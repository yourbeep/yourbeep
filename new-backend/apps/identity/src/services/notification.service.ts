import { AppError, env, getFirebaseMessaging, httpJson } from "@yourbeep/shared";
import { Types } from "mongoose";
import type { BatchResponse, MulticastMessage } from "firebase-admin/messaging";
import {
  NotificationCampaignModel,
  type NotificationCampaignRecord,
} from "../models/notification-campaign";
import { UserModel } from "../models/user";
import type { z } from "zod";
import {
  adminBroadcastSchema,
  internalNotificationSchema,
  notificationAudiencePreviewSchema,
  notificationCampaignCreateSchema,
  notificationCampaignListQuerySchema,
  notificationCampaignUpdateSchema,
} from "../validators";

type AdminBroadcastInput = z.infer<typeof adminBroadcastSchema>;
type InternalNotificationInput = z.infer<typeof internalNotificationSchema>;
type NotificationCampaignCreateInput = z.infer<typeof notificationCampaignCreateSchema>;
type NotificationCampaignUpdateInput = z.infer<typeof notificationCampaignUpdateSchema>;
type NotificationCampaignListQuery = z.infer<typeof notificationCampaignListQuerySchema>;
type NotificationAudiencePreviewInput = z.infer<typeof notificationAudiencePreviewSchema>;

const INVALID_FCM_TOKEN_CODES = new Set([
  "messaging/invalid-registration-token",
  "messaging/registration-token-not-registered",
]);

const chunk = <T>(items: T[], size: number) => {
  const results: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    results.push(items.slice(index, index + size));
  }
  return results;
};

const normalizeNotificationData = (data?: Record<string, string | number | boolean>) =>
  Object.fromEntries(Object.entries(data ?? {}).map(([key, value]) => [key, String(value)]));

const pruneInvalidTokens = async (tokens: string[]) => {
  if (tokens.length === 0) {
    return;
  }

  await UserModel.updateMany(
    { fcmTokens: { $in: tokens } },
    { $pull: { fcmTokens: { $in: tokens } } },
  );
};

const sendToTokens = async (
  tokens: string[],
  payload: {
    title: string;
    body: string;
    imageUrl?: string;
    data?: Record<string, string | number | boolean>;
  },
) => {
  if (tokens.length === 0) {
    return {
      requestedTokens: 0,
      successCount: 0,
      failureCount: 0,
      invalidTokenCount: 0,
    };
  }

  const messaging = getFirebaseMessaging();
  const batches = chunk(tokens, 500);
  let successCount = 0;
  let failureCount = 0;
  const invalidTokens: string[] = [];

  for (const batch of batches) {
    const message: MulticastMessage = {
      tokens: batch,
      notification: {
        title: payload.title,
        body: payload.body,
        ...(payload.imageUrl ? { imageUrl: payload.imageUrl } : {}),
      },
      data: normalizeNotificationData(payload.data),
    };

    const response: BatchResponse = await messaging.sendEachForMulticast(message);
    successCount += response.successCount;
    failureCount += response.failureCount;

    response.responses.forEach((item, index) => {
      if (!item.success && item.error?.code && INVALID_FCM_TOKEN_CODES.has(item.error.code)) {
        invalidTokens.push(batch[index]!);
      }
    });
  }

  await pruneInvalidTokens(invalidTokens);

  return {
    requestedTokens: tokens.length,
    successCount,
    failureCount,
    invalidTokenCount: invalidTokens.length,
  };
};

const getActiveUsersWithTokens = async (filter: Record<string, unknown>) =>
  UserModel.find({
    ...filter,
    isActive: true,
    fcmTokens: { $exists: true, $ne: [] },
  }).select("_id name email region fcmTokens");

const getPurchasedUserIds = async (courseId: string) => {
  const response = await httpJson<{ success: boolean; data: { userIds: string[] } }>(
    `${env.COMMERCE_URL}/internal/courses/${courseId}/purchasers`,
    {
      method: "GET",
      headers: {
        "x-internal-service-key": env.INTERNAL_SERVICE_SECRET,
      },
    },
  );

  return response.data.userIds;
};

const getPremiumUserIds = async () => {
  const response = await httpJson<{ success: boolean; data: { userIds: string[] } }>(
    `${env.COMMERCE_URL}/internal/users/premium`,
    {
      method: "GET",
      headers: {
        "x-internal-service-key": env.INTERNAL_SERVICE_SECRET,
      },
    },
  );

  return response.data.userIds;
};

const getTokensForUserIds = async (userIds: string[]) => {
  if (userIds.length === 0) {
    return [];
  }

  const users = await getActiveUsersWithTokens({
    _id: { $in: userIds.map((id) => new Types.ObjectId(id)) },
  });

  return [...new Set(users.flatMap((user) => user.fcmTokens))];
};

const serializeCampaign = (campaign: NotificationCampaignRecord | null) => {
  if (!campaign) {
    return null;
  }

  return {
    _id: campaign._id.toString(),
    title: campaign.title,
    body: campaign.body,
    imageUrl: campaign.imageUrl ?? null,
    type: campaign.type,
    audience: {
      type: campaign.audience.type,
      courseId: campaign.audience.courseId?.toString() ?? null,
      userIds: campaign.audience.userIds.map((userId: Types.ObjectId) => userId.toString()),
      regions: campaign.audience.regions,
    },
    data: campaign.data ? { ...campaign.data } : {},
    status: campaign.status,
    targetedUsersCount: campaign.targetedUsersCount,
    requestedTokens: campaign.requestedTokens,
    successCount: campaign.successCount,
    failureCount: campaign.failureCount,
    invalidTokenCount: campaign.invalidTokenCount,
    sentAt: campaign.sentAt ?? null,
    createdBy: campaign.createdBy.toString(),
    updatedBy: campaign.updatedBy?.toString() ?? null,
    createdAt: campaign.createdAt,
    updatedAt: campaign.updatedAt,
  };
};

const resolveAudienceUsers = async (audience: NotificationAudiencePreviewInput["audience"]) => {
  if (audience.type === "all_users") {
    return getActiveUsersWithTokens({});
  }

  if (audience.type === "premium_users") {
    const userIds = await getPremiumUserIds();
    return getActiveUsersWithTokens({
      _id: { $in: userIds.map((id) => new Types.ObjectId(id)) },
    });
  }

  if (audience.type === "course_purchasers") {
    const userIds = await getPurchasedUserIds(audience.courseId!);
    return getActiveUsersWithTokens({
      _id: { $in: userIds.map((id) => new Types.ObjectId(id)) },
    });
  }

  if (audience.type === "specific_users") {
    return getActiveUsersWithTokens({
      _id: { $in: audience.userIds.map((id) => new Types.ObjectId(id)) },
    });
  }

  return getActiveUsersWithTokens({
    region: { $in: audience.regions },
  });
};

const deliverCampaign = async (
  campaignId: string,
  payload: {
    title: string;
    body: string;
    imageUrl?: string;
    type: string;
    audience: NotificationAudiencePreviewInput["audience"];
    data?: Record<string, string | number | boolean>;
  },
) => {
  const users = await resolveAudienceUsers(payload.audience);
  const tokens = [...new Set(users.flatMap((user) => user.fcmTokens))];

  const delivery = await sendToTokens(tokens, {
    title: payload.title,
    body: payload.body,
    imageUrl: payload.imageUrl,
    data: {
      campaignId,
      type: payload.type,
      audienceType: payload.audience.type,
      ...(payload.audience.courseId ? { courseId: payload.audience.courseId } : {}),
      ...(payload.data ?? {}),
    },
  });

  return {
    users,
    delivery,
  };
};

export const previewNotificationAudience = async (payload: NotificationAudiencePreviewInput) => {
  const users = await resolveAudienceUsers(payload.audience);
  const tokens = [...new Set(users.flatMap((user) => user.fcmTokens))];

  return {
    audience: payload.audience,
    targetedUsers: users.length,
    targetedTokens: tokens.length,
    sampleUsers: users.slice(0, 5).map((user) => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      region: user.region ?? null,
      tokenCount: user.fcmTokens.length,
    })),
  };
};

export const listNotificationCampaigns = async (query: NotificationCampaignListQuery) => {
  const filter: Record<string, unknown> = {};
  if (query.status) {
    filter.status = query.status;
  }
  if (query.audienceType) {
    filter["audience.type"] = query.audienceType;
  }
  if (query.q) {
    filter.$or = [
      { title: { $regex: query.q, $options: "i" } },
      { body: { $regex: query.q, $options: "i" } },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    NotificationCampaignModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
    NotificationCampaignModel.countDocuments(filter),
  ]);

  return {
    items: items.map((item) => serializeCampaign(item)!),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
    },
  };
};

export const getNotificationCampaignById = async (campaignId: string) => {
  const campaign = await NotificationCampaignModel.findById(campaignId);
  if (!campaign) {
    throw new AppError("Notification campaign not found", 404, "NOT_FOUND");
  }

  return { campaign: serializeCampaign(campaign) };
};

export const createNotificationCampaign = async (adminId: string, payload: NotificationCampaignCreateInput) => {
  const campaign = await NotificationCampaignModel.create({
    title: payload.title,
    body: payload.body,
    imageUrl: payload.imageUrl,
    type: payload.type,
    audience: {
      type: payload.audience.type,
      courseId: payload.audience.courseId ? new Types.ObjectId(payload.audience.courseId) : undefined,
      userIds: payload.audience.userIds.map((id) => new Types.ObjectId(id)),
      regions: payload.audience.regions,
    },
    data: normalizeNotificationData(payload.data),
    createdBy: new Types.ObjectId(adminId),
    updatedBy: new Types.ObjectId(adminId),
  });

  if (payload.sendNow) {
    return sendNotificationCampaign(campaign.id, adminId);
  }

  return { campaign: serializeCampaign(campaign) };
};

export const updateNotificationCampaign = async (
  campaignId: string,
  adminId: string,
  payload: NotificationCampaignUpdateInput,
) => {
  const campaign = await NotificationCampaignModel.findById(campaignId);
  if (!campaign) {
    throw new AppError("Notification campaign not found", 404, "NOT_FOUND");
  }

  if (campaign.status !== "draft") {
    throw new AppError("Only draft campaigns can be updated", 422, "CAMPAIGN_NOT_EDITABLE");
  }

  if (payload.title !== undefined) campaign.title = payload.title;
  if (payload.body !== undefined) campaign.body = payload.body;
  if (payload.imageUrl !== undefined) campaign.imageUrl = payload.imageUrl;
  if (payload.type !== undefined) campaign.type = payload.type;
  if (payload.audience) {
    campaign.audience = {
      type: payload.audience.type,
      courseId: payload.audience.courseId ? new Types.ObjectId(payload.audience.courseId) : undefined,
      userIds: payload.audience.userIds.map((id) => new Types.ObjectId(id)),
      regions: payload.audience.regions,
    };
  }
  if (payload.data !== undefined) {
    campaign.data = normalizeNotificationData(payload.data);
  }
  campaign.updatedBy = new Types.ObjectId(adminId);

  await campaign.save();
  return { campaign: serializeCampaign(campaign) };
};

export const cancelNotificationCampaign = async (campaignId: string) => {
  const campaign = await NotificationCampaignModel.findById(campaignId);
  if (!campaign) {
    throw new AppError("Notification campaign not found", 404, "NOT_FOUND");
  }

  if (campaign.status === "sent") {
    throw new AppError("Sent campaigns cannot be cancelled", 422, "CAMPAIGN_ALREADY_SENT");
  }

  campaign.status = "cancelled";
  await campaign.save();
  return { campaign: serializeCampaign(campaign) };
};

export const sendNotificationCampaign = async (campaignId: string, adminId?: string) => {
  const campaign = await NotificationCampaignModel.findById(campaignId);
  if (!campaign) {
    throw new AppError("Notification campaign not found", 404, "NOT_FOUND");
  }

  if (campaign.status === "sent") {
    throw new AppError("Campaign has already been sent", 422, "CAMPAIGN_ALREADY_SENT");
  }

  if (campaign.status === "cancelled") {
    throw new AppError("Cancelled campaign cannot be sent", 422, "CAMPAIGN_CANCELLED");
  }

  const audience = {
    type: campaign.audience.type,
    courseId: campaign.audience.courseId?.toString(),
    userIds: campaign.audience.userIds.map((userId: Types.ObjectId) => userId.toString()),
    regions: campaign.audience.regions,
  } as NotificationAudiencePreviewInput["audience"];

  const { users, delivery } = await deliverCampaign(campaign.id, {
    title: campaign.title,
    body: campaign.body,
    imageUrl: campaign.imageUrl,
    type: campaign.type,
    audience,
    data: campaign.data ? Object.fromEntries(campaign.data) : {},
  });

  campaign.status = "sent";
  campaign.targetedUsersCount = users.length;
  campaign.requestedTokens = delivery.requestedTokens;
  campaign.successCount = delivery.successCount;
  campaign.failureCount = delivery.failureCount;
  campaign.invalidTokenCount = delivery.invalidTokenCount;
  campaign.sentAt = new Date();
  if (adminId) {
    campaign.updatedBy = new Types.ObjectId(adminId);
  }
  await campaign.save();

  return {
    campaign: serializeCampaign(campaign),
    delivery,
  };
};

export const getNotificationCenterSummary = async () => {
  const [totalCampaigns, draftCampaigns, sentCampaigns, cancelledCampaigns, premiumAudienceCampaigns] =
    await Promise.all([
      NotificationCampaignModel.countDocuments({}),
      NotificationCampaignModel.countDocuments({ status: "draft" }),
      NotificationCampaignModel.countDocuments({ status: "sent" }),
      NotificationCampaignModel.countDocuments({ status: "cancelled" }),
      NotificationCampaignModel.countDocuments({ "audience.type": "premium_users" }),
    ]);

  const sent = await NotificationCampaignModel.find({ status: "sent" }).sort({ createdAt: -1 }).limit(10);

  return {
    totalCampaigns,
    draftCampaigns,
    sentCampaigns,
    cancelledCampaigns,
    premiumAudienceCampaigns,
    totalDelivered: sent.reduce((sum, item) => sum + item.successCount, 0),
    totalFailures: sent.reduce((sum, item) => sum + item.failureCount, 0),
    recentCampaigns: sent.slice(0, 5).map((item) => serializeCampaign(item)),
  };
};

export const sendAdminBroadcast = async (payload: AdminBroadcastInput) => {
  const audience =
    payload.courseId
      ? { type: "course_purchasers" as const, courseId: payload.courseId, userIds: [], regions: [] }
      : { type: "all_users" as const, userIds: [], regions: [] };

  const campaign = await NotificationCampaignModel.create({
    title: payload.title,
    body: payload.body,
    imageUrl: payload.imageUrl,
    type: "admin_broadcast",
    audience: {
      type: audience.type,
      courseId: payload.courseId ? new Types.ObjectId(payload.courseId) : undefined,
      userIds: [],
      regions: [],
    },
    data: normalizeNotificationData(payload.data),
    status: "draft",
    createdBy: new Types.ObjectId(),
  });

  const data = await sendNotificationCampaign(campaign.id);
  return {
    audience: payload.courseId ? "course_purchasers" : "all_users",
    courseId: payload.courseId ?? null,
    targetedUsers: data.campaign?.targetedUsersCount ?? 0,
    ...data.delivery,
  };
};

export const sendInternalNotification = async (payload: InternalNotificationInput) => {
  const targetUserIds = payload.userId
    ? [payload.userId]
    : payload.courseId
      ? await getPurchasedUserIds(payload.courseId)
      : [];

  if (targetUserIds.length === 0) {
    throw new AppError("No users found for notification target", 404, "NOT_FOUND");
  }

  const tokens = await getTokensForUserIds(targetUserIds);
  const delivery = await sendToTokens(tokens, {
    title: payload.title,
    body: payload.body,
    imageUrl: payload.imageUrl,
    data: {
      type: payload.type,
      ...(payload.courseId ? { courseId: payload.courseId } : {}),
      ...(payload.userId ? { userId: payload.userId } : {}),
      ...(payload.data ?? {}),
    },
  });

  return {
    type: payload.type,
    targetedUsers: targetUserIds.length,
    ...delivery,
  };
};

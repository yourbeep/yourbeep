import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { notificationsApi } from "../../../features/notifications/services/notificationsApi";
import { getApiErrorMessage } from "../../../utils/apiError";
import type {
  AudiencePreview,
  NotificationCampaign,
  NotificationCampaignList,
  NotificationsFilters,
  NotificationSummary,
} from "./notificationsTypes";

const mapCampaign = (campaign: any): NotificationCampaign => ({
  _id: String(campaign?._id || ""),
  title: String(campaign?.title || ""),
  body: String(campaign?.body || ""),
  imageUrl: typeof campaign?.imageUrl === "string" ? campaign.imageUrl : null,
  type: campaign?.type || "admin_broadcast",
  audience: {
    type: campaign?.audience?.type || "all_users",
    courseId: campaign?.audience?.courseId ? String(campaign.audience.courseId) : null,
    userIds: Array.isArray(campaign?.audience?.userIds)
      ? campaign.audience.userIds.map((id: any) => String(id))
      : [],
    regions: Array.isArray(campaign?.audience?.regions) ? campaign.audience.regions : [],
  },
  data:
    campaign?.data && typeof campaign.data === "object" ? Object.fromEntries(Object.entries(campaign.data).map(([k, v]) => [k, String(v)])) : {},
  status: campaign?.status || "draft",
  targetedUsersCount: Number(campaign?.targetedUsersCount || 0),
  requestedTokens: Number(campaign?.requestedTokens || 0),
  successCount: Number(campaign?.successCount || 0),
  failureCount: Number(campaign?.failureCount || 0),
  invalidTokenCount: Number(campaign?.invalidTokenCount || 0),
  sentAt: campaign?.sentAt || null,
  createdBy: String(campaign?.createdBy || ""),
  updatedBy: campaign?.updatedBy ? String(campaign.updatedBy) : null,
  createdAt: String(campaign?.createdAt || new Date().toISOString()),
  updatedAt: String(campaign?.updatedAt || new Date().toISOString()),
});

const mapPagination = (pagination: any, fallbackPage: number, fallbackLimit: number) => ({
  page: Number(pagination?.page || fallbackPage),
  limit: Number(pagination?.limit || fallbackLimit),
  total: Number(pagination?.total || 0),
});

export const fetchNotificationSummary = createAsyncThunk<
  NotificationSummary,
  void,
  { rejectValue: string }
>("notifications/fetchSummary", async (_, { rejectWithValue }) => {
  try {
    const response = await notificationsApi.getSummary();
    const data = response.data?.data ?? {};
    return {
      totalCampaigns: Number(data.totalCampaigns || 0),
      draftCampaigns: Number(data.draftCampaigns || 0),
      sentCampaigns: Number(data.sentCampaigns || 0),
      cancelledCampaigns: Number(data.cancelledCampaigns || 0),
      premiumAudienceCampaigns: Number(data.premiumAudienceCampaigns || 0),
      totalDelivered: Number(data.totalDelivered || 0),
      totalFailures: Number(data.totalFailures || 0),
      recentCampaigns: Array.isArray(data.recentCampaigns)
        ? data.recentCampaigns.map(mapCampaign)
        : [],
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load notification summary."),
      );
    }
    return rejectWithValue("Unable to load notification summary.");
  }
});

export const fetchNotificationCampaigns = createAsyncThunk<
  NotificationCampaignList,
  NotificationsFilters | void,
  { rejectValue: string }
>("notifications/fetchCampaigns", async (filters, { rejectWithValue }) => {
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 10;
  try {
    const response = await notificationsApi.listCampaigns({
      page,
      limit,
      ...(filters?.q ? { q: filters.q } : {}),
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.audienceType ? { audienceType: filters.audienceType } : {}),
    });
    const data = response.data?.data ?? {};
    return {
      items: Array.isArray(data.items) ? data.items.map(mapCampaign) : [],
      pagination: mapPagination(data.pagination, page, limit),
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load notification campaigns."),
      );
    }
    return rejectWithValue("Unable to load notification campaigns.");
  }
});

export const fetchNotificationCampaignDetail = createAsyncThunk<
  NotificationCampaign,
  string,
  { rejectValue: string }
>("notifications/fetchCampaignDetail", async (campaignId, { rejectWithValue }) => {
  try {
    const response = await notificationsApi.getCampaign(campaignId);
    return mapCampaign(response.data?.data?.campaign ?? {});
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load campaign detail."),
      );
    }
    return rejectWithValue("Unable to load campaign detail.");
  }
});

export const previewNotificationAudience = createAsyncThunk<
  AudiencePreview,
  {
    audience: {
      type: string;
      courseId?: string;
      userIds?: string[];
      regions?: string[];
    };
  },
  { rejectValue: string }
>("notifications/previewAudience", async (payload, { rejectWithValue }) => {
  try {
    const response = await notificationsApi.previewAudience(payload);
    const data = response.data?.data ?? {};
    return {
      audience: {
        type: data.audience?.type || "all_users",
        courseId: data.audience?.courseId ? String(data.audience.courseId) : null,
        userIds: Array.isArray(data.audience?.userIds)
          ? data.audience.userIds.map((id: any) => String(id))
          : [],
        regions: Array.isArray(data.audience?.regions) ? data.audience.regions : [],
      },
      targetedUsers: Number(data.targetedUsers || 0),
      targetedTokens: Number(data.targetedTokens || 0),
      sampleUsers: Array.isArray(data.sampleUsers)
        ? data.sampleUsers.map((user: any) => ({
            _id: String(user?._id || ""),
            name: String(user?.name || ""),
            email: String(user?.email || ""),
            region: typeof user?.region === "string" ? user.region : null,
            tokenCount: Number(user?.tokenCount || 0),
          }))
        : [],
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to preview audience."),
      );
    }
    return rejectWithValue("Unable to preview audience.");
  }
});

export const createNotificationCampaign = createAsyncThunk<
  NotificationCampaign,
  Record<string, unknown>,
  { rejectValue: string }
>("notifications/createCampaign", async (payload, { rejectWithValue }) => {
  try {
    const response = await notificationsApi.createCampaign(payload);
    return mapCampaign(response.data?.data?.campaign ?? {});
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to create notification campaign."),
      );
    }
    return rejectWithValue("Unable to create notification campaign.");
  }
});

export const updateNotificationCampaign = createAsyncThunk<
  NotificationCampaign,
  { campaignId: string; payload: Record<string, unknown> },
  { rejectValue: string }
>("notifications/updateCampaign", async ({ campaignId, payload }, { rejectWithValue }) => {
  try {
    const response = await notificationsApi.updateCampaign(campaignId, payload);
    return mapCampaign(response.data?.data?.campaign ?? {});
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to update notification campaign."),
      );
    }
    return rejectWithValue("Unable to update notification campaign.");
  }
});

export const sendNotificationCampaign = createAsyncThunk<
  NotificationCampaign,
  string,
  { rejectValue: string }
>("notifications/sendCampaign", async (campaignId, { rejectWithValue }) => {
  try {
    const response = await notificationsApi.sendCampaign(campaignId);
    return mapCampaign(response.data?.data?.campaign ?? {});
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to send notification campaign."),
      );
    }
    return rejectWithValue("Unable to send notification campaign.");
  }
});

export const cancelNotificationCampaign = createAsyncThunk<
  NotificationCampaign,
  string,
  { rejectValue: string }
>("notifications/cancelCampaign", async (campaignId, { rejectWithValue }) => {
  try {
    const response = await notificationsApi.cancelCampaign(campaignId);
    return mapCampaign(response.data?.data?.campaign ?? {});
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to cancel notification campaign."),
      );
    }
    return rejectWithValue("Unable to cancel notification campaign.");
  }
});

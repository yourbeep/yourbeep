import { env, httpJson, parseBody, success } from "@yourbeep/shared";
import type { Request, Response } from "express";
import {
  getCurrentUserActivityLog,
  getAdminDashboard,
  getCurrentUserProfile,
  getCurrentUserDashboard,
  getCurrentUserProgress,
  getCurrentUserPurchases,
  getCurrentUserStats,
  getUserById,
  listUsers,
  registerFcmToken,
  removeFcmToken,
  restoreUser,
  softDeleteUser,
  updateCurrentUser,
  updateUserRole,
} from "../services/user.service";
import {
  adminBroadcastSchema,
  adminDashboardQuerySchema,
  activityLogQuerySchema,
  notificationAudiencePreviewSchema,
  notificationCampaignCreateSchema,
  notificationCampaignListQuerySchema,
  notificationCampaignUpdateSchema,
  paginationSchema,
  registerFcmSchema,
  removeFcmSchema,
  updateProfileSchema,
  updateRoleSchema,
} from "../validators";
import {
  cancelNotificationCampaign,
  createNotificationCampaign,
  getNotificationCampaignById,
  getNotificationCenterSummary,
  listNotificationCampaigns,
  previewNotificationAudience,
  sendAdminBroadcast,
  sendNotificationCampaign,
  updateNotificationCampaign,
} from "../services/notification.service";

export const getCurrentUserController = async (req: Request, res: Response) => {
  const user = await getCurrentUserProfile(req.auth!.firebaseUid);
  return success(res, { user }, "Current user profile");
};

export const updateCurrentUserController = async (req: Request, res: Response) => {
  const payload = parseBody(updateProfileSchema, req.body);
  const user = await updateCurrentUser(req.auth!.firebaseUid, payload);
  return success(res, { user }, "Profile updated");
};

export const getCurrentUserStatsController = async (req: Request, res: Response) => {
  const data = await getCurrentUserStats(req.auth!.firebaseUid);
  return success(res, data, "User stats");
};

export const getActivityLogController = async (req: Request, res: Response) => {
  const query = parseBody(activityLogQuerySchema, req.query);
  const data = await getCurrentUserActivityLog(req.auth!.firebaseUid, query);
  return success(res, data, "Activity log");
};

export const getPurchasesController = async (req: Request, res: Response) => {
  const data = await getCurrentUserPurchases(req.auth!.firebaseUid);
  return success(res, data, "User purchases");
};

export const getProgressController = async (req: Request, res: Response) => {
  const data = await getCurrentUserProgress(req.auth!.firebaseUid);
  return success(res, data, "Progress");
};

export const getDashboardController = async (req: Request, res: Response) => {
  const data = await getCurrentUserDashboard(req.auth!.firebaseUid);
  return success(res, data, "Dashboard");
};

export const registerFcmTokenController = async (req: Request, res: Response) => {
  const payload = parseBody(registerFcmSchema, req.body);
  const data = await registerFcmToken(req.auth!.firebaseUid, payload);
  return success(res, data, "FCM token registered");
};

export const removeFcmTokenController = async (req: Request, res: Response) => {
  const payload = parseBody(removeFcmSchema, req.body);
  const data = await removeFcmToken(req.auth!.firebaseUid, payload);
  return success(res, data, "FCM token removed");
};

export const adminBroadcastController = async (req: Request, res: Response) => {
  const payload = parseBody(adminBroadcastSchema, req.body);
  const data = await sendAdminBroadcast(payload);
  return success(res, data, "Notification broadcast sent");
};

export const listNotificationCampaignsController = async (req: Request, res: Response) => {
  const query = parseBody(notificationCampaignListQuerySchema, req.query);
  const data = await listNotificationCampaigns(query);
  return success(res, data, "Notification campaigns");
};

export const getNotificationCampaignByIdController = async (req: Request, res: Response) => {
  const data = await getNotificationCampaignById(String(req.params.campaignId));
  return success(res, data, "Notification campaign detail");
};

export const createNotificationCampaignController = async (req: Request, res: Response) => {
  const payload = parseBody(notificationCampaignCreateSchema, req.body);
  const data = await createNotificationCampaign(req.auth!.id, payload);
  return success(res, data, payload.sendNow ? "Notification campaign sent" : "Notification campaign created");
};

export const updateNotificationCampaignController = async (req: Request, res: Response) => {
  const payload = parseBody(notificationCampaignUpdateSchema, req.body);
  const data = await updateNotificationCampaign(String(req.params.campaignId), req.auth!.id, payload);
  return success(res, data, "Notification campaign updated");
};

export const sendNotificationCampaignController = async (req: Request, res: Response) => {
  const data = await sendNotificationCampaign(String(req.params.campaignId), req.auth!.id);
  return success(res, data, "Notification campaign sent");
};

export const cancelNotificationCampaignController = async (req: Request, res: Response) => {
  const data = await cancelNotificationCampaign(String(req.params.campaignId));
  return success(res, data, "Notification campaign cancelled");
};

export const previewNotificationAudienceController = async (req: Request, res: Response) => {
  const payload = parseBody(notificationAudiencePreviewSchema, req.body);
  const data = await previewNotificationAudience(payload);
  return success(res, data, "Notification audience preview");
};

export const getNotificationCenterSummaryController = async (_req: Request, res: Response) => {
  const data = await getNotificationCenterSummary();
  return success(res, data, "Notification center summary");
};

export const listUsersController = async (req: Request, res: Response) => {
  const query = parseBody(paginationSchema, req.query);
  const data = await listUsers(query);
  return success(res, data, "Users list");
};

export const getAdminDashboardController = async (req: Request, res: Response) => {
  const query = parseBody(adminDashboardQuerySchema, req.query);
  const data = await getAdminDashboard(query);
  return success(res, data, "Admin dashboard");
};

export const getUserByIdController = async (req: Request, res: Response) => {
  const user = await getUserById(String(req.params.id));
  return success(res, { user }, "User detail");
};

export const updateUserRoleController = async (req: Request, res: Response) => {
  const payload = parseBody(updateRoleSchema, req.body);
  const user = await updateUserRole(String(req.params.id), payload);
  return success(res, { user }, "User role updated");
};

export const softDeleteUserController = async (req: Request, res: Response) => {
  const user = await softDeleteUser(String(req.params.id));
  return success(res, { user }, "User soft-deleted");
};

export const restoreUserController = async (req: Request, res: Response) => {
  const user = await restoreUser(String(req.params.id));
  return success(res, { user }, "User restored");
};

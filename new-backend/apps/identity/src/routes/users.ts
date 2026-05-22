import { Router } from "express";
import { asyncHandler, requireAdmin, requireAuth } from "@yourbeep/shared";
import {
  getActivityLogController,
  getAdminDashboardController,
  getCurrentUserController,
  getCurrentUserStatsController,
  getDashboardController,
  getProgressController,
  getPurchasesController,
  getUserByIdController,
  listUsersController,
  adminBroadcastController,
  cancelNotificationCampaignController,
  createNotificationCampaignController,
  getNotificationCampaignByIdController,
  getNotificationCenterSummaryController,
  listNotificationCampaignsController,
  previewNotificationAudienceController,
  registerFcmTokenController,
  removeFcmTokenController,
  restoreUserController,
  sendNotificationCampaignController,
  softDeleteUserController,
  updateCurrentUserController,
  updateNotificationCampaignController,
  updateUserRoleController,
} from "../controllers/user.controller";

export const usersRouter = Router();

usersRouter.get("/users/me", requireAuth, asyncHandler(getCurrentUserController));
usersRouter.patch("/users/me", requireAuth, asyncHandler(updateCurrentUserController));
usersRouter.get("/users/me/stats", requireAuth, asyncHandler(getCurrentUserStatsController));
usersRouter.get("/users/me/activity-log", requireAuth, asyncHandler(getActivityLogController));
usersRouter.get("/users/me/purchases", requireAuth, asyncHandler(getPurchasesController));
usersRouter.get("/users/me/progress", requireAuth, asyncHandler(getProgressController));
usersRouter.get("/users/me/dashboard", requireAuth, asyncHandler(getDashboardController));

usersRouter.post("/notifications/token", requireAuth, asyncHandler(registerFcmTokenController));
usersRouter.delete("/notifications/token", requireAuth, asyncHandler(removeFcmTokenController));

usersRouter.post("/admin/notifications/broadcast", requireAdmin, asyncHandler(adminBroadcastController));
usersRouter.get("/admin/notifications/summary", requireAdmin, asyncHandler(getNotificationCenterSummaryController));
usersRouter.get("/admin/notifications/campaigns", requireAdmin, asyncHandler(listNotificationCampaignsController));
usersRouter.get("/admin/notifications/campaigns/:campaignId", requireAdmin, asyncHandler(getNotificationCampaignByIdController));
usersRouter.post("/admin/notifications/campaigns", requireAdmin, asyncHandler(createNotificationCampaignController));
usersRouter.patch("/admin/notifications/campaigns/:campaignId", requireAdmin, asyncHandler(updateNotificationCampaignController));
usersRouter.post("/admin/notifications/campaigns/:campaignId/send", requireAdmin, asyncHandler(sendNotificationCampaignController));
usersRouter.delete("/admin/notifications/campaigns/:campaignId", requireAdmin, asyncHandler(cancelNotificationCampaignController));
usersRouter.post("/admin/notifications/audience-preview", requireAdmin, asyncHandler(previewNotificationAudienceController));
usersRouter.get("/admin/dashboard", requireAdmin, asyncHandler(getAdminDashboardController));
usersRouter.get("/admin/users", requireAdmin, asyncHandler(listUsersController));
usersRouter.get("/admin/users/:id", requireAdmin, asyncHandler(getUserByIdController));
usersRouter.patch("/admin/users/:id/role", requireAdmin, asyncHandler(updateUserRoleController));
usersRouter.delete("/admin/users/:id", requireAdmin, asyncHandler(softDeleteUserController));
usersRouter.post("/admin/users/:id/restore", requireAdmin, asyncHandler(restoreUserController));

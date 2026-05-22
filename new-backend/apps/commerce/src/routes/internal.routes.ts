import { Router } from "express";
import { asyncHandler, env, requireInternalService } from "@yourbeep/shared";
import {
  getInternalAdminPromotionSummaryController,
  getInternalAdminDashboardAnalyticsController,
  getInternalAdminUserPurchasesController,
  cancelUserSubscriptionsController,
  getInternalAdminRevenueMetricsController,
  getInternalAdminUserPurchaseSummaryController,
  getInternalCoursePurchasersController,
  getInternalPremiumUsersController,
  getInternalPurchaseAccessController,
} from "../controllers/internal.controller";

export const internalRouter = Router();

internalRouter.use(requireInternalService(env.INTERNAL_SERVICE_SECRET));
internalRouter.delete("/users/:userId/subscriptions", asyncHandler(cancelUserSubscriptionsController));
internalRouter.get("/purchases/:userId/:courseId", asyncHandler(getInternalPurchaseAccessController));
internalRouter.get("/users/premium", asyncHandler(getInternalPremiumUsersController));
internalRouter.get("/courses/:courseId/purchasers", asyncHandler(getInternalCoursePurchasersController));
internalRouter.get("/admin/revenue-metrics", asyncHandler(getInternalAdminRevenueMetricsController));
internalRouter.get("/admin/dashboard-analytics", asyncHandler(getInternalAdminDashboardAnalyticsController));
internalRouter.get("/admin/users/:userId/purchases", asyncHandler(getInternalAdminUserPurchasesController));
internalRouter.post("/admin/user-purchase-summary", asyncHandler(getInternalAdminUserPurchaseSummaryController));
internalRouter.get("/admin/promotion-summary", asyncHandler(getInternalAdminPromotionSummaryController));

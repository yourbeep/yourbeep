import { Router } from "express";
import { asyncHandler, requireAdmin } from "@yourbeep/shared";
import {
  getAdminPurchaseByIdController,
  processSubscriptionNotificationsController,
  getRevenueSummaryController,
  listAdminPurchasesController,
  refundPurchaseController,
} from "../controllers/admin.controller";

export const adminRouter = Router();

adminRouter.get("/admin/commerce/purchases", requireAdmin, asyncHandler(listAdminPurchasesController));
adminRouter.get("/admin/commerce/purchases/:purchaseId", requireAdmin, asyncHandler(getAdminPurchaseByIdController));
adminRouter.post("/admin/commerce/purchases/:purchaseId/refund", requireAdmin, asyncHandler(refundPurchaseController));
adminRouter.get("/admin/commerce/revenue", requireAdmin, asyncHandler(getRevenueSummaryController));
adminRouter.post(
  "/admin/commerce/notifications/process-subscriptions",
  requireAdmin,
  asyncHandler(processSubscriptionNotificationsController),
);

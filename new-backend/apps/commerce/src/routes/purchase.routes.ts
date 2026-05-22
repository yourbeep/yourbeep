import { Router } from "express";
import { asyncHandler, requireAuth } from "@yourbeep/shared";
import {
  confirmPurchaseController,
  confirmRenewalController,
  getCourseAccessController,
  getUserPurchasesController,
  initiatePurchaseController,
  initiateRenewalController,
  stripeWebhookController,
} from "../controllers/purchase.controller";

export const purchaseRouter = Router();

purchaseRouter.post("/commerce/courses/:courseId/purchase/initiate", requireAuth, asyncHandler(initiatePurchaseController));
purchaseRouter.post("/commerce/courses/:courseId/purchase/confirm", requireAuth, asyncHandler(confirmPurchaseController));
purchaseRouter.get("/commerce/courses/:courseId/access", requireAuth, asyncHandler(getCourseAccessController));
purchaseRouter.get("/commerce/purchases", requireAuth, asyncHandler(getUserPurchasesController));
purchaseRouter.post("/commerce/courses/:courseId/renew/initiate", requireAuth, asyncHandler(initiateRenewalController));
purchaseRouter.post("/commerce/courses/:courseId/renew/confirm", requireAuth, asyncHandler(confirmRenewalController));
purchaseRouter.post("/webhooks/stripe", asyncHandler(stripeWebhookController));

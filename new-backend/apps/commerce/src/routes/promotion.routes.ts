import { Router } from "express";
import { asyncHandler, requireAdmin, requireAuth } from "@yourbeep/shared";
import {
  archivePromotionController,
  createPromotionController,
  getPromotionByIdController,
  getPromotionSummaryController,
  listPromotionsController,
  previewPromotionController,
  restorePromotionController,
  updatePromotionController,
} from "../controllers/promotion.controller";

export const promotionRouter = Router();

promotionRouter.get("/admin/commerce/promotions", requireAdmin, asyncHandler(listPromotionsController));
promotionRouter.get("/admin/commerce/promotions/summary", requireAdmin, asyncHandler(getPromotionSummaryController));
promotionRouter.get("/admin/commerce/promotions/:promotionId", requireAdmin, asyncHandler(getPromotionByIdController));
promotionRouter.post("/admin/commerce/promotions", requireAdmin, asyncHandler(createPromotionController));
promotionRouter.put("/admin/commerce/promotions/:promotionId", requireAdmin, asyncHandler(updatePromotionController));
promotionRouter.delete("/admin/commerce/promotions/:promotionId", requireAdmin, asyncHandler(archivePromotionController));
promotionRouter.post(
  "/admin/commerce/promotions/:promotionId/restore",
  requireAdmin,
  asyncHandler(restorePromotionController),
);

promotionRouter.post(
  "/commerce/courses/:courseId/promotion/preview",
  requireAuth,
  asyncHandler(previewPromotionController),
);

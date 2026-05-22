import { Router } from "express";
import { asyncHandler, requireAdmin } from "@yourbeep/shared";
import {
  deleteCoursePricingController,
  getCoursePriceByRegionController,
  getCoursePriceController,
  listCoursePricingController,
  upsertPricingController,
} from "../controllers/pricing.controller";

export const pricingRouter = Router();

pricingRouter.get("/courses/:courseId/price", asyncHandler(getCoursePriceController));
pricingRouter.get("/courses/:courseId/price/:region", asyncHandler(getCoursePriceByRegionController));
pricingRouter.get("/admin/commerce/courses/:courseId/pricing", requireAdmin, asyncHandler(listCoursePricingController));
pricingRouter.put("/admin/commerce/courses/:courseId/pricing", requireAdmin, asyncHandler(upsertPricingController));
pricingRouter.delete(
  "/admin/commerce/courses/:courseId/pricing/:region",
  requireAdmin,
  asyncHandler(deleteCoursePricingController),
);

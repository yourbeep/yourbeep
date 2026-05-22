import { Router } from "express";
import { asyncHandler, requireAdmin, requireAuth } from "@yourbeep/shared";
import {
  createAdminTestimonialController,
  createTestimonialController,
  getAdminTestimonialByIdController,
  hideAdminTestimonialController,
  listAdminTestimonialsController,
  listPublicTestimonialsController,
  updateAdminTestimonialController,
} from "../controllers/testimonial.controller";

export const testimonialRouter = Router();

testimonialRouter.get("/testimonials", asyncHandler(listPublicTestimonialsController));
testimonialRouter.post("/testimonials", requireAuth, asyncHandler(createTestimonialController));

testimonialRouter.get("/admin/testimonials", requireAdmin, asyncHandler(listAdminTestimonialsController));
testimonialRouter.get(
  "/admin/testimonials/:testimonialId",
  requireAdmin,
  asyncHandler(getAdminTestimonialByIdController),
);
testimonialRouter.post("/admin/testimonials", requireAdmin, asyncHandler(createAdminTestimonialController));
testimonialRouter.patch(
  "/admin/testimonials/:testimonialId",
  requireAdmin,
  asyncHandler(updateAdminTestimonialController),
);
testimonialRouter.delete(
  "/admin/testimonials/:testimonialId",
  requireAdmin,
  asyncHandler(hideAdminTestimonialController),
);

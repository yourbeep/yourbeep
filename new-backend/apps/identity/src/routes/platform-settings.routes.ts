import { Router } from "express";
import { asyncHandler, requireAdmin } from "@yourbeep/shared";
import {
  createPlatformFaqController,
  deletePlatformFaqController,
  getAdminPlatformSettingsController,
  getCommunityGuidelinesController,
  getCookiePolicyController,
  getPrivacyPolicyController,
  getPublicPlatformSettingsController,
  getRefundPolicyController,
  getTermsAndConditionsController,
  updatePlatformFaqController,
  updatePlatformSettingsController,
} from "../controllers/platform-settings.controller";

export const platformSettingsRouter = Router();

platformSettingsRouter.get("/platform/settings", asyncHandler(getPublicPlatformSettingsController));
platformSettingsRouter.get("/platform/legal/terms", asyncHandler(getTermsAndConditionsController));
platformSettingsRouter.get("/platform/legal/privacy", asyncHandler(getPrivacyPolicyController));
platformSettingsRouter.get("/platform/legal/refund", asyncHandler(getRefundPolicyController));
platformSettingsRouter.get("/platform/legal/cookies", asyncHandler(getCookiePolicyController));
platformSettingsRouter.get("/platform/legal/community-guidelines", asyncHandler(getCommunityGuidelinesController));

platformSettingsRouter.get("/admin/platform/settings", requireAdmin, asyncHandler(getAdminPlatformSettingsController));
platformSettingsRouter.patch("/admin/platform/settings", requireAdmin, asyncHandler(updatePlatformSettingsController));
platformSettingsRouter.post("/admin/platform/settings/faqs", requireAdmin, asyncHandler(createPlatformFaqController));
platformSettingsRouter.patch(
  "/admin/platform/settings/faqs/:faqId",
  requireAdmin,
  asyncHandler(updatePlatformFaqController),
);
platformSettingsRouter.delete(
  "/admin/platform/settings/faqs/:faqId",
  requireAdmin,
  asyncHandler(deletePlatformFaqController),
);

import { parseBody, success } from "@yourbeep/shared";
import type { Request, Response } from "express";
import {
  createPlatformFaq,
  deletePlatformFaq,
  getAdminPlatformSettings,
  getPlatformLegalDocument,
  getPublicPlatformSettings,
  updatePlatformFaq,
  updatePlatformSettings,
} from "../services/platform-settings.service";
import {
  createPlatformFaqSchema,
  updatePlatformFaqSchema,
  updatePlatformSettingsSchema,
} from "../validators";

export const getPublicPlatformSettingsController = async (_req: Request, res: Response) => {
  const data = await getPublicPlatformSettings();
  return success(res, data, "Platform settings");
};

export const getTermsAndConditionsController = async (_req: Request, res: Response) => {
  const data = await getPlatformLegalDocument("termsOfService");
  return success(res, data, "Terms & Conditions");
};

export const getPrivacyPolicyController = async (_req: Request, res: Response) => {
  const data = await getPlatformLegalDocument("privacyPolicy");
  return success(res, data, "Privacy policy");
};

export const getRefundPolicyController = async (_req: Request, res: Response) => {
  const data = await getPlatformLegalDocument("refundPolicy");
  return success(res, data, "Refund policy");
};

export const getCookiePolicyController = async (_req: Request, res: Response) => {
  const data = await getPlatformLegalDocument("cookiePolicy");
  return success(res, data, "Cookie policy");
};

export const getCommunityGuidelinesController = async (_req: Request, res: Response) => {
  const data = await getPlatformLegalDocument("communityGuidelines");
  return success(res, data, "Community guidelines");
};

export const getAdminPlatformSettingsController = async (_req: Request, res: Response) => {
  const data = await getAdminPlatformSettings();
  return success(res, data, "Admin platform settings");
};

export const updatePlatformSettingsController = async (req: Request, res: Response) => {
  const payload = parseBody(updatePlatformSettingsSchema, req.body);
  const data = await updatePlatformSettings(req.auth!.id, payload);
  return success(res, data, "Platform settings updated");
};

export const createPlatformFaqController = async (req: Request, res: Response) => {
  const payload = parseBody(createPlatformFaqSchema, req.body);
  const data = await createPlatformFaq(req.auth!.id, payload);
  return success(res, data, "Platform FAQ created", 201);
};

export const updatePlatformFaqController = async (req: Request, res: Response) => {
  const payload = parseBody(updatePlatformFaqSchema, req.body);
  const data = await updatePlatformFaq(req.auth!.id, String(req.params.faqId), payload);
  return success(res, data, "Platform FAQ updated");
};

export const deletePlatformFaqController = async (req: Request, res: Response) => {
  const data = await deletePlatformFaq(req.auth!.id, String(req.params.faqId));
  return success(res, data, "Platform FAQ deleted");
};

import { parseBody, success } from "@yourbeep/shared";
import type { Request, Response } from "express";
import {
  archivePromotion,
  createPromotion,
  getPromotionById,
  getPromotionSummary,
  listPromotions,
  resolvePromotionPreview,
  restorePromotion,
  updatePromotion,
} from "../services/promotion.service";
import {
  promotionCreateSchema,
  promotionListQuerySchema,
  promotionPreviewSchema,
  promotionUpdateSchema,
} from "../validators";
import { PricingModel } from "../models/pricing";
import { AppError } from "@yourbeep/shared";
import { Types } from "mongoose";

const detectRegion = (req: Request) =>
  typeof req.headers["x-user-region"] === "string" ? req.headers["x-user-region"].toUpperCase() : "IN";

export const listPromotionsController = async (req: Request, res: Response) => {
  const query = parseBody(promotionListQuerySchema, req.query);
  const data = await listPromotions(query);
  return success(res, data, "Promotions");
};

export const getPromotionByIdController = async (req: Request, res: Response) => {
  const data = await getPromotionById(String(req.params.promotionId));
  return success(res, data, "Promotion detail");
};

export const createPromotionController = async (req: Request, res: Response) => {
  const payload = parseBody(promotionCreateSchema, req.body);
  const data = await createPromotion(req.auth!.id, payload);
  return success(res, data, "Promotion created");
};

export const updatePromotionController = async (req: Request, res: Response) => {
  const payload = parseBody(promotionUpdateSchema, req.body);
  const data = await updatePromotion(String(req.params.promotionId), payload);
  return success(res, data, "Promotion updated");
};

export const archivePromotionController = async (req: Request, res: Response) => {
  const data = await archivePromotion(String(req.params.promotionId));
  return success(res, data, "Promotion archived");
};

export const restorePromotionController = async (req: Request, res: Response) => {
  const data = await restorePromotion(String(req.params.promotionId));
  return success(res, data, "Promotion restored");
};

export const getPromotionSummaryController = async (_req: Request, res: Response) => {
  const data = await getPromotionSummary();
  return success(res, data, "Promotion summary");
};

export const previewPromotionController = async (req: Request, res: Response) => {
  const payload = parseBody(promotionPreviewSchema, req.body);
  const pricing = await PricingModel.findOne({
    courseId: new Types.ObjectId(String(req.params.courseId)),
    region: detectRegion(req),
  });

  if (!pricing) {
    throw new AppError("No pricing found for the requested region", 422, "REGION_NOT_SUPPORTED");
  }

  const originalAmount = payload.planType === "six_month" ? pricing.amount6mo : pricing.amount1yr;
  const data = await resolvePromotionPreview({
    courseId: String(req.params.courseId),
    region: pricing.region,
    currency: pricing.currency,
    planType: payload.planType,
    originalAmount,
    userId: req.auth!.id,
    promotionCode: payload.promotionCode,
  });

  return success(
    res,
    {
      ...data,
      courseId: String(req.params.courseId),
      region: pricing.region,
      currency: pricing.currency,
      planType: payload.planType,
    },
    "Promotion preview",
  );
};

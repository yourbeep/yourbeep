import { AppError } from "@yourbeep/shared";
import { Types } from "mongoose";
import { CoursePurchaseModel, type PlanType } from "../models/course-purchase";
import {
  PromotionModel,
  type PromotionDiscountType,
  type PromotionDocument,
  type PromotionRecord,
} from "../models/promotion";
import {
  createStripeCouponAndPromotionCode,
  deactivateStripePromotionCode,
} from "./stripe.service";
import type { z } from "zod";
import {
  promotionCreateSchema,
  promotionListQuerySchema,
  promotionUpdateSchema,
} from "../validators";

type PromotionCreateInput = z.infer<typeof promotionCreateSchema>;
type PromotionUpdateInput = z.infer<typeof promotionUpdateSchema>;
type PromotionListQuery = z.infer<typeof promotionListQuerySchema>;

type PromotionPreviewInput = {
  courseId: string;
  region: string;
  currency: string;
  planType: PlanType;
  originalAmount: number;
  userId?: string;
  promotionCode?: string;
};

const round = (value: number) => Number(value.toFixed(2));

const toObjectId = (value?: string) => (value ? new Types.ObjectId(value) : undefined);

const normalizeRegions = (regions: string[]) => [...new Set(regions.map((item) => item.toUpperCase()))];

const getPromotionStatus = (promotion: PromotionRecord, now = new Date()) => {
  if (promotion.isArchived) return "archived";
  if (!promotion.isActive) return "inactive";
  if (promotion.startsAt && promotion.startsAt > now) return "scheduled";
  if (promotion.endsAt && promotion.endsAt <= now) return "expired";
  return "active";
};

const serializePromotion = (promotion: PromotionRecord) => ({
  _id: promotion._id.toString(),
  name: promotion.name,
  code: promotion.code,
  description: promotion.description ?? null,
  courseId: promotion.courseId?.toString() ?? null,
  regions: promotion.regions,
  planTypes: promotion.planTypes,
  discountType: promotion.discountType,
  percentageOff: promotion.percentageOff ?? null,
  amountOff: promotion.amountOff ?? null,
  currency: promotion.currency ?? null,
  autoApply: promotion.autoApply,
  startsAt: promotion.startsAt ?? null,
  endsAt: promotion.endsAt ?? null,
  maxRedemptions: promotion.maxRedemptions ?? null,
  redemptionCount: promotion.redemptionCount,
  perUserLimit: promotion.perUserLimit,
  isActive: promotion.isActive,
  isArchived: promotion.isArchived,
  status: getPromotionStatus(promotion),
  createdBy: promotion.createdBy?.toString?.() ?? "",
  createdAt: promotion.createdAt,
  updatedAt: promotion.updatedAt,
});

const createStripeAssets = async (
  payload: PromotionCreateInput | PromotionUpdateInput,
  metadata: Record<string, string>,
) =>
  createStripeCouponAndPromotionCode({
    code: payload.code,
    name: payload.name,
    discountType: payload.discountType,
    percentageOff: payload.percentageOff,
    amountOff: payload.amountOff,
    currency: payload.currency,
    maxRedemptions: payload.maxRedemptions,
    expiresAt: payload.endsAt,
    metadata,
  });

const calculateDiscountAmount = (
  originalAmount: number,
  promotion: PromotionRecord,
  currency: string,
) => {
  if (promotion.discountType === "percentage") {
    return Math.min(originalAmount, Math.round(originalAmount * ((promotion.percentageOff ?? 0) / 100)));
  }

  if (promotion.currency !== currency) {
    throw new AppError("Promotion currency does not match course pricing currency", 422, "PROMOTION_CURRENCY_MISMATCH");
  }

  return Math.min(originalAmount, promotion.amountOff ?? 0);
};

const ensurePromotionUserLimit = async (promotion: PromotionRecord, userId?: string) => {
  if (!userId || promotion.perUserLimit <= 0) {
    return;
  }

  const count = await CoursePurchaseModel.countDocuments({
    userId: new Types.ObjectId(userId),
    promotionId: promotion._id,
    purchasedAt: { $exists: true },
  });

  if (count >= promotion.perUserLimit) {
    throw new AppError("Promotion usage limit reached for this user", 422, "PROMOTION_USER_LIMIT_REACHED");
  }
};

const ensurePromotionApplicability = async (
  promotion: PromotionRecord,
  input: PromotionPreviewInput,
) => {
  const now = new Date();
  const status = getPromotionStatus(promotion, now);

  if (status !== "active") {
    throw new AppError("Promotion is not currently active", 422, "PROMOTION_INACTIVE");
  }

  if (promotion.courseId && promotion.courseId.toString() !== input.courseId) {
    throw new AppError("Promotion does not apply to this course", 422, "PROMOTION_NOT_APPLICABLE");
  }

  if (promotion.regions.length > 0 && !promotion.regions.includes(input.region)) {
    throw new AppError("Promotion does not apply to this region", 422, "PROMOTION_NOT_APPLICABLE");
  }

  if (!promotion.planTypes.includes(input.planType)) {
    throw new AppError("Promotion does not apply to this plan", 422, "PROMOTION_NOT_APPLICABLE");
  }

  if (
    promotion.maxRedemptions !== undefined &&
    promotion.redemptionCount >= promotion.maxRedemptions
  ) {
    throw new AppError("Promotion redemption limit reached", 422, "PROMOTION_EXHAUSTED");
  }

  await ensurePromotionUserLimit(promotion, input.userId);
};

const listApplicablePromotions = async (input: PromotionPreviewInput, autoApplyOnly: boolean) => {
  const filter: Record<string, unknown> = {
    isArchived: false,
    isActive: true,
    planTypes: input.planType,
    $or: [{ courseId: new Types.ObjectId(input.courseId) }, { courseId: { $exists: false } }],
  };

  if (autoApplyOnly) {
    filter.autoApply = true;
  }

  const promotions = await PromotionModel.find(filter).sort({ createdAt: -1 });
  const applicable: Array<{
    promotion: PromotionRecord;
    discountAmount: number;
  }> = [];

  for (const promotion of promotions) {
    try {
      await ensurePromotionApplicability(promotion, input);
      const discountAmount = calculateDiscountAmount(input.originalAmount, promotion, input.currency);
      applicable.push({ promotion, discountAmount });
    } catch {
      continue;
    }
  }

  return applicable.sort((left, right) => right.discountAmount - left.discountAmount);
};

export const resolvePromotionPreview = async (input: PromotionPreviewInput) => {
  let selectedPromotion: PromotionRecord | null = null;
  let discountAmount = 0;
  const availablePromotions: PromotionRecord[] = [];

  if (input.promotionCode) {
    const promotion = await PromotionModel.findOne({
      code: input.promotionCode.toUpperCase(),
      isArchived: false,
    });

    if (!promotion) {
      throw new AppError("Promotion code not found", 404, "PROMOTION_NOT_FOUND");
    }

    await ensurePromotionApplicability(promotion, input);
    selectedPromotion = promotion;
    discountAmount = calculateDiscountAmount(input.originalAmount, promotion, input.currency);
    availablePromotions.push(promotion);
  } else {
    const applicable = await listApplicablePromotions(input, true);
    availablePromotions.push(...applicable.map((item) => item.promotion));
    if (applicable[0]) {
      selectedPromotion = applicable[0].promotion;
      discountAmount = applicable[0].discountAmount;
    }
  }

  const finalAmount = Math.max(1, input.originalAmount - discountAmount);

  return {
    originalAmount: input.originalAmount,
    discountAmount,
    finalAmount,
    appliedPromotion: selectedPromotion
      ? {
          id: selectedPromotion._id.toString(),
          name: selectedPromotion.name,
          code: selectedPromotion.code,
          discountType: selectedPromotion.discountType,
          discountValue:
            selectedPromotion.discountType === "percentage"
              ? selectedPromotion.percentageOff ?? 0
              : selectedPromotion.amountOff ?? 0,
          stripeCouponId: selectedPromotion.stripeCouponId ?? null,
          stripePromotionCodeId: selectedPromotion.stripePromotionCodeId ?? null,
        }
      : null,
    availablePromotions: availablePromotions.map((promotion) => ({
      id: promotion._id.toString(),
      name: promotion.name,
      code: promotion.code,
      discountType: promotion.discountType,
      discountValue:
        promotion.discountType === "percentage"
          ? promotion.percentageOff ?? 0
          : promotion.amountOff ?? 0,
      status: getPromotionStatus(promotion),
    })),
  };
};

export const createPromotion = async (adminId: string, payload: PromotionCreateInput) => {
  const existing = await PromotionModel.findOne({ code: payload.code });
  if (existing) {
    throw new AppError("Promotion code already exists", 409, "PROMOTION_CODE_EXISTS");
  }

  const stripeAssets = await createStripeAssets(payload, {
    adminId,
    courseId: payload.courseId ?? "global",
  });

  const promotion = await PromotionModel.create({
    ...payload,
    regions: normalizeRegions(payload.regions),
    stripeCouponId: stripeAssets.couponId,
    stripePromotionCodeId: stripeAssets.promotionCodeId,
    createdBy: new Types.ObjectId(adminId),
    courseId: toObjectId(payload.courseId),
  });

  return { promotion: serializePromotion(promotion) };
};

export const updatePromotion = async (promotionId: string, payload: PromotionUpdateInput) => {
  const promotion = await PromotionModel.findById(promotionId);
  if (!promotion) {
    throw new AppError("Promotion not found", 404, "NOT_FOUND");
  }

  if (promotion.code !== payload.code) {
    const conflict = await PromotionModel.findOne({ code: payload.code, _id: { $ne: promotion._id } });
    if (conflict) {
      throw new AppError("Promotion code already exists", 409, "PROMOTION_CODE_EXISTS");
    }
  }

  const previousPromotionCodeId = promotion.stripePromotionCodeId;
  const stripeAssets = await createStripeAssets(payload, {
    promotionId: promotion.id,
    courseId: payload.courseId ?? "global",
  });

  Object.assign(promotion, {
    ...payload,
    regions: normalizeRegions(payload.regions),
    stripeCouponId: stripeAssets.couponId,
    stripePromotionCodeId: stripeAssets.promotionCodeId,
    courseId: toObjectId(payload.courseId),
  });

  await promotion.save();
  await deactivateStripePromotionCode(previousPromotionCodeId).catch(() => null);

  return { promotion: serializePromotion(promotion) };
};

export const archivePromotion = async (promotionId: string) => {
  const promotion = await PromotionModel.findByIdAndUpdate(
    promotionId,
    { $set: { isArchived: true, isActive: false } },
    { new: true },
  );

  if (!promotion) {
    throw new AppError("Promotion not found", 404, "NOT_FOUND");
  }

  await deactivateStripePromotionCode(promotion.stripePromotionCodeId).catch(() => null);
  return { promotion: serializePromotion(promotion) };
};

export const restorePromotion = async (promotionId: string) => {
  const promotion = await PromotionModel.findById(promotionId);
  if (!promotion) {
    throw new AppError("Promotion not found", 404, "NOT_FOUND");
  }

  promotion.isArchived = false;
  await promotion.save();
  return { promotion: serializePromotion(promotion) };
};

export const getPromotionById = async (promotionId: string) => {
  const promotion = await PromotionModel.findById(promotionId);
  if (!promotion) {
    throw new AppError("Promotion not found", 404, "NOT_FOUND");
  }

  return { promotion: serializePromotion(promotion) };
};

export const listPromotions = async (query: PromotionListQuery) => {
  const filter: Record<string, unknown> = {};
  if (query.q) {
    filter.$or = [
      { name: { $regex: query.q, $options: "i" } },
      { code: { $regex: query.q, $options: "i" } },
    ];
  }
  if (query.courseId) {
    filter.courseId = new Types.ObjectId(query.courseId);
  }

  const promotions = await PromotionModel.find(filter).sort({ createdAt: -1 });
  const filtered = query.status
    ? promotions.filter((promotion) => getPromotionStatus(promotion) === query.status)
    : promotions;

  const start = (query.page - 1) * query.limit;
  const items = filtered.slice(start, start + query.limit).map(serializePromotion);

  return {
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total: filtered.length,
    },
  };
};

export const getPromotionSummary = async () => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const promotions = await PromotionModel.find({});
  const purchases = await CoursePurchaseModel.find({
    purchasedAt: { $gte: currentMonthStart },
    promotionId: { $exists: true },
  });

  const counts = promotions.reduce(
    (acc, promotion) => {
      const status = getPromotionStatus(promotion, now);
      acc.total += 1;
      acc[status] += 1;
      if (promotion.autoApply) {
        acc.autoApply += 1;
      }
      acc.totalRedemptions += promotion.redemptionCount;
      return acc;
    },
    {
      total: 0,
      active: 0,
      scheduled: 0,
      expired: 0,
      inactive: 0,
      archived: 0,
      autoApply: 0,
      totalRedemptions: 0,
    },
  );

  return {
    ...counts,
    currentMonthRedemptions: purchases.length,
    currentMonthDiscountGiven: round(purchases.reduce((sum, purchase) => sum + (purchase.discountAmount ?? 0), 0)),
  };
};

export const finalizePromotionRedemption = async (purchase: {
  promotionId?: Types.ObjectId;
}) => {
  if (!purchase.promotionId) {
    return;
  }

  await PromotionModel.findByIdAndUpdate(purchase.promotionId, { $inc: { redemptionCount: 1 } });
};

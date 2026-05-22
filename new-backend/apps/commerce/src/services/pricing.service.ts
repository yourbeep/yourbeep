import { AppError } from "@yourbeep/shared";
import { Types } from "mongoose";
import { PricingModel } from "../models/pricing";
import type { z } from "zod";
import { pricingUpsertSchema } from "../validators";

type PricingInput = z.infer<typeof pricingUpsertSchema>;

const regionToCurrency: Record<string, string> = {
  IN: "INR",
  US: "USD",
  CA: "CAD",
  GB: "GBP",
};

const displayPrice = (currency: string, amount: number) => `${currency} ${amount.toLocaleString("en-IN")}`;

const inferRegion = (input?: string) => {
  const value = (input ?? "").trim().toUpperCase();
  return value || "IN";
};

export const resolveUserRegion = (headers: Record<string, unknown>, explicitRegion?: string) => {
  const fromHeader = typeof headers["x-user-region"] === "string" ? headers["x-user-region"] : undefined;
  return inferRegion(explicitRegion ?? fromHeader);
};

export const getCoursePrice = async (courseId: string, region?: string) => {
  const resolvedRegion = inferRegion(region);
  const pricing = await PricingModel.findOne({ courseId: new Types.ObjectId(courseId), region: resolvedRegion });

  if (!pricing) {
    throw new AppError("No pricing found for the requested region", 422, "REGION_NOT_SUPPORTED");
  }

  return {
    courseId,
    region: pricing.region,
    currency: pricing.currency,
    plans: {
      sixMonth: {
        amount: pricing.amount6mo,
        displayPrice: displayPrice(pricing.currency, pricing.amount6mo),
        planType: "six_month",
        stripePriceId: pricing.stripePriceId6mo ?? null,
      },
      annual: {
        amount: pricing.amount1yr,
        displayPrice: displayPrice(pricing.currency, pricing.amount1yr),
        planType: "annual",
        savings: pricing.amount1yr < pricing.amount6mo * 2 ? displayPrice(pricing.currency, pricing.amount6mo * 2 - pricing.amount1yr) : null,
        stripePriceId: pricing.stripePriceId1yr ?? null,
      },
    },
    detectionMethod: region ? "explicit" : "ip",
  };
};

export const upsertPricing = async (courseId: string, payload: PricingInput) => {
  const courseObjectId = new Types.ObjectId(courseId);
  const pricing = await PricingModel.findOneAndUpdate(
    { courseId: courseObjectId, region: payload.region },
    {
      $set: {
        ...payload,
        currency: payload.currency || regionToCurrency[payload.region] || payload.currency,
      },
    },
    { new: true, upsert: true },
  );

  return pricing;
};

export const listCoursePricing = async (courseId: string) => {
  const items = await PricingModel.find({ courseId: new Types.ObjectId(courseId) }).sort({ updatedAt: -1, region: 1 });
  return { items };
};

export const deleteCoursePricing = async (courseId: string, region: string) => {
  const deleted = await PricingModel.findOneAndDelete({
    courseId: new Types.ObjectId(courseId),
    region: inferRegion(region),
  });

  if (!deleted) {
    throw new AppError("Pricing row not found", 404, "NOT_FOUND");
  }

  return deleted;
};

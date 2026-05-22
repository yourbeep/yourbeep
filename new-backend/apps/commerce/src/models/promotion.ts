import { Schema, model, models, Types, type HydratedDocument } from "mongoose";
import type { PlanType } from "./course-purchase";

export type PromotionDiscountType = "percentage" | "fixed_amount";

export interface PromotionDocument {
  name: string;
  code: string;
  description?: string;
  courseId?: Types.ObjectId;
  regions: string[];
  planTypes: PlanType[];
  discountType: PromotionDiscountType;
  percentageOff?: number;
  amountOff?: number;
  currency?: string;
  autoApply: boolean;
  startsAt?: Date;
  endsAt?: Date;
  maxRedemptions?: number;
  redemptionCount: number;
  perUserLimit: number;
  isActive: boolean;
  isArchived: boolean;
  stripeCouponId?: string;
  stripePromotionCodeId?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type PromotionRecord = HydratedDocument<PromotionDocument>;

const promotionSchema = new Schema<PromotionDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    code: { type: String, required: true, trim: true, uppercase: true, maxlength: 40, unique: true, index: true },
    description: { type: String, trim: true, maxlength: 500 },
    courseId: { type: Schema.Types.ObjectId, index: true },
    regions: [{ type: String, uppercase: true, minlength: 2, maxlength: 2 }],
    planTypes: {
      type: [{ type: String, enum: ["six_month", "annual"] }],
      default: ["six_month", "annual"],
    },
    discountType: { type: String, enum: ["percentage", "fixed_amount"], required: true },
    percentageOff: { type: Number, min: 1, max: 100 },
    amountOff: { type: Number, min: 1 },
    currency: { type: String, uppercase: true, minlength: 3, maxlength: 3 },
    autoApply: { type: Boolean, default: false },
    startsAt: { type: Date },
    endsAt: { type: Date },
    maxRedemptions: { type: Number, min: 1 },
    redemptionCount: { type: Number, default: 0, min: 0 },
    perUserLimit: { type: Number, default: 1, min: 1 },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
    stripeCouponId: { type: String },
    stripePromotionCodeId: { type: String },
    createdBy: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
  },
);

promotionSchema.index({ courseId: 1, isArchived: 1, isActive: 1 });

export const PromotionModel = models.Promotion || model<PromotionDocument>("Promotion", promotionSchema);

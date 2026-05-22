import { Schema, model, models, Types } from "mongoose";

export interface PricingDocument {
  courseId: Types.ObjectId;
  region: string;
  currency: string;
  amount6mo: number;
  amount1yr: number;
  stripeProductId6mo?: string;
  stripeProductId1yr?: string;
  stripePriceId6mo?: string;
  stripePriceId1yr?: string;
  createdAt: Date;
  updatedAt: Date;
}

const pricingSchema = new Schema<PricingDocument>(
  {
    courseId: { type: Schema.Types.ObjectId, required: true, index: true },
    region: { type: String, required: true, uppercase: true, minlength: 2, maxlength: 2 },
    currency: { type: String, required: true, uppercase: true, minlength: 3, maxlength: 3 },
    amount6mo: { type: Number, required: true, min: 1 },
    amount1yr: { type: Number, required: true, min: 1 },
    stripeProductId6mo: { type: String },
    stripeProductId1yr: { type: String },
    stripePriceId6mo: { type: String },
    stripePriceId1yr: { type: String },
  },
  {
    timestamps: true,
  },
);

pricingSchema.index({ courseId: 1, region: 1 }, { unique: true });

export const PricingModel = models.Pricing || model<PricingDocument>("Pricing", pricingSchema);

import { Schema, model, models, Types, type HydratedDocument } from "mongoose";

export type PlanType = "six_month" | "annual";
export type PurchaseStatus = "pending" | "active" | "expired" | "cancelled" | "refunded";

export interface CoursePurchaseDocument {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  planType: PlanType;
  status: PurchaseStatus;
  region: string;
  currency: string;
  originalAmount: number;
  discountAmount: number;
  amountPaid: number;
  promotionId?: Types.ObjectId;
  promotionCode?: string;
  promotionName?: string;
  promotionDiscountType?: "percentage" | "fixed_amount";
  promotionDiscountValue?: number;
  stripePriceId: string;
  stripeSessionId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripeInvoiceId?: string;
  stripePaymentIntentId?: string;
  stripeRefundId?: string;
  detectedRegionIp: string;
  phoneCountryCode?: string;
  regionMismatch: boolean;
  accessGranted: boolean;
  startDate?: Date;
  expiryDate?: Date;
  renewedFromId?: Types.ObjectId;
  purchasedAt?: Date;
  paymentFailedNotificationSentAt?: Date;
  expiringNotificationSentAt?: Date;
  expiredNotificationSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type CoursePurchaseRecord = HydratedDocument<CoursePurchaseDocument>;

const coursePurchaseSchema = new Schema<CoursePurchaseDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, required: true, index: true },
    planType: { type: String, enum: ["six_month", "annual"], required: true },
    status: {
      type: String,
      enum: ["pending", "active", "expired", "cancelled", "refunded"],
      default: "pending",
    },
    region: { type: String, required: true, uppercase: true, minlength: 2, maxlength: 2 },
    currency: { type: String, required: true, uppercase: true, minlength: 3, maxlength: 3 },
    originalAmount: { type: Number, required: true, min: 1 },
    discountAmount: { type: Number, required: true, min: 0, default: 0 },
    amountPaid: { type: Number, required: true, min: 1 },
    promotionId: { type: Schema.Types.ObjectId, index: true },
    promotionCode: { type: String, uppercase: true },
    promotionName: { type: String },
    promotionDiscountType: { type: String, enum: ["percentage", "fixed_amount"] },
    promotionDiscountValue: { type: Number, min: 0 },
    stripePriceId: { type: String, required: true },
    stripeSessionId: { type: String, required: true, unique: true, index: true },
    stripeCustomerId: { type: String, index: true },
    stripeSubscriptionId: { type: String, index: true },
    stripeInvoiceId: { type: String },
    stripePaymentIntentId: { type: String },
    stripeRefundId: { type: String },
    detectedRegionIp: { type: String, required: true, uppercase: true, minlength: 2, maxlength: 2 },
    phoneCountryCode: { type: String },
    regionMismatch: { type: Boolean, default: false },
    accessGranted: { type: Boolean, default: false },
    startDate: { type: Date },
    expiryDate: { type: Date, index: true },
    renewedFromId: { type: Schema.Types.ObjectId },
    purchasedAt: { type: Date },
    paymentFailedNotificationSentAt: { type: Date },
    expiringNotificationSentAt: { type: Date },
    expiredNotificationSentAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

coursePurchaseSchema.index({ userId: 1, courseId: 1, status: 1, expiryDate: 1 });

export const CoursePurchaseModel =
  models.CoursePurchase || model<CoursePurchaseDocument>("CoursePurchase", coursePurchaseSchema);

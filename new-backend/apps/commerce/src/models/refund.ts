import { Schema, model, models, Types } from "mongoose";

export interface RefundDocument {
  purchaseId: Types.ObjectId;
  stripeRefundId: string;
  amount: number;
  reason: "duplicate" | "fraudulent" | "requested_by_customer" | "other";
  adminId: Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const refundSchema = new Schema<RefundDocument>(
  {
    purchaseId: { type: Schema.Types.ObjectId, required: true, index: true },
    stripeRefundId: { type: String, required: true, unique: true, index: true },
    amount: { type: Number, required: true, min: 1 },
    reason: {
      type: String,
      enum: ["duplicate", "fraudulent", "requested_by_customer", "other"],
      required: true,
    },
    adminId: { type: Schema.Types.ObjectId, required: true },
    notes: { type: String },
  },
  { timestamps: true },
);

export const RefundModel = models.Refund || model<RefundDocument>("Refund", refundSchema);

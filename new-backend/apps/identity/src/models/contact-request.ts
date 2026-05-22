import { Schema, model, models, type HydratedDocument } from "mongoose";

export type ContactRequestTopic =
  | "refund_related"
  | "account_access"
  | "course_access"
  | "video_access"
  | "payment_issue"
  | "game_issue"
  | "technical_issue"
  | "general_support"
  | "partnership"
  | "feedback";

export type ContactRequestStatus = "new" | "reviewed" | "replied" | "closed";

export interface ContactRequestDocument {
  name: string;
  email: string;
  topic: ContactRequestTopic;
  subject: string;
  message: string;
  phoneCountryCode?: string;
  userId?: string;
  status: ContactRequestStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ContactRequestRecord = HydratedDocument<ContactRequestDocument>;

const contactRequestSchema = new Schema<ContactRequestDocument>(
  {
    name: { type: String, required: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    topic: {
      type: String,
      enum: [
        "refund_related",
        "account_access",
        "course_access",
        "video_access",
        "payment_issue",
        "game_issue",
        "technical_issue",
        "general_support",
        "partnership",
        "feedback",
      ],
      required: true,
      index: true,
    },
    subject: { type: String, required: true, maxlength: 160 },
    message: { type: String, required: true, maxlength: 5000 },
    phoneCountryCode: { type: String },
    userId: { type: String, index: true },
    status: {
      type: String,
      enum: ["new", "reviewed", "replied", "closed"],
      default: "new",
      index: true,
    },
    notes: { type: String, maxlength: 3000 },
  },
  { timestamps: true },
);

contactRequestSchema.index({ createdAt: -1, status: 1 });

export const ContactRequestModel =
  models.ContactRequest || model<ContactRequestDocument>("ContactRequest", contactRequestSchema);

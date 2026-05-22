import { Schema, model, models, type HydratedDocument, Types } from "mongoose";

export type NotificationAudienceType =
  | "all_users"
  | "premium_users"
  | "course_purchasers"
  | "specific_users"
  | "region_users";

export type NotificationCampaignStatus = "draft" | "sent" | "cancelled";

export interface NotificationCampaignDocument {
  title: string;
  body: string;
  imageUrl?: string;
  type:
    | "course_ready"
    | "game_added"
    | "game_reminder"
    | "purchase_confirmed"
    | "subscription_expiring"
    | "subscription_expired"
    | "admin_broadcast";
  audience: {
    type: NotificationAudienceType;
    courseId?: Types.ObjectId;
    userIds: Types.ObjectId[];
    regions: string[];
  };
  data?: Record<string, string>;
  status: NotificationCampaignStatus;
  targetedUsersCount: number;
  requestedTokens: number;
  successCount: number;
  failureCount: number;
  invalidTokenCount: number;
  sentAt?: Date;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationCampaignRecord = HydratedDocument<NotificationCampaignDocument>;

const notificationCampaignSchema = new Schema<NotificationCampaignDocument>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    body: { type: String, required: true, trim: true, maxlength: 500 },
    imageUrl: { type: String },
    type: {
      type: String,
      enum: [
        "course_ready",
        "game_added",
        "game_reminder",
        "purchase_confirmed",
        "subscription_expiring",
        "subscription_expired",
        "admin_broadcast",
      ],
      default: "admin_broadcast",
    },
    audience: {
      type: {
        type: String,
        enum: ["all_users", "premium_users", "course_purchasers", "specific_users", "region_users"],
        required: true,
      },
      courseId: { type: Schema.Types.ObjectId },
      userIds: { type: [Schema.Types.ObjectId], default: [] },
      regions: { type: [String], default: [] },
    },
    data: { type: Map, of: String },
    status: {
      type: String,
      enum: ["draft", "sent", "cancelled"],
      default: "draft",
      index: true,
    },
    targetedUsersCount: { type: Number, default: 0 },
    requestedTokens: { type: Number, default: 0 },
    successCount: { type: Number, default: 0 },
    failureCount: { type: Number, default: 0 },
    invalidTokenCount: { type: Number, default: 0 },
    sentAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, required: true, index: true },
    updatedBy: { type: Schema.Types.ObjectId },
  },
  {
    timestamps: true,
  },
);

notificationCampaignSchema.index({ "audience.type": 1, status: 1, createdAt: -1 });

export const NotificationCampaignModel =
  models.NotificationCampaign ||
  model<NotificationCampaignDocument>("NotificationCampaign", notificationCampaignSchema);

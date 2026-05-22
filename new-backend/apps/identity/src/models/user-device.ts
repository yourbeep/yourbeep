import { Schema, model, models, Types } from "mongoose";

export type UserPlatform = "web" | "ios" | "android";

export interface UserDeviceDocument {
  userId: Types.ObjectId;
  platform: UserPlatform;
  sessionKey?: string;
  fcmToken?: string;
  ipAddress?: string;
  userAgent?: string;
  deviceName?: string;
  countryCode?: string;
  regionName?: string;
  city?: string;
  locationLabel?: string;
  notificationsEnabled: boolean;
  isActive: boolean;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userDeviceSchema = new Schema<UserDeviceDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    platform: { type: String, enum: ["web", "ios", "android"], required: true, index: true },
    sessionKey: { type: String, sparse: true, index: true },
    fcmToken: { type: String, sparse: true, index: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    deviceName: { type: String },
    countryCode: { type: String },
    regionName: { type: String },
    city: { type: String },
    locationLabel: { type: String },
    notificationsEnabled: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, index: true },
    lastSeenAt: { type: Date, default: () => new Date(), index: true },
  },
  {
    timestamps: true,
  },
);

userDeviceSchema.index({ userId: 1, platform: 1, sessionKey: 1 }, { unique: true, sparse: true });
userDeviceSchema.index({ userId: 1, platform: 1, fcmToken: 1 }, { unique: true, sparse: true });

export const UserDeviceModel =
  models.UserDevice || model<UserDeviceDocument>("UserDevice", userDeviceSchema);

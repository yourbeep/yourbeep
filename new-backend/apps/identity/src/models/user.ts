import { Schema, model, models } from "mongoose";

export interface UserDocument {
  firebaseUid: string;
  name: string;
  email: string;
  avatar?: string;
  timezone: string;
  role: "user" | "admin";
  userLevel: number;
  points: number;
  streakDays: number;
  badges: string[];
  fcmTokens: string[];
  region?: string;
  phoneCountryCode?: string;
  isActive: boolean;
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    avatar: { type: String },
    timezone: { type: String, default: "UTC" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    userLevel: { type: Number, default: 1 },
    points: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
    fcmTokens: { type: [String], default: [] },
    region: { type: String },
    phoneCountryCode: { type: String },
    isActive: { type: Boolean, default: true },
    lastActiveAt: { type: Date, default: () => new Date() },
  },
  {
    timestamps: true,
  },
);

export const UserModel = models.User || model<UserDocument>("User", userSchema);

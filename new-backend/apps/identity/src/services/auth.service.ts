import { AppError, deleteFirebaseUser, env, httpJson } from "@yourbeep/shared";
import type { AuthContext } from "@yourbeep/shared";
import { UserModel } from "../models/user";
import type { z } from "zod";
import { authSyncSchema } from "../validators";
import { upsertUserDevice } from "./user-device.service";

type AuthSyncInput = z.infer<typeof authSyncSchema>;
type SessionAccessContext = {
  platform: "web" | "ios" | "android";
  sessionKey?: string;
  ipAddress?: string;
  userAgent?: string;
  deviceName?: string;
  countryCode?: string;
  regionName?: string;
  city?: string;
  locationLabel?: string;
};

const deriveDisplayName = (email: string) => email.split("@")[0]?.replace(/[._-]+/g, " ") ?? "User";
const adminEmailAllowlist = (env.ADMIN_EMAIL_ALLOWLIST ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const isAdminEmail = (email: string) => adminEmailAllowlist.includes(email.trim().toLowerCase());

export const syncUser = async (
  auth: AuthContext | null,
  payload: AuthSyncInput,
  sessionAccess?: SessionAccessContext,
) => {
  if (!auth) {
    throw new AppError(
      "A valid bearer token is required for auth sync even though the route is public",
      401,
      "TOKEN_INVALID",
    );
  }

  const existing = await UserModel.findOne({ firebaseUid: auth.firebaseUid });

  const user =
    existing ??
    new UserModel({
      firebaseUid: auth.firebaseUid,
      email: auth.email,
      name: deriveDisplayName(auth.email),
      timezone: payload.timezone ?? "UTC",
      region: payload.region,
      role: isAdminEmail(auth.email) ? "admin" : "user",
      fcmTokens: payload.fcmToken ? [payload.fcmToken] : [],
    });

  if (existing) {
    existing.email = auth.email;
    existing.timezone = payload.timezone ?? "UTC";
    existing.region = payload.region;
    existing.lastActiveAt = new Date();

    if (isAdminEmail(auth.email) && existing.role !== "admin") {
      existing.role = "admin";
    }

    if (payload.fcmToken && !existing.fcmTokens.includes(payload.fcmToken)) {
      existing.fcmTokens.push(payload.fcmToken);
    }

    await existing.save();
  } else {
    await user.save();
  }

  const saved = existing ?? user;

  if (payload.deviceType || sessionAccess) {
    await upsertUserDevice({
      userId: saved.id,
      platform: payload.deviceType ?? sessionAccess?.platform ?? "web",
      sessionKey: sessionAccess?.sessionKey,
      fcmToken: payload.fcmToken,
      notificationsEnabled: Boolean(payload.fcmToken),
      ipAddress: sessionAccess?.ipAddress,
      userAgent: sessionAccess?.userAgent,
      deviceName: sessionAccess?.deviceName,
      countryCode: sessionAccess?.countryCode,
      regionName: sessionAccess?.regionName,
      city: sessionAccess?.city,
      locationLabel: sessionAccess?.locationLabel,
    });
  }

  return {
    user: saved.toObject(),
    isNewUser: !existing,
  };
};

export const getAuthenticatedUserProfile = async (
  firebaseUid: string,
  touchLastActive = false,
  sessionAccess?: SessionAccessContext,
) => {
  const user = await UserModel.findOne({ firebaseUid, isActive: true });

  if (!user) {
    throw new AppError("User profile does not exist yet", 404, "USER_NOT_FOUND");
  }

  if (touchLastActive) {
    user.lastActiveAt = new Date();
    await user.save();
  }

  if (sessionAccess) {
    await upsertUserDevice({
      userId: user.id,
      platform: sessionAccess.platform,
      sessionKey: sessionAccess.sessionKey,
      ipAddress: sessionAccess.ipAddress,
      userAgent: sessionAccess.userAgent,
      deviceName: sessionAccess.deviceName,
      countryCode: sessionAccess.countryCode,
      regionName: sessionAccess.regionName,
      city: sessionAccess.city,
      locationLabel: sessionAccess.locationLabel,
      notificationsEnabled: false,
    });
  }

  return user;
};

export const deleteAccount = async (firebaseUid: string) => {
  const user = await getAuthenticatedUserProfile(firebaseUid);

  await httpJson(`${env.COMMERCE_URL}/internal/users/${user.id}/subscriptions`, {
    method: "DELETE",
    headers: {
      "x-internal-service-key": env.INTERNAL_SERVICE_SECRET,
    },
  }).catch(() => null);

  await deleteFirebaseUser(user.firebaseUid);
  user.isActive = false;
  await user.save();

  return { deleted: true };
};

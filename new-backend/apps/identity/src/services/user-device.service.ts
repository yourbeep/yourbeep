import { Types } from "mongoose";
import { UserDeviceModel, type UserPlatform } from "../models/user-device";

type UpsertUserDeviceInput = {
  userId: string;
  platform: UserPlatform;
  sessionKey?: string;
  fcmToken?: string;
  notificationsEnabled?: boolean;
  ipAddress?: string;
  userAgent?: string;
  deviceName?: string;
  countryCode?: string;
  regionName?: string;
  city?: string;
  locationLabel?: string;
};

export const upsertUserDevice = async (input: UpsertUserDeviceInput) => {
  const filter = input.sessionKey
    ? {
        userId: new Types.ObjectId(input.userId),
        platform: input.platform,
        sessionKey: input.sessionKey,
      }
    : input.fcmToken
      ? { userId: new Types.ObjectId(input.userId), platform: input.platform, fcmToken: input.fcmToken }
      : { userId: new Types.ObjectId(input.userId), platform: input.platform, fcmToken: null };

  const update = {
    $set: {
      userId: new Types.ObjectId(input.userId),
      platform: input.platform,
      ...(input.sessionKey !== undefined ? { sessionKey: input.sessionKey } : {}),
      ...(input.fcmToken !== undefined ? { fcmToken: input.fcmToken } : {}),
      ...(input.ipAddress !== undefined ? { ipAddress: input.ipAddress } : {}),
      ...(input.userAgent !== undefined ? { userAgent: input.userAgent } : {}),
      ...(input.deviceName !== undefined ? { deviceName: input.deviceName } : {}),
      ...(input.countryCode !== undefined ? { countryCode: input.countryCode } : {}),
      ...(input.regionName !== undefined ? { regionName: input.regionName } : {}),
      ...(input.city !== undefined ? { city: input.city } : {}),
      ...(input.locationLabel !== undefined ? { locationLabel: input.locationLabel } : {}),
      notificationsEnabled: input.notificationsEnabled ?? Boolean(input.fcmToken),
      isActive: true,
      lastSeenAt: new Date(),
    },
  };

  try {
    return await UserDeviceModel.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });
  } catch (error) {
    const isDuplicateKey =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: number }).code === 11000;

    if (!isDuplicateKey) {
      throw error;
    }

    return UserDeviceModel.findOneAndUpdate(filter, update, {
      new: true,
      upsert: false,
    });
  }
};

export const deactivateUserDeviceByToken = async (fcmToken: string) =>
  UserDeviceModel.updateMany(
    { fcmToken },
    {
      $set: {
        isActive: false,
        notificationsEnabled: false,
        lastSeenAt: new Date(),
      },
    },
  );

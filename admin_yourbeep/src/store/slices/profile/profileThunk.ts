import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { profileApi } from "../../../features/profile/services/profileApi";
import { getApiErrorMessage } from "../../../utils/apiError";
import type { AdminProfile, UpdateAdminProfilePayload } from "./profileTypes";

const mapProfile = (user: any): AdminProfile => ({
  _id: String(user?._id || ""),
  firebaseUid: String(user?.firebaseUid || ""),
  name: String(user?.name || ""),
  email: String(user?.email || ""),
  avatar: typeof user?.avatar === "string" ? user.avatar : null,
  timezone: typeof user?.timezone === "string" ? user.timezone : null,
  region: typeof user?.region === "string" ? user.region : null,
  phoneCountryCode:
    typeof user?.phoneCountryCode === "string" ? user.phoneCountryCode : null,
  role: user?.role === "admin" ? "admin" : "user",
  isActive: Boolean(user?.isActive),
  userLevel: Number(user?.userLevel || 1),
  points: Number(user?.points || 0),
  streakDays: Number(user?.streakDays || 0),
  badges: Array.isArray(user?.badges) ? user.badges : [],
  fcmTokens: Array.isArray(user?.fcmTokens) ? user.fcmTokens : [],
  createdAt: String(user?.createdAt || new Date().toISOString()),
  updatedAt: String(user?.updatedAt || new Date().toISOString()),
  lastActiveAt: user?.lastActiveAt ? String(user.lastActiveAt) : null,
  sessionSummary: user?.sessionSummary
    ? {
        totalDevices: Number(user.sessionSummary.totalDevices || 0),
        activeWebSessions: Number(user.sessionSummary.activeWebSessions || 0),
        activeMobileSessions: Number(user.sessionSummary.activeMobileSessions || 0),
        lastLoginAt: user.sessionSummary.lastLoginAt
          ? String(user.sessionSummary.lastLoginAt)
          : null,
      }
    : undefined,
  recentSessions: Array.isArray(user?.recentSessions)
    ? user.recentSessions.map((session: any) => ({
        id: String(session?.id || ""),
        platform:
          session?.platform === "ios" || session?.platform === "android"
            ? session.platform
            : "web",
        notificationsEnabled: Boolean(session?.notificationsEnabled),
        firstSeenAt: String(session?.firstSeenAt || new Date().toISOString()),
        lastSeenAt: String(session?.lastSeenAt || new Date().toISOString()),
        tokenAttached: Boolean(session?.tokenAttached),
        ipAddress: typeof session?.ipAddress === "string" ? session.ipAddress : null,
        userAgent: typeof session?.userAgent === "string" ? session.userAgent : null,
        deviceName: typeof session?.deviceName === "string" ? session.deviceName : null,
        countryCode:
          typeof session?.countryCode === "string" ? session.countryCode : null,
        regionName:
          typeof session?.regionName === "string" ? session.regionName : null,
        city: typeof session?.city === "string" ? session.city : null,
        locationLabel:
          typeof session?.locationLabel === "string"
            ? session.locationLabel
            : null,
      }))
    : [],
  recentAccessActivity: Array.isArray(user?.recentAccessActivity)
    ? user.recentAccessActivity.map((item: any) => ({
        id: String(item?.id || ""),
        type: String(item?.type || "activity"),
        courseId: item?.courseId ? String(item.courseId) : null,
        gameKey: item?.gameKey ? String(item.gameKey) : null,
        completedAt: String(item?.completedAt || new Date().toISOString()),
        metadata:
          item?.metadata && typeof item.metadata === "object" ? item.metadata : {},
      }))
    : [],
});

export const fetchAdminProfile = createAsyncThunk<
  AdminProfile,
  void,
  { rejectValue: string }
>("profile/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await profileApi.getCurrentProfile();
    return mapProfile(response.data?.data?.user ?? {});
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load admin profile."),
      );
    }

    return rejectWithValue("Unable to load admin profile.");
  }
});

export const updateAdminProfile = createAsyncThunk<
  AdminProfile,
  UpdateAdminProfilePayload,
  { rejectValue: string }
>("profile/updateProfile", async (payload, { rejectWithValue }) => {
  try {
    const response = await profileApi.updateCurrentProfile(payload);
    return mapProfile(response.data?.data?.user ?? {});
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to save admin profile."),
      );
    }

    return rejectWithValue("Unable to save admin profile.");
  }
});

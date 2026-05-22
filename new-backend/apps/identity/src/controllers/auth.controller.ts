import { getRequestAuth, parseBody, success } from "@yourbeep/shared";
import type { Request, Response } from "express";
import {
  syncUser,
  getAuthenticatedUserProfile,
  deleteAccount,
} from "../services/auth.service";
import { authSyncSchema } from "../validators";

const getHeaderValue = (req: Request, key: string) => {
  const value = req.headers[key];
  return typeof value === "string" ? value : undefined;
};

const getClientIp = (req: Request) => {
  const forwarded = getHeaderValue(req, "x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim();
  }

  return (
    getHeaderValue(req, "x-real-ip") ||
    getHeaderValue(req, "cf-connecting-ip") ||
    req.ip ||
    undefined
  );
};

const inferPlatform = (deviceType?: "web" | "ios" | "android", userAgent?: string) => {
  if (deviceType) {
    return deviceType;
  }

  const normalizedAgent = userAgent?.toLowerCase() ?? "";
  if (normalizedAgent.includes("iphone") || normalizedAgent.includes("ipad") || normalizedAgent.includes("ios")) {
    return "ios";
  }
  if (normalizedAgent.includes("android")) {
    return "android";
  }
  return "web";
};

const buildSessionAccessContext = (
  req: Request,
  deviceType?: "web" | "ios" | "android",
) => {
  const userAgent = getHeaderValue(req, "user-agent");
  const ipAddress = getClientIp(req);
  const countryCode =
    getHeaderValue(req, "x-vercel-ip-country") ||
    getHeaderValue(req, "cf-ipcountry") ||
    undefined;
  const regionName = getHeaderValue(req, "x-vercel-ip-country-region");
  const city = getHeaderValue(req, "x-vercel-ip-city");
  const deviceName =
    getHeaderValue(req, "sec-ch-ua-platform")?.replace(/"/g, "") ||
    (userAgent?.includes("Mac") ? "macOS" : userAgent?.includes("Windows") ? "Windows" : undefined);
  const locationLabel = [city, regionName, countryCode].filter(Boolean).join(", ") || countryCode || undefined;

  return {
    platform: inferPlatform(deviceType, userAgent),
    sessionKey: [inferPlatform(deviceType, userAgent), ipAddress, userAgent].filter(Boolean).join("::") || undefined,
    ipAddress,
    userAgent,
    deviceName,
    countryCode,
    regionName,
    city,
    locationLabel,
  };
};

export const syncAuthController = async (req: Request, res: Response) => {
  const auth = getRequestAuth(req);
  const payload = parseBody(authSyncSchema, req.body);
  const data = await syncUser(auth, payload, buildSessionAccessContext(req, payload.deviceType));

  return success(
    res,
    data,
    data.isNewUser ? "User created" : "User synced",
    data.isNewUser ? 201 : 200,
  );
};

export const getMeController = async (req: Request, res: Response) => {
  const user = await getAuthenticatedUserProfile(
    req.auth!.firebaseUid,
    true,
    buildSessionAccessContext(req, "web"),
  );
  return success(res, { user }, "Authenticated user profile");
};

export const deleteAccountController = async (req: Request, res: Response) => {
  const data = await deleteAccount(req.auth!.firebaseUid);
  return success(res, data, "Account soft-deleted");
};

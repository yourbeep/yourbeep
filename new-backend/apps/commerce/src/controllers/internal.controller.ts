import { success } from "@yourbeep/shared";
import type { Request, Response } from "express";
import {
  cancelUserSubscriptions,
  getAdminDashboardAnalytics,
  getAdminUserPurchases,
  getAdminRevenueMetrics,
  getAdminUserPurchaseSummary,
  getPurchaseAccess,
  getPremiumUserIds,
  getPurchasedUserIdsByCourse,
} from "../services/purchase.service";
import { getPromotionSummary } from "../services/promotion.service";

export const cancelUserSubscriptionsController = async (req: Request, res: Response) => {
  const data = await cancelUserSubscriptions(String(req.params.userId));
  return success(res, data, "Subscriptions cancelled");
};

export const getInternalPurchaseAccessController = async (req: Request, res: Response) => {
  const data = await getPurchaseAccess(String(req.params.userId), String(req.params.courseId));
  return success(res, data, "Internal access check");
};

export const getInternalCoursePurchasersController = async (req: Request, res: Response) => {
  const data = await getPurchasedUserIdsByCourse(String(req.params.courseId));
  return success(res, data, "Internal course purchasers");
};

export const getInternalPremiumUsersController = async (_req: Request, res: Response) => {
  const data = await getPremiumUserIds();
  return success(res, data, "Internal premium users");
};

export const getInternalAdminRevenueMetricsController = async (_req: Request, res: Response) => {
  const data = await getAdminRevenueMetrics();
  return success(res, data, "Internal admin revenue metrics");
};

export const getInternalAdminDashboardAnalyticsController = async (_req: Request, res: Response) => {
  const data = await getAdminDashboardAnalytics();
  return success(res, data, "Internal admin dashboard analytics");
};

export const getInternalAdminUserPurchaseSummaryController = async (req: Request, res: Response) => {
  const body = req.body as { userIds?: string[] };
  const data = await getAdminUserPurchaseSummary(body.userIds ?? []);
  return success(res, data, "Internal admin user purchase summary");
};

export const getInternalAdminUserPurchasesController = async (req: Request, res: Response) => {
  const data = await getAdminUserPurchases(String(req.params.userId));
  return success(res, data, "Internal admin user purchases");
};

export const getInternalAdminPromotionSummaryController = async (_req: Request, res: Response) => {
  const data = await getPromotionSummary();
  return success(res, data, "Internal admin promotion summary");
};

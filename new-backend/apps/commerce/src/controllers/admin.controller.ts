import { parseBody, success } from "@yourbeep/shared";
import type { Request, Response } from "express";
import {
  getAdminPurchaseById,
  processSubscriptionNotifications,
  getRevenueSummary,
  listAdminPurchases,
  refundPurchase,
} from "../services/purchase.service";
import {
  processSubscriptionNotificationsSchema,
  purchaseListQuerySchema,
  refundSchema,
  revenueQuerySchema,
} from "../validators";

export const listAdminPurchasesController = async (req: Request, res: Response) => {
  const query = parseBody(purchaseListQuerySchema, req.query);
  const data = await listAdminPurchases(query);
  return success(res, data, "Admin purchases");
};

export const getAdminPurchaseByIdController = async (req: Request, res: Response) => {
  const purchase = await getAdminPurchaseById(String(req.params.purchaseId));
  return success(res, { purchase }, "Admin purchase detail");
};

export const refundPurchaseController = async (req: Request, res: Response) => {
  const payload = parseBody(refundSchema, req.body);
  const data = await refundPurchase(String(req.params.purchaseId), req.auth!.id, payload);
  return success(res, data, "Purchase refunded");
};

export const getRevenueSummaryController = async (req: Request, res: Response) => {
  const query = parseBody(revenueQuerySchema, req.query);
  const data = await getRevenueSummary(query);
  return success(res, data, "Revenue summary");
};

export const processSubscriptionNotificationsController = async (req: Request, res: Response) => {
  const payload = parseBody(processSubscriptionNotificationsSchema, req.body ?? {});
  const data = await processSubscriptionNotifications(payload);
  return success(res, data, "Subscription notifications processed");
};

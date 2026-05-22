import { parseBody, success } from "@yourbeep/shared";
import type { Request, Response } from "express";
import {
  confirmPurchase,
  confirmRenewal,
  getPurchaseAccess,
  getUserPurchases,
  handleStripeWebhook,
  initiatePurchase,
  initiateRenewal,
} from "../services/purchase.service";
import { purchaseConfirmSchema, purchaseInitiateSchema } from "../validators";

const detectRegion = (req: Request) =>
  typeof req.headers["x-user-region"] === "string" ? req.headers["x-user-region"].toUpperCase() : "IN";

export const initiatePurchaseController = async (req: Request, res: Response) => {
  const payload = parseBody(purchaseInitiateSchema, req.body);
  const data = await initiatePurchase(req.auth!.id, req.auth!.email, String(req.params.courseId), detectRegion(req), payload);
  return success(res, data, "Purchase initiated");
};

export const confirmPurchaseController = async (req: Request, res: Response) => {
  const payload = parseBody(purchaseConfirmSchema, req.body);
  const data = await confirmPurchase(req.auth!.id, String(req.params.courseId), payload);
  return success(res, data, "Purchase confirmed");
};

export const getCourseAccessController = async (req: Request, res: Response) => {
  const data = await getPurchaseAccess(req.auth!.id, String(req.params.courseId));
  return success(res, data, "Course access");
};

export const getUserPurchasesController = async (req: Request, res: Response) => {
  const data = await getUserPurchases(req.auth!.id);
  return success(res, data, "User purchases");
};

export const initiateRenewalController = async (req: Request, res: Response) => {
  const payload = parseBody(purchaseInitiateSchema, req.body);
  const data = await initiateRenewal(req.auth!.id, req.auth!.email, String(req.params.courseId), detectRegion(req), payload);
  return success(res, data, "Renewal initiated");
};

export const confirmRenewalController = async (req: Request, res: Response) => {
  const payload = parseBody(purchaseConfirmSchema, req.body);
  const data = await confirmRenewal(req.auth!.id, String(req.params.courseId), payload);
  return success(res, data, "Renewal confirmed");
};

export const stripeWebhookController = async (req: Request, res: Response) => {
  const signature = typeof req.headers["stripe-signature"] === "string" ? req.headers["stripe-signature"] : undefined;
  const data = await handleStripeWebhook(req.rawBody ?? JSON.stringify(req.body ?? {}), signature);
  return success(res, data, "Stripe webhook processed");
};

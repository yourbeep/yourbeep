import api from "../../../services/api";
import type { OrderStatus } from "../../../store/slices/orders/ordersTypes";

type RevenueParams = {
  region?: string;
};

type ListPurchasesParams = {
  page: number;
  limit: number;
  status?: OrderStatus;
  region?: string;
  courseId?: string;
};

type RefundPurchasePayload = {
  reason: string;
  notes?: string;
  partialAmount?: number;
};

type ProcessSubscriptionNotificationsPayload = {
  daysBeforeExpiry: number;
};

export const ordersApi = {
  getRevenue: (params: RevenueParams) =>
    api.get("/admin/commerce/revenue", { params }),
  listPurchases: (params: ListPurchasesParams) =>
    api.get("/admin/commerce/purchases", { params }),
  getPurchase: (purchaseId: string) =>
    api.get(`/admin/commerce/purchases/${purchaseId}`),
  refundPurchase: (purchaseId: string, payload: RefundPurchasePayload) =>
    api.post(`/admin/commerce/purchases/${purchaseId}/refund`, payload),
  processSubscriptionNotifications: (
    payload: ProcessSubscriptionNotificationsPayload,
  ) => api.post("/admin/commerce/notifications/process-subscriptions", payload),
};

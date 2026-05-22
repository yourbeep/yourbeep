import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ordersApi } from "../../../features/orders/services/ordersApi";
import { getApiErrorMessage } from "../../../utils/apiError";
import type {
  OrderItem,
  OrdersFilters,
  OrdersListPayload,
  ProcessSubscriptionsResult,
  RevenueSummary,
} from "./ordersTypes";

const mapOrder = (item: any): OrderItem => ({
  _id: String(item?._id || item?.id || ""),
  userId: String(item?.userId || ""),
  courseId: String(item?.courseId || ""),
  planType: item?.planType || "annual",
  status: item?.status || "pending",
  region: String(item?.region || ""),
  currency: String(item?.currency || ""),
  originalAmount: Number(item?.originalAmount || 0),
  discountAmount: Number(item?.discountAmount || 0),
  amountPaid: Number(item?.amountPaid || 0),
  promotionCode: item?.promotionCode ? String(item.promotionCode) : null,
  promotionName: item?.promotionName ? String(item.promotionName) : null,
  accessGranted: Boolean(item?.accessGranted),
  startDate: item?.startDate ? String(item.startDate) : null,
  expiryDate: item?.expiryDate ? String(item.expiryDate) : null,
  purchasedAt: item?.purchasedAt ? String(item.purchasedAt) : null,
  stripeSessionId: String(item?.stripeSessionId || ""),
  stripeCustomerId: item?.stripeCustomerId ? String(item.stripeCustomerId) : null,
  stripeSubscriptionId: item?.stripeSubscriptionId ? String(item.stripeSubscriptionId) : null,
  stripeInvoiceId: item?.stripeInvoiceId ? String(item.stripeInvoiceId) : null,
  stripePaymentIntentId: item?.stripePaymentIntentId ? String(item.stripePaymentIntentId) : null,
  stripeRefundId: item?.stripeRefundId ? String(item.stripeRefundId) : null,
  detectedRegionIp: String(item?.detectedRegionIp || ""),
  phoneCountryCode: item?.phoneCountryCode ? String(item.phoneCountryCode) : null,
  regionMismatch: Boolean(item?.regionMismatch),
  renewedFromId: item?.renewedFromId ? String(item.renewedFromId) : null,
  createdAt: String(item?.createdAt || new Date().toISOString()),
  updatedAt: String(item?.updatedAt || new Date().toISOString()),
});

const mapPagination = (pagination: any, fallbackPage: number, fallbackLimit: number) => ({
  page: Number(pagination?.page || fallbackPage),
  limit: Number(pagination?.limit || fallbackLimit),
  total: Number(pagination?.total || 0),
});

export const fetchRevenueSummary = createAsyncThunk<
  RevenueSummary,
  { region?: string } | void,
  { rejectValue: string }
>("orders/fetchRevenueSummary", async (filters, { rejectWithValue }) => {
  try {
    const response = await ordersApi.getRevenue({
      ...(filters?.region ? { region: filters.region } : {}),
    });
    const data = response.data?.data ?? {};
    return {
      grossRevenue: Number(data.grossRevenue || 0),
      activeCount: Number(data.activeCount || 0),
      refundedCount: Number(data.refundedCount || 0),
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load revenue summary."),
      );
    }
    return rejectWithValue("Unable to load revenue summary.");
  }
});

export const fetchOrders = createAsyncThunk<
  OrdersListPayload,
  OrdersFilters | void,
  { rejectValue: string }
>("orders/fetchOrders", async (filters, { rejectWithValue }) => {
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 10;
  try {
    const response = await ordersApi.listPurchases({
      page,
      limit,
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.region ? { region: filters.region } : {}),
      ...(filters?.courseId ? { courseId: filters.courseId } : {}),
    });
    const data = response.data?.data ?? {};
    return {
      items: Array.isArray(data.items) ? data.items.map(mapOrder) : [],
      pagination: mapPagination(data.pagination, page, limit),
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load orders."),
      );
    }
    return rejectWithValue("Unable to load orders.");
  }
});

export const fetchOrderDetail = createAsyncThunk<
  OrderItem,
  string,
  { rejectValue: string }
>("orders/fetchOrderDetail", async (purchaseId, { rejectWithValue }) => {
  try {
    const response = await ordersApi.getPurchase(purchaseId);
    return mapOrder(response.data?.data?.purchase ?? {});
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load purchase detail."),
      );
    }
    return rejectWithValue("Unable to load purchase detail.");
  }
});

export const refundOrder = createAsyncThunk<
  { purchaseId: string; stripeRefundId: string; amountRefunded: number; currency: string; status: string; accessRevoked: boolean; revokedAt: string },
  { purchaseId: string; payload: { reason: string; notes?: string; partialAmount?: number } },
  { rejectValue: string }
>("orders/refundOrder", async ({ purchaseId, payload }, { rejectWithValue }) => {
  try {
    const response = await ordersApi.refundPurchase(purchaseId, payload);
    return response.data?.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to refund purchase."),
      );
    }
    return rejectWithValue("Unable to refund purchase.");
  }
});

export const processSubscriptionNotifications = createAsyncThunk<
  ProcessSubscriptionsResult,
  { daysBeforeExpiry: number },
  { rejectValue: string }
>("orders/processSubscriptionNotifications", async (payload, { rejectWithValue }) => {
  try {
    const response = await ordersApi.processSubscriptionNotifications(payload);
    const data = response.data?.data ?? {};
    return {
      daysBeforeExpiry: Number(data.daysBeforeExpiry || payload.daysBeforeExpiry),
      expiringProcessed: Number(data.expiringProcessed || 0),
      expiredProcessed: Number(data.expiredProcessed || 0),
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to process subscription notifications."),
      );
    }
    return rejectWithValue("Unable to process subscription notifications.");
  }
});

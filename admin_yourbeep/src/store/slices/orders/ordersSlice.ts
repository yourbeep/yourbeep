import { createSlice } from "@reduxjs/toolkit";
import type { OrdersState } from "./ordersTypes";
import {
  fetchOrderDetail,
  fetchOrders,
  fetchRevenueSummary,
  processSubscriptionNotifications,
  refundOrder,
} from "./ordersThunk";

const initialState: OrdersState = {
  summary: null,
  list: null,
  selectedOrder: null,
  subscriptionProcessingResult: null,
  filters: {
    page: 1,
    limit: 10,
  },
  loadingSummary: false,
  loadingList: false,
  loadingDetail: false,
  mutating: false,
  error: null,
};

const replaceOrderInList = (state: OrdersState, order: any) => {
  if (!state.list) return;
  state.list.items = state.list.items.map((item) =>
    item._id === order._id ? { ...item, ...order } : item,
  );
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrdersError: (state) => {
      state.error = null;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRevenueSummary.pending, (state) => {
        state.loadingSummary = true;
        state.error = null;
      })
      .addCase(fetchRevenueSummary.fulfilled, (state, action) => {
        state.loadingSummary = false;
        state.summary = action.payload;
      })
      .addCase(fetchRevenueSummary.rejected, (state, action) => {
        state.loadingSummary = false;
        state.error = String(action.payload || "Unable to load revenue summary.");
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loadingList = false;
        state.list = action.payload;
        state.filters = {
          ...state.filters,
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loadingList = false;
        state.error = String(action.payload || "Unable to load orders.");
      })
      .addCase(fetchOrderDetail.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.selectedOrder = action.payload;
        replaceOrderInList(state, action.payload);
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = String(action.payload || "Unable to load purchase detail.");
      })
      .addCase(processSubscriptionNotifications.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(processSubscriptionNotifications.fulfilled, (state, action) => {
        state.mutating = false;
        state.subscriptionProcessingResult = action.payload;
      })
      .addCase(processSubscriptionNotifications.rejected, (state, action) => {
        state.mutating = false;
        state.error = String(action.payload || "Unable to process subscription notifications.");
      })
      .addCase(refundOrder.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(refundOrder.fulfilled, (state, action) => {
        state.mutating = false;
        if (state.selectedOrder && state.selectedOrder._id === action.payload.purchaseId) {
          state.selectedOrder = {
            ...state.selectedOrder,
            status: "refunded",
            stripeRefundId: action.payload.stripeRefundId,
            accessGranted: false,
            updatedAt: action.payload.revokedAt,
          };
        }
        replaceOrderInList(state, {
          _id: action.payload.purchaseId,
          status: "refunded",
          stripeRefundId: action.payload.stripeRefundId,
          accessGranted: false,
          updatedAt: action.payload.revokedAt,
        });
      })
      .addCase(refundOrder.rejected, (state, action) => {
        state.mutating = false;
        state.error = String(action.payload || "Unable to refund purchase.");
      });
  },
});

export const { clearOrdersError, clearSelectedOrder } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;
export default ordersSlice.reducer;

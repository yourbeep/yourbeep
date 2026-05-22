import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BillingPlanType } from "@features/payments/services/paymentTypes";
import {
  confirmCourseCheckout,
  fetchCoursePaymentPage,
  initiateCourseCheckout,
  previewCoursePromotion,
} from "./paymentThunk";
import type { PaymentsState } from "./paymentTypes";

const initialState: PaymentsState = {
  page: null,
  selectedPlan: "annual",
  promotionCode: "",
  preview: null,
  latestCheckout: null,
  latestConfirmation: null,
  loading: false,
  loaded: false,
  previewing: false,
  checkingOut: false,
  confirming: false,
  error: null,
  notice: null,
};

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setSelectedPlan(state, action: PayloadAction<BillingPlanType>) {
      state.selectedPlan = action.payload;
      state.preview = null;
      state.notice = null;
    },
    setPromotionCode(state, action: PayloadAction<string>) {
      state.promotionCode = action.payload;
    },
    clearPaymentNotice(state) {
      state.notice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoursePaymentPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoursePaymentPage.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.page = action.payload;
      })
      .addCase(fetchCoursePaymentPage.rejected, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.error = String(
          action.payload || "Unable to load course pricing right now.",
        );
      })
      .addCase(previewCoursePromotion.pending, (state) => {
        state.previewing = true;
        state.notice = null;
      })
      .addCase(previewCoursePromotion.fulfilled, (state, action) => {
        state.previewing = false;
        state.preview = action.payload;
        state.notice = action.payload.appliedPromotion?.code
          ? {
              type: "success",
              message: `${action.payload.appliedPromotion.code} applied to this plan.`,
            }
          : {
              type: "info",
              message: "Promotion preview updated.",
            };
      })
      .addCase(previewCoursePromotion.rejected, (state, action) => {
        state.previewing = false;
        state.notice = {
          type: "error",
          message: String(
            action.payload || "Unable to preview this promotion right now.",
          ),
        };
      })
      .addCase(initiateCourseCheckout.pending, (state) => {
        state.checkingOut = true;
        state.notice = null;
      })
      .addCase(initiateCourseCheckout.fulfilled, (state, action) => {
        state.checkingOut = false;
        state.latestCheckout = action.payload;
      })
      .addCase(initiateCourseCheckout.rejected, (state, action) => {
        state.checkingOut = false;
        state.notice = {
          type: "error",
          message: String(action.payload || "Unable to start checkout right now."),
        };
      })
      .addCase(confirmCourseCheckout.pending, (state) => {
        state.confirming = true;
      })
      .addCase(confirmCourseCheckout.fulfilled, (state, action) => {
        state.confirming = false;
        state.latestConfirmation = action.payload;
        state.notice = {
          type: "success",
          message: "Payment confirmed. Your access is now active.",
        };

        if (state.page) {
          state.page.access = {
            hasAccess: Boolean(action.payload.accessGranted),
            purchase: {
              purchaseId: action.payload.purchaseId,
              planType: state.selectedPlan,
              status: action.payload.status,
              startDate: action.payload.startDate ?? null,
              expiryDate: action.payload.expiryDate ?? null,
              daysRemaining: null,
            },
            canRenew: false,
            reason: null,
            expiredAt: null,
          };
        }
      })
      .addCase(confirmCourseCheckout.rejected, (state, action) => {
        state.confirming = false;
        state.notice = {
          type: "error",
          message: String(
            action.payload || "We couldn't confirm your payment yet.",
          ),
        };
      });
  },
});

export const { setSelectedPlan, setPromotionCode, clearPaymentNotice } =
  paymentsSlice.actions;

export const paymentsReducer = paymentsSlice.reducer;

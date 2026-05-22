import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { paymentApi } from "@features/payments/services/paymentApi";
import type {
  BillingPlanType,
  CheckoutConfirmed,
  CheckoutInitiated,
  CheckoutMode,
  CoursePaymentPageData,
  PromotionPreview,
} from "@features/payments/services/paymentTypes";
import { getApiErrorMessage } from "@utils/apiError";

const getThunkError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return getApiErrorMessage(error.response?.data, fallback);
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
};

export const fetchCoursePaymentPage = createAsyncThunk<
  CoursePaymentPageData,
  string,
  { rejectValue: string }
>("payments/fetchPage", async (courseId, { rejectWithValue }) => {
  try {
    return await paymentApi.getCoursePaymentPage(courseId);
  } catch (error) {
    return rejectWithValue(
      getThunkError(error, "Unable to load course pricing right now."),
    );
  }
});

export const previewCoursePromotion = createAsyncThunk<
  PromotionPreview,
  { courseId: string; planType: BillingPlanType; promotionCode?: string },
  { rejectValue: string }
>("payments/previewPromotion", async (input, { rejectWithValue }) => {
  try {
    return await paymentApi.previewPromotion(input);
  } catch (error) {
    return rejectWithValue(
      getThunkError(error, "Unable to preview this promotion right now."),
    );
  }
});

export const initiateCourseCheckout = createAsyncThunk<
  CheckoutInitiated,
  {
    courseId: string;
    planType: BillingPlanType;
    promotionCode?: string;
    successUrl: string;
    cancelUrl: string;
    mode: CheckoutMode;
  },
  { rejectValue: string }
>("payments/initiateCheckout", async (input, { rejectWithValue }) => {
  try {
    return await paymentApi.initiateCheckout(input);
  } catch (error) {
    return rejectWithValue(
      getThunkError(error, "Unable to start checkout right now."),
    );
  }
});

export const confirmCourseCheckout = createAsyncThunk<
  CheckoutConfirmed,
  { courseId: string; sessionId: string; mode: CheckoutMode },
  { rejectValue: string }
>("payments/confirmCheckout", async (input, { rejectWithValue }) => {
  try {
    return await paymentApi.confirmCheckout(input);
  } catch (error) {
    return rejectWithValue(
      getThunkError(error, "We couldn't confirm your payment yet."),
    );
  }
});

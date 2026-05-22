import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../../services/api";
import { getApiErrorMessage } from "../../../utils/apiError";
import type {
  OffersFilters,
  OffersPayload,
  PromotionItem,
  PromotionSummary,
} from "./offersTypes";

export const fetchPromotionSummary = createAsyncThunk<
  PromotionSummary,
  void,
  { rejectValue: string }
>("offers/fetchPromotionSummary", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/admin/commerce/promotions/summary");
    return response.data?.data as PromotionSummary;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load promotion summary."),
      );
    }

    return rejectWithValue("Unable to load promotion summary.");
  }
});

export const fetchPromotions = createAsyncThunk<
  OffersPayload,
  OffersFilters | void,
  { rejectValue: string }
>("offers/fetchPromotions", async (filters, { rejectWithValue }) => {
  try {
    const response = await api.get("/admin/commerce/promotions", {
      params: {
        page: filters?.page ?? 1,
        limit: filters?.limit ?? 20,
        ...(filters?.q ? { q: filters.q } : {}),
        ...(filters?.status ? { status: filters.status } : {}),
        ...(filters?.courseId ? { courseId: filters.courseId } : {}),
      },
    });
    return response.data?.data as OffersPayload;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load promotions."),
      );
    }

    return rejectWithValue("Unable to load promotions.");
  }
});

export const fetchPromotionDetail = createAsyncThunk<
  PromotionItem,
  string,
  { rejectValue: string }
>("offers/fetchPromotionDetail", async (promotionId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/admin/commerce/promotions/${promotionId}`);
    return response.data?.data?.promotion as PromotionItem;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load promotion detail."),
      );
    }
    return rejectWithValue("Unable to load promotion detail.");
  }
});

export const createPromotion = createAsyncThunk<
  PromotionItem,
  Record<string, unknown>,
  { rejectValue: string }
>("offers/createPromotion", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post("/admin/commerce/promotions", payload);
    return response.data?.data?.promotion as PromotionItem;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to create promotion."),
      );
    }
    return rejectWithValue("Unable to create promotion.");
  }
});

export const updatePromotion = createAsyncThunk<
  PromotionItem,
  { promotionId: string; payload: Record<string, unknown> },
  { rejectValue: string }
>("offers/updatePromotion", async ({ promotionId, payload }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/admin/commerce/promotions/${promotionId}`, payload);
    return response.data?.data?.promotion as PromotionItem;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to update promotion."),
      );
    }
    return rejectWithValue("Unable to update promotion.");
  }
});

export const archivePromotion = createAsyncThunk<
  PromotionItem,
  string,
  { rejectValue: string }
>("offers/archivePromotion", async (promotionId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/admin/commerce/promotions/${promotionId}`);
    return response.data?.data?.promotion as PromotionItem;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to archive promotion."),
      );
    }
    return rejectWithValue("Unable to archive promotion.");
  }
});

export const restorePromotion = createAsyncThunk<
  PromotionItem,
  string,
  { rejectValue: string }
>("offers/restorePromotion", async (promotionId, { rejectWithValue }) => {
  try {
    const response = await api.post(`/admin/commerce/promotions/${promotionId}/restore`);
    return response.data?.data?.promotion as PromotionItem;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to restore promotion."),
      );
    }
    return rejectWithValue("Unable to restore promotion.");
  }
});

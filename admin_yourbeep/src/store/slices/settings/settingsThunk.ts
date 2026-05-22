import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../../services/api";
import { getApiErrorMessage } from "../../../utils/apiError";
import type { PlatformSettingsData } from "./settingsTypes";

export const fetchPlatformSettings = createAsyncThunk<
  PlatformSettingsData,
  void,
  { rejectValue: string }
>("settings/fetchPlatformSettings", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/admin/platform/settings");
    return response.data?.data as PlatformSettingsData;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load platform settings."),
      );
    }

    return rejectWithValue("Unable to load platform settings.");
  }
});

export const updatePlatformSettings = createAsyncThunk<
  PlatformSettingsData,
  Record<string, unknown>,
  { rejectValue: string }
>("settings/updatePlatformSettings", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.patch("/admin/platform/settings", payload);
    return response.data?.data as PlatformSettingsData;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to update platform settings."),
      );
    }

    return rejectWithValue("Unable to update platform settings.");
  }
});

export const createPlatformFaq = createAsyncThunk<
  PlatformSettingsData,
  Record<string, unknown>,
  { rejectValue: string }
>("settings/createPlatformFaq", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post("/admin/platform/settings/faqs", payload);
    return response.data?.data as PlatformSettingsData;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to create FAQ item."),
      );
    }

    return rejectWithValue("Unable to create FAQ item.");
  }
});

export const updatePlatformFaq = createAsyncThunk<
  PlatformSettingsData,
  { faqId: string; payload: Record<string, unknown> },
  { rejectValue: string }
>("settings/updatePlatformFaq", async ({ faqId, payload }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/admin/platform/settings/faqs/${faqId}`, payload);
    return response.data?.data as PlatformSettingsData;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to update FAQ item."),
      );
    }

    return rejectWithValue("Unable to update FAQ item.");
  }
});

export const deletePlatformFaq = createAsyncThunk<
  PlatformSettingsData,
  string,
  { rejectValue: string }
>("settings/deletePlatformFaq", async (faqId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/admin/platform/settings/faqs/${faqId}`);
    return response.data?.data as PlatformSettingsData;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to delete FAQ item."),
      );
    }

    return rejectWithValue("Unable to delete FAQ item.");
  }
});

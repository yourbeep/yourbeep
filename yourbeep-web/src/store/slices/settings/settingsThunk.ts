import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/api";
import { getApiErrorMessage } from "@utils/apiError";
import type {
  ContactRequestPayload,
  LegalDocumentData,
  LegalDocumentSlug,
  PlatformSettingsData,
} from "./settingsTypes";

export const fetchPlatformSettings = createAsyncThunk<
  PlatformSettingsData,
  void,
  { rejectValue: string }
>("settings/fetchPlatformSettings", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/platform/settings");
    return response.data?.data as PlatformSettingsData;
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(error, "Unable to load platform settings right now."),
    );
  }
});

export const fetchLegalDocument = createAsyncThunk<
  { slug: LegalDocumentSlug; document: LegalDocumentData },
  LegalDocumentSlug,
  { rejectValue: string }
>("settings/fetchLegalDocument", async (slug, { rejectWithValue }) => {
  try {
    const response = await api.get(`/platform/legal/${slug}`);
    return {
      slug,
      document: response.data?.data as LegalDocumentData,
    };
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(error, "Unable to load this legal document right now."),
    );
  }
});

export const submitContactRequest = createAsyncThunk<
  string,
  ContactRequestPayload,
  { rejectValue: string }
>("settings/submitContactRequest", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post("/get-in-touch", payload);
    return String(response.data?.message || "Your message has been sent.");
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(error, "Unable to send your message right now."),
    );
  }
});

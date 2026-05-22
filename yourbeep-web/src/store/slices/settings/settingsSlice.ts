import { createSlice } from "@reduxjs/toolkit";
import {
  fetchLegalDocument,
  fetchPlatformSettings,
  submitContactRequest,
} from "./settingsThunk";
import type { SettingsState } from "./settingsTypes";

const initialState: SettingsState = {
  data: null,
  legalDocs: {
    terms: null,
    privacy: null,
    refund: null,
    cookies: null,
    "community-guidelines": null,
  },
  loading: false,
  legalLoading: false,
  submittingContact: false,
  loaded: false,
  error: null,
  contactSuccessMessage: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    clearContactSuccessMessage: (state) => {
      state.contactSuccessMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatformSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlatformSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.data = action.payload;
      })
      .addCase(fetchPlatformSettings.rejected, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.error = String(action.payload || "Unable to load platform settings right now.");
      })
      .addCase(fetchLegalDocument.pending, (state) => {
        state.legalLoading = true;
        state.error = null;
      })
      .addCase(fetchLegalDocument.fulfilled, (state, action) => {
        state.legalLoading = false;
        state.legalDocs[action.payload.slug] = action.payload.document;
      })
      .addCase(fetchLegalDocument.rejected, (state, action) => {
        state.legalLoading = false;
        state.error = String(action.payload || "Unable to load this legal document right now.");
      })
      .addCase(submitContactRequest.pending, (state) => {
        state.submittingContact = true;
        state.contactSuccessMessage = null;
        state.error = null;
      })
      .addCase(submitContactRequest.fulfilled, (state, action) => {
        state.submittingContact = false;
        state.contactSuccessMessage = action.payload;
      })
      .addCase(submitContactRequest.rejected, (state, action) => {
        state.submittingContact = false;
        state.error = String(action.payload || "Unable to send your message right now.");
      });
  },
});

export const { clearContactSuccessMessage } = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;

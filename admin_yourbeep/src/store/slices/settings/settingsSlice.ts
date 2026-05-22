import { createSlice } from "@reduxjs/toolkit";
import {
  createPlatformFaq,
  deletePlatformFaq,
  fetchPlatformSettings,
  updatePlatformFaq,
  updatePlatformSettings,
} from "./settingsThunk";
import type { SettingsState } from "./settingsTypes";

const initialState: SettingsState = {
  data: null,
  loading: false,
  mutating: false,
  error: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatformSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlatformSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPlatformSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload || "Unable to load platform settings.");
      });

    [updatePlatformSettings, createPlatformFaq, updatePlatformFaq, deletePlatformFaq].forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.mutating = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.mutating = false;
          state.data = action.payload;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.mutating = false;
          state.error = String(action.payload || "Unable to save platform settings.");
        });
    });
  },
});

export const settingsReducer = settingsSlice.reducer;
export default settingsSlice.reducer;

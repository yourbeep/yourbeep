import { createSlice } from "@reduxjs/toolkit";
import { fetchMainDashboard } from "./mainThunk";
import type { MainState } from "./mainTypes";

const initialState: MainState = {
  dashboard: null,
  loading: false,
  loaded: false,
  error: null,
};

const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMainDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMainDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.dashboard = action.payload;
      })
      .addCase(fetchMainDashboard.rejected, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.error = String(
          action.payload || "Unable to load your dashboard right now.",
        );
      });
  },
});

export const mainReducer = mainSlice.reducer;

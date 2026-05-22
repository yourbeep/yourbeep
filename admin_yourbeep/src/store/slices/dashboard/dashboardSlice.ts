import { createSlice } from "@reduxjs/toolkit";
import { fetchAdminDashboard } from "./dashboardThunk";
import type { DashboardState } from "./dashboardTypes";

const initialState: DashboardState = {
  data: null,
  filters: {
    page: 1,
    limit: 10,
    q: "",
    isActive: undefined,
    region: "",
    planType: undefined,
    period: "30d",
    from: "",
    to: "",
  },
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.filters = {
          page: action.meta.arg?.page ?? 1,
          limit: action.meta.arg?.limit ?? 10,
          q: action.meta.arg?.q ?? "",
          isActive: action.meta.arg?.isActive,
          region: action.meta.arg?.region ?? "",
          planType: action.meta.arg?.planType,
          period: action.meta.arg?.period ?? "30d",
          from: action.meta.arg?.from ?? "",
          to: action.meta.arg?.to ?? "",
        };
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload || "Unable to load dashboard.");
      });
  },
});

export const dashboardReducer = dashboardSlice.reducer;
export default dashboardSlice.reducer;

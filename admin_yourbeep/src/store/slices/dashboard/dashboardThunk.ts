import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../../services/api";
import { getApiErrorMessage } from "../../../utils/apiError";
import type { DashboardFilters, DashboardPayload } from "./dashboardTypes";

export const fetchAdminDashboard = createAsyncThunk<
  DashboardPayload,
  DashboardFilters | void,
  { rejectValue: string }
>("dashboard/fetchAdminDashboard", async (filters, { rejectWithValue }) => {
  try {
    const response = await api.get("/admin/dashboard", {
      params: {
        page: filters?.page ?? 1,
        limit: filters?.limit ?? 10,
        ...(filters?.q ? { q: filters.q } : {}),
        ...(filters?.region ? { region: filters.region } : {}),
        ...(filters?.planType ? { planType: filters.planType } : {}),
        ...(filters?.period ? { period: filters.period } : {}),
        ...(filters?.from ? { from: filters.from } : {}),
        ...(filters?.to ? { to: filters.to } : {}),
        ...(typeof filters?.isActive === "boolean"
          ? { isActive: filters.isActive }
          : {}),
      },
    });

    return response.data?.data as DashboardPayload;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load dashboard."),
      );
    }

    return rejectWithValue("Unable to load dashboard.");
  }
});

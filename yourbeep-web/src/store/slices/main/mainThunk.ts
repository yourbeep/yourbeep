import { createAsyncThunk } from "@reduxjs/toolkit";
import { getApiErrorMessage } from "@utils/apiError";
import { mainApi } from "@features/main/services/mainApi";
import type { MainDashboardData } from "./mainTypes";

export const fetchMainDashboard = createAsyncThunk<
  MainDashboardData,
  void,
  { rejectValue: string }
>("main/fetchDashboard", async (_, { rejectWithValue }) => {
  try {
    return await mainApi.getDashboard();
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(error, "Unable to load your dashboard right now."),
    );
  }
});

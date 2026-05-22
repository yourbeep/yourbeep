import { createSlice } from "@reduxjs/toolkit";
import type { ProfileState } from "./profileTypes";
import { fetchAdminProfile, updateAdminProfile } from "./profileThunk";

const initialState: ProfileState = {
  data: null,
  loading: false,
  saving: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload || "Unable to load admin profile.");
      })
      .addCase(updateAdminProfile.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.data = action.payload;
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.saving = false;
        state.error = String(action.payload || "Unable to save admin profile.");
      });
  },
});

export const { clearProfileError } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
export default profileSlice.reducer;

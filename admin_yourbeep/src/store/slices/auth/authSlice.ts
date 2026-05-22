import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "./authTypes";
import {
  completeSocialLoginRedirect,
  forgotPassword,
  loadUser,
  loginAdmin,
  loginAdminWithSocial,
  logoutAdmin,
} from "./authThunk";

const storedUser = localStorage.getItem("authUser");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem("token"),
  loading: false,
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload || "Unable to sign in.");
      })
      .addCase(loginAdminWithSocial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdminWithSocial.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.initialized = true;
          state.user = action.payload.user;
          state.token = action.payload.accessToken;
        }
      })
      .addCase(loginAdminWithSocial.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload || "Unable to sign in.");
      })
      .addCase(completeSocialLoginRedirect.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeSocialLoginRedirect.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.accessToken;
        }
      })
      .addCase(completeSocialLoginRedirect.rejected, (state, action) => {
        state.loading = false;
        state.error = String(
          action.payload || "Unable to complete social sign in.",
        );
      })
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload;
        state.token = localStorage.getItem("token");
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
        state.token = null;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.initialized = true;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload || "Unable to send reset email.");
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export const authReducer = authSlice.reducer;
export default authSlice.reducer;

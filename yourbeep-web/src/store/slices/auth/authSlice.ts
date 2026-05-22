import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "./authTypes";
import {
  completeSocialLoginRedirect,
  forgotPassword,
  loadUser,
  loginUser,
  loginUserWithSocial,
  logoutUser,
  registerUser,
} from "./authThunk";

const storedUser = localStorage.getItem("authUser");
const storedToken = localStorage.getItem("token");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
  loading: false,
  initialized: !storedToken,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    setAuthInitialized: (state, action) => {
      state.initialized = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload || "Unable to sign in.");
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload || "Unable to create account.");
      })
      .addCase(loginUserWithSocial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserWithSocial.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.initialized = true;
          state.user = action.payload.user;
          state.token = action.payload.accessToken;
        }
      })
      .addCase(loginUserWithSocial.rejected, (state, action) => {
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
      .addCase(logoutUser.fulfilled, (state) => {
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

export const { clearAuthError, setAuthInitialized } = authSlice.actions;
export const authReducer = authSlice.reducer;


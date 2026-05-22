import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  AuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getRedirectResult,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
} from "firebase/auth";
import api from "@services/api";
import { getApiErrorMessage } from "@utils/apiError";
import {
  appleProvider,
  firebaseAuth,
  googleProvider,
} from "@features/auth/services/firebaseClient";
import type {
  AuthResponse,
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  SocialLoginProvider,
} from "./authTypes";

const mapBackendUser = (user: Record<string, unknown>): AuthUser => ({
  id: String(user._id || user.id || ""),
  firebaseUid: String(user.firebaseUid || ""),
  email: String(user.email || ""),
  fullName: String(user.name || user.fullName || ""),
  role: user.role === "admin" ? "admin" : "user",
  avatar: typeof user.avatar === "string" ? user.avatar : null,
  timezone: typeof user.timezone === "string" ? user.timezone : null,
  region: typeof user.region === "string" ? user.region : null,
  sessionSummary: user.sessionSummary && typeof user.sessionSummary === "object"
    ? {
        totalDevices: Number((user.sessionSummary as Record<string, unknown>).totalDevices || 0),
        activeWebSessions: Number((user.sessionSummary as Record<string, unknown>).activeWebSessions || 0),
        activeMobileSessions: Number((user.sessionSummary as Record<string, unknown>).activeMobileSessions || 0),
        lastLoginAt: (user.sessionSummary as Record<string, unknown>).lastLoginAt
          ? String((user.sessionSummary as Record<string, unknown>).lastLoginAt)
          : null,
      }
    : undefined,
  recentSessions: Array.isArray(user.recentSessions)
    ? user.recentSessions.map((session) => {
        const item = session as Record<string, unknown>;
        return {
          id: String(item.id || ""),
          platform:
            item.platform === "ios" || item.platform === "android"
              ? item.platform
              : "web",
          notificationsEnabled: Boolean(item.notificationsEnabled),
          firstSeenAt: String(item.firstSeenAt || new Date().toISOString()),
          lastSeenAt: String(item.lastSeenAt || new Date().toISOString()),
          tokenAttached: Boolean(item.tokenAttached),
          ipAddress: typeof item.ipAddress === "string" ? item.ipAddress : null,
          userAgent: typeof item.userAgent === "string" ? item.userAgent : null,
          deviceName: typeof item.deviceName === "string" ? item.deviceName : null,
          countryCode: typeof item.countryCode === "string" ? item.countryCode : null,
          regionName: typeof item.regionName === "string" ? item.regionName : null,
          city: typeof item.city === "string" ? item.city : null,
          locationLabel: typeof item.locationLabel === "string" ? item.locationLabel : null,
        };
      })
    : [],
});

const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("authUser");
};

const getSocialProvider = (provider: SocialLoginProvider): AuthProvider =>
  provider === "google" ? googleProvider : appleProvider;

const postAuthSync = async () =>
  api.post("/auth/sync", {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Calcutta",
    deviceType: "web",
  });

const syncUserSession = async (accessToken: string) => {
  localStorage.setItem("token", accessToken);

  const syncResponse = await postAuthSync();
  const user = mapBackendUser(syncResponse.data?.data?.user ?? {});

  localStorage.setItem("authUser", JSON.stringify(user));
  return { user, accessToken };
};

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async ({ email, password, rememberMe }, { rejectWithValue }) => {
  try {
    await setPersistence(
      firebaseAuth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence,
    );

    const credential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    );

    const accessToken = await credential.user.getIdToken();
    return await syncUserSession(accessToken);
  } catch (err) {
    clearAuthStorage();

    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to sign in."),
      );
    }

    if (err instanceof Error) {
      return rejectWithValue(err.message || "Unable to sign in.");
    }

    return rejectWithValue("Unable to sign in.");
  }
});

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterPayload,
  { rejectValue: string }
>(
  "auth/register",
  async ({ fullName, email, password, rememberMe = true }, { rejectWithValue }) => {
    try {
      await setPersistence(
        firebaseAuth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence,
      );

      const credential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password,
      );

      await updateProfile(credential.user, { displayName: fullName });

      const accessToken = await credential.user.getIdToken(true);
      const session = await syncUserSession(accessToken);

      await api.patch("/users/me", { name: fullName });
      const profileResponse = await api.get("/auth/me");
      const updatedUser = mapBackendUser(profileResponse.data?.data?.user ?? {});
      localStorage.setItem("authUser", JSON.stringify(updatedUser));

      return { ...session, user: updatedUser };
    } catch (err) {
      clearAuthStorage();

      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          getApiErrorMessage(err.response?.data, "Unable to create account."),
        );
      }

      if (err instanceof Error) {
        return rejectWithValue(err.message || "Unable to create account.");
      }

      return rejectWithValue("Unable to create account.");
    }
  },
);

export const loginUserWithSocial = createAsyncThunk<
  AuthResponse | null,
  { provider: SocialLoginProvider; rememberMe?: boolean },
  { rejectValue: string }
>(
  "auth/loginSocial",
  async ({ provider, rememberMe = true }, { rejectWithValue }) => {
    try {
      const socialProvider = getSocialProvider(provider);

      if (provider === "google") {
        try {
          await setPersistence(
            firebaseAuth,
            rememberMe ? browserLocalPersistence : browserSessionPersistence,
          );

          const credential = await signInWithPopup(firebaseAuth, socialProvider);
          const accessToken = await credential.user.getIdToken();
          return await syncUserSession(accessToken);
        } catch (popupError) {
          if (
            popupError instanceof Error &&
            "code" in popupError &&
            typeof popupError.code === "string" &&
            popupError.code === "auth/popup-blocked"
          ) {
            await setPersistence(
              firebaseAuth,
              rememberMe ? browserLocalPersistence : browserSessionPersistence,
            );
            await signInWithRedirect(firebaseAuth, socialProvider);
            return null;
          }

          throw popupError;
        }
      }

      await setPersistence(
        firebaseAuth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence,
      );
      await signInWithRedirect(firebaseAuth, socialProvider);
      return null;
    } catch (err) {
      clearAuthStorage();

      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          getApiErrorMessage(err.response?.data, `Unable to sign in with ${provider}.`),
        );
      }

      if (err instanceof Error) {
        return rejectWithValue(
          err.message || `Unable to sign in with ${provider}.`,
        );
      }

      return rejectWithValue(`Unable to sign in with ${provider}.`);
    }
  },
);

export const completeSocialLoginRedirect = createAsyncThunk<
  AuthResponse | null,
  void,
  { rejectValue: string }
>("auth/completeSocialRedirect", async (_, { rejectWithValue }) => {
  try {
    const credential = await getRedirectResult(firebaseAuth);

    if (!credential) {
      return null;
    }

    const accessToken = await credential.user.getIdToken();
    return await syncUserSession(accessToken);
  } catch (err) {
    clearAuthStorage();

    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(
          err.response?.data,
          "Unable to complete social sign in.",
        ),
      );
    }

    if (err instanceof Error) {
      return rejectWithValue(
        err.message || "Unable to complete social sign in.",
      );
    }

    return rejectWithValue("Unable to complete social sign in.");
  }
});

export const loadUser = createAsyncThunk<AuthUser, void, { rejectValue: string }>(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const currentUser = firebaseAuth.currentUser;

      if (!currentUser) {
        clearAuthStorage();
        return rejectWithValue("Session expired");
      }

      const accessToken = await currentUser.getIdToken();
      localStorage.setItem("token", accessToken);

      let response;

      try {
        response = await api.get("/auth/me");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          await postAuthSync();
          response = await api.get("/auth/me");
        } else {
          throw err;
        }
      }

      const user = mapBackendUser(response.data?.data?.user ?? {});
      localStorage.setItem("authUser", JSON.stringify(user));
      return user;
    } catch (err) {
      clearAuthStorage();

      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          getApiErrorMessage(err.response?.data, "Session expired"),
        );
      }

      return rejectWithValue("Session expired");
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await signOut(firebaseAuth);
  } finally {
    clearAuthStorage();
  }
});

export const forgotPassword = createAsyncThunk<
  { message: string },
  ForgotPasswordPayload,
  { rejectValue: string }
>("auth/forgotPassword", async ({ email }, { rejectWithValue }) => {
  try {
    await sendPasswordResetEmail(firebaseAuth, email);
    return { message: "Password reset email sent." };
  } catch (err) {
    if (err instanceof Error) {
      return rejectWithValue(err.message || "Unable to send reset email.");
    }

    return rejectWithValue("Unable to send reset email.");
  }
});

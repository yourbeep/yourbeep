import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  ActionCodeSettings,
  AuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  getRedirectResult,
  sendPasswordResetEmail,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  appleProvider,
  firebaseAuth,
  googleProvider,
} from "../../../features/auth/services/firebaseClient";
import api from "../../../services/api";
import { getApiErrorMessage } from "../../../utils/apiError";
import type {
  AuthResponse,
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  SocialLoginProvider,
} from "./authTypes";

const configuredAdminAppUrl = import.meta.env.VITE_ADMIN_APP_URL;
const browserOrigin =
  typeof window !== "undefined" ? window.location.origin : undefined;
const resolvedAdminAppUrl = browserOrigin || configuredAdminAppUrl || "";

const passwordResetActionSettings: ActionCodeSettings | undefined =
  resolvedAdminAppUrl
    ? {
        url: `${resolvedAdminAppUrl}/login`,
        handleCodeInApp: false,
      }
    : undefined;

const mapBackendUser = (user: Record<string, unknown>): AuthUser => ({
  id: String(user._id || user.id || ""),
  firebaseUid: String(user.firebaseUid || ""),
  email: String(user.email || ""),
  fullName: String(user.name || user.fullName || ""),
  role: user.role === "admin" ? "admin" : "user",
  avatar: typeof user.avatar === "string" ? user.avatar : null,
  timezone: typeof user.timezone === "string" ? user.timezone : null,
  region: typeof user.region === "string" ? user.region : null,
});

const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("authUser");
  localStorage.removeItem("isAuthenticated");
};

const getSocialProvider = (provider: SocialLoginProvider): AuthProvider => {
  if (provider === "google") {
    return googleProvider;
  }

  return appleProvider;
};

const isPopupBlockedError = (err: unknown) => {
  if (!(err instanceof Error)) {
    return false;
  }

  return (
    err.message.includes("auth/popup-blocked") ||
    err.message.includes("auth/cancelled-popup-request")
  );
};

const postAuthSync = async () => {
  return api.post("/auth/sync", {
    timezone:
      Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Calcutta",
    deviceType: "web",
  });
};

const syncAdminSession = async (accessToken: string) => {
  console.info("[auth] syncAdminSession:start");
  localStorage.setItem("token", accessToken);

  const syncResponse = await postAuthSync();
  console.info("[auth] syncAdminSession:sync-success", syncResponse.data);
  const user = mapBackendUser(syncResponse.data?.data?.user ?? {});
  console.info("[auth] syncAdminSession:user-from-sync", user);

  if (user.role !== "admin") {
    console.warn("[auth] syncAdminSession:not-admin", user);
    await signOut(firebaseAuth);
    clearAuthStorage();
    throw new Error("Only admin accounts can access this dashboard.");
  }

  localStorage.setItem("authUser", JSON.stringify(user));
  console.info("[auth] syncAdminSession:completed", {
    email: user.email,
    role: user.role,
  });
  return { user, accessToken };
};

export const loginAdmin = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async ({ email, password, rememberMe }, { rejectWithValue }) => {
  try {
    console.info("[auth] loginAdmin:start", { email });
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
    console.info("[auth] loginAdmin:firebase-success", {
      email: credential.user.email,
      uid: credential.user.uid,
    });
    return await syncAdminSession(accessToken);
  } catch (err) {
    clearAuthStorage();
    console.error("[auth] loginAdmin:error", err);

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

export const loginAdminWithSocial = createAsyncThunk<
  AuthResponse | null,
  { provider: SocialLoginProvider; rememberMe?: boolean },
  { rejectValue: string }
>(
  "auth/loginSocial",
  async ({ provider, rememberMe = true }, { rejectWithValue }) => {
    try {
      console.info("[auth] loginAdminWithSocial:start", { provider });
      await setPersistence(
        firebaseAuth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence,
      );

      const socialProvider = getSocialProvider(provider);

      if (provider === "google") {
        try {
          const credential = await signInWithPopup(firebaseAuth, socialProvider);
          console.info("[auth] loginAdminWithSocial:popup-success", {
            provider,
            email: credential.user.email,
            uid: credential.user.uid,
          });

          const accessToken = await credential.user.getIdToken();
          return await syncAdminSession(accessToken);
        } catch (popupError) {
          if (isPopupBlockedError(popupError)) {
            console.warn(
              "[auth] loginAdminWithSocial:popup-blocked-fallback-to-redirect",
              { provider },
            );
            await signInWithRedirect(firebaseAuth, socialProvider);
            return null;
          }

          throw popupError;
        }
      }

      await signInWithRedirect(firebaseAuth, socialProvider);
      console.info("[auth] loginAdminWithSocial:redirect-started", { provider });
      return null;
    } catch (err) {
      clearAuthStorage();
      console.error("[auth] loginAdminWithSocial:error", err);

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
    console.info("[auth] completeSocialLoginRedirect:start");
    const credential = await getRedirectResult(firebaseAuth);

    if (!credential) {
      console.info("[auth] completeSocialLoginRedirect:no-credential");
      return null;
    }

    console.info("[auth] completeSocialLoginRedirect:firebase-success", {
      providerId: credential.providerId,
      email: credential.user.email,
      uid: credential.user.uid,
    });
    const accessToken = await credential.user.getIdToken();
    return await syncAdminSession(accessToken);
  } catch (err) {
    clearAuthStorage();
    console.error("[auth] completeSocialLoginRedirect:error", err);

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
      console.info("[auth] loadUser:start", {
        hasCurrentUser: Boolean(currentUser),
      });

      if (!currentUser) {
        clearAuthStorage();
        console.warn("[auth] loadUser:no-current-user");
        return rejectWithValue("Session expired");
      }

      const accessToken = await currentUser.getIdToken();
      localStorage.setItem("token", accessToken);

      let response;

      try {
        response = await api.get("/auth/me");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          console.warn("[auth] loadUser:profile-missing, syncing first");
          const syncResponse = await postAuthSync();
          console.info("[auth] loadUser:sync-success", syncResponse.data);
          response = await api.get("/auth/me");
        } else {
          throw err;
        }
      }

      const user = mapBackendUser(response.data?.data?.user ?? {});
      console.info("[auth] loadUser:me-success", user);

      if (user.role !== "admin") {
        console.warn("[auth] loadUser:not-admin", user);
        await signOut(firebaseAuth);
        clearAuthStorage();
        return rejectWithValue("Only admin accounts can access this dashboard.");
      }

      localStorage.setItem("authUser", JSON.stringify(user));
      return user;
    } catch (err) {
      clearAuthStorage();
      console.error("[auth] loadUser:error", err);

      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          getApiErrorMessage(err.response?.data, "Session expired"),
        );
      }

      return rejectWithValue("Session expired");
    }
  },
);

export const logoutAdmin = createAsyncThunk("auth/logout", async () => {
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
    await sendPasswordResetEmail(
      firebaseAuth,
      email,
      passwordResetActionSettings,
    );
    return { message: "Password reset email sent." };
  } catch (err) {
    if (err instanceof Error) {
      return rejectWithValue(err.message || "Unable to send reset email.");
    }

    return rejectWithValue("Unable to send reset email.");
  }
});

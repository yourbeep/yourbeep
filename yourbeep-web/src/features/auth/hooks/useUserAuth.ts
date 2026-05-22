import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@store";
import {
  clearAuthError,
  completeSocialLoginRedirect,
  forgotPassword,
  loadUser,
  loginUser,
  loginUserWithSocial,
  registerUser,
} from "@store/slices/auth";
import type {
  LoginPayload,
  RegisterPayload,
  SocialLoginProvider,
} from "@store/slices/auth";
import { appRoutes } from "@constants/routes";
import showToast from "@utils/showToast";

export const useUserAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, token, user } = useAppSelector((state) => state.auth);
  const [forgotMessage, setForgotMessage] = useState("");

  useEffect(() => {
    let active = true;

    const completeRedirect = async () => {
      const result = await dispatch(completeSocialLoginRedirect());

      if (!active) return;

      if (completeSocialLoginRedirect.fulfilled.match(result) && result.payload) {
        navigate(appRoutes.dashboard, { replace: true });
        return;
      }

      if (completeSocialLoginRedirect.fulfilled.match(result) && !result.payload) {
        const loadResult = await dispatch(loadUser());

        if (loadUser.fulfilled.match(loadResult)) {
          navigate(appRoutes.dashboard, { replace: true });
        }
      }
    };

    if (!user && !token) {
      void completeRedirect();
    }

    return () => {
      active = false;
    };
  }, [dispatch, navigate, token, user]);

  useEffect(() => {
    if (token && user) {
      navigate(appRoutes.dashboard, { replace: true });
    }
  }, [navigate, token, user]);

  const signIn = async (values: LoginPayload) => {
    setForgotMessage("");
    const result = await dispatch(loginUser(values));
    if (loginUser.fulfilled.match(result)) {
      showToast({
        type: "success",
        message: "Welcome back",
        options: {
          description: "Your workspace is ready.",
        },
      });
      navigate(appRoutes.dashboard, { replace: true });
      return { ok: true };
    }
    return { ok: false };
  };

  const signUp = async (values: RegisterPayload) => {
    setForgotMessage("");
    const result = await dispatch(registerUser(values));
    if (registerUser.fulfilled.match(result)) {
      showToast({
        type: "success",
        message: "Account created",
        options: {
          description: "You are signed in and ready to begin.",
        },
      });
      navigate(appRoutes.dashboard, { replace: true });
      return { ok: true };
    }
    return { ok: false };
  };

  const signInWithSocial = async (
    provider: SocialLoginProvider,
    rememberMe = true,
  ) => {
    setForgotMessage("");
    const result = await dispatch(loginUserWithSocial({ provider, rememberMe }));
    if (loginUserWithSocial.rejected.match(result)) {
      return { ok: false };
    }
    if (
      loginUserWithSocial.fulfilled.match(result) &&
      result.payload &&
      provider === "google"
    ) {
      showToast({
        type: "success",
        message: "Signed in with Google",
      });
      navigate(appRoutes.dashboard, { replace: true });
    }
    return { ok: true };
  };

  const sendResetEmail = async (email: string) => {
    setForgotMessage("");
    const result = await dispatch(forgotPassword({ email }));
    if (forgotPassword.fulfilled.match(result)) {
      setForgotMessage(result.payload.message);
      showToast({
        type: "info",
        message: "Reset link sent",
        options: {
          description: result.payload.message,
        },
      });
      return { ok: true };
    }
    return { ok: false };
  };

  return {
    loading,
    error,
    forgotMessage,
    clearError: () => dispatch(clearAuthError()),
    signIn,
    signUp,
    signInWithSocial,
    sendResetEmail,
  };
};

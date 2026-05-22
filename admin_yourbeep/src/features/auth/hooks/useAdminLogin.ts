import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  clearAuthError,
  completeSocialLoginRedirect,
  forgotPassword,
  loadUser,
  loginAdmin,
  loginAdminWithSocial,
} from "../../../store/slices/auth";
import type {
  LoginPayload,
  SocialLoginProvider,
} from "../../../store/slices/auth/authTypes";
import { showToast } from "../../../utils/showToast";

type AuthActionResult = {
  ok: boolean;
};

export function useAdminLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, token, user } = useAppSelector((state) => state.auth);
  const [forgotMessage, setForgotMessage] = useState<string>("");

  useEffect(() => {
    let active = true;

    const completeRedirect = async () => {
      console.info("[auth-ui] checking redirect result");
      const result = await dispatch(completeSocialLoginRedirect());
      console.info("[auth-ui] redirect result", result);

      if (!active) {
        return;
      }

      if (
        completeSocialLoginRedirect.fulfilled.match(result) &&
        result.payload
      ) {
        navigate("/", { replace: true });
        return;
      }

      if (
        completeSocialLoginRedirect.fulfilled.match(result) &&
        !result.payload
      ) {
        console.info("[auth-ui] no redirect credential, trying loadUser fallback");
        const loadResult = await dispatch(loadUser());
        console.info("[auth-ui] loadUser fallback result", loadResult);

        if (loadUser.fulfilled.match(loadResult)) {
          navigate("/", { replace: true });
        }
      }
    };

    if (!user && !token) {
      void completeRedirect();
    } else {
      console.info("[auth-ui] skipping redirect check", {
        hasUser: Boolean(user),
        hasToken: Boolean(token),
      });
    }

    return () => {
      active = false;
    };
  }, [dispatch, navigate, token, user]);

  useEffect(() => {
    if (token && user) {
      console.info("[auth-ui] navigating to dashboard", {
        email: user.email,
        role: user.role,
      });
      navigate("/", { replace: true });
    }
  }, [navigate, token, user]);

  const signIn = async (values: LoginPayload): Promise<AuthActionResult> => {
    console.info("[auth-ui] email login submit", { email: values.email });
    const result = await dispatch(loginAdmin(values));
    console.info("[auth-ui] email login result", result);

    if (loginAdmin.fulfilled.match(result)) {
      navigate("/", { replace: true });
      return { ok: true };
    }

    return { ok: false };
  };

  const sendResetEmail = async (email: string): Promise<AuthActionResult> => {
    setForgotMessage("");

    const result = await dispatch(forgotPassword({ email }));

    if (forgotPassword.fulfilled.match(result)) {
      setForgotMessage(result.payload.message);
      showToast({
        type: "success",
        message: "Reset link sent",
        options: {
          description: result.payload.message,
        },
      });
      return { ok: true };
    }

    return { ok: false };
  };

  const signInWithSocial = async (
    provider: SocialLoginProvider,
    rememberMe = true,
  ): Promise<AuthActionResult> => {
    console.info("[auth-ui] social login submit", { provider, rememberMe });
    const result = await dispatch(
      loginAdminWithSocial({ provider, rememberMe }),
    );
    console.info("[auth-ui] social login dispatch result", result);

    if (loginAdminWithSocial.rejected.match(result)) {
      return { ok: false };
    }

    if (loginAdminWithSocial.fulfilled.match(result)) {
      if (provider === "google") {
        navigate("/", { replace: true });
      }
      return { ok: true };
    }

    return { ok: true };
  };

  return {
    loading,
    error,
    forgotMessage,
    clearError: () => dispatch(clearAuthError()),
    signIn,
    signInWithSocial,
    sendResetEmail,
  };
}

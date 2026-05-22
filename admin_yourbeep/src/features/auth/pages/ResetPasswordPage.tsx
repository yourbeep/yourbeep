import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";
import { motion } from "framer-motion";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { InputField } from "../../../components/ui/InputField";
import { MainButton } from "../../../components/ui/MainButton";
import { firebaseAuth } from "../services/firebaseClient";
import { showToast } from "../../../utils/showToast";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode") ?? "";
  const continueUrl = searchParams.get("continueUrl") ?? "/login";

  const [loadingState, setLoadingState] = useState<"checking" | "submitting" | "idle">("checking");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isResetMode = mode === "resetPassword";

  useEffect(() => {
    if (!isResetMode || !oobCode) {
      setLoadingState("idle");
      setErrorMessage("This password reset link is incomplete or invalid.");
      return;
    }

    let active = true;

    const verifyCode = async () => {
      try {
        const email = await verifyPasswordResetCode(firebaseAuth, oobCode);

        if (!active) {
          return;
        }

        setVerifiedEmail(email);
        setLoadingState("idle");
      } catch (error) {
        if (!active) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "This password reset link is no longer valid.";

        setErrorMessage(message);
        setLoadingState("idle");
      }
    };

    void verifyCode();

    return () => {
      active = false;
    };
  }, [isResetMode, oobCode]);

  const canSubmit = useMemo(() => {
    return (
      loadingState !== "checking" &&
      Boolean(verifiedEmail) &&
      password.length >= 8 &&
      confirmPassword.length >= 8
    );
  }, [confirmPassword.length, loadingState, password.length, verifiedEmail]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!oobCode) {
      const message = "Missing password reset token.";
      setErrorMessage(message);
      showToast({ type: "error", message });
      return;
    }

    if (password.length < 8) {
      const message = "Use at least 8 characters for your new password.";
      setErrorMessage(message);
      showToast({ type: "warning", message });
      return;
    }

    if (password !== confirmPassword) {
      const message = "Passwords do not match.";
      setErrorMessage(message);
      showToast({ type: "warning", message });
      return;
    }

    setLoadingState("submitting");

    try {
      await confirmPasswordReset(firebaseAuth, oobCode, password);

      const message = "Your password has been updated. You can sign in now.";
      setSuccessMessage(message);
      showToast({ type: "success", message });

      window.setTimeout(() => {
        navigate(continueUrl.startsWith("http") ? "/login" : continueUrl, {
          replace: true,
        });
      }, 1200);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to reset your password.";

      setErrorMessage(message);
      showToast({ type: "error", message });
    } finally {
      setLoadingState("idle");
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-[#eef5ea] p-2 text-black selection:bg-[var(--primary)]/20 lg:h-screen lg:overflow-hidden lg:p-4">
      <section className="relative hidden h-full w-[52%] flex-col overflow-hidden rounded-3xl px-12 py-12 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(103,162,116,0.38),transparent_70%),radial-gradient(ellipse_60%_50%_at_15%_30%,rgba(61,121,77,0.24),transparent_60%),linear-gradient(180deg,#f5fbf2_0%,#e3f1db_42%,#cfe6c4_100%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            <img
              src="/app_logo.png"
              alt="YourBeep"
              className="h-14 w-auto object-contain object-left"
            />
          </div>

          <div className="flex flex-col gap-8 pb-8">
            <div>
              <h1 className="text-[42px] font-semibold leading-[1.08] tracking-tight text-black">
                Reset your admin password
              </h1>
              <p className="mt-3 max-w-[420px] text-sm leading-relaxed text-black/50">
                Set a new password for your approved workspace account, then return
                to the dashboard login.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-1 items-center justify-center overflow-y-auto rounded-3xl bg-[linear-gradient(180deg,#f9fcf8_0%,#f1f7ed_100%)] px-4 py-10 sm:px-8 lg:px-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="w-full max-w-[480px]"
        >
          <div className="mb-7">
            <h2 className="text-3xl font-medium tracking-tight text-black">
              Create a new password
            </h2>
            <p className="mt-1.5 text-sm text-black/40">
              {verifiedEmail
                ? `Resetting access for ${verifiedEmail}`
                : "We’re validating your reset link."}
            </p>
          </div>

          {loadingState === "checking" ? (
            <div className="rounded-2xl border border-[#d7e8d2] bg-white px-5 py-4 text-sm text-gray-600 shadow-sm">
              Checking your reset link...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="New Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                inputClassName="pr-11"
                disabled={!verifiedEmail || Boolean(successMessage)}
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="text-black/30 transition-colors hover:text-[var(--primary-dark)]"
                  >
                    {showPassword ? (
                      <MdVisibilityOff className="text-[18px]" />
                    ) : (
                      <MdVisibility className="text-[18px]" />
                    )}
                  </button>
                }
              />

              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repeat your new password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                inputClassName="pr-11"
                disabled={!verifiedEmail || Boolean(successMessage)}
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="text-black/30 transition-colors hover:text-[var(--primary-dark)]"
                  >
                    {showConfirmPassword ? (
                      <MdVisibilityOff className="text-[18px]" />
                    ) : (
                      <MdVisibility className="text-[18px]" />
                    )}
                  </button>
                }
              />

              {errorMessage || successMessage ? (
                <div
                  className={`rounded-xl px-3 py-2 text-xs ${
                    errorMessage
                      ? "bg-red-50 text-red-600"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {errorMessage || successMessage}
                </div>
              ) : null}

              <MainButton
                type="submit"
                disabled={!canSubmit || Boolean(successMessage)}
                isLoading={loadingState === "submitting"}
                size="xl"
                text={
                  loadingState === "submitting"
                    ? "Updating password..."
                    : "Set new password"
                }
                className="mt-2 w-full bg-[linear-gradient(135deg,var(--primary)_0%,#68a074_100%)] hover:brightness-[0.97]"
              />

              <div className="pt-1 text-center">
                <Link
                  to="/login"
                  className="text-xs font-medium text-[var(--primary)] transition hover:text-[var(--primary-dark)]"
                >
                  Back to admin login
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      </section>
    </main>
  );
}

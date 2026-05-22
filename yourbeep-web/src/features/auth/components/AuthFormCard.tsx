import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import MainButton from "@components/ui/MainButton";
import MainInput from "@components/ui/MainInput";
import SegmentToggle from "@components/ui/SegmentToggle";
import type {
  LoginPayload,
  RegisterPayload,
  SocialLoginProvider,
} from "@store/slices/auth";
import showToast from "@utils/showToast";
import SocialAuthButtons from "./SocialAuthButtons";

type Tab = "signin" | "register";

type Props = {
  initialTab?: Tab;
  loading: boolean;
  error: string | null;
  forgotMessage: string;
  signIn: (values: LoginPayload) => Promise<{ ok: boolean }>;
  signUp: (values: RegisterPayload) => Promise<{ ok: boolean }>;
  signInWithSocial: (
    provider: SocialLoginProvider,
    rememberMe: boolean,
  ) => Promise<{ ok: boolean }>;
  sendResetEmail: (email: string) => Promise<{ ok: boolean }>;
  clearError: () => void;
  onTabChange?: (tab: Tab) => void;
};

const tabOptions = [
  { label: "Login", value: "signin" as const },
  { label: "Sign Up", value: "register" as const },
];

const panelMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.24 },
};

const AuthFormCard = ({
  initialTab = "signin",
  loading,
  error,
  forgotMessage,
  signIn,
  signUp,
  signInWithSocial,
  sendResetEmail,
  clearError,
  onTabChange,
}: Props) => {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [localMessage, setLocalMessage] = useState("");

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!error) return;

    showToast({
      type: "error",
      message: "Authentication failed",
      options: {
        description: error,
      },
    });
  }, [error]);

  useEffect(() => {
    if (!forgotMessage) return;

    setLocalMessage("");
  }, [forgotMessage]);

  const updateTab = (nextTab: Tab) => {
    clearError();
    setLocalMessage("");
    setTab(nextTab);
    onTabChange?.(nextTab);
  };

  const handleSubmit = async () => {
    setLocalMessage("");
    clearError();

    if (tab === "register") {
      if (!fullName.trim()) {
        const message = "Enter your full name to create your account.";
        setLocalMessage(message);
        showToast({ type: "warning", message });
        return;
      }

      if (!email.trim() || !password.trim()) {
        const message = "Email and password are required.";
        setLocalMessage(message);
        showToast({ type: "warning", message });
        return;
      }

      await signUp({ fullName, email, password, rememberMe });
      return;
    }

    if (!email.trim() || !password.trim()) {
      const message = "Email and password are required.";
      setLocalMessage(message);
      showToast({ type: "warning", message });
      return;
    }

    await signIn({ email, password, rememberMe });
  };

  const handleForgotPassword = async () => {
    setLocalMessage("");

    if (!email.trim()) {
      const message = "Enter your email first so we know where to send the reset link.";
      setLocalMessage(message);
      showToast({ type: "warning", message });
      return;
    }

    clearError();
    await sendResetEmail(email);
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-[radial-gradient(circle_at_top,#eef5f0_0%,#f6f3ea_48%,#f2eee3_100%)] px-6 py-10 lg:w-[52%] lg:px-10">
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-[560px] rounded-[34px] border border-[var(--border)] bg-[rgba(255,253,248,0.92)] p-6 shadow-[0_28px_60px_rgba(24,52,58,0.12)] backdrop-blur-xl md:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">
              YourBeep Access
            </p>
            <h2 className="mt-2 text-[32px] font-bold tracking-[-0.03em] text-[var(--text)]">
              {tab === "signin" ? "Welcome back" : "Begin your guided practice"}
            </h2>
            <p className="mt-2 max-w-[380px] text-sm leading-7 text-[var(--muted)]">
              {tab === "signin"
                ? "Step back into your reflective workspace and continue your course and activity journey."
                : "Create your account to access courses, guided games, and progress-aware learning."}
            </p>
          </div>

          <SegmentToggle value={tab} onChange={updateTab} options={tabOptions} />
        </div>

        <div className="mt-8">
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div key={tab} {...panelMotion} className="space-y-4">
                {tab === "register" ? (
                  <MainInput
                    label="Full Name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Dr. Julian Thorne"
                  />
                ) : null}

                <MainInput
                  label="Work Email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="julian@clinic.io"
                />

                <MainInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  endAdornment={
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--primary)]"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  }
                />

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-white/80 px-4 py-3">
                  <label className="flex items-center gap-3 text-sm text-[var(--text)]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                    Keep me signed in on this device
                  </label>

                  {tab === "signin" ? (
                    <button
                      type="button"
                      onClick={() => void handleForgotPassword()}
                      className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)] transition hover:text-[var(--primary-strong)]"
                    >
                      Forgot password
                    </button>
                  ) : null}
                </div>
              </motion.div>
            </AnimatePresence>

            {error || forgotMessage || localMessage ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  error || localMessage
                    ? "border-red-100 bg-red-50 text-red-700"
                    : "border-emerald-100 bg-emerald-50 text-emerald-700"
                }`}
              >
                {error || localMessage || forgotMessage}
              </motion.div>
            ) : null}

            <div className="space-y-3">
              <MainButton
                onClick={() => void handleSubmit()}
                disabled={loading}
                isLoading={loading}
                fullWidth
                size="lg"
                className="rounded-2xl"
              >
                {tab === "signin" ? "Log In" : "Create Account"}
              </MainButton>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[var(--border)]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Or continue with
                </span>
                <div className="h-px flex-1 bg-[var(--border)]" />
              </div>

              <SocialAuthButtons
                loading={loading}
                onSocialSignIn={(provider) => signInWithSocial(provider, rememberMe)}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthFormCard;

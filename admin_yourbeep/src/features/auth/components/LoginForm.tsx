import { useEffect, useState } from "react";
import { FaApple, FaGoogle } from "react-icons/fa";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import type { IconType } from "react-icons";
import type { FormEvent } from "react";
import { InputField } from "../../../components/ui/InputField";
import { MainButton } from "../../../components/ui/MainButton";
import type { SocialLoginProvider } from "../../../store/slices/auth/authTypes";
import { useAdminLogin } from "../hooks/useAdminLogin";

type SocialButtonProps = {
  icon: IconType;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

function SocialButton({
  icon: Icon,
  label,
  onClick,
  disabled = false,
}: SocialButtonProps) {
  return (
    <MainButton
      type="button"
      onClick={() => onClick?.()}
      disabled={disabled}
      variant="outline"
      className="w-full justify-center border-[#d6e3d0] bg-white text-[#24412c] hover:border-[#bfd3b8] hover:bg-[#f5faf3]"
    >
      <span className="flex items-center justify-center gap-2">
        <Icon size={15} />
        {label}
      </span>
    </MainButton>
  );
}

export default function LoginForm() {
  const {
    loading,
    error,
    forgotMessage,
    clearError,
    signIn,
    signInWithSocial,
    sendResetEmail,
  } = useAdminLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localMessage, setLocalMessage] = useState("");

  useEffect(() => {
    if (error || forgotMessage) {
      setLocalMessage("");
    }
  }, [error, forgotMessage]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalMessage("");
    clearError();

    await signIn({ email, password, rememberMe: true });
  };

  const handleForgotPassword = async () => {
    setLocalMessage("");

    if (!email) {
      setLocalMessage(
        "Enter your admin email first so we know where to send it.",
      );
      return;
    }

    clearError();
    await sendResetEmail(email);
  };

  const handleSocialSignIn = async (provider: SocialLoginProvider) => {
    setLocalMessage("");
    clearError();

    await signInWithSocial(provider, true);
  };

  return (
    <div className="w-full max-w-[480px]">
      <div>
        <div className="mb-7">
          <h2 className="text-3xl font-medium tracking-tight text-black">
            Access YourBeep
          </h2>
          <p className="mt-1.5 text-sm text-black/40">
            Sign in with your approved account to continue.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SocialButton
            icon={FaGoogle}
            label="Google"
            onClick={() => void handleSocialSignIn("google")}
            disabled={loading}
          />
          <SocialButton
            icon={FaApple}
            label="Apple"
            onClick={() => void handleSocialSignIn("apple")}
            disabled={loading}
          />
        </div>

        <div className="my-5 flex items-center">
          <div className="h-px flex-1 bg-[#d6e3d0]" />
          <span className="px-4 text-xs font-medium uppercase tracking-widest text-black/30">
            Or
          </span>
          <div className="h-px flex-1 bg-[#d6e3d0]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="admin@yourbeep.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => void handleForgotPassword()}
                className="text-xs text-[var(--primary)] transition hover:text-[var(--primary-dark)]"
              >
                Forgot password?
              </button>
            </div>
            <InputField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              inputClassName="pr-11"
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
          </div>

          {error || forgotMessage || localMessage ? (
            <div
              className={`rounded-xl px-3 py-2 text-xs ${
                error || localMessage
                  ? "bg-red-50 text-red-600"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {error || localMessage || forgotMessage}
            </div>
          ) : null}

          <MainButton
            type="submit"
            disabled={loading}
            isLoading={loading}
            size="xl"
            text={
              loading
                ? "Signing in..."
                : "Open Workspace"
            }
            className="mt-2 w-full bg-[linear-gradient(135deg,var(--primary)_0%,#68a074_100%)] hover:brightness-[0.97]"
          />
        </form>
      </div>
    </div>
  );
}

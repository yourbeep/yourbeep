import type { ButtonHTMLAttributes, ReactNode } from "react";

type MainButtonVariant = "primary" | "outline" | "ghost" | "soft";
type MainButtonSize = "sm" | "md" | "lg";

type MainButtonProps = {
  children?: ReactNode;
  text?: string;
  variant?: MainButtonVariant;
  size?: MainButtonSize;
  isLoading?: boolean;
  headIcon?: ReactNode;
  tailIcon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

const variantClasses: Record<MainButtonVariant, string> = {
  primary:
    "bg-[linear-gradient(135deg,var(--primary)_0%,var(--primary-strong)_100%)] text-white shadow-[0_12px_28px_rgba(39,107,115,0.22)] hover:brightness-[0.98]",
  outline:
    "border border-[var(--border)] bg-white text-[var(--text)] hover:border-[var(--primary)] hover:bg-[var(--surface)]",
  ghost:
    "bg-transparent text-[var(--primary)] hover:bg-[var(--primary-soft)]",
  soft:
    "border border-[var(--border)] bg-[var(--primary-soft)] text-[var(--primary)] hover:bg-[#d8ebe4]",
};

const sizeClasses: Record<MainButtonSize, string> = {
  sm: "h-9 rounded-full px-3 text-xs",
  md: "h-11 rounded-full px-5 text-sm",
  lg: "h-12 rounded-full px-6 text-sm",
};

export function MainButton({
  children,
  text,
  variant = "primary",
  size = "md",
  isLoading = false,
  headIcon,
  tailIcon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: MainButtonProps) {
  const content = children ?? text;

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition duration-200 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`.trim()}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {!isLoading && headIcon ? <span className="shrink-0">{headIcon}</span> : null}
      {content ? <span>{content}</span> : null}
      {!isLoading && tailIcon ? <span className="shrink-0">{tailIcon}</span> : null}
    </button>
  );
}

export default MainButton;

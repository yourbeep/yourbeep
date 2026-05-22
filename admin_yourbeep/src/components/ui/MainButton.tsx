import { clsx, type ClassValue } from "clsx";
import type { ReactNode } from "react";
import { FiLoader } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "soft";

type ButtonSize = "sm" | "md" | "lg" | "xl";

interface MainButtonProps {
  text?: string;
  children?: ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
  headIcon?: ReactNode;
  tailIcon?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  form?: string;
}

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--primary)] text-white border border-[var(--primary)] shadow-[0_8px_18px_rgba(13,110,110,0.22)] hover:bg-[var(--primary-dark)] hover:border-[var(--primary-dark)] active:bg-[#084d4d]",

  secondary:
    "bg-[#E5E7EB] text-[#2F3642] border border-[#E5E7EB] hover:bg-[#D9DDE3] active:bg-[#CDD3DB]",

  outline:
    "bg-white text-[#2F3642] border border-[#C8D0DD] hover:bg-[#F8FAFC] active:bg-[#F1F5F9]",

  ghost:
    "bg-transparent text-[var(--primary)] border border-transparent hover:bg-[var(--primary-light)] active:bg-[#d7ecec]",

  danger:
    "bg-[#D93025] text-white border border-[#D93025] hover:bg-[#B3261E] active:bg-[#8F1D18]",

  soft: "bg-[var(--primary-light)] text-[var(--primary)] border border-[#cfe7e7] hover:bg-[#dff0f0] active:bg-[#d3ebeb]",
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs rounded-lg gap-1.5",
  md: "h-11 px-4 text-sm rounded-xl gap-2",
  lg: "h-12 px-5 text-sm rounded-xl gap-2",
  xl: "h-14 px-6 text-base rounded-2xl gap-2.5",
};

export function MainButton({
  text,
  children,
  isLoading = false,
  onClick,
  headIcon,
  tailIcon,
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  disabled = false,
  form,
}: MainButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      form={form}
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      aria-busy={isLoading}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap font-semibold tracking-[-0.01em] transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]/25",
        "active:scale-[0.985]",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none",
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className,
      )}
    >
      {children ? (
        children
      ) : (
        <>
          {isLoading && <FiLoader className="h-4 w-4 shrink-0 animate-spin" />}
          {!isLoading && headIcon && (
            <span className="shrink-0">{headIcon}</span>
          )}
          {text && <span>{text}</span>}
          {!isLoading && tailIcon && (
            <span className="shrink-0">{tailIcon}</span>
          )}
        </>
      )}
    </button>
  );
}

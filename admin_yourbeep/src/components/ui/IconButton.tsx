import { clsx, type ClassValue } from "clsx";
import type { ReactNode } from "react";
import { FiLoader } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type IconButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "soft";

type IconButtonSize = "sm" | "md" | "lg";

interface IconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
  ariaLabel: string;
}

const ICON_BUTTON_VARIANTS: Record<IconButtonVariant, string> = {
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

const ICON_BUTTON_SIZES: Record<IconButtonSize, string> = {
  sm: "h-9 w-9 rounded-lg",
  md: "h-10 w-10 rounded-xl",
  lg: "h-12 w-12 rounded-xl",
};

export function IconButton({
  icon,
  onClick,
  variant = "outline",
  size = "md",
  className,
  disabled = false,
  isLoading = false,
  type = "button",
  ariaLabel,
}: IconButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]/25",
        "active:scale-[0.96]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        ICON_BUTTON_VARIANTS[variant],
        ICON_BUTTON_SIZES[size],
        className,
      )}
    >
      {isLoading ? (
        <FiLoader className="h-4 w-4 animate-spin" />
      ) : (
        <span className="text-[16px]">{icon}</span>
      )}
    </button>
  );
}

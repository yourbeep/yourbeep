import { clsx, type ClassValue } from "clsx";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type StatusPillVariant =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted";

export type StatusPillSize = "sm" | "md";

const VARIANTS: Record<StatusPillVariant, string> = {
  neutral: "border-slate-200 bg-slate-100 text-slate-700",
  primary: "border-blue-200 bg-blue-50 text-blue-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  danger: "border-red-200 bg-red-50 text-red-800",
  info: "border-sky-200 bg-sky-50 text-sky-900",
  muted: "border-transparent bg-slate-200/80 text-slate-600",
};

const DOTS: Record<StatusPillVariant, string> = {
  neutral: "bg-slate-500",
  primary: "bg-blue-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-sky-500",
  muted: "bg-slate-400",
};

const SIZES: Record<StatusPillSize, string> = {
  sm: "px-2 py-0.5 text-[10px] font-semibold tracking-wide",
  md: "px-2.5 py-1 text-[11px] font-semibold",
};

export type StatusPillProps = {
  children: ReactNode;
  variant?: StatusPillVariant;
  size?: StatusPillSize;
  /** Leading status dot (e.g. live / active). */
  dot?: boolean;
  /** Pulse animation on the dot. */
  pulse?: boolean;
  className?: string;
};

export function StatusPill({
  children,
  variant = "neutral",
  size = "sm",
  dot = false,
  pulse = false,
  className,
}: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit max-w-full items-center gap-1.5 rounded-lg border",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
    >
      {dot ? (
        <span
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            DOTS[variant],
            pulse && "animate-pulse",
          )}
        />
      ) : null}
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}

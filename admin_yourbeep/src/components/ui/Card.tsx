import { clsx, type ClassValue } from "clsx";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Card({
  children,
  className,
  as: Component = "section",
}: {
  children: ReactNode;
  className?: string;
  /** Default `section` for grouped settings/blocks; use `div` if nested in another landmark. */
  as?: "section" | "div";
}) {
  return (
    <Component
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm",
        className,
      )}
    >
      {children}
    </Component>
  );
}

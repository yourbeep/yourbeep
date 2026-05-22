import type { ReactNode } from "react";

type StatusPillTone = "primary" | "success" | "warning" | "muted";

type StatusPillProps = {
  children: ReactNode;
  tone?: StatusPillTone;
  dot?: boolean;
  className?: string;
};

const toneClasses: Record<StatusPillTone, string> = {
  primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
  success: "bg-[#e8f5ec] text-[#24744e]",
  warning: "bg-[#fbefdb] text-[#a56712]",
  muted: "bg-[#ece8dc] text-[var(--muted)]",
};

const dotClasses: Record<StatusPillTone, string> = {
  primary: "bg-[var(--primary)]",
  success: "bg-[#24744e]",
  warning: "bg-[#a56712]",
  muted: "bg-[var(--muted)]",
};

export function StatusPill({
  children,
  tone = "primary",
  dot = false,
  className = "",
}: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${toneClasses[tone]} ${className}`.trim()}
    >
      {dot ? <span className={`h-2 w-2 rounded-full ${dotClasses[tone]}`} /> : null}
      {children}
    </span>
  );
}

export default StatusPill;

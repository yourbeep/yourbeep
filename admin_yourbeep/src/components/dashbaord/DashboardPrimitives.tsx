import type { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { Search } from "lucide-react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type DashboardTone = "blue" | "emerald" | "red" | "amber" | "violet" | "slate";

const toneStyles: Record<
  DashboardTone,
  { icon: string; pill: string; progress: string; text: string; dot: string }
> = {
  blue: {
    icon: "bg-[var(--primary-light)] text-[var(--primary)]",
    pill: "bg-[var(--primary-light)] text-[var(--primary)] border-[#cfe7e7]",
    progress: "bg-[var(--primary)]",
    text: "text-[var(--primary)]",
    dot: "bg-[var(--primary)]",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-700",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-100",
    progress: "bg-emerald-600",
    text: "text-emerald-700",
    dot: "bg-emerald-600",
  },
  red: {
    icon: "bg-red-50 text-red-700",
    pill: "bg-red-50 text-red-700 border-red-100",
    progress: "bg-red-600",
    text: "text-red-700",
    dot: "bg-red-600",
  },
  amber: {
    icon: "bg-amber-50 text-amber-700",
    pill: "bg-amber-50 text-amber-700 border-amber-100",
    progress: "bg-amber-500",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  violet: {
    icon: "bg-blue-100 text-[#1565C0]",
    pill: "bg-blue-100 text-[#1565C0] border-blue-100",
    progress: "bg-[#1565C0]",
    text: "text-[#1565C0]",
    dot: "bg-[#1565C0]",
  },
  slate: {
    icon: "bg-slate-100 text-slate-700",
    pill: "bg-slate-100 text-slate-700 border-slate-200",
    progress: "bg-slate-500",
    text: "text-slate-700",
    dot: "bg-slate-500",
  },
};

export function DashboardCard({
  children,
  className = "",
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-slate-200 bg-white shadow-sm",
        interactive &&
          "cursor-pointer transition hover:border-[#cfe7e7] hover:shadow-md",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardIcon({
  icon,
  tone = "blue",
  className = "",
}: {
  icon: ReactNode;
  tone?: DashboardTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
        toneStyles[tone].icon,
        className,
      )}
    >
      {icon}
    </span>
  );
}

export function Pill({
  children,
  tone = "slate",
  dot = false,
  pulse = false,
  className = "",
}: {
  children: ReactNode;
  tone?: DashboardTone;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center gap-1.5 rounded-full border px-2.5 text-[10px] font-bold uppercase tracking-normal",
        toneStyles[tone].pill,
        className,
      )}
    >
      {dot ? (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            toneStyles[tone].dot,
            pulse && "animate-pulse",
          )}
        />
      ) : null}
      {children}
    </span>
  );
}

export function ProgressMeter({
  value,
  tone = "blue",
  className = "",
}: {
  value: number;
  tone?: DashboardTone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "h-1.5 overflow-hidden rounded-full bg-slate-200",
        className,
      )}
    >
      <span
        className={cn("block h-full rounded-full", toneStyles[tone].progress)}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  note?: string;
  tone?: "blue" | "red" | "green" | "slate";
  children?: ReactNode;
};

export function StatCard({
  label,
  value,
  note,
  tone = "blue",
  children,
}: StatCardProps) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value}
        {note ? <span>{note}</span> : null}
      </div>
      {children ?? (
        <div className="mini-track">
          <span style={{ width: tone === "red" ? "18%" : "72%" }} />
        </div>
      )}
    </article>
  );
}

export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      {(title || action) && (
        <div className="panel-header">
          {title ? <h2>{title}</h2> : <span />}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function SearchBox({ placeholder }: { placeholder: string }) {
  return (
    <label className="search-box">
      <Search size={17} />
      <input placeholder={placeholder} />
    </label>
  );
}

export function StatusChip({ value }: { value: string }) {
  const token = value.toLowerCase().replace(/\s+/g, "-");
  return <span className={`status-chip ${token}`}>{value}</span>;
}

export function ProgressBar({
  value,
  tone = "blue",
}: {
  value: number;
  tone?: "blue" | "red" | "green" | "slate";
}) {
  return (
    <div className={`progress-line tone-${tone}`}>
      <span style={{ width: `${value}%` }} />
    </div>
  );
}

export function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-title">
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

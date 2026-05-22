import type { ReactNode } from "react";

export function CardHeader({
  icon,
  title,
  right,
  className = "",
}: {
  icon?: ReactNode;
  title: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mb-4 flex items-center justify-between ${className}`.trim()}
    >
      <div className="flex items-center gap-2">
        {icon ? <span className="text-slate-500">{icon}</span> : null}
        <span className="text-[13px] font-semibold text-slate-900">{title}</span>
      </div>
      {right}
    </div>
  );
}

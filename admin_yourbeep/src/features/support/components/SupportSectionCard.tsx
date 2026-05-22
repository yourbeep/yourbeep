import type { ReactNode } from "react";

type SupportSectionCardProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export default function SupportSectionCard({
  title,
  subtitle,
  actions,
  children,
}: SupportSectionCardProps) {
  return (
    <section className="rounded-[24px] border border-[#e7eadf] bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#203321]">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-[#74816f]">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

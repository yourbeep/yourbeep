import { motion } from "framer-motion";
import type { ReactNode } from "react";

type ProfileSectionCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
};

export default function ProfileSectionCard({
  title,
  subtitle,
  children,
  actions,
}: ProfileSectionCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="rounded-[24px] border border-[#e7eadf] bg-white p-6 shadow-sm"
    >
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#203321]">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-[#74816f]">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex gap-3">{actions}</div> : null}
      </div>
      {children}
    </motion.section>
  );
}

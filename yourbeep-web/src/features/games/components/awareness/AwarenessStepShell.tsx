import { motion } from "framer-motion";
import type { ReactNode } from "react";

type AwarenessStepShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  currentStep: number;
  progressLabel: string;
  children: ReactNode;
};

const AwarenessStepShell = ({
  eyebrow,
  title,
  description,
  currentStep,
  progressLabel,
  children,
}: AwarenessStepShellProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="rounded-[30px] border border-[rgba(39,107,115,0.08)] bg-white p-6 shadow-[0_16px_36px_rgba(17,24,39,0.06)] md:p-8"
    >
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7c8f90]">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-[30px] font-bold leading-tight text-[#1a2e38] md:text-[36px]">
            {title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#617273]">{description}</p>
        </div>

        <div className="min-w-[240px] rounded-[24px] border border-[#e9efea] bg-[#f7faf8] px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#819293]">
            {progressLabel}
          </p>
          <div className="mt-3 flex gap-2">
            {[1, 2, 3].map((item) => (
              <span
                key={item}
                className={`h-2.5 flex-1 rounded-full ${
                  item <= currentStep ? "bg-[var(--primary)]" : "bg-[#d7dfdc]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {children}
    </motion.section>
  );
};

export default AwarenessStepShell;

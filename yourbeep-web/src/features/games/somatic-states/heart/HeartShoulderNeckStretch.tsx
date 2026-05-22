import { motion } from "framer-motion";
import { PersonStanding } from "lucide-react";

type Step = {
  title: string;
  description: string;
};

const steps: ReadonlyArray<Step> = [
  {
    title: "Inhale & lift",
    description:
      "Lift shoulders up to your ears on a slow, deep inhale. Hold the tension at the top.",
  },
  {
    title: "Exhale & drop",
    description:
      "Drop shoulders heavily and completely on a forceful exhale. Let the physical weight drop.",
  },
  {
    title: "Rotate",
    description:
      "Execute gentle, slow neck rotations. Focus on the sensation of release in the cervical spine.",
  },
];

export default function HeartShoulderNeckStretch() {
  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-white p-6">
      <div className="text-center">
        <h4 className="text-3xl font-bold text-[var(--text)] md:text-4xl">Shoulder & Neck stretch</h4>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Targeted cervical decompression designed to reset autonomic tone through precise kinetic
          release.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="relative overflow-hidden rounded-[24px] border border-[var(--border)] bg-[#e9e5dd] p-5">
          <span className="inline-flex rounded-full bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Est. 3 Min
          </span>
          <div className="mt-4 flex h-[260px] items-end justify-center rounded-[18px] bg-[linear-gradient(180deg,#dad4c6_0%,#bfb6a6_100%)] md:h-[300px]">
            <div className="relative h-[230px] w-[160px] md:h-[270px] md:w-[180px]">
              <div className="absolute inset-x-10 top-0 h-16 rounded-full bg-[#5b4434]" />
              <div className="absolute inset-x-12 top-12 h-20 rounded-full bg-[#f1c8a3]" />
              <div className="absolute inset-x-6 top-[88px] h-28 rounded-[60px] bg-[#2c2c2c]" />
              <div className="absolute inset-x-2 bottom-0 h-[88px] rounded-t-[40px] bg-[#1f3a52]" />
              <PersonStanding
                size={48}
                strokeWidth={1.4}
                className="absolute left-1/2 top-[90px] -translate-x-1/2 text-white/0"
              />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Kinetic sequence
          </p>
          <div className="mt-4 space-y-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="relative overflow-hidden rounded-[18px] border border-[var(--border)] bg-white p-4"
              >
                <span className="absolute left-0 top-0 h-full w-1 bg-[var(--primary)]" />
                <div className="flex items-start gap-3 pl-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--text)] text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">{step.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

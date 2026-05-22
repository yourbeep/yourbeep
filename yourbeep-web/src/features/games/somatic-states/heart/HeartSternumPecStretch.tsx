import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Hand, Pause, Play } from "lucide-react";

const HOLD_SECONDS = 60;

type Step = {
  title: string;
  description: string;
};

const steps: ReadonlyArray<Step> = [
  {
    title: "Palm placement",
    description:
      "Place both palms flat against the upper sternum, fingers pointing toward the collarbones.",
  },
  {
    title: "Lateral expansion",
    description:
      "Inhale deeply, drawing the elbows backward and expanding the chest laterally.",
  },
  {
    title: "Sustained release",
    description:
      "Apply gentle pressure and hold, focusing on the softening of the pectoral muscles.",
  },
];

export default function HeartSternumPecStretch() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      return undefined;
    }

    intervalRef.current = window.setInterval(() => {
      setElapsed((current) => {
        if (current >= HOLD_SECONDS) {
          setRunning(false);
          return HOLD_SECONDS;
        }
        return current + 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running]);

  const remaining = Math.max(0, HOLD_SECONDS - elapsed);
  const progress = elapsed / HOLD_SECONDS;
  const circumference = 2 * Math.PI * 56;

  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-white p-6">
      <div className="text-center">
        <h4 className="text-3xl font-bold text-[var(--text)] md:text-4xl">Chest opening</h4>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Open the thoracic cavity to release somatic bracing. Focus on the lengthening of the
          pectoral fibers.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div className="overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_30%_20%,#3a1f17_0%,#1a0e0a_70%)] p-6">
          <div className="flex h-full min-h-[260px] items-center justify-center rounded-[20px] bg-[radial-gradient(circle_at_center,rgba(228,148,113,0.35)_0%,rgba(60,30,18,0)_60%)] md:min-h-[300px]">
            <div className="relative flex h-44 w-44 items-center justify-center">
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,158,108,0.55)_0%,rgba(60,30,18,0)_70%)]"
                animate={{ scale: running ? [1, 1.08, 1] : 1, opacity: running ? [0.85, 1, 0.85] : 1 }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[rgba(255,158,108,0.18)] text-[#ffaf85] shadow-[inset_0_0_30px_rgba(255,158,108,0.35)]">
                <Hand size={48} strokeWidth={1.4} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
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
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 rounded-[18px] bg-white p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-xs font-bold text-[var(--primary)]">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">{step.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-[var(--border)] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                Hold duration
              </p>
              <button
                type="button"
                onClick={() => setRunning((current) => !current)}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-4 py-1.5 text-xs font-semibold text-white transition hover:-translate-y-0.5"
              >
                {running ? <Pause size={12} /> : <Play size={12} />}
                {running ? "Pause" : elapsed === 0 ? "Begin hold" : "Resume"}
              </button>
            </div>

            <div className="mt-4 flex justify-center">
              <div className="relative flex h-32 w-32 items-center justify-center">
                <svg className="-rotate-90" width="128" height="128">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="rgba(36,72,66,0.1)"
                    strokeWidth="6"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="var(--text)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - progress)}
                    animate={{ strokeDashoffset: circumference * (1 - progress) }}
                    transition={{ duration: 0.35 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-bold tabular-nums text-[var(--text)]">{remaining}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                    sec
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, Timer } from "lucide-react";

const TOTAL_SECONDS = 300;

export default function HeartRelease() {
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
        if (current >= TOTAL_SECONDS) {
          setRunning(false);
          return TOTAL_SECONDS;
        }
        return current + 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running]);

  const remaining = Math.max(0, TOTAL_SECONDS - elapsed);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const phaseLabel = !running && elapsed === 0
    ? "Ready"
    : remaining === 0
      ? "Complete"
      : "Releasing";

  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-white p-6">
      <div className="text-center">
        <h4 className="text-3xl font-bold text-[var(--text)] md:text-4xl">The Release</h4>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
          Allow the heart center to soften and expand. Breathe into the space behind the sternum.
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <div className="relative flex h-[260px] w-[260px] items-center justify-center md:h-[300px] md:w-[300px]">
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(146,194,196,0.35)_0%,rgba(255,255,255,0)_70%)]"
            animate={{ scale: running ? [1, 1.08, 1] : 1 }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-6 rounded-full border border-[rgba(20,56,76,0.12)] bg-[#cfe1de]"
            animate={{ scale: running ? [1, 1.04, 1] : 1 }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
          <motion.div
            className="relative flex h-[150px] w-[150px] items-center justify-center rounded-full bg-[#1a4a55] text-white shadow-[0_20px_40px_rgba(20,56,76,0.28)] md:h-[170px] md:w-[170px]"
            animate={{ scale: running ? [1, 1.06, 1] : 1 }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/85">
              {phaseLabel}
            </span>
          </motion.div>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)]">
          <Timer size={14} className="text-[var(--muted)]" />
          <span className="tabular-nums">
            {String(mins)}:{String(secs).padStart(2, "0")}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setRunning((current) => !current)}
          className={`mt-5 inline-flex items-center gap-2 rounded-full px-7 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 ${
            running
              ? "bg-[#f0c5b3] text-[#7a3220]"
              : "bg-[#fbdac9] text-[#7a3220]"
          }`}
        >
          {running ? <Pause size={14} /> : <Play size={14} />}
          {running ? "Pause" : elapsed === 0 ? "Begin" : remaining === 0 ? "Restart" : "Resume"}
        </button>
      </div>
    </div>
  );
}

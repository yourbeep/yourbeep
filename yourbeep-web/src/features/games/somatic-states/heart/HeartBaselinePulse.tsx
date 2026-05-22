import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Pause, Play, RotateCcw } from "lucide-react";

const TOTAL_SECONDS = 180;
const BPM_BASE = 72;
const HRV_BASE = 64;

const flowFromHrv = (hrv: number) => {
  if (hrv >= 70) return "Coherent";
  if (hrv >= 55) return "Balanced";
  if (hrv >= 42) return "Activated";
  return "Compressed";
};

export default function HeartBaselinePulse() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [bpm, setBpm] = useState(BPM_BASE);
  const [hrv, setHrv] = useState(HRV_BASE);
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
      setBpm((current) => Math.max(58, Math.min(92, Math.round(current + (Math.random() - 0.5) * 3))));
      setHrv((current) => Math.max(42, Math.min(82, Math.round(current + (Math.random() - 0.5) * 4))));
    }, 1000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running]);

  const remaining = Math.max(0, TOTAL_SECONDS - elapsed);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const flowState = flowFromHrv(hrv);

  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-[linear-gradient(180deg,#f7faf8_0%,#ffffff_100%)] p-6">
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          Heart practice
        </p>
        <h4 className="mt-2 text-3xl font-bold text-[var(--text)] md:text-4xl">
          Baseline pulse awareness
        </h4>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
          “Place your hand over your heart. Observe the rhythm without judgment.”
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="flex justify-center">
          <div className="relative flex h-[260px] w-[260px] items-center justify-center rounded-full bg-white shadow-[0_28px_56px_rgba(36,72,66,0.08)] md:h-[320px] md:w-[320px]">
            <motion.div
              className="absolute inset-3 rounded-full bg-[radial-gradient(circle_at_center,#dff0e8_0%,#ffffff_72%)]"
              animate={{ scale: running ? [1, 1.04, 1] : 1 }}
              transition={{ duration: 60 / Math.max(40, bpm), repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="relative flex h-[112px] w-[112px] items-center justify-center rounded-full bg-[#bfe2d4] text-[#1f5b4f] shadow-inner"
              animate={{ scale: running ? [1, 1.08, 1] : 1 }}
              transition={{ duration: 60 / Math.max(40, bpm), repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart size={36} strokeWidth={1.6} className="fill-[#bfe2d4] text-[#1f5b4f]" />
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="text-4xl font-bold tabular-nums text-[var(--text)] md:text-5xl">
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Estimated duration
          </p>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setRunning((current) => !current)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--text)] text-white transition hover:-translate-y-0.5"
              aria-label={running ? "Pause baseline" : "Begin baseline"}
            >
              {running ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setElapsed(0);
                setBpm(BPM_BASE);
                setHrv(HRV_BASE);
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] transition hover:border-[var(--primary)] hover:bg-[#f4faf7]"
              aria-label="Reset baseline"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-4 border-t border-[var(--border)] pt-5 text-center lg:text-left">
            <div>
              <p className="text-2xl font-bold tabular-nums text-[var(--text)]">{bpm}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                BPM
              </p>
            </div>
            <div className="border-l border-[var(--border)] lg:pl-4">
              <p className="text-2xl font-bold tabular-nums text-[var(--text)]">
                {hrv}
                <span className="ml-0.5 text-sm font-semibold text-[var(--muted)]">ms</span>
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                HRV
              </p>
            </div>
            <div className="border-l border-[var(--border)] lg:pl-4">
              <p className="text-sm font-bold uppercase tracking-[0.1em] text-[var(--text)]">
                {flowState}
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                Flow state
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

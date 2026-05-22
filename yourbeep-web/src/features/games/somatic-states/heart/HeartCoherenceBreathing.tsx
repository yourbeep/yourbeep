import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";

const TOTAL_SECONDS = 165;
const TOTAL_CYCLES = 18;
const CYCLE_SECONDS = Math.round(TOTAL_SECONDS / TOTAL_CYCLES);
const PATH_CYCLE_MS = 9000;

const WAVE_WIDTH = 560;
const WAVE_HEIGHT = 200;
const WAVE_BASELINE = WAVE_HEIGHT / 2;
const WAVE_AMPLITUDE = 78;
const WAVES = 2.2;

const wavePath = (() => {
  const steps = 120;
  let d = "";
  for (let index = 0; index <= steps; index += 1) {
    const t = index / steps;
    const x = t * WAVE_WIDTH;
    const y = WAVE_BASELINE - Math.sin(t * Math.PI * WAVES) * WAVE_AMPLITUDE;
    d += `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return d.trim();
})();

const samplePoint = (progress: number) => {
  const t = ((progress % 1) + 1) % 1;
  const x = t * WAVE_WIDTH;
  const y = WAVE_BASELINE - Math.sin(t * Math.PI * WAVES) * WAVE_AMPLITUDE;
  return { x, y };
};

const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

type BreathDotProps = {
  progress: ReturnType<typeof useMotionValue<number>>;
  offset: number;
  size: number;
};

function BreathDot({ progress, offset, size }: BreathDotProps) {
  const left = useTransform(progress, (value) => {
    const point = samplePoint(value + offset);
    return `${(point.x / WAVE_WIDTH) * 100}%`;
  });
  const top = useTransform(progress, (value) => {
    const point = samplePoint(value + offset);
    return `${(point.y / WAVE_HEIGHT) * 100}%`;
  });

  return (
    <motion.div
      className="pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_32%_28%,#9adcf0_0%,#4a9cb5_52%,#1f667a_100%)] shadow-[0_12px_28px_rgba(58,138,161,0.35)]"
      style={{
        width: size,
        height: size,
        left,
        top,
        x: "-50%",
        y: "-50%",
      }}
    />
  );
}

export default function HeartCoherenceBreathing() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const pathStartRef = useRef<number | null>(null);
  const pathProgress = useMotionValue(0);
  const runningRef = useRef(false);

  runningRef.current = running;

  useAnimationFrame((time) => {
    if (!runningRef.current) return;

    if (pathStartRef.current === null) {
      pathStartRef.current = time;
    }

    const elapsedMs = time - pathStartRef.current;
    const linear = (elapsedMs % PATH_CYCLE_MS) / PATH_CYCLE_MS;
    pathProgress.set(easeInOutSine(linear));
  });

  useEffect(() => {
    if (!running) {
      pathStartRef.current = null;
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
  const cycle = Math.min(TOTAL_CYCLES, Math.floor(elapsed / CYCLE_SECONDS) + (running ? 1 : 0));

  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-[linear-gradient(180deg,#f7faf8_0%,#ffffff_100%)] p-6">
      <div className="text-center">
        <h4 className="text-3xl font-bold text-[var(--text)] md:text-4xl">Coherence Breathing</h4>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
          “Inhale deeply through the heart… Exhale, letting go of resistance.”
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <div className="relative w-full max-w-[640px]">
          <svg
            viewBox={`0 0 ${WAVE_WIDTH} ${WAVE_HEIGHT}`}
            className="h-auto w-full"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <path
              d={wavePath}
              fill="none"
              stroke="#1a3c4a"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <BreathDot progress={pathProgress} offset={0} size={36} />
          <BreathDot progress={pathProgress} offset={0.22} size={20} />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <div className="min-w-[7.5rem] rounded-2xl border border-[var(--border)] bg-white px-5 py-3 text-center shadow-[0_8px_18px_rgba(36,72,66,0.06)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Remaining
          </p>
          <p className="mt-0.5 text-xl font-bold tabular-nums text-[var(--text)]">
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </p>
        </div>
        <div className="min-w-[7.5rem] rounded-2xl border border-[var(--border)] bg-white px-5 py-3 text-center shadow-[0_8px_18px_rgba(36,72,66,0.06)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Cycles
          </p>
          <p className="mt-0.5 text-xl font-bold tabular-nums text-[var(--text)]">
            {Math.min(cycle, TOTAL_CYCLES)}/{TOTAL_CYCLES}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setRunning((current) => !current)}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
        >
          {running ? <Pause size={16} /> : <Play size={16} />}
          {running ? "Pause" : elapsed === 0 ? "Begin cycle" : "Resume"}
        </button>
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            setElapsed(0);
            pathProgress.set(0);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--primary)] hover:bg-[#f4faf7]"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </div>
  );
}

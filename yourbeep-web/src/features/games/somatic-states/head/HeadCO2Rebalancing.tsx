import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";

const TOTAL_SECONDS = 45;

const phases = [
  {
    label: "Breathe Out",
    sublabel: "Let the exhale be slower and quieter than the inhale.",
    duration: 4,
    fillFrom: "#9ad6c9",
    fillTo: "#4a9d87",
  },
  {
    label: "Hold",
    sublabel: "Relax shoulders and keep the jaw soft.",
    duration: 4,
    fillFrom: "#72bca9",
    fillTo: "#2a5248",
  },
  {
    label: "Breathe In",
    sublabel: "Inhale lightly without lifting into the upper chest.",
    duration: 4,
    fillFrom: "#4a9d87",
    fillTo: "#9ad6c9",
  },
];

const rhythmSteps = [
  {
    icon: "↑",
    label: "Inhale",
    desc: "Lightly through the nose for 4 seconds.",
  },
  {
    icon: "●",
    label: "Hold (Current)",
    desc: "Relax shoulders. Notice the gentle urge to breathe.",
  },
  {
    icon: "↓",
    label: "Release",
    desc: "Softly exhale for 6 seconds, letting go of tension.",
  },
];

const CAPSULE_TOP = [0, 166, 332];
const CAPSULE_HEIGHT = 150;
const CIRCLE_SIZE = 48;
const CIRCLE_PADDING = 12;

export default function HeadCO2Rebalancing() {
  const [playing, setPlaying] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseSeconds, setPhaseSeconds] = useState(0);
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const circleYMotion = useMotionValue(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setPhaseSeconds((cur) => {
        const duration = phases[phaseIndex].duration;

        if (cur + 1 >= duration) {
          setPhaseIndex((p) => (p + 1) % phases.length);
          return 0;
        }

        return cur + 1;
      });

      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phaseIndex, playing]);

  const phase = phases[phaseIndex];
  const capsuleRatio = phaseSeconds / phase.duration;

  const movementRange = CAPSULE_HEIGHT - CIRCLE_SIZE - CIRCLE_PADDING * 2;

  const circleY =
    CAPSULE_TOP[phaseIndex] + CIRCLE_PADDING + capsuleRatio * movementRange;

  // Smoothly animate the circle position
  useEffect(() => {
    circleYMotion.set(circleY);
  }, [circleY, circleYMotion]);

  return (
    <div className="relative m-6 flex min-h-screen items-center justify-center overflow-hidden rounded-4xl bg-white px-6 py-14">
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[#3a7d6a]">
            Breath regulation
          </p>

          <h1 className="text-[38px] font-bold leading-tight tracking-tight text-[#1a2e2a]">
            CO₂ <span className="text-[#3a7d6a]">Rebalancing</span>
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#1a2e2a]/50">
            Slow the breathing pattern and lengthen the exhale so the nervous
            system can come back into better rhythm.
          </p>
        </motion.div>

        <motion.div className="mb-10 text-[56px] font-bold leading-none text-[#1a2e2a] tabular-nums">
          {`00:${String(remaining).padStart(2, "0")}`}
        </motion.div>

        <div className="flex w-full items-start gap-8">
          <div className="flex items-start gap-5">
            <div className="relative" style={{ width: 64, height: 482 }}>
              {phases.map((p, i) => (
                <div
                  key={p.label}
                  className="absolute left-0 overflow-hidden rounded-full transition-colors duration-300"
                  style={{
                    width: 64,
                    height: CAPSULE_HEIGHT,
                    top: CAPSULE_TOP[i],
                    background:
                      phaseIndex === i
                        ? "rgba(58,125,106,0.14)"
                        : "rgba(58,125,106,0.08)",
                  }}
                />
              ))}

              <motion.div
                className="absolute left-1/2 z-20 rounded-full shadow-lg"
                style={{
                  width: CIRCLE_SIZE,
                  height: CIRCLE_SIZE,
                  x: "-50%",
                  top: circleYMotion,
                  background: phase.fillTo,
                }}
              />
            </div>

            <div className="flex flex-col" style={{ gap: 16 }}>
              {phases.map((p, i) => (
                <div
                  key={p.label}
                  className="flex flex-col justify-center"
                  style={{ height: CAPSULE_HEIGHT }}
                >
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={phaseIndex === i ? "active" : "inactive"}
                      className={`text-lg font-bold leading-tight transition-colors duration-300 ${
                        phaseIndex === i
                          ? "text-[#1a2e2a]"
                          : "text-[#1a2e2a]/35"
                      }`}
                    >
                      {p.label}
                    </motion.p>
                  </AnimatePresence>

                  <p
                    className={`mt-1 max-w-[160px] text-xs leading-relaxed text-[#1a2e2a] transition-opacity duration-300 ${
                      phaseIndex === i ? "opacity-60" : "opacity-25"
                    }`}
                  >
                    {p.sublabel}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 rounded-2xl border border-[rgba(26,46,42,0.12)] bg-white/70 p-5 backdrop-blur-sm">
            <p className="mb-4 text-sm font-bold text-[#1a2e2a]">The rhythm</p>

            <div className="space-y-4">
              {rhythmSteps.map((step, i) => (
                <div key={step.label} className="flex items-start gap-3">
                  <div
                    className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{
                      background:
                        phaseIndex === i ? "#3a7d6a" : "rgba(58,125,106,0.25)",
                    }}
                  >
                    {i + 1}
                  </div>

                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        phaseIndex === i
                          ? "text-[#1a2e2a]"
                          : "text-[#1a2e2a]/40"
                      }`}
                    >
                      {step.label}
                    </p>

                    <p
                      className={`mt-0.5 text-xs leading-relaxed ${
                        phaseIndex === i
                          ? "text-[#1a2e2a]/60"
                          : "text-[#1a2e2a]/25"
                      }`}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <motion.button
                className="flex-1 rounded-full bg-[#3a7d6a] py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-[0_4px_16px_rgba(58,125,106,0.28)]"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPlaying((p) => !p)}
              >
                {playing ? "Pause" : "Play / Resume"}
              </motion.button>

              <motion.button
                className="rounded-full border border-[rgba(26,46,42,0.2)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#1a2e2a]"
                whileHover={{ borderColor: "#3a7d6a" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setPlaying(false);
                  setPhaseIndex(0);
                  setPhaseSeconds(0);
                  setRemaining(TOTAL_SECONDS);
                }}
              >
                Reset
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={phaseIndex}
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3a7d6a]">
              {phase.label}
            </span>

            <span className="mx-3 text-[#1a2e2a]/20">·</span>

            <span className="text-xs text-[#1a2e2a]/45">
              {phaseSeconds + 1} / {phase.duration}s
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

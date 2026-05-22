import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_SECONDS = 60;

export default function HeadAwarenessTest() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [breathIn, setBreathIn] = useState(true);
  const intervalRef = useRef(null);
  const breathRef = useRef(null);

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      clearInterval(breathRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= TOTAL_SECONDS) {
          setRunning(false);
          return TOTAL_SECONDS;
        }
        return prev + 1;
      });
    }, 1000);

    setBreathIn(true);
    breathRef.current = setInterval(() => {
      setBreathIn((b) => !b);
    }, 4000);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(breathRef.current);
    };
  }, [running]);

  const remaining = Math.max(0, TOTAL_SECONDS - elapsed);
  const progress = elapsed / TOTAL_SECONDS;
  const isDone = remaining === 0 && elapsed > 0;

  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const rings = [
    {
      size: 300,
      opacity: 0.1,
      scaleExpand: 1.07,
      scaleContract: 0.96,
      duration: 4.2,
    },
    {
      size: 240,
      opacity: 0.16,
      scaleExpand: 1.1,
      scaleContract: 0.94,
      duration: 3.8,
    },
    {
      size: 185,
      opacity: 0.22,
      scaleExpand: 1.13,
      scaleContract: 0.92,
      duration: 3.5,
    },
  ];

  return (
    <div className="min-h-screen bg-white rounded-4xl flex items-center justify-center relative overflow-hidden px-6 py-12">
      <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-[#1a2e2a] mb-4">
            The 60-second
            <span className="text-[#3a7d6a]"> cognitive check.</span>
          </h1>
          <p className="text-sm text-[#1a2e2a]/50 leading-relaxed">
            Let the headspace settle without trying to fix it.
            <br />
            Observe clarity, speed, and internal pressure.
          </p>
        </motion.div>

        {/* Orb area */}
        <div
          className="relative flex items-center justify-center mb-10"
          style={{ width: 320, height: 320 }}
        >
          {/* Breathing rings */}
          {rings.map((ring, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: ring.size,
                height: ring.size,
                backgroundColor: `rgba(58,125,106,${ring.opacity})`,
              }}
              animate={
                running
                  ? { scale: breathIn ? ring.scaleExpand : ring.scaleContract }
                  : { scale: 1 }
              }
              transition={{
                duration: ring.duration,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            />
          ))}

          {/* Progress ring SVG */}
          <svg
            width={260}
            height={260}
            viewBox="0 0 260 260"
            className="absolute z-10"
          >
            <circle
              cx={130}
              cy={130}
              r={radius}
              fill="none"
              stroke="rgba(58,125,106,0.13)"
              strokeWidth={9}
            />
            <motion.circle
              cx={130}
              cy={130}
              r={radius}
              fill="none"
              stroke="#3a7d6a"
              strokeWidth={9}
              strokeDasharray={circumference}
              strokeLinecap="round"
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ rotate: -90, transformOrigin: "130px 130px" }}
            />
          </svg>

          {/* Inner orb */}
          <div
            className="absolute z-20 flex items-center justify-center overflow-hidden rounded-full"
            style={{ width: 148, height: 148 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-[#2a5248]"
              animate={
                running ? { scale: breathIn ? 1.06 : 0.95 } : { scale: 1 }
              }
              transition={{ duration: 4, ease: "easeInOut" }}
            />
            <div className="relative z-10 flex flex-col items-center gap-0.5">
              <AnimatePresence mode="wait">
                <motion.span
                  key={isDone ? "done" : running ? "observe" : "ready"}
                  className="text-[10px] tracking-[0.2em] uppercase text-white/50"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDone ? "Complete" : running ? "Observe" : "Ready"}
                </motion.span>
              </AnimatePresence>

              <span className="text-[22px] font-bold text-white tabular-nums leading-none">
                {`00:${String(remaining).padStart(2, "0")}`}
              </span>

              <AnimatePresence>
                {running && (
                  <motion.span
                    className="text-[9px] tracking-[0.14em] uppercase text-white/35 italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {breathIn ? "breathe in" : "breathe out"}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Remaining counter */}
        <div className="flex items-baseline gap-2 mb-10">
          <AnimatePresence mode="wait">
            <motion.span
              key={remaining}
              className="text-[44px] font-bold text-[#1a2e2a] leading-none"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
            >
              {remaining}
            </motion.span>
          </AnimatePresence>
          <span className="text-xs tracking-[0.16em] uppercase text-[#1a2e2a]/40">
            remaining
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap justify-center">
          <motion.button
            className="bg-[#3a7d6a] text-white rounded-full px-9 py-3.5 text-xs tracking-[0.16em] uppercase font-semibold shadow-[0_4px_20px_rgba(58,125,106,0.3)]"
            whileHover={{
              y: -2,
              boxShadow: "0 8px 28px rgba(58,125,106,0.38)",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setElapsed(0);
              setRunning(true);
            }}
          >
            {isDone ? "Restart" : running ? "Restart" : "Begin"}
          </motion.button>

          <motion.button
            className={`rounded-full border border-[#1a2e2a]/20 px-9 py-3.5 text-xs tracking-[0.16em] uppercase font-semibold text-[#1a2e2a] ${
              isDone && !running
                ? "opacity-40 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            whileHover={!isDone ? { borderColor: "#3a7d6a" } : {}}
            whileTap={!isDone ? { scale: 0.97 } : {}}
            onClick={() => !isDone && setRunning((r) => !r)}
          >
            {running ? "Pause" : "Resume"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

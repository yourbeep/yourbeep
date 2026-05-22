import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import HandsLegsTimerCard from "./HandsLegsTimerCard";

const TOTAL_SECONDS = 60;

export default function HandsLegsGroundingDrill() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => {
      setElapsed((current) => {
        if (current >= TOTAL_SECONDS) {
          setRunning(false);
          return TOTAL_SECONDS;
        }
        return current + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const remaining = Math.max(0, TOTAL_SECONDS - elapsed);
  const progress = elapsed / TOTAL_SECONDS;

  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-[#f9f8f3] px-6 py-8 md:px-10 md:py-10">
      <div className="text-center">
        <h4 className="text-[2rem] font-bold text-[#1a3c4a] md:text-[2.35rem]">Grounding Drill</h4>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-[#5a6b6f]">
          Press the feet and hands into support. Let gravity register before the next breath.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl items-center gap-8 md:grid-cols-2 md:gap-10">
        <div className="flex justify-center">
          <div className="relative flex aspect-square w-full max-w-[15rem] items-end justify-center rounded-[2rem] bg-[#ece8df] p-6 sm:max-w-[16rem]">
            <div className="absolute inset-x-8 bottom-8 h-3 rounded-full bg-[#1a3c4a]/20" />
            {[0, 1].map((index) => (
              <motion.div
                key={index}
                className="mx-3 h-16 w-10 rounded-t-[1.25rem] bg-[#1a3c4a]"
                animate={{ scaleY: running ? [1, 0.92, 1] : 1 }}
                transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.3 }}
                style={{ transformOrigin: "bottom" }}
              />
            ))}
            <motion.div
              className="absolute top-10 h-14 w-14 rounded-full border-4 border-[#1a3c4a]/25 bg-[#d9edf8]"
              animate={{ y: running ? [0, -4, 0] : 0 }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <HandsLegsTimerCard
            instruction="Feel contact through the soles and palms. Stay with pressure, temperature, and weight without trying to change anything."
            remaining={remaining}
            progress={progress}
          />
          <button
            type="button"
            onClick={() => setRunning((current) => !current)}
            className="w-full rounded-full bg-[#1a3c4a] py-2.5 text-sm font-semibold text-white transition hover:bg-[#14303a]"
          >
            {running ? "Pause" : elapsed === 0 ? "Begin drill" : "Resume"}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import footPressureSteps from "../../../../assets/games/hands-legs/foot-pressure-steps.png";
import HandsLegsTimerCard from "./HandsLegsTimerCard";

const TOTAL_SECONDS = 60;

export default function HandsLegsRhythmicGrounding() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsed((current) => (current >= TOTAL_SECONDS ? TOTAL_SECONDS : current + 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const remaining = Math.max(0, TOTAL_SECONDS - elapsed);
  const progress = elapsed / TOTAL_SECONDS;

  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-white px-6 py-8 md:px-10 md:py-10">
      <div className="text-center">
        <h4 className="text-[2rem] font-bold text-[#1a3c4a] md:text-[2.35rem]">Rhythmic Grounding</h4>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-[#5a6b6f]">
          Assess for neuro-somatic dorsal-vagal response.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl items-center gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.72fr)] lg:gap-10">
        <div className="overflow-hidden rounded-[1.15rem] bg-[#f3efe6]">
          <img
            src={footPressureSteps}
            alt="Foot pressure progression from heel to toe"
            className="block h-auto w-full object-contain"
          />
        </div>

        <HandsLegsTimerCard
          instruction="Shift weight slowly from heel to toe. Feel the resonance of the earth anchor your feet."
          remaining={remaining}
          progress={progress}
          className="mx-auto w-full max-w-[320px] lg:mx-0 lg:justify-self-end"
        />
      </div>
    </div>
  );
}

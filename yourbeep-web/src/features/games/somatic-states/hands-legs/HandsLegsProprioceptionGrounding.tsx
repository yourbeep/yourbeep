import { useEffect, useState } from "react";
import proprioceptionTorso from "../../../../assets/games/hands-legs/proprioception-torso.png";
import HandsLegsTimerCard from "./HandsLegsTimerCard";

const TOTAL_SECONDS = 60;

export default function HandsLegsProprioceptionGrounding() {
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
        <h4 className="mx-auto max-w-md text-[2rem] font-bold leading-tight text-[#1a3c4a] md:text-[2.35rem]">
          Proprioception Grounding
        </h4>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.78fr)] lg:gap-10">
        <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[1.15rem] bg-[#111] lg:max-w-none">
          <img
            src={proprioceptionTorso}
            alt="Anatomical joint map — tap each highlighted joint"
            className="block h-auto w-full object-contain"
          />
        </div>

        <HandsLegsTimerCard
          instruction="Tap each highlighted joint. Close your eyes and visualize the exact position of your limbs in space."
          remaining={remaining}
          progress={progress}
          className="mx-auto w-full max-w-[320px] lg:mx-0 lg:justify-self-end"
        />
      </div>
    </div>
  );
}

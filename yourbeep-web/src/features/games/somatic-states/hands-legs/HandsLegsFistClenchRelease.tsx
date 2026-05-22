import { Brain } from "lucide-react";
import fistClenchCard from "../../../../assets/games/hands-legs/fist-clench-card.png";

export default function HandsLegsFistClenchRelease() {
  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-white px-6 py-8 md:px-10 md:py-10">
      <div className="text-center">
        <h4 className="text-[2rem] font-bold leading-tight text-[#1a3c4a] md:text-[2.35rem]">
          Fist Clench &amp; Release
        </h4>
      </div>

      <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center lg:gap-12">
        <div className="w-full max-w-[320px] shrink-0">
          <img
            src={fistClenchCard}
            alt="Clenched fist exercise — inhale to clench for 5 seconds, exhale to release"
            className="h-auto w-full rounded-[1.35rem] shadow-[0_16px_40px_rgba(36,72,66,0.1)]"
          />
        </div>

        <div className="w-full max-w-[420px] lg:pt-1">
          <div className="rounded-[1.25rem] bg-[#f5f5f5] px-5 py-5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d9edf8] text-[#1a3c4a]">
                <Brain size={18} strokeWidth={2} />
              </div>
              <div>
                <p className="text-base font-bold text-[#1a3c4a]">Neural Mechanism</p>
                <p className="mt-2 text-sm leading-7 text-[#5a6b6f]">
                  Releasing instant tension through somatic awareness forces nervous system
                  regulation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

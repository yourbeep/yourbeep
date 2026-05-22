import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronsRight, Square } from "lucide-react";

type VulnerabilityKey = "expansion_vulnerable" | "purge_dramatic";
type Level = 1 | 2 | 3;

const questions: ReadonlyArray<{ key: VulnerabilityKey; prompt: string }> = [
  { key: "expansion_vulnerable", prompt: "Did expansion feel vulnerable?" },
  { key: "purge_dramatic", prompt: "Did the purge get more dramatic?" },
];

/** Dot anchor (% from top of bar stack) per active level — aligned to each pill center */
const dotAnchor: Record<Level, number> = {
  3: 14,
  2: 46,
  1: 82,
};

type YesNoToggleProps = {
  value: "yes" | "no";
  onChange: (value: "yes" | "no") => void;
  layoutId: string;
};

function YesNoToggle({ value, onChange, layoutId }: YesNoToggleProps) {
  return (
    <div className="inline-flex overflow-hidden rounded-full" role="group">
      {(["yes", "no"] as const).map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`relative min-w-[4.25rem] px-5 py-2 text-sm font-semibold capitalize transition-colors ${
              active ? "text-white" : "text-white/95"
            }`}
          >
            {active ? (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 bg-[#1a3c4a]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            ) : (
              <span className="absolute inset-0 bg-[#c5ccc9]" />
            )}
            <span className="relative z-[1]">{option}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function HeartExpansionAllowance() {
  const [activeLevel, setActiveLevel] = useState<Level>(1);
  const [running, setRunning] = useState(false);
  const [answers, setAnswers] = useState<Record<VulnerabilityKey, "yes" | "no">>({
    expansion_vulnerable: "yes",
    purge_dramatic: "yes",
  });
  const cycleRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      if (cycleRef.current) window.clearInterval(cycleRef.current);
      return undefined;
    }

    cycleRef.current = window.setInterval(() => {
      setActiveLevel((current) => (current >= 3 ? 1 : ((current + 1) as Level)));
    }, 4800);

    return () => {
      if (cycleRef.current) window.clearInterval(cycleRef.current);
    };
  }, [running]);

  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-[#f7f5ee] p-6 md:p-8">
      <div className="text-center">
        <h4 className="text-[2rem] font-bold leading-tight text-[#1a3c4a] md:text-[2.35rem]">
          Expansion Allowance
        </h4>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#5a6b6f]">
          Allow the heart center to soften and expand. Breathe into the space behind the sternum.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
        {/* Left — overlapping level pills */}
        <div className="flex justify-center lg:justify-end">
          <div className="flex items-stretch gap-5">
            <div className="relative h-[21rem] w-[4.5rem] md:h-[23rem] md:w-[5rem]">
              {/* Level 3 — pale top pill */}
              <div className="absolute inset-x-0 top-0 h-[34%] rounded-full bg-[#d9edf8]/95 shadow-[inset_0_-2px_6px_rgba(255,255,255,0.5)]" />
              {/* Level 2 — middle pill, overlaps */}
              <div className="absolute inset-x-0 top-[22%] h-[42%] rounded-full bg-[#9ad4f7]/90 shadow-[0_8px_20px_rgba(90,180,220,0.18)]" />
              {/* Level 1 — bottom pill, brightest */}
              <div className="absolute inset-x-0 bottom-0 h-[48%] rounded-full bg-[#5cb1e5] shadow-[0_10px_24px_rgba(70,160,210,0.28)]" />

              <motion.div
                aria-hidden
                className="absolute left-1/2 z-10 h-10 w-10 -translate-x-1/2 rounded-full bg-[#1a3c4a] shadow-[0_8px_20px_rgba(26,60,74,0.35)]"
                animate={{ top: `calc(${dotAnchor[activeLevel]}% - 20px)` }}
                transition={{ type: "spring", stiffness: 70, damping: 16, mass: 0.9 }}
              />
            </div>

            <div className="relative h-[21rem] w-[5.5rem] md:h-[23rem]">
              <button
                type="button"
                onClick={() => setActiveLevel(3)}
                className="absolute left-0 top-[10%] text-left text-base font-bold text-[#1a3c4a]"
              >
                Level 3
              </button>
              <button
                type="button"
                onClick={() => setActiveLevel(2)}
                className="absolute left-0 top-[42%] text-left text-base font-bold text-[#1a3c4a]"
              >
                Level 2
              </button>
              <button
                type="button"
                onClick={() => setActiveLevel(1)}
                className="absolute left-0 top-[76%] text-left text-base font-bold text-[#1a3c4a]"
              >
                Level 1
              </button>
            </div>
          </div>
        </div>

        {/* Right — vulnerability check */}
        <div className="lg:pl-2">
          <p className="text-lg font-bold text-[#1a3c4a]">Vulnerability Check</p>

          <div className="mt-6 space-y-7">
            {questions.map((question) => (
              <div key={question.key}>
                <p className="text-base font-semibold text-[#1a3c4a]">{question.prompt}</p>
                <div className="mt-3">
                  <YesNoToggle
                    value={answers[question.key]}
                    onChange={(value) =>
                      setAnswers((current) => ({ ...current, [question.key]: value }))
                    }
                    layoutId={`expansion-yesno-${question.key}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setActiveLevel(1);
              }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eceae4] text-[#1a3c4a] transition hover:bg-[#e2e0da]"
              aria-label="Stop"
            >
              <Square size={13} fill="currentColor" strokeWidth={0} />
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(true);
                setActiveLevel((current) => (current >= 3 ? 1 : ((current + 1) as Level)));
              }}
              className="inline-flex min-w-[10rem] flex-1 items-center justify-center gap-1 rounded-full border-2 border-[#1a3c4a] bg-transparent px-8 py-2.5 text-sm font-semibold text-[#1a3c4a] transition hover:bg-white/40 sm:flex-none"
            >
              Skip
              <ChevronsRight size={18} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

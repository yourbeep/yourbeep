import { useState } from "react";
import { motion } from "framer-motion";
import activationGuideMan from "../../../../assets/games/heart/activation-guide-man.png";

type SignalKey = "feelings" | "breath" | "neck_shoulder";
type Verdict = "excitement" | "threat";

const signals: ReadonlyArray<{ key: SignalKey; label: string }> = [
  { key: "feelings", label: "Feelings" },
  { key: "breath", label: "Notice your breath" },
  { key: "neck_shoulder", label: "Neck & shoulder" },
];

type VerdictToggleProps = {
  value: Verdict;
  onChange: (value: Verdict) => void;
  layoutId: string;
};

function VerdictToggle({ value, onChange, layoutId }: VerdictToggleProps) {
  return (
    <div className="inline-flex w-full max-w-[17.5rem] overflow-hidden rounded-full" role="group">
      {(["excitement", "threat"] as const).map((option) => {
        const active = value === option;
        const label = option === "excitement" ? "Excitement" : "Threat";

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`relative flex-1 px-4 py-2.5 text-sm font-semibold transition-colors ${
              active ? "text-white" : "text-[#5a6b6f]"
            }`}
          >
            {active ? (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 bg-[#1a4d57]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            ) : (
              <span className="absolute inset-0 bg-[#c5ccc9]" />
            )}
            <span className="relative z-[1]">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function HeartActivationDifferentiation() {
  const [picks, setPicks] = useState<Record<SignalKey, Verdict>>({
    feelings: "excitement",
    breath: "excitement",
    neck_shoulder: "excitement",
  });

  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-white p-6 md:p-8">
      <span className="inline-flex rounded-md bg-[#eceae4] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a8582]">
        Diagnostic protocol
      </span>

      <div className="mt-5">
        <h4 className="text-[1.75rem] font-bold leading-tight text-[#1a2e35] md:text-[2rem]">
          Differentiating Activation
        </h4>
        <p className="mt-2 max-w-2xl text-base leading-7 text-[#7a8582]">
          Determine if the heart activation is physiological or emotional.
        </p>
      </div>

      <div className="mt-7 overflow-hidden rounded-[1.75rem] border border-[#ffd8c4] bg-[#fff9f6] p-6 md:p-8">
        <p className="text-sm leading-6 text-[#8a9491]">
          Areas of highest cognitive or emotional resonance.
        </p>

        <div className="mt-6 flex justify-center">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:gap-4 md:gap-5">
            <div className="w-fit shrink-0 space-y-6">
              {signals.map((signal, index) => (
                <motion.div
                  key={signal.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <p className="text-base font-bold text-[#1a4d57]">{signal.label}</p>
                  <div className="mt-2.5">
                    <VerdictToggle
                      value={picks[signal.key]}
                      onChange={(verdict) =>
                        setPicks((current) => ({ ...current, [signal.key]: verdict }))
                      }
                      layoutId={`activation-verdict-${signal.key}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12, duration: 0.35 }}
              className="shrink-0"
            >
              <img
                src={activationGuideMan}
                alt=""
                aria-hidden
                className="h-[11.5rem] w-auto object-contain object-bottom sm:h-[13.5rem]"
              />
            </motion.div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-sm leading-6 text-[#8a9491]">
        Excitement usually includes expansion and muscle fluidity. Threat includes muscle
        contraction.
      </p>
    </div>
  );
}

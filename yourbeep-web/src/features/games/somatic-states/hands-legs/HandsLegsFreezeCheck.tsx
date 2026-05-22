import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Hand, Thermometer } from "lucide-react";

type Temperature = "cold" | "neutral" | "warm";

const temperatureOptions: ReadonlyArray<{ value: Temperature; label: string }> = [
  { value: "cold", label: "Cold" },
  { value: "neutral", label: "Neutral" },
  { value: "warm", label: "Warm" },
];

function StepCard({
  stepLabel,
  title,
  description,
  icon: Icon,
  glowPosition,
  children,
  delay = 0,
}: {
  stepLabel: string;
  title: string;
  description: string;
  icon: typeof Hand;
  glowPosition: "top-right" | "bottom-right";
  children: ReactNode;
  delay?: number;
}) {
  const glowClass =
    glowPosition === "top-right"
      ? "before:absolute before:right-0 before:top-0 before:h-28 before:w-28 before:rounded-full before:bg-[radial-gradient(circle,rgba(126,207,232,0.42)_0%,transparent_70%)] before:content-['']"
      : "before:absolute before:bottom-0 before:right-0 before:h-28 before:w-28 before:rounded-full before:bg-[radial-gradient(circle,rgba(126,207,232,0.42)_0%,transparent_70%)] before:content-['']";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative flex min-h-[17.5rem] flex-col overflow-hidden rounded-[1.5rem] border border-[#e8eef0] bg-white p-6 shadow-[0_10px_28px_rgba(36,72,66,0.06)] ${glowClass}`}
    >
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#18a68e]">
            {stepLabel}
          </p>
          <p className="mt-1.5 text-lg font-bold text-[#1a2e35]">{title}</p>
        </div>
        <Icon size={18} strokeWidth={2} className="shrink-0 text-[#18a68e]" />
      </div>
      <p className="relative mt-3 flex-1 text-sm leading-7 text-[#5a6b6f]">{description}</p>
      <div className="relative mt-auto pt-5">{children}</div>
    </motion.div>
  );
}

export default function HandsLegsFreezeCheck() {
  const [temperature, setTemperature] = useState<Temperature | null>(null);
  const [taps, setTaps] = useState(0);

  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-white px-6 py-8 md:px-10 md:py-10">
      <div className="text-center">
        <h4 className="text-[2rem] font-bold text-[#1a3c4a] md:text-[2.35rem]">Freeze Check</h4>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-[#5a6b6f]">
          Assess for neuro-somatic dorsal-vagal response.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2 md:items-stretch">
        <StepCard
          stepLabel="STEP 02"
          title="Motor Initiation"
          description="Attempt a small finger tap. Notice the lag between the thought to move and the physical action."
          icon={Hand}
          glowPosition="bottom-right"
        >
          <button
            type="button"
            onClick={() => setTaps((count) => count + 1)}
            className="w-full rounded-full bg-[#ededed] py-3.5 text-sm font-medium text-[#1a2e35] transition hover:bg-[#e4e4e4]"
          >
            Tap Here{taps > 0 ? ` (${taps})` : ""}
          </button>
        </StepCard>

        <StepCard
          stepLabel="STEP 01"
          title="Core Temperature"
          description="Observe internal warmth. Rub your palms for 5–10 sec. Do you feel heat, or a cold hollowness?"
          icon={Thermometer}
          glowPosition="top-right"
          delay={0.06}
        >
          <div className="flex gap-2">
            {temperatureOptions.map((option) => {
              const active = temperature === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTemperature(option.value)}
                  className={`flex-1 rounded-full py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-[#1a3c4a] text-white"
                      : "bg-[#ededed] text-[#1a2e35] hover:bg-[#e4e4e4]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </StepCard>
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Circle, Wind } from "lucide-react";
import shoulderDropFigure from "../../../../assets/games/hands-legs/shoulder-drop-figure.png";
import ShoulderDropGlow from "./ShoulderDropGlow";

const steps = [
  {
    id: 1,
    label: "STEP 01",
    title: "Inhale",
    description: "Shrug your shoulders high towards your ears. Hold for 3 seconds.",
    icon: Wind,
  },
  {
    id: 2,
    label: "STEP 02",
    title: "Exhale",
    description: "Drop them suddenly, feeling the weight release through your fingertips.",
    icon: Circle,
  },
] as const;

export default function HandsLegsShoulderDrop() {
  const [activeStep, setActiveStep] = useState<1 | 2>(1);

  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-[#f7f7f0] px-6 py-8 md:px-10 md:py-10">
      <div className="text-center">
        <h4 className="text-[2rem] font-bold text-[#1a2e35] md:text-[2.35rem]">Shoulder Drop</h4>
      </div>

      <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center justify-center gap-10 lg:flex-row lg:items-center lg:gap-14">
        <div className="relative flex aspect-square w-[min(19rem,72vw)] shrink-0 items-center justify-center sm:w-[21rem]">
          <ShoulderDropGlow className="pointer-events-none absolute -inset-[10%] h-[120%] w-[120%]" />
          <motion.div
            className="relative z-[1] aspect-square w-full overflow-hidden rounded-full shadow-[0_24px_56px_rgba(36,72,66,0.14)]"
            animate={{ scale: activeStep === 1 ? [1, 1.015, 1] : [1, 0.985, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src={shoulderDropFigure}
              alt="Shoulder drop anatomical guide"
              className="h-full w-full object-cover object-[center_18%]"
            />
          </motion.div>
        </div>

        <div className="w-full max-w-[21rem] shrink-0 space-y-4">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={`relative w-full overflow-hidden rounded-[1.2rem] p-5 text-left transition ${
                  isActive
                    ? "border border-[#dceef4] bg-white shadow-[0_14px_32px_rgba(36,72,66,0.08)]"
                    : "border border-transparent bg-white/55"
                }`}
              >
                {isActive ? (
                  <span className="absolute bottom-4 left-0 top-4 w-[3px] rounded-full bg-[#18a68e]" />
                ) : null}

                <div className="flex items-start justify-between gap-3 pl-2">
                  <div className="min-w-0">
                    <p
                      className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                        isActive ? "text-[#18a68e]" : "text-[#c5ccc9]"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p
                      className={`mt-1.5 text-lg font-bold ${
                        isActive ? "text-[#1a2e35]" : "text-[#b8c0bd]"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p
                      className={`mt-2 text-sm leading-6 ${
                        isActive ? "text-[#5a6b6f]" : "text-[#c5ccc9]"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                  <Icon
                    size={17}
                    strokeWidth={2}
                    className={`mt-0.5 shrink-0 ${isActive ? "text-[#18a68e]" : "text-[#d0d6d3]"}`}
                  />
                </div>

                {isActive ? (
                  <div className="mt-5 flex items-center gap-1.5 pl-2">
                    <span className="h-[3px] w-[38%] rounded-full bg-[#1a3c4a]" />
                    <span className="h-[2px] flex-1 rounded-full bg-[#e8e6df]" />
                    <span className="h-[2px] flex-1 rounded-full bg-[#e8e6df]" />
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { Activity, Battery, Cloud, Droplets, Sun } from "lucide-react";

const protocolSteps = [
  {
    title: "Hydration check",
    description:
      "Drink a full glass of water to eliminate dehydration as a cognitive blocker.",
    icon: Droplets,
    color: "#4a8fa3",
  },
  {
    title: "Environmental stimulus",
    description:
      "Step outside for two minutes of direct sunlight or high-intensity ambient light.",
    icon: Sun,
    color: "#d4a843",
  },
  {
    title: "Circulation drill",
    description:
      "Do ten slow squats or calf raises to move blood and trigger a heart-rate variability response.",
    icon: Activity,
    color: "#a34a6a",
  },
] as const;

export default function HeadFogVsFatigue() {
  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-white p-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          Fatigue check
        </p>
        <h4 className="mt-2 text-2xl font-semibold text-[var(--text)]">Fog vs fatigue</h4>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Determine whether the current heaviness is driven by overload or by physiological depletion
          so the next move matches what the system actually needs.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {[
          {
            title: "Emotional fog",
            description: "Emotional overload, mental clutter, and overstimulation.",
            icon: Cloud,
          },
          {
            title: "Physiological fatigue",
            description: "Low energy, metabolic depletion, and systemic exhaustion.",
            icon: Battery,
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-[var(--text)]">{card.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{card.description}</p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[var(--primary)]">
                  <Icon size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5">
        <p className="text-sm font-semibold text-[var(--text)]">Protocol sequence</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {protocolSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="rounded-[20px] bg-white p-4"
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} style={{ color: step.color }} />
                  <p className="text-sm font-semibold text-[var(--text)]">{step.title}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

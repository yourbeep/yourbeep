import { motion } from "framer-motion";
import { Activity, Heart, HeartCrack, HeartPulse, Waves } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type HeartSomaticAssessmentProps = {
  selected: string;
  onSelect: (value: string) => void;
};

type SensationDefinition = {
  value: string;
  icon: LucideIcon;
  title: string;
  description: string;
  tone: string;
  toneColor: string;
  surface: string;
  iconColor: string;
};

const sensations: readonly SensationDefinition[] = [
  {
    value: "steady_heart_integration",
    icon: Heart,
    title: "The Steady Heart",
    description:
      "Integration. A calm, rhythmic baseline reflecting autonomic balance and coherence.",
    tone: "Healthy equilibrium",
    toneColor: "#2f8c7a",
    surface: "#e0f3ee",
    iconColor: "#2f8c7a",
  },
  {
    value: "the_release_expansion",
    icon: Waves,
    title: "The Release",
    description:
      "Expansion through the heart. Letting go of residual tension and opening neural pathways.",
    tone: "Somatic unwinding",
    toneColor: "#3a8aa1",
    surface: "#dff0f4",
    iconColor: "#3a8aa1",
  },
  {
    value: "increasing_pulse_activation",
    icon: Activity,
    title: "Increasing Pulse",
    description:
      "Healthy activation. Gradual increase in heart rate responding to physical demand or focus.",
    tone: "Adaptive stress",
    toneColor: "#b97718",
    surface: "#f6e7cf",
    iconColor: "#b97718",
  },
  {
    value: "pounding_heart_waver",
    icon: HeartPulse,
    title: "The Pounding Heart",
    description:
      "Hyper-alertness. Strong visceral feedback often associated with peak exertion or anxiety.",
    tone: "High load",
    toneColor: "#7a4423",
    surface: "#e6d8cf",
    iconColor: "#54321b",
  },
  {
    value: "heart_ache_chaos",
    icon: HeartCrack,
    title: "The Heart Ache",
    description:
      "Visceral constriction. Significant emotional or physical dissonance requiring immediate remediation.",
    tone: "Chaos and ache",
    toneColor: "#b8506a",
    surface: "#fbe1e7",
    iconColor: "#b8506a",
  },
] as const;

export default function HeartSomaticAssessment({
  selected,
  onSelect,
}: HeartSomaticAssessmentProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          Heart assessment
        </p>
        <h3 className="mt-2 text-xl font-semibold text-[var(--text)]">
          What are you noticing in the heartspace?
        </h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Tune into the rhythm and charge currently moving through the heart. Choose the signal that
          most closely matches what is alive right now.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {sensations.map((item, index) => {
          const Icon = item.icon;
          const isActive = selected === item.value;
          const isLast = index === sensations.length - 1;

          return (
            <motion.button
              key={item.value}
              type="button"
              onClick={() => onSelect(item.value)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.24 }}
              whileHover={{ y: -2 }}
              className={`group flex h-full flex-col rounded-[22px] border bg-white px-4 py-4 text-left transition ${
                isLast ? "sm:col-span-2" : ""
              } ${
                isActive
                  ? "border-[var(--primary)] bg-[var(--primary-soft)] shadow-[0_16px_36px_rgba(36,72,66,0.1)]"
                  : "border-[var(--border)] hover:border-[var(--primary)] hover:bg-[#f6fbf8]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: item.surface, color: item.iconColor }}
                >
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-[var(--text)]">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-[var(--border)] pt-3">
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: item.toneColor }}
                >
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: item.toneColor }}
                  />
                  {item.tone}
                </span>
                <span
                  aria-hidden
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                    isActive
                      ? "border-[var(--primary)] bg-[var(--primary)]"
                      : "border-[var(--border)] bg-transparent"
                  }`}
                >
                  {isActive ? (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  ) : null}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

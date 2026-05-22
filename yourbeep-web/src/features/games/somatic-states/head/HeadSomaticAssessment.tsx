import { motion } from "framer-motion";
import { Cloud, Sun, Wind } from "lucide-react";

type HeadSomaticAssessmentProps = {
  selected: string;
  onSelect: (value: string) => void;
};

const sensations = [
  {
    value: "bright_clear_focus",
    icon: Sun,
    title: "Brightness & Clear Focus",
    description:
      "A sensation of clarity, light, or sharp attention. The mind feels expansive and unburdened, like clear sky.",
  },
  {
    value: "dizzy_spacey",
    icon: Wind,
    title: "Dizzy / Spacey",
    description:
      "A feeling of disconnection, lightheadedness, or swirling energy. Grounding may feel temporarily distant or blurred.",
  },
  {
    value: "heaviness_fog",
    icon: Cloud,
    title: "Heaviness / Fog",
    description:
      "A dense, weighted sensation or a lack of clarity. Thoughts may feel slow, muddy, or submerged beneath a thick layer.",
  },
] as const;

export default function HeadSomaticAssessment({
  selected,
  onSelect,
}: HeadSomaticAssessmentProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          Head assessment
        </p>
        <h3 className="mt-2 text-xl font-semibold text-[var(--text)]">
          What are you noticing in the headspace?
        </h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Choose the sensation that best matches the quality of attention, pressure, or internal tone
          you are feeling right now.
        </p>
      </div>

      <div className="space-y-3">
        {sensations.map((item, index) => {
          const Icon = item.icon;
          const isActive = selected === item.value;

          return (
            <motion.button
              key={item.value}
              type="button"
              onClick={() => onSelect(item.value)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.24 }}
              whileHover={{ y: -2 }}
              className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${
                isActive
                  ? "border-[var(--primary)] bg-[var(--primary-soft)] shadow-[0_14px_32px_rgba(36,72,66,0.08)]"
                  : "border-[var(--border)] bg-white hover:border-[var(--primary)] hover:bg-[#f6fbf8]"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                    isActive ? "bg-[var(--primary)] text-white" : "bg-[var(--surface)] text-[var(--primary)]"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-[var(--text)]">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
                </div>
                <div
                  className={`mt-1 h-5 w-5 rounded-full border-2 ${
                    isActive
                      ? "border-[var(--primary)] bg-[var(--primary)]"
                      : "border-[var(--border)] bg-transparent"
                  }`}
                >
                  {isActive ? (
                    <div className="mx-auto mt-[3px] h-2 w-2 rounded-full bg-white" />
                  ) : null}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

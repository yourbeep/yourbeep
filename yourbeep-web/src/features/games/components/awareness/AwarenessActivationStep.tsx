import MainButton from "@components/ui/MainButton";
import { awarenessActivationCards, awarenessExpansionCards } from "./awarenessContent";
import AwarenessStepShell from "./AwarenessStepShell";

type AwarenessActivationStepProps = {
  mode: "activation" | "expansion";
  selectedValues: string[];
  submitting: boolean;
  onToggle: (value: string) => void;
  onSubmit: () => void;
  eyebrow?: string;
  currentStep?: number;
  buttonLabel?: string;
};

const copyByMode = {
  activation: {
    eyebrow: "Step 1 of 3",
    title: "Let's check your daily activation",
    description:
      "Select one or two cards that best reflect your immediate internal state. We use this to map how your system is mobilising right now.",
    button: "Save activation",
    required: "Select one or two states to continue.",
    selected: "activation states",
  },
  expansion: {
    eyebrow: "Step 2 of 3",
    title: "How does your state open or contract?",
    description:
      "Choose one or two expansion patterns that usually follow once your first state begins to move. This gives the second half of the awareness map.",
    button: "Save expansion",
    required: "Select one or two expansion states to continue.",
    selected: "expansion states",
  },
} as const;

const AwarenessActivationStep = ({
  mode,
  selectedValues,
  submitting,
  onToggle,
  onSubmit,
  eyebrow,
  currentStep,
  buttonLabel,
}: AwarenessActivationStepProps) => {
  const content = copyByMode[mode];
  const cards = mode === "activation" ? awarenessActivationCards : awarenessExpansionCards;

  return (
    <AwarenessStepShell
      eyebrow={eyebrow ?? content.eyebrow}
      title={content.title}
      description={content.description}
      currentStep={currentStep ?? (mode === "activation" ? 1 : 2)}
      progressLabel={selectedValues.length ? `${selectedValues.length} ${content.selected} selected` : content.required}
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const selected = selectedValues.includes(card.value);

          return (
            <button
              key={card.value}
              type="button"
              onClick={() => onToggle(card.value)}
              className={`relative rounded-[28px] p-6 text-left transition ${
                selected
                  ? "scale-[1.02] border-[2.5px] border-[#1a3a40] shadow-[0_8px_24px_rgba(26,58,64,0.16)]"
                  : "border-[2.5px] border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
              } ${card.card}`}
            >
              {selected ? (
                <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-[#1a3a40] text-white">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              ) : null}

              <span className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full ${card.iconWrap}`}>
                {card.icon}
              </span>

              <p className="text-[17px] font-bold leading-snug text-[#1a2e38]">
                {card.label}
              </p>
              <p className="mt-3 text-[13px] leading-6 text-[#56686a]">
                {card.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-[12px] font-medium text-[#6d7d7e]">
          {selectedValues.length ? `${selectedValues.length} selected` : content.required}
        </p>
        <MainButton
          onClick={onSubmit}
          disabled={!selectedValues.length || submitting}
        >
          {submitting ? "Saving..." : buttonLabel ?? content.button}
        </MainButton>
      </div>
    </AwarenessStepShell>
  );
};

export default AwarenessActivationStep;

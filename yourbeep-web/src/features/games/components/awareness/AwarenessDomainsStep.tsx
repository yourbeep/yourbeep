import MainButton from "@components/ui/MainButton";
import { awarenessDomainCards } from "./awarenessContent";
import AwarenessStepShell from "./AwarenessStepShell";

type AwarenessDomainsStepProps = {
  highPoints: string[];
  lowPoints: string[];
  onToggle: (domain: string, type: "high" | "low") => void;
  onContinue: () => void;
  onBack?: () => void;
  eyebrow?: string;
  title?: string;
  description?: string;
  currentStep?: number;
  continueLabel?: string;
};

const AwarenessDomainsStep = ({
  highPoints,
  lowPoints,
  onToggle,
  onContinue,
  onBack,
  eyebrow = "Step 1 of 3",
  title = "Mapping your life domains",
  description = "Choose two high points where energy feels resourced and two low points where strain is clearer. This helps the awareness summary land in real life.",
  currentStep = 1,
  continueLabel = "Save life-domain map",
}: AwarenessDomainsStepProps) => {
  const canContinue = highPoints.length === 2 && lowPoints.length === 2;

  return (
    <AwarenessStepShell
      eyebrow={eyebrow}
      title={title}
      description={description}
      currentStep={currentStep}
      progressLabel={`High ${highPoints.length}/2 | Low ${lowPoints.length}/2`}
    >
      <div className="mb-8 rounded-[20px] border border-[#f0d870] bg-[#fef8e0] px-5 py-4">
        <p className="text-[12px] font-bold text-[#c09a20]">Activity instructions</p>
        <p className="mt-1 text-[12px] leading-6 text-[#8a7a30]">
          Please choose exactly two high points and two low points. A domain cannot
          be both at the same time.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {awarenessDomainCards.map((domain) => {
          const isHigh = highPoints.includes(domain.value);
          const isLow = lowPoints.includes(domain.value);

          return (
            <div
              key={domain.value}
              className="rounded-[24px] bg-white p-5 shadow-[0_1px_6px_rgba(0,0,0,0.06)] ring-1 ring-[#edf1ee]"
            >
              <div className="mb-4">{domain.icon}</div>
              <p className="text-[15px] font-bold text-[#1a2e38]">{domain.label}</p>
              <p className="mt-2 text-[12px] leading-6 text-[#7a8a8a]">
                {domain.description}
              </p>
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => onToggle(domain.value, "high")}
                  className={`flex-1 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition ${
                    isHigh
                      ? "border-[#1a3a40] bg-[#1a3a40] text-white"
                      : "border-[#1a3a40] bg-transparent text-[#1a3a40]"
                  }`}
                >
                  High
                </button>
                <button
                  type="button"
                  onClick={() => onToggle(domain.value, "low")}
                  className={`flex-1 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition ${
                    isLow
                      ? "border-[#1a3a40] bg-[#1a3a40] text-white"
                      : "border-[#1a3a40] bg-transparent text-[#1a3a40]"
                  }`}
                >
                  Low
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="text-[14px] font-semibold text-[#2a6878] transition hover:text-[#1a3a40]"
          >
            Back
          </button>
        ) : <span />}
        <MainButton onClick={onContinue} disabled={!canContinue}>
          {continueLabel}
        </MainButton>
      </div>
    </AwarenessStepShell>
  );
};

export default AwarenessDomainsStep;

import MainButton from "@components/ui/MainButton";
import { awarenessDomainCards, awarenessRootCauseCards } from "./awarenessContent";
import AwarenessStepShell from "./AwarenessStepShell";

type AwarenessRootCauseStepProps = {
  selectedDomains: string[];
  rootCauses: Record<string, string>;
  submitting: boolean;
  onAssign: (domain: string, rootCause: string) => void;
  onBack: () => void;
  onSubmit: () => void;
};

const AwarenessRootCauseStep = ({
  selectedDomains,
  rootCauses,
  submitting,
  onAssign,
  onBack,
  onSubmit,
}: AwarenessRootCauseStepProps) => {
  const canSubmit = selectedDomains.length > 0 && selectedDomains.every((domain) => Boolean(rootCauses[domain]));

  return (
    <AwarenessStepShell
      eyebrow="Final reflection"
      title="Root cause mapping"
      description="For each selected life domain, choose the deeper origin that feels most true right now. This becomes part of the final awareness synthesis."
      currentStep={3}
      progressLabel={`${Object.keys(rootCauses).filter((key) => rootCauses[key]).length}/${selectedDomains.length} root causes mapped`}
    >
      <div className="space-y-6">
        {selectedDomains.map((domain) => {
          const domainMeta = awarenessDomainCards.find((item) => item.value === domain);

          return (
            <section key={domain} className="rounded-[26px] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] ring-1 ring-[#edf1ee]">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef3f1]">
                  {domainMeta?.icon}
                </span>
                <div>
                  <p className="text-[16px] font-bold text-[#1a2e38]">{domainMeta?.label || domain}</p>
                  <p className="text-[12px] text-[#6f7f80]">Choose the most likely deeper origin.</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {awarenessRootCauseCards.map((option) => {
                  const selected = rootCauses[domain] === option.value;

                  return (
                    <button
                      key={`${domain}-${option.value}`}
                      type="button"
                      onClick={() => onAssign(domain, option.value)}
                      className={`rounded-[20px] border p-4 text-left transition ${
                        selected
                          ? "border-[#1a3a40] shadow-[0_8px_18px_rgba(26,58,64,0.12)]"
                          : "border-transparent"
                      } ${option.tone}`}
                    >
                      <p className="text-[13px] font-bold text-[#1a2e38]">{option.label}</p>
                      <p className="mt-2 text-[12px] leading-6 text-[#5d6f70]">{option.description}</p>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="text-[14px] font-semibold text-[#2a6878] transition hover:text-[#1a3a40]"
        >
          Back
        </button>
        <MainButton
          onClick={onSubmit}
          disabled={!canSubmit || submitting}
        >
          {submitting ? "Completing..." : "Complete awareness"}
        </MainButton>
      </div>
    </AwarenessStepShell>
  );
};

export default AwarenessRootCauseStep;

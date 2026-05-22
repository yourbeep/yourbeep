import MainButton from "@components/ui/MainButton";
import { awarenessDomainCards } from "./awarenessContent";
import AwarenessStepShell from "./AwarenessStepShell";

type ResultMapping = {
  detectedState?: string;
  energyOrientation?: {
    label?: string;
    description?: string;
  };
  flowStability?: {
    label?: string;
    description?: string;
  };
  stateSynthesis?: {
    title?: string;
    description?: string;
  };
};

type AwarenessSummaryStepProps = {
  result: Record<string, unknown> | null;
  onRetake: () => void;
};

const toResultMapping = (value: unknown): ResultMapping | null =>
  value && typeof value === "object" ? (value as ResultMapping) : null;

const toStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

const AwarenessSummaryStep = ({ result, onRetake }: AwarenessSummaryStepProps) => {
  const activation = toResultMapping(result?.activationResultMapping);
  const expansion = toResultMapping(result?.expansionResultMapping);
  const summary =
    result?.summary && typeof result.summary === "object"
      ? (result.summary as Record<string, unknown>)
      : null;
  const score = typeof result?.score === "number" ? result.score : null;

  const valueSystems =
    summary?.valueSystems && typeof summary.valueSystems === "object"
      ? (summary.valueSystems as Record<string, unknown>)
      : null;
  const highPoints = toStringArray(valueSystems?.highPoints);
  const lowPoints = toStringArray(valueSystems?.lowPoints);

  return (
    <AwarenessStepShell
      eyebrow="Completed"
      title="Integrated awareness summary"
      description="This combines the life-domain map, activation map, and expansion map into one view you can return to whenever you revisit the course."
      currentStep={3}
      progressLabel={score != null ? `Final awareness score ${score.toFixed(2)}/3` : "Awareness complete"}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {[{ label: "Activation", value: activation }, { label: "Expansion", value: expansion }].map((item) => (
          <div key={item.label} className="rounded-[24px] bg-[#f7f4ed] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b8c8d]">
              {item.label}
            </p>
            <h3 className="mt-3 text-[20px] font-bold text-[#1a2e38]">
              {item.value?.detectedState || "Mapped"}
            </h3>
            <p className="mt-3 text-[13px] leading-7 text-[#586869]">
              {item.value?.stateSynthesis?.description || item.value?.energyOrientation?.description || "Your mapped summary appears here."}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-[26px] bg-[#fffafa] p-6 ring-1 ring-[#f2d8d8]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d16d6d]">
          Final synthesis
        </p>
        <h3 className="mt-3 text-[24px] font-bold text-[#1a2e38]">
          {typeof summary?.synthesis === "object" && summary.synthesis && "title" in summary.synthesis
            ? String((summary.synthesis as Record<string, unknown>).title || "Integrated Awareness Summary")
            : "Integrated Awareness Summary"}
        </h3>
        <p className="mt-3 text-[13px] leading-7 text-[#5a6a6a]">
          {typeof summary?.synthesis === "object" && summary.synthesis && "description" in summary.synthesis
            ? String((summary.synthesis as Record<string, unknown>).description || "")
            : "This summary combines activation, expansion, life-domain reflection, and root-cause assignment into one reflective snapshot."}
        </p>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-[24px] bg-white p-6 ring-1 ring-[#edf1ee]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b8e8f]">
            High points
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {highPoints.map((point) => (
              <span key={point} className="rounded-full bg-[#e7f4ef] px-4 py-2 text-[12px] font-semibold text-[#275d54]">
                {awarenessDomainCards.find((item) => item.value === point)?.label || point}
              </span>
            ))}
          </div>

          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b8e8f]">
            Low points
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {lowPoints.map((point) => (
              <span key={point} className="rounded-full bg-[#fff0ea] px-4 py-2 text-[12px] font-semibold text-[#8a5844]">
                {awarenessDomainCards.find((item) => item.value === point)?.label || point}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <MainButton onClick={onRetake} variant="outline">
          Retake awareness
        </MainButton>
      </div>
    </AwarenessStepShell>
  );
};

export default AwarenessSummaryStep;

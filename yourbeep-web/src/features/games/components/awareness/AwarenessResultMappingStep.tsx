import MainButton from "@components/ui/MainButton";
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
  metrics?: {
    sensoryLoad?: string;
    vagalInterference?: string;
  };
};

type AwarenessResultMappingStepProps = {
  mode: "activation" | "expansion";
  resultMapping: ResultMapping | null;
  onContinue: () => void;
  onBack: () => void;
  eyebrow?: string;
  title?: string;
  description?: string;
  nextLabel?: string;
  currentStep?: number;
};

const copyByMode = {
  activation: {
    eyebrow: "Step 1 result",
    title: "Your activation map",
    description:
      "Here is the first reflection from your selected activation state. Read it as a snapshot of current energy and regulation, not a fixed identity.",
    nextLabel: "Continue to expansion",
    currentStep: 1,
  },
  expansion: {
    eyebrow: "Step 2 result",
    title: "Your expansion map",
    description:
      "This second map shows how your system opens, contracts, or protects once the first activation begins to move.",
    nextLabel: "Continue to life domains",
    currentStep: 2,
  },
} as const;

const AwarenessResultMappingStep = ({
  mode,
  resultMapping,
  onContinue,
  onBack,
  eyebrow,
  title,
  description,
  nextLabel,
  currentStep,
}: AwarenessResultMappingStepProps) => {
  const content = copyByMode[mode];

  return (
    <AwarenessStepShell
      eyebrow={eyebrow ?? content.eyebrow}
      title={title ?? content.title}
      description={description ?? content.description}
      currentStep={currentStep ?? content.currentStep}
      progressLabel={resultMapping?.detectedState || "Result ready"}
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="text-[12px] font-medium text-[#8a9a9a]">Detected state</span>
        <span className="rounded-full bg-[#fce8e0] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#c06040]">
          {resultMapping?.detectedState || "State detected"}
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[24px] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-[#edf1ee]">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-[16px] font-bold text-[#1a2e38]">
              Energy Orientation: {resultMapping?.energyOrientation?.label || "Pending"}
            </h3>
            <span className="rounded-full bg-[#e7f5f1] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2a8a7a]">
              Energy
            </span>
          </div>
          <p className="mt-4 rounded-[20px] bg-[#f8faf8] p-4 text-[13px] leading-7 text-[#5a6a6a]">
            {resultMapping?.energyOrientation?.description || "Your energy description will appear here."}
          </p>
        </div>

        <div className="rounded-[24px] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-[#edf1ee]">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-[16px] font-bold text-[#1a2e38]">
              Flow Stability: {resultMapping?.flowStability?.label || "Pending"}
            </h3>
            <span className="rounded-full bg-[#fdf0f0] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d46f6f]">
              Flow
            </span>
          </div>
          <p className="mt-4 rounded-[20px] bg-[#fdf8f8] p-4 text-[13px] leading-7 text-[#5a6a6a]">
            {resultMapping?.flowStability?.description || "Your flow description will appear here."}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[26px] border border-[#f1d3d3] bg-[#fffafa] p-6">
        <div className="flex items-center gap-2">
          <div className="h-[2px] w-6 rounded bg-[#e07070]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#e07070]">
            Synthesis
          </span>
        </div>
        <h3 className="mt-4 text-[22px] font-bold text-[#1a2e38]">
          {resultMapping?.stateSynthesis?.title || "Synthesis ready"}
        </h3>
        <p className="mt-3 text-[13px] leading-7 text-[#5a6a6a]">
          {resultMapping?.stateSynthesis?.description || "The combined state explanation will appear here."}
        </p>

        <div className="mt-6 flex flex-wrap gap-8">
          <div>
            <p className="text-[24px] font-bold text-[#1a2e38]">
              {resultMapping?.metrics?.sensoryLoad || "--"}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#99aaab]">
              Sensory load
            </p>
          </div>
          <div>
            <p className="text-[24px] font-bold text-[#1a2e38]">
              {resultMapping?.metrics?.vagalInterference || "--"}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#99aaab]">
              Vagal interference
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="text-[14px] font-semibold text-[#2a6878] transition hover:text-[#1a3a40]"
        >
          Back
        </button>
        <MainButton onClick={onContinue}>
          {nextLabel ?? content.nextLabel}
        </MainButton>
      </div>
    </AwarenessStepShell>
  );
};

export default AwarenessResultMappingStep;

import { useState } from "react";
import MainButton from "@components/ui/MainButton";
import AwarenessActivationStep from "./AwarenessActivationStep";
import AwarenessDomainsStep from "./AwarenessDomainsStep";
import AwarenessResultMappingStep from "./AwarenessResultMappingStep";
import AwarenessSummaryStep from "./AwarenessSummaryStep";
import AwarenessStepShell from "../../components/awareness/AwarenessStepShell";
import type { GameSubmissionPayload } from "../../services/gameExperienceTypes";
import { isAwarenessSubActivity } from "../../services/gameSubActivities";

type AwarenessGameFormProps = {
  courseId: string;
  submitting: boolean;
  existingResult: Record<string, unknown> | null;
  initialSubActivityKey?: string | null;
  onSubmit: (payload: GameSubmissionPayload) => Promise<unknown>;
};

type AwarenessStage =
  | "domains"
  | "domains-complete"
  | "activation-select"
  | "activation-result"
  | "expansion-select"
  | "expansion-result"
  | "summary";

type AwarenessSubActivityKey =
  | "mapping_life_domains"
  | "daily_activation"
  | "expansion_check";

const toggleValue = (values: string[], next: string, max = 2) => {
  if (values.includes(next)) {
    return values.filter((value) => value !== next);
  }
  if (values.length >= max) {
    return [...values.slice(1), next];
  }
  return [...values, next];
};

const readValueSystems = (result: Record<string, unknown> | null) => {
  const summary =
    result?.summary && typeof result.summary === "object"
      ? (result.summary as Record<string, unknown>)
      : null;
  const valueSystems =
    summary?.valueSystems && typeof summary.valueSystems === "object"
      ? (summary.valueSystems as Record<string, unknown>)
      : null;

  return {
    highPoints: Array.isArray(valueSystems?.highPoints)
      ? valueSystems.highPoints.filter(
          (item): item is string => typeof item === "string",
        )
      : [],
    lowPoints: Array.isArray(valueSystems?.lowPoints)
      ? valueSystems.lowPoints.filter(
          (item): item is string => typeof item === "string",
        )
      : [],
  };
};

const getInitialStage = (
  existingResult: Record<string, unknown> | null,
  focusedSubActivity: AwarenessSubActivityKey | null,
): AwarenessStage => {
  if (focusedSubActivity === "mapping_life_domains") return "domains";
  if (focusedSubActivity === "daily_activation") return "activation-select";
  if (focusedSubActivity === "expansion_check") return "expansion-select";
  return existingResult?.summary ? "summary" : "domains";
};

const FocusedCompletion = ({
  title,
  description,
  onRetake,
}: {
  title: string;
  description: string;
  onRetake: () => void;
}) => (
  <AwarenessStepShell
    eyebrow="Checkpoint saved"
    title={title}
    description={description}
    currentStep={3}
    progressLabel="Saved"
  >
    <div className="rounded-[28px] border border-[#d9ebe6] bg-white p-8 shadow-[0_2px_14px_rgba(0,0,0,0.06)]">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e7f4ef] text-[#206d5c]">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <p className="mt-5 text-[15px] leading-7 text-[#5a6a6a]">{description}</p>
      <div className="mt-8 flex justify-end">
        <MainButton onClick={onRetake} variant="outline">
          Run this activity again
        </MainButton>
      </div>
    </div>
  </AwarenessStepShell>
);

const AwarenessGameForm = ({
  courseId,
  submitting,
  existingResult,
  initialSubActivityKey,
  onSubmit,
}: AwarenessGameFormProps) => {
  const focusedSubActivity = isAwarenessSubActivity(initialSubActivityKey)
    ? initialSubActivityKey
    : null;
  const existingValueSystems = readValueSystems(existingResult);
  const [stage, setStage] = useState<AwarenessStage>(
    getInitialStage(existingResult, focusedSubActivity),
  );
  const [activationSelections, setActivationSelections] = useState<string[]>([]);
  const [expansionSelections, setExpansionSelections] = useState<string[]>([]);
  const [highPoints, setHighPoints] = useState<string[]>(existingValueSystems.highPoints);
  const [lowPoints, setLowPoints] = useState<string[]>(existingValueSystems.lowPoints);
  const [activationResult, setActivationResult] = useState<Record<string, unknown> | null>(
    existingResult?.activationResultMapping &&
      typeof existingResult.activationResultMapping === "object"
      ? (existingResult.activationResultMapping as Record<string, unknown>)
      : null,
  );
  const [expansionResult, setExpansionResult] = useState<Record<string, unknown> | null>(
    existingResult?.expansionResultMapping &&
      typeof existingResult.expansionResultMapping === "object"
      ? (existingResult.expansionResultMapping as Record<string, unknown>)
      : null,
  );
  const [completedResult, setCompletedResult] = useState<Record<string, unknown> | null>(
    existingResult,
  );

  const resetFlow = () => {
    setStage(getInitialStage(null, focusedSubActivity));
    setActivationSelections([]);
    setExpansionSelections([]);
    setHighPoints([]);
    setLowPoints([]);
    setActivationResult(null);
    setExpansionResult(null);
    setCompletedResult(null);
  };

  const submitStep = async (step: 1 | 2 | 3) => {
    const payload: GameSubmissionPayload = {
      type: "awareness_states",
      courseId,
      step,
      subActivityKey:
        step === 1
          ? "mapping_life_domains"
          : step === 2
            ? "daily_activation"
            : "expansion_check",
      payload: {
        ...(step === 1
          ? {
              valueSystems: {
                highPoints,
                lowPoints,
              },
            }
          : {}),
        ...(step === 2 ? { activationSelections } : {}),
        ...(step === 3 ? { expansionSelections } : {}),
      },
    };

    const response = await onSubmit(payload);
    const resultData =
      response &&
      typeof response === "object" &&
      "resultData" in response &&
      response.resultData &&
      typeof response.resultData === "object"
        ? (response.resultData as Record<string, unknown>)
        : null;

    if (!resultData) {
      return;
    }

    if (step === 1) {
      if (focusedSubActivity === "mapping_life_domains") {
        setCompletedResult({
          summary: {
            valueSystems: {
              highPoints,
              lowPoints,
            },
          },
        });
        setStage("domains-complete");
        return;
      }

      setStage("activation-select");
      return;
    }

    if (step === 2) {
      const resultMapping =
        resultData.resultMapping && typeof resultData.resultMapping === "object"
          ? (resultData.resultMapping as Record<string, unknown>)
          : null;
      setActivationResult(resultMapping);
      setStage("activation-result");
      return;
    }

    const resultMapping =
      resultData.resultMapping && typeof resultData.resultMapping === "object"
        ? (resultData.resultMapping as Record<string, unknown>)
        : null;
    setExpansionResult(resultMapping);
    setCompletedResult(resultData);
    setStage("expansion-result");
  };

  if (stage === "domains") {
    return (
      <AwarenessDomainsStep
        highPoints={highPoints}
        lowPoints={lowPoints}
        eyebrow={focusedSubActivity ? "Awareness activity" : "Step 1 of 3"}
        title="Mapping your life domains"
        description="Pick two high points and two low points so your later awareness maps are anchored in the actual life areas carrying the most charge right now."
        currentStep={1}
        continueLabel={focusedSubActivity ? "Save life-domain map" : "Continue to activation"}
        onToggle={(domain, type) => {
          if (type === "high") {
            setHighPoints((current) => toggleValue(current, domain));
            setLowPoints((current) => current.filter((item) => item !== domain));
            return;
          }

          setLowPoints((current) => toggleValue(current, domain));
          setHighPoints((current) => current.filter((item) => item !== domain));
        }}
        onBack={focusedSubActivity ? undefined : undefined}
        onContinue={() => void submitStep(1)}
      />
    );
  }

  if (stage === "domains-complete") {
    return (
      <FocusedCompletion
        title="Life-domain mapping saved"
        description="Your two high points and two low points are saved. You can revisit this checkpoint anytime from the same cue or continue through the full awareness journey from the course flow."
        onRetake={resetFlow}
      />
    );
  }

  if (stage === "activation-select") {
    return (
      <AwarenessActivationStep
        mode="activation"
        selectedValues={activationSelections}
        submitting={submitting}
        eyebrow={focusedSubActivity ? "Awareness activity" : "Step 2 of 3"}
        currentStep={2}
        buttonLabel={focusedSubActivity ? "Save activation" : "Save activation"}
        onToggle={(value) => setActivationSelections((current) => toggleValue(current, value))}
        onSubmit={() => void submitStep(2)}
      />
    );
  }

  if (stage === "activation-result") {
    return (
      <AwarenessResultMappingStep
        mode="activation"
        resultMapping={activationResult}
        eyebrow={focusedSubActivity ? "Activation result" : "Step 2 result"}
        currentStep={2}
        nextLabel={focusedSubActivity ? "Finish this activity" : "Continue to expansion"}
        onBack={() => setStage("activation-select")}
        onContinue={() =>
          focusedSubActivity ? setStage("summary") : setStage("expansion-select")
        }
      />
    );
  }

  if (stage === "expansion-select") {
    return (
      <AwarenessActivationStep
        mode="expansion"
        selectedValues={expansionSelections}
        submitting={submitting}
        eyebrow={focusedSubActivity ? "Awareness activity" : "Step 3 of 3"}
        currentStep={3}
        buttonLabel={focusedSubActivity ? "Save expansion" : "Complete awareness"}
        onToggle={(value) => setExpansionSelections((current) => toggleValue(current, value))}
        onSubmit={() => void submitStep(3)}
      />
    );
  }

  if (stage === "expansion-result") {
    return (
      <AwarenessResultMappingStep
        mode="expansion"
        resultMapping={expansionResult}
        eyebrow={focusedSubActivity ? "Expansion result" : "Step 3 result"}
        currentStep={3}
        nextLabel={focusedSubActivity ? "Finish this activity" : "Open full awareness summary"}
        onBack={() => setStage("expansion-select")}
        onContinue={() => setStage("summary")}
      />
    );
  }

  if (focusedSubActivity && stage === "summary") {
    const copyByKey: Record<AwarenessSubActivityKey, { title: string; description: string }> = {
      mapping_life_domains: {
        title: "Life-domain mapping saved",
        description: "Your domain map is saved as a standalone awareness checkpoint.",
      },
      daily_activation: {
        title: "Activation checkpoint saved",
        description: "Your activation map is saved. You can return to this single checkpoint anytime without reopening the full awareness flow.",
      },
      expansion_check: {
        title: "Expansion checkpoint saved",
        description: "Your expansion map is saved. The full awareness summary will appear when all three awareness sub-activities are completed together.",
      },
    };

    return (
      <FocusedCompletion
        title={copyByKey[focusedSubActivity].title}
        description={copyByKey[focusedSubActivity].description}
        onRetake={resetFlow}
      />
    );
  }

  return <AwarenessSummaryStep result={completedResult} onRetake={resetFlow} />;
};

export default AwarenessGameForm;

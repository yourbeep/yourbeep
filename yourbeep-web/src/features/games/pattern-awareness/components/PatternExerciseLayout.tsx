import type { ReactNode } from "react";
import type { PatternAwarenessExerciseKey } from "@store/slices/games";
import ExerciseResultsPanel from "./ExerciseResultsPanel";
import { PATTERN_SIDEBAR_WIDTH } from "./patternLayoutTokens";
import type { PatternBackendExerciseResult } from "../types";

type PatternExerciseLayoutProps = {
  title: string;
  toolbar?: ReactNode;
  showResults: boolean;
  exerciseKey: PatternAwarenessExerciseKey;
  backendExercise: PatternBackendExerciseResult | null;
  analyzing?: boolean;
  analyzeError?: string | null;
  children: ReactNode;
};

const PatternExerciseLayout = ({
  title,
  toolbar,
  showResults,
  exerciseKey,
  backendExercise,
  analyzing = false,
  analyzeError = null,
  children,
}: PatternExerciseLayoutProps) => (
  <section className="w-full min-w-0 overflow-x-hidden rounded-[18px] bg-[#f8f5ea] px-2 py-3 sm:rounded-[24px] sm:px-3 sm:py-4 md:px-4 md:py-4">
    <h2 className="text-center text-base font-bold leading-tight text-[#0d475d] sm:text-lg md:text-xl">
      {title}
    </h2>

    <div
      className={`mt-2 grid w-full gap-3 sm:mt-3 md:items-stretch md:gap-3.5 lg:gap-4 ${PATTERN_SIDEBAR_WIDTH}`}
    >
      <div className="flex min-h-0 min-w-0 flex-col">
        {toolbar}
        <div className="min-h-0 flex-1">{children}</div>
      </div>

      <ExerciseResultsPanel
        exerciseKey={exerciseKey}
        visible={showResults}
        loading={analyzing}
        error={analyzeError}
        backendExercise={backendExercise}
      />
    </div>
  </section>
);

export default PatternExerciseLayout;

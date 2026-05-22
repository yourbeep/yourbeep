import { Clock3 } from "lucide-react";
import SketchSurface, { PatternSurfaceActions } from "../SketchSurface";
import PatternExerciseLayout from "../PatternExerciseLayout";
import {
  usePatternExerciseDrawing,
  type PatternExerciseScreenProps,
} from "../../hooks/usePatternExerciseDrawing";

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const AwarenessCirclesScreen = ({
  initialStrokes = [],
  backendExercise,
  analyzing = false,
  analyzeError = null,
  onBack,
  onSave,
  onAnalyze,
  onClearResults,
  saving = false,
}: PatternExerciseScreenProps) => {
  const {
    strokes,
    activeStroke,
    summary,
    showResults,
    onStartStroke,
    onAppendPoint,
    onEndStroke,
    onClear,
    onUndo,
  } = usePatternExerciseDrawing({
    exerciseKey: "awareness_circles",
    initialStrokes,
    backendExercise,
    analyzing,
    onAnalyze,
    onClearResults,
  });

  const durationSeconds =
    backendExercise?.durationSeconds ?? summary.durationSeconds;
  const sessionScore = backendExercise?.scores?.patternScore ?? 0;

  return (
    <div className="min-w-0 overflow-x-hidden">
      <PatternExerciseLayout
        title="Awareness Circles"
        exerciseKey="awareness_circles"
        showResults={showResults}
        backendExercise={backendExercise}
        analyzing={analyzing}
        analyzeError={analyzeError}
        toolbar={
          <div className="mb-2 flex w-full flex-col gap-2 rounded-[14px] bg-white px-3 py-2 shadow-[0_8px_18px_rgba(25,48,54,0.07)] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2 sm:rounded-full sm:px-4 sm:py-2.5 md:mb-2">
            <div className="flex shrink-0 items-center justify-between gap-2 text-[#2e3b3f] sm:justify-start">
              <div className="flex items-center gap-1.5">
                <Clock3 size={15} className="shrink-0" />
                <span className="text-base font-medium tabular-nums sm:text-lg">
                  {showResults ? formatDuration(durationSeconds) : "03:00"}
                </span>
              </div>
              {showResults && sessionScore ? (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#dae7dc] text-[11px] font-semibold tabular-nums text-[#4f6d5d] sm:hidden">
                  {sessionScore}
                </div>
              ) : null}
            </div>
            <p className="min-w-0 text-center text-[11px] leading-snug text-[#64757a] sm:flex-1 sm:basis-[8rem] sm:text-left">
              &ldquo;Follow the breath. Move with intention.&rdquo;
            </p>
            {showResults && sessionScore ? (
              <div className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#dae7dc] text-[11px] font-semibold tabular-nums text-[#4f6d5d] sm:flex">
                {sessionScore}
              </div>
            ) : null}
          </div>
        }
      >
        <SketchSurface
          title=""
          strokes={strokes}
          activeStroke={activeStroke}
          onStartStroke={onStartStroke}
          onAppendPoint={onAppendPoint}
          onEndStroke={onEndStroke}
          onClear={onClear}
          onUndo={onUndo}
          embedded
          boardClassName="mt-0"
          canvasClassName="aspect-square !h-auto max-h-[min(88vw,400px)] w-full border-none bg-transparent sm:max-h-[min(46vh,420px)] md:aspect-auto md:!h-full md:max-h-none"
          background={
            <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
              <div className="relative aspect-square h-full max-h-full w-full max-w-full">
                <div className="absolute inset-0 rounded-full border border-dashed border-[#d9ddcd]" />
                <div className="absolute inset-[15%] rounded-full border-[3px] border-[#8ca18c] sm:border-[4px]" />
                <div className="absolute inset-[38%] rounded-full border border-dashed border-[#d9ddcd]" />
                <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c7cabf]" />
              </div>
            </div>
          }
          footer={
            <PatternSurfaceActions
              onBack={onBack}
              onSave={() => void onSave(summary, strokes)}
              saveLabel="Save Exercise"
              saveDisabled={strokes.length === 0 || saving || analyzing}
              saving={saving}
            />
          }
        />
      </PatternExerciseLayout>
    </div>
  );
};

export default AwarenessCirclesScreen;

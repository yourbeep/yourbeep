import SketchSurface, { PatternSurfaceActions } from "../SketchSurface";
import PatternExerciseLayout from "../PatternExerciseLayout";
import {
  usePatternExerciseDrawing,
  type PatternExerciseScreenProps,
} from "../../hooks/usePatternExerciseDrawing";

const DrawYourBreathScreen = ({
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
    exerciseKey: "draw_your_breath",
    initialStrokes,
    backendExercise,
    analyzing,
    onAnalyze,
    onClearResults,
  });

  return (
    <div className="min-w-0">
      <PatternExerciseLayout
        title="Draw Your Breath"
        exerciseKey="draw_your_breath"
        showResults={showResults}
        backendExercise={backendExercise}
        analyzing={analyzing}
        analyzeError={analyzeError}
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
          canvasClassName="bg-[linear-gradient(to_right,rgba(50,94,116,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(50,94,116,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"
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

export default DrawYourBreathScreen;

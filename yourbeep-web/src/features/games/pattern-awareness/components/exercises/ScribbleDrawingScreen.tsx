import SketchSurface, { PatternSurfaceActions } from "../SketchSurface";
import PatternExerciseLayout from "../PatternExerciseLayout";
import {
  usePatternExerciseDrawing,
  type PatternExerciseScreenProps,
} from "../../hooks/usePatternExerciseDrawing";

const ScribbleDrawingScreen = ({
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
    exerciseKey: "scribble_drawing",
    initialStrokes,
    backendExercise,
    analyzing,
    onAnalyze,
    onClearResults,
  });

  return (
    <div className="min-w-0">
      <PatternExerciseLayout
        title="Scribble Drawing"
        exerciseKey="scribble_drawing"
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
          canvasClassName="bg-[#d9d8dd]"
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

export default ScribbleDrawingScreen;

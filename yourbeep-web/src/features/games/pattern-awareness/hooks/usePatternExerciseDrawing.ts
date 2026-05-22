import { useMemo, useState } from "react";
import { summariseExerciseMetrics } from "../services/patternAwarenessMetrics";
import type {
  ExerciseMetricsSummary,
  PatternBackendExerciseResult,
  SketchPoint,
  SketchStroke,
} from "../types";

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 700;

type PatternExerciseScreenProps = {
  initialStrokes?: SketchStroke[];
  backendExercise: PatternBackendExerciseResult | null;
  analyzing?: boolean;
  analyzeError?: string | null;
  onBack: () => void;
  onSave: (summary: ExerciseMetricsSummary, strokes: SketchStroke[]) => Promise<void> | void;
  onAnalyze: (summary: ExerciseMetricsSummary, strokes: SketchStroke[]) => Promise<void>;
  onClearResults: () => void;
  saving?: boolean;
};

export const usePatternExerciseDrawing = ({
  exerciseKey,
  initialStrokes = [],
  backendExercise,
  analyzing = false,
  onAnalyze,
  onClearResults,
}: Pick<
  PatternExerciseScreenProps,
  "initialStrokes" | "backendExercise" | "analyzing" | "onAnalyze" | "onClearResults"
> & {
  exerciseKey: "draw_your_breath" | "awareness_circles" | "scribble_drawing";
}) => {
  const [strokes, setStrokes] = useState<SketchStroke[]>(initialStrokes);
  const [activeStroke, setActiveStroke] = useState<SketchPoint[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const summary = useMemo(
    () =>
      summariseExerciseMetrics({
        exerciseKey,
        strokes,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
      }),
    [exerciseKey, strokes],
  );

  const showResults = Boolean(backendExercise) && !isDrawing && !analyzing;

  const requestAnalysis = async (nextStrokes: SketchStroke[]) => {
    if (!nextStrokes.length) {
      onClearResults();
      return;
    }

    if (!onAnalyze) {
      return;
    }

    const nextSummary = summariseExerciseMetrics({
      exerciseKey,
      strokes: nextStrokes,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    });

    await onAnalyze(nextSummary, nextStrokes);
  };

  const commitStroke = () => {
    if (activeStroke.length < 2) {
      setActiveStroke([]);
      setIsDrawing(false);
      return;
    }

    const nextStrokes = [
      ...strokes,
      {
        id: crypto.randomUUID(),
        points: activeStroke,
      },
    ];

    setStrokes(nextStrokes);
    setActiveStroke([]);
    setIsDrawing(false);
    void requestAnalysis(nextStrokes);
  };

  return {
    strokes,
    activeStroke,
    summary,
    showResults,
    onStartStroke: (point: SketchPoint) => {
      setIsDrawing(true);
      setActiveStroke([point]);
    },
    onAppendPoint: (point: SketchPoint) => {
      setActiveStroke((current) => [...current, point]);
    },
    onEndStroke: commitStroke,
    onClear: () => {
      setStrokes([]);
      setActiveStroke([]);
      setIsDrawing(false);
      onClearResults();
    },
    onUndo: () => {
      const nextStrokes = strokes.slice(0, Math.max(0, strokes.length - 1));
      setStrokes(nextStrokes);
      setIsDrawing(false);
      void requestAnalysis(nextStrokes);
    },
  };
};

export type { PatternExerciseScreenProps };

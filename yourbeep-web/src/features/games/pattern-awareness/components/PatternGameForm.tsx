import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@store/index";
import {
  openPatternAwarenessAnalysis,
  openPatternAwarenessExercise,
  resetPatternAwarenessSession,
  returnToPatternAwarenessHub,
  savePatternAwarenessExercise,
  type PatternAwarenessExerciseKey,
} from "@store/slices/games";
import PatternAwarenessHub from "./PatternAwarenessHub";
import DrawYourBreathScreen from "./exercises/DrawYourBreathScreen";
import AwarenessCirclesScreen from "./exercises/AwarenessCirclesScreen";
import ScribbleDrawingScreen from "./exercises/ScribbleDrawingScreen";
import PatternAnalysisScreen from "./PatternAnalysisScreen";
import { patternAwarenessExercises } from "../services/patternAwarenessConfig";
import {
  extractBackendExerciseResult,
  mapBackendResultsByExercise,
} from "../services/exerciseBackendResult";
import type {
  GameSubmissionPayload,
  GameSubmissionResponse,
} from "../../services/gameExperienceTypes";
import type {
  ExerciseMetricsSummary,
  PatternBackendExerciseResult,
  PatternResultData,
  SketchStroke,
} from "../types";
import { isPatternSubActivity } from "../../services/gameSubActivities";

type PatternGameFormProps = {
  courseId: string;
  submitting: boolean;
  existingResult?: Record<string, unknown> | null;
  submissionResult?: Record<string, unknown> | null;
  initialSubActivityKey?: string | null;
  onSubmit: (
    payload: GameSubmissionPayload,
    options?: { silent?: boolean },
  ) => Promise<unknown>;
};

const backendScoreToPercent = (exercise: PatternBackendExerciseResult | null) => {
  const patternScore = Number(exercise?.scores?.patternScore ?? 0);
  if (!patternScore) {
    return 0;
  }

  return Math.round((patternScore / 3) * 100);
};

const PatternGameForm = ({
  courseId,
  submitting,
  existingResult,
  submissionResult,
  initialSubActivityKey,
  onSubmit,
}: PatternGameFormProps) => {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.games.patternAwareness);
  const [exerciseStrokes, setExerciseStrokes] = useState<
    Partial<Record<PatternAwarenessExerciseKey, SketchStroke[]>>
  >({});
  const [backendResultsByExercise, setBackendResultsByExercise] = useState<
    Partial<Record<PatternAwarenessExerciseKey, PatternBackendExerciseResult>>
  >({});
  const [analyzingKey, setAnalyzingKey] = useState<PatternAwarenessExerciseKey | null>(
    null,
  );
  const [analyzeErrors, setAnalyzeErrors] = useState<
    Partial<Record<PatternAwarenessExerciseKey, string>>
  >({});

  const backendResult = (submissionResult ?? existingResult ?? null) as PatternResultData | null;

  useEffect(() => {
    dispatch(resetPatternAwarenessSession());
    if (isPatternSubActivity(initialSubActivityKey)) {
      dispatch(openPatternAwarenessExercise(initialSubActivityKey));
    }
  }, [courseId, dispatch, initialSubActivityKey]);

  useEffect(() => {
    if (existingResult && !submissionResult && !isPatternSubActivity(initialSubActivityKey)) {
      dispatch(openPatternAwarenessAnalysis());
    }
  }, [dispatch, existingResult, initialSubActivityKey, submissionResult]);

  useEffect(() => {
    const mapped = mapBackendResultsByExercise(
      backendResult as Record<string, unknown> | null,
    );
    if (Object.keys(mapped).length) {
      setBackendResultsByExercise((current) => ({ ...current, ...mapped }));
    }
  }, [backendResult]);

  const firstIncompleteExercise = useMemo(
    () =>
      patternAwarenessExercises.find(
        (exercise) => session.exercises[exercise.key].status !== "completed",
      )?.key ?? null,
    [session.exercises],
  );

  const allExercisesCompleted = useMemo(
    () =>
      patternAwarenessExercises.every(
        (exercise) => session.exercises[exercise.key].status === "completed",
      ),
    [session.exercises],
  );

  const submitExerciseToBackend = async (
    exerciseKey: PatternAwarenessExerciseKey,
    summary: ExerciseMetricsSummary,
    options?: { silent?: boolean },
  ) => {
    const payload: GameSubmissionPayload = {
      type: "pattern_awareness",
      courseId,
      payload: {
        exercises: [
          {
            exerciseKey,
            durationSeconds: summary.durationSeconds,
            metrics: summary.metrics,
          },
        ],
      },
    };

    return (await onSubmit(payload, options)) as GameSubmissionResponse | null;
  };

  const analyzeExercise = async (
    exerciseKey: PatternAwarenessExerciseKey,
    summary: ExerciseMetricsSummary,
    strokes: SketchStroke[],
  ) => {
    setAnalyzingKey(exerciseKey);
    setAnalyzeErrors((current) => {
      const next = { ...current };
      delete next[exerciseKey];
      return next;
    });

    try {
      const response = await submitExerciseToBackend(exerciseKey, summary, {
        silent: true,
      });

      if (!response) {
        throw new Error("Unable to analyze your drawing. Please try again.");
      }

      const exercise = extractBackendExerciseResult(response.resultData, exerciseKey);

      if (!exercise) {
        throw new Error("Exercise results were not found in the server response.");
      }

      setBackendResultsByExercise((current) => ({
        ...current,
        [exerciseKey]: exercise,
      }));
      setExerciseStrokes((current) => ({ ...current, [exerciseKey]: strokes }));
    } catch (error) {
      setAnalyzeErrors((current) => ({
        ...current,
        [exerciseKey]:
          error instanceof Error
            ? error.message
            : "Unable to analyze your pattern right now.",
      }));
    } finally {
      setAnalyzingKey(null);
    }
  };

  const clearExerciseResults = (exerciseKey: PatternAwarenessExerciseKey) => {
    setBackendResultsByExercise((current) => {
      const next = { ...current };
      delete next[exerciseKey];
      return next;
    });
    setAnalyzeErrors((current) => {
      const next = { ...current };
      delete next[exerciseKey];
      return next;
    });
  };

  const handleSaveExercise = async (
    exerciseKey: PatternAwarenessExerciseKey,
    summary: ExerciseMetricsSummary,
    strokes: SketchStroke[],
  ) => {
    const response = await submitExerciseToBackend(exerciseKey, summary);
    if (!response) {
      return;
    }

    const exercise = extractBackendExerciseResult(response.resultData, exerciseKey);

    dispatch(
      savePatternAwarenessExercise({
        exerciseKey,
        durationSeconds: exercise?.durationSeconds ?? summary.durationSeconds,
        score: backendScoreToPercent(exercise),
        strokeCount: summary.strokeCount,
        metrics: exercise?.metrics ?? summary.metrics,
      }),
    );
    setExerciseStrokes((current) => ({ ...current, [exerciseKey]: strokes }));

    if (exercise) {
      setBackendResultsByExercise((current) => ({
        ...current,
        [exerciseKey]: exercise,
      }));
    }

    if (response.isComplete) {
      dispatch(openPatternAwarenessAnalysis());
    }
  };

  const handleContinue = () => {
    if (allExercisesCompleted) {
      dispatch(openPatternAwarenessAnalysis());
      return;
    }

    if (firstIncompleteExercise) {
      dispatch(openPatternAwarenessExercise(firstIncompleteExercise));
    }
  };

  const handleDone = () => {
    dispatch(returnToPatternAwarenessHub());
  };

  const sharedExerciseProps = (exerciseKey: PatternAwarenessExerciseKey) => ({
    initialStrokes: exerciseStrokes[exerciseKey],
    backendExercise: backendResultsByExercise[exerciseKey] ?? null,
    analyzing: analyzingKey === exerciseKey,
    analyzeError: analyzeErrors[exerciseKey] ?? null,
    onBack: () => dispatch(returnToPatternAwarenessHub()),
    saving: submitting,
    onAnalyze: (summary: ExerciseMetricsSummary, strokes: SketchStroke[]) =>
      analyzeExercise(exerciseKey, summary, strokes),
    onClearResults: () => clearExerciseResults(exerciseKey),
    onSave: (summary: ExerciseMetricsSummary, strokes: SketchStroke[]) =>
      void handleSaveExercise(exerciseKey, summary, strokes),
  });

  const renderExercise = () => {
    switch (session.currentExerciseKey) {
      case "draw_your_breath":
        return <DrawYourBreathScreen {...sharedExerciseProps("draw_your_breath")} />;
      case "awareness_circles":
        return <AwarenessCirclesScreen {...sharedExerciseProps("awareness_circles")} />;
      case "scribble_drawing":
        return <ScribbleDrawingScreen {...sharedExerciseProps("scribble_drawing")} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-none"
    >
      <AnimatePresence mode="wait">
        {session.stage === "hub" ? (
          <motion.div
            key="hub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <PatternAwarenessHub
              session={session}
              onSelectExercise={(exerciseKey) =>
                dispatch(openPatternAwarenessExercise(exerciseKey))
              }
              onContinue={handleContinue}
            />
          </motion.div>
        ) : null}

        {session.stage === "exercise" ? (
          <motion.div
            key={session.currentExerciseKey ?? "exercise"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="min-w-0 overflow-x-hidden"
          >
            {renderExercise()}
          </motion.div>
        ) : null}

        {session.stage === "analysis" ? (
          <motion.div
            key="analysis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="min-w-0 overflow-x-hidden"
          >
            <PatternAnalysisScreen
              session={session}
              signatureStrokes={exerciseStrokes.draw_your_breath ?? []}
              backendResult={backendResult}
              backendResultsByExercise={backendResultsByExercise}
              onBack={() => dispatch(returnToPatternAwarenessHub())}
              onDone={() => void handleDone()}
              submitting={submitting}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

export default PatternGameForm;

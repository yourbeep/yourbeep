import type { PatternAwarenessExerciseKey } from "@store/slices/games";
import type { PatternBackendExerciseResult } from "../types";

export const extractBackendExerciseResult = (
  resultData: Record<string, unknown> | null | undefined,
  exerciseKey: PatternAwarenessExerciseKey,
): PatternBackendExerciseResult | null => {
  if (!resultData || !Array.isArray(resultData.exercises)) {
    return null;
  }

  const match = resultData.exercises.find(
    (item) =>
      item &&
      typeof item === "object" &&
      "exerciseKey" in item &&
      item.exerciseKey === exerciseKey,
  );

  return match && typeof match === "object"
    ? (match as PatternBackendExerciseResult)
    : null;
};

export const mapBackendResultsByExercise = (
  resultData: Record<string, unknown> | null | undefined,
): Partial<Record<PatternAwarenessExerciseKey, PatternBackendExerciseResult>> => {
  if (!resultData || !Array.isArray(resultData.exercises)) {
    return {};
  }

  return resultData.exercises.reduce<
    Partial<Record<PatternAwarenessExerciseKey, PatternBackendExerciseResult>>
  >((accumulator, item) => {
    if (!item || typeof item !== "object" || !("exerciseKey" in item)) {
      return accumulator;
    }

    const exerciseKey = item.exerciseKey;
    if (
      exerciseKey === "draw_your_breath" ||
      exerciseKey === "awareness_circles" ||
      exerciseKey === "scribble_drawing"
    ) {
      accumulator[exerciseKey] = item as PatternBackendExerciseResult;
    }

    return accumulator;
  }, {});
};

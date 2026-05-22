import type { PatternAwarenessExerciseKey } from "@store/slices/games";
import type { PatternBackendExerciseResult } from "../types";

export type ScatterPoint = {
  x: number;
  y: number;
};

export type ExerciseResultView = {
  primaryValue: string;
  primaryLabel: string;
  insight: string;
  metrics: Array<{ label: string; value: string }>;
  scatterPoints: ScatterPoint[];
  rhythmBars?: [number, number];
  profileScale: number;
};

const formatToken = (value: unknown, fallback = "—") => {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }

  return value
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const toPercent = (value: unknown) =>
  `${Math.round(Number(value ?? 0) * 100)}%`;

const scoreLabel = (value: unknown) => {
  const score = Number(value ?? 0);
  if (score >= 2.5) return "High";
  if (score >= 1.75) return "Medium";
  return "Low";
};

const readField = (
  exercise: PatternBackendExerciseResult,
  key: string,
) => {
  const diagnostics = exercise.scores?.diagnostics;
  if (diagnostics && key in diagnostics) {
    return diagnostics[key];
  }

  const metrics = exercise.metrics;
  if (metrics && key in metrics) {
    return metrics[key];
  }

  return undefined;
};

const getTraceScatterPoints = (
  exercise: PatternBackendExerciseResult,
): ScatterPoint[] => {
  const trace =
    exercise.metrics?.trace ??
    (exercise.scores?.diagnostics?.trace as unknown);

  if (!Array.isArray(trace)) {
    return [];
  }

  return trace
    .filter(
      (point): point is { x: number; y: number } =>
        Boolean(point) &&
        typeof point === "object" &&
        typeof (point as { x?: unknown }).x === "number" &&
        typeof (point as { y?: unknown }).y === "number",
    )
    .filter((_, index, items) => {
      const step = Math.max(1, Math.floor(items.length / 12));
      return index % step === 0;
    })
    .map((point) => {
      const x = point.x <= 1 ? point.x * 100 : (point.x / 1000) * 100;
      const y = point.y <= 1 ? point.y * 100 : (point.y / 700) * 100;

      return { x, y };
    });
};

const getRhythmBars = (intervalPattern: unknown): [number, number] => {
  const pattern = String(intervalPattern ?? "even").toLowerCase();
  if (pattern === "wide_to_narrow") {
    return [78, 42];
  }
  if (pattern === "narrow_to_wide") {
    return [42, 78];
  }
  if (pattern === "medium" || pattern === "even") {
    return [62, 62];
  }
  return [55, 55];
};

const getCircleInsight = (pattern: string, completeness: number) => {
  if (completeness >= 0.75) {
    return "Your loops stay closed and steady — a strong sign of sustained attention through each breath cycle.";
  }
  if (pattern === "contained") {
    return "Marks stay near the centre, suggesting focused inward attention with minimal drift.";
  }
  if (pattern === "scattered") {
    return "Stroke paths vary in radius — try slowing down to keep each circle more even.";
  }
  if (pattern === "expansive") {
    return "You used a wide area of the canvas, showing outward, exploratory movement.";
  }
  return "Your stroke continuity is strongest when loops stay open and consistent through the exhalation phase.";
};

const getBreathInsight = (exercise: PatternBackendExerciseResult) => {
  const spacing = String(readField(exercise, "controlLimitSpacing") ?? "medium");
  const pattern = String(readField(exercise, "intervalPattern") ?? "even");
  const lifts = Number(readField(exercise, "penLiftCount") ?? 0);

  if (lifts >= 4) {
    return "Several pen lifts suggest the rhythm broke often — one continuous line usually maps breath more clearly.";
  }
  if (pattern === "even" && spacing !== "narrow") {
    return "Your inhale and exhale arcs look balanced, with steady spacing across the full breath map.";
  }
  if (pattern === "wide_to_narrow") {
    return "Amplitude eases toward the end of the trace — often matching a settling exhale.";
  }
  if (pattern === "narrow_to_wide") {
    return "The trace opens as it progresses — often reflecting a deepening or expanding breath.";
  }
  return "Keep tracing one continuous rhythm; spacing and wave height reveal how your breath is landing.";
};

const getScribbleInsight = (exercise: PatternBackendExerciseResult) => {
  const direction = String(readField(exercise, "directionPattern") ?? "contained");
  const spacing = String(readField(exercise, "lineSpacing") ?? "medium");

  if (direction === "undefined_scattered") {
    return "Wide, shifting marks suggest high activation or a searching, exploratory state.";
  }
  if (direction === "defined_spatial") {
    return "Directional flow is clear — your hand moved with purpose across the canvas.";
  }
  if (spacing === "narrow") {
    return "Tight, dense marks can indicate compression, focus, or elevated nervous-system load.";
  }
  if (spacing === "wide") {
    return "Open spacing suggests release, spaciousness, or a lighter energetic tone.";
  }
  return "Free-form marks reveal how density, direction, and canvas use come together in the moment.";
};

export const buildExerciseResultViewFromBackend = (
  exerciseKey: PatternAwarenessExerciseKey,
  exercise: PatternBackendExerciseResult,
): ExerciseResultView => {
  const scores = exercise.scores ?? {};
  const scatterPoints = getTraceScatterPoints(exercise);
  const coverage = Number(readField(exercise, "coverage") ?? readField(exercise, "spatialCoverage") ?? 0);

  if (exerciseKey === "draw_your_breath") {
    const intervalPattern = readField(exercise, "intervalPattern");

    return {
      primaryValue: formatToken(intervalPattern, "Even"),
      primaryLabel: "Breath Rhythm",
      insight: getBreathInsight(exercise),
      metrics: [
        { label: "Spacing", value: formatToken(readField(exercise, "controlLimitSpacing")) },
        { label: "Spatial Use", value: toPercent(coverage) },
        { label: "Presence", value: scoreLabel(scores.breaksScore) },
        { label: "Action", value: scoreLabel(scores.variabilityScore) },
        { label: "Pattern", value: scoreLabel(scores.patternScore) },
      ],
      scatterPoints,
      rhythmBars: getRhythmBars(intervalPattern),
      profileScale: Math.max(0.35, Math.min(1, coverage * 1.35 + 0.25)),
    };
  }

  if (exerciseKey === "awareness_circles") {
    const completeness = Number(readField(exercise, "circleCompleteness") ?? 0);
    const pattern = String(readField(exercise, "circlePattern") ?? "defined_spatial");

    return {
      primaryValue: toPercent(completeness),
      primaryLabel: "Completeness",
      insight: getCircleInsight(pattern, completeness),
      metrics: [
        { label: "Pattern", value: formatToken(pattern) },
        { label: "Spatial Use", value: toPercent(coverage) },
        { label: "Presence", value: scoreLabel(scores.breaksScore) },
        { label: "Action", value: scoreLabel(scores.variabilityScore) },
        { label: "Pattern Score", value: scoreLabel(scores.patternScore) },
      ],
      scatterPoints,
      profileScale: Math.max(0.35, Math.min(1, completeness + 0.15)),
    };
  }

  return {
    primaryValue: formatToken(readField(exercise, "directionPattern"), "Contained"),
    primaryLabel: "Movement Pattern",
    insight: getScribbleInsight(exercise),
    metrics: [
      { label: "Line Spacing", value: formatToken(readField(exercise, "lineSpacing")) },
      { label: "Spatial Use", value: toPercent(coverage) },
      { label: "Presence", value: scoreLabel(scores.breaksScore) },
      { label: "Action", value: scoreLabel(scores.boldnessScore) },
      { label: "Pattern Score", value: scoreLabel(scores.patternScore) },
    ],
    scatterPoints,
    profileScale: Math.max(0.35, Math.min(1, coverage * 1.35 + 0.25)),
  };
};

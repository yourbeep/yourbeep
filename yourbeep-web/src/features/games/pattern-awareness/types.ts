import type { PatternAwarenessExerciseKey } from "@store/slices/games";

export type SketchPoint = {
  x: number;
  y: number;
  time: number;
};

export type SketchStroke = {
  id: string;
  points: SketchPoint[];
};

export type PatternBackendExerciseScores = {
  breaksScore?: number;
  durationScore?: number;
  variabilityScore?: number;
  boldnessScore?: number;
  visionScore?: number;
  patternScore?: number;
  overlapCrowdingScore?: number;
  isolatedMarksScore?: number;
  directionalShiftScore?: number;
  stabilityScore?: number;
  densityBehaviorScore?: number;
  diagnostics?: Record<string, unknown>;
};

export type PatternBackendExerciseResult = {
  exerciseKey?: string;
  durationSeconds?: number;
  metrics?: Record<string, unknown>;
  scores?: PatternBackendExerciseScores;
};

export type PatternResultData = {
  exercises?: PatternBackendExerciseResult[];
  presenceScore?: number;
  actionScore?: number;
  patternScore?: number;
  overallScore?: number;
  progressScore?: number;
  criteria?: Record<string, unknown>;
  labels?: {
    presenceAttention?: string;
    action?: string;
    pattern?: string;
  };
  exerciseDiagnostics?: Array<{
    exerciseKey?: string;
    durationSeconds?: number;
    diagnostics?: Record<string, unknown>;
  }>;
  adminReviewSummary?: Record<string, unknown>;
};

export type ExerciseMetricsSummary = {
  durationSeconds: number;
  score: number;
  strokeCount: number;
  metrics: Record<string, unknown>;
};

export type PatternAwarenessExerciseDefinition = {
  key: PatternAwarenessExerciseKey;
  title: string;
  durationLabel: string;
  prompt: string;
  accent: string;
};

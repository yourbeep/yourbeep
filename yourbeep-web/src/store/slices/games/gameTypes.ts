import type { CourseContentData } from "@features/learning/services/learningTypes";
import type {
  CourseGameLesson,
  GameSubmissionResponse,
  SupportedGameKey,
} from "@features/games/services/gameExperienceTypes";

export type GameExperienceData = {
  content: CourseContentData;
  lesson: CourseGameLesson;
  existingResult: Record<string, unknown> | null;
};

export type PatternAwarenessExerciseKey =
  | "draw_your_breath"
  | "awareness_circles"
  | "scribble_drawing";

export type PatternAwarenessStage = "hub" | "exercise" | "analysis";

export type PatternAwarenessExerciseState = {
  status: "not_started" | "in_progress" | "completed";
  durationSeconds: number;
  score: number;
  metrics: Record<string, unknown> | null;
  strokeCount: number;
  updatedAt: string | null;
};

export type PatternAwarenessSessionState = {
  stage: PatternAwarenessStage;
  currentExerciseKey: PatternAwarenessExerciseKey | null;
  exercises: Record<PatternAwarenessExerciseKey, PatternAwarenessExerciseState>;
};

export type GamesState = {
  currentGameKey: SupportedGameKey | null;
  experience: GameExperienceData | null;
  submission: GameSubmissionResponse | null;
  loading: boolean;
  submitting: boolean;
  loaded: boolean;
  error: string | null;
  patternAwareness: PatternAwarenessSessionState;
};

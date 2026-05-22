import type { LearningContentItem } from "@features/learning/services/learningTypes";

export type SupportedGameKey =
  | "awareness_states"
  | "somatic_states"
  | "pattern_awareness"
  | "reflect_act";

export type CourseGameLesson = LearningContentItem & {
  gameId: string;
  gameKey: SupportedGameKey;
};

export type GameSubmissionPayload =
  | {
      type: "awareness_states";
      courseId: string;
      step: number;
      subActivityKey?: "mapping_life_domains" | "daily_activation" | "expansion_check";
      payload: {
        activationSelections?: string[];
        expansionSelections?: string[];
        valueSystems?: {
          highPoints: string[];
          lowPoints: string[];
        };
      };
    }
  | {
      type: "somatic_states";
      courseId: string;
      payload: {
        regions: Array<{
          region: string;
          sensation: string;
          activities: Array<{
            activityKey: string;
            completed: boolean;
            skipped: boolean;
            durationSeconds?: number;
            response?: Record<string, unknown>;
          }>;
        }>;
      };
    }
  | {
      type: "pattern_awareness";
      courseId: string;
      payload: {
        exercises: Array<{
          exerciseKey: string;
          durationSeconds: number;
          metrics: Record<string, unknown>;
        }>;
      };
    }
  | {
      type: "reflect_act";
      courseId: string;
      payload: {
        userReflectionNotes?: string;
        acknowledgedAction?: string;
      };
    };

export type GameSubmissionResponse = {
  id: string;
  type: SupportedGameKey;
  score: number;
  isComplete: boolean;
  resultData: Record<string, unknown> | null;
  finalCourseScore?: {
    finalScore: number;
    scaleMax: number;
    breakdown: Array<{
      gameId: string;
      weight: number;
      score: number;
      weightedScore: number;
    }>;
  } | null;
};

export type SomaticActivityDetail = {
  activityKey: string;
  title: string;
  subtitle: string;
  type: "timed_exercise" | "awareness_test" | "movement_exercise";
  instruction: string;
  durationSeconds?: number;
  canSkip: boolean;
  ui: {
    animationType: string;
    imageKey?: string;
  };
};

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchCourseGameExperience,
  submitCourseGameExperience,
} from "./gameThunk";
import type {
  GamesState,
  PatternAwarenessExerciseKey,
  PatternAwarenessExerciseState,
  PatternAwarenessSessionState,
} from "./gameTypes";

const createPatternExerciseState = (): PatternAwarenessExerciseState => ({
  status: "not_started",
  durationSeconds: 0,
  score: 0,
  metrics: null,
  strokeCount: 0,
  updatedAt: null,
});

const createPatternAwarenessState = (): PatternAwarenessSessionState => ({
  stage: "hub",
  currentExerciseKey: null,
  exercises: {
    draw_your_breath: createPatternExerciseState(),
    awareness_circles: createPatternExerciseState(),
    scribble_drawing: createPatternExerciseState(),
  },
});

const initialState: GamesState = {
  currentGameKey: null,
  experience: null,
  submission: null,
  loading: false,
  submitting: false,
  loaded: false,
  error: null,
  patternAwareness: createPatternAwarenessState(),
};

const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    resetPatternAwarenessSession: (state) => {
      state.patternAwareness = createPatternAwarenessState();
    },
    openPatternAwarenessExercise: (
      state,
      action: PayloadAction<PatternAwarenessExerciseKey>,
    ) => {
      const exercise = state.patternAwareness.exercises[action.payload];
      if (exercise.status === "not_started") {
        exercise.status = "in_progress";
        exercise.updatedAt = new Date().toISOString();
      }

      state.patternAwareness.stage = "exercise";
      state.patternAwareness.currentExerciseKey = action.payload;
    },
    returnToPatternAwarenessHub: (state) => {
      state.patternAwareness.stage = "hub";
      state.patternAwareness.currentExerciseKey = null;
    },
    openPatternAwarenessAnalysis: (state) => {
      state.patternAwareness.stage = "analysis";
      state.patternAwareness.currentExerciseKey = null;
    },
    savePatternAwarenessExercise: (
      state,
      action: PayloadAction<{
        exerciseKey: PatternAwarenessExerciseKey;
        durationSeconds: number;
        score: number;
        strokeCount: number;
        metrics: Record<string, unknown>;
      }>,
    ) => {
      const { exerciseKey, durationSeconds, score, strokeCount, metrics } =
        action.payload;
      state.patternAwareness.exercises[exerciseKey] = {
        status: "completed",
        durationSeconds,
        score,
        strokeCount,
        metrics,
        updatedAt: new Date().toISOString(),
      };
      state.patternAwareness.stage = "hub";
      state.patternAwareness.currentExerciseKey = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseGameExperience.pending, (state) => {
        state.loading = true;
        state.loaded = false;
        state.error = null;
        state.experience = null;
        state.submission = null;
        state.currentGameKey = null;
      })
      .addCase(fetchCourseGameExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.experience = action.payload;
        state.currentGameKey = action.payload.lesson.gameKey;
        if (action.payload.lesson.gameKey !== "pattern_awareness") {
          state.patternAwareness = createPatternAwarenessState();
        }
      })
      .addCase(fetchCourseGameExperience.rejected, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.error = String(
          action.payload || "Unable to load this game experience.",
        );
      })
      .addCase(submitCourseGameExperience.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitCourseGameExperience.fulfilled, (state, action) => {
        state.submitting = false;
        state.submission = action.payload;
        if (state.experience && action.payload.resultData) {
          state.experience.existingResult = action.payload.resultData;
        }
      })
      .addCase(submitCourseGameExperience.rejected, (state, action) => {
        state.submitting = false;
        state.error = String(
          action.payload || "Unable to save this activity right now.",
        );
      });
  },
});

export const {
  resetPatternAwarenessSession,
  openPatternAwarenessExercise,
  returnToPatternAwarenessHub,
  openPatternAwarenessAnalysis,
  savePatternAwarenessExercise,
} = gamesSlice.actions;

export const gamesReducer = gamesSlice.reducer;
export default gamesSlice.reducer;

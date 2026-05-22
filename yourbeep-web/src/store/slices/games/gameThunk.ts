import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { gameExperienceApi } from "@features/games/services/gameExperienceApi";
import type {
  GameSubmissionPayload,
  GameSubmissionResponse,
} from "@features/games/services/gameExperienceTypes";
import { getApiErrorMessage } from "@utils/apiError";
import type { GameExperienceData } from "./gameTypes";

const getApiErrorCode = (payload: unknown) => {
  if (!payload || typeof payload !== "object") return null;

  const record = payload as {
    response?: {
      data?: {
        error?: {
          code?: string;
        };
      };
    };
  };

  return record.response?.data?.error?.code ?? null;
};

const getThunkError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return getApiErrorMessage(error.response?.data, fallback);
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
};

export const fetchCourseGameExperience = createAsyncThunk<
  GameExperienceData,
  { courseId: string; gameId: string; contentItemId?: string | null },
  { rejectValue: string }
>("games/fetchExperience", async (input, { rejectWithValue }) => {
  try {
    const {
      content: contentResponse,
      lesson: lessonResponse,
    } = await gameExperienceApi.getCourseGame(
      input.courseId,
      input.gameId,
      input.contentItemId,
    );

    const shouldLoadExistingResult = lessonResponse.userStatus === "completed";
    const resultResponse = shouldLoadExistingResult
      ? await gameExperienceApi.getGameResult(input.gameId).catch((resultError) => {
          if (getApiErrorCode(resultError) === "NOT_FOUND") {
            return null;
          }

          throw resultError;
        })
      : null;

    return {
      content: contentResponse,
      lesson: lessonResponse,
      existingResult: resultResponse,
    };
  } catch (error) {
    return rejectWithValue(
      getThunkError(error, "Unable to load this game experience."),
    );
  }
});

export const submitCourseGameExperience = createAsyncThunk<
  GameSubmissionResponse,
  { gameId: string; payload: GameSubmissionPayload },
  { rejectValue: string }
>("games/submitExperience", async (input, { rejectWithValue }) => {
  try {
    return await gameExperienceApi.submitGame(input.gameId, input.payload);
  } catch (error) {
    return rejectWithValue(
      getThunkError(error, "Unable to save this activity right now."),
    );
  }
});

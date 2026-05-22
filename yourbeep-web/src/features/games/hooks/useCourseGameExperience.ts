import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@store/index";
import {
  fetchCourseGameExperience,
  submitCourseGameExperience,
} from "@store/slices/games";
import showToast from "@utils/showToast";
import type {
  GameSubmissionPayload,
} from "../services/gameExperienceTypes";

export const useCourseGameExperience = (
  courseId?: string,
  gameId?: string,
  contentItemId?: string | null,
) => {
  const dispatch = useAppDispatch();
  const { experience, submission, loading, submitting, error } = useAppSelector(
    (state) => state.games,
  );

  useEffect(() => {
    if (!courseId || !gameId) {
      return;
    }

    void dispatch(
      fetchCourseGameExperience({
        courseId,
        gameId,
        contentItemId,
      }),
    );
  }, [contentItemId, courseId, dispatch, gameId]);

  const submit = async (
    payload: GameSubmissionPayload,
    options?: { silent?: boolean },
  ) => {
    if (!gameId) return null;

    try {
      const response = await dispatch(
        submitCourseGameExperience({
          gameId,
          payload,
        }),
      ).unwrap();

      if (!options?.silent) {
        showToast({
          type: response.isComplete ? "success" : "info",
          message: response.isComplete
            ? "Practice completed"
            : "Checkpoint saved",
          options: {
            description: response.isComplete
              ? "Your latest response has been saved and the next part of the journey is ready."
              : "Your progress is saved and you can continue to the next step.",
          },
        });
      }
      return response;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : String(err || "Unable to save this activity right now.");

      if (!options?.silent) {
        showToast({
          type: "error",
          message: "Unable to save practice",
          options: {
            description: message,
          },
        });
      }
      return null;
    }
  };

  const siblingLessons = useMemo(
    () => experience?.content.contentItems.filter((item) => item.type === "game") ?? [],
    [experience],
  );

  return {
    content: experience?.content ?? null,
    lesson: experience?.lesson ?? null,
    siblingLessons,
    existingResult: experience?.existingResult ?? null,
    submission,
    loading,
    submitting,
    error,
    submit,
  };
};

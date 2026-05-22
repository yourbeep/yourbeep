import api from "@services/api";
import { learningApi } from "@features/learning/services/learningApi";
import type {
  GameSubmissionPayload,
  GameSubmissionResponse,
  SomaticActivityDetail,
} from "./gameExperienceTypes";
import type { LearningContentItem } from "@features/learning/services/learningTypes";

type RawCourseGame = {
  _id?: string;
  gameId?:
    | string
    | {
        _id?: string;
        title?: string;
        key?: string;
        description?: string;
      };
  title?: string;
  type?: string;
  gameKey?: string;
  description?: string;
};

type RawCourseDetail = {
  _id: string;
  title: string;
  contentItems?: Array<{
    _id?: string;
    refId?: string;
    title?: string;
    type?: string;
    description?: string | null;
    durationMinutes?: number | null;
    isFree?: boolean;
    order?: number;
    videoId?: string | null;
    bunnyVideoId?: string | null;
    gameKey?: string | null;
    interactiveCueCount?: number;
    userStatus?: string;
  }>;
  games?: RawCourseGame[];
};

const mapSubmissionResponse = (data: Record<string, unknown>): GameSubmissionResponse => ({
  id: String(data._id || data.id || ""),
  type: String(data.type || "awareness_states") as GameSubmissionResponse["type"],
  score: Number(data.score ?? 0),
  isComplete: Boolean(data.isComplete),
  resultData:
    data.resultData && typeof data.resultData === "object"
      ? (data.resultData as Record<string, unknown>)
      : null,
  finalCourseScore:
    data.finalCourseScore && typeof data.finalCourseScore === "object"
      ? (data.finalCourseScore as GameSubmissionResponse["finalCourseScore"])
      : null,
});

export const gameExperienceApi = {
  async getCourseGame(
    courseId: string,
    gameId: string,
    contentItemId?: string | null,
  ) {
    const content = await learningApi.getCourseContent(courseId);
    const lesson =
      content.contentItems.find(
        (item) =>
          item.type === "game" &&
          item.gameKey &&
          (item.refId === gameId || item.id === gameId || item.id === contentItemId),
      ) ?? null;

    if (lesson?.gameKey) {
      return {
        content,
        lesson: {
          ...lesson,
          gameId: lesson.refId,
          gameKey: lesson.gameKey,
        },
      };
    }

    const detailResponse = await api.get(`/courses/${courseId}`);
    const detail = (detailResponse.data?.data ?? {}) as RawCourseDetail;
    const fallbackGame = detail.games?.find((game) => {
      const refId =
        typeof game.gameId === "string" ? game.gameId : game.gameId?._id;
      return refId === gameId || game._id === gameId;
    });

    if (!fallbackGame) {
      throw new Error("Game not found in this course.");
    }

    const fallbackLesson: LearningContentItem = {
      id: contentItemId || String(fallbackGame._id || gameId),
      order: content.contentItems.filter((item) => item.type === "game").length + 1,
      type: "game",
      refId:
        String(
          (typeof fallbackGame.gameId === "string"
            ? fallbackGame.gameId
            : fallbackGame.gameId?._id) || gameId,
        ),
      gameKey:
        fallbackGame.gameKey ||
        (typeof fallbackGame.gameId === "string"
          ? null
          : fallbackGame.gameId?.key) ||
        "guided_game",
      title:
        fallbackGame.title ||
        (typeof fallbackGame.gameId === "string"
          ? "Interactive Practice"
          : fallbackGame.gameId?.title) ||
        "Interactive Practice",
      description:
        fallbackGame.description ||
        (typeof fallbackGame.gameId === "string"
          ? "A guided interactive practice inside this course."
          : fallbackGame.gameId?.description) ||
        "A guided interactive practice inside this course.",
      durationMinutes: null,
      isFree: false,
      videoId: null,
      bunnyVideoId: null,
      interactiveCueCount: 0,
      userStatus: "not_started",
    };

    return {
      content,
      lesson: {
        ...fallbackLesson,
        gameId: fallbackLesson.refId,
        gameKey: fallbackLesson.gameKey as NonNullable<LearningContentItem["gameKey"]>,
      },
    };
  },

  async submitGame(gameId: string, payload: GameSubmissionPayload) {
    const response = await api.post(`/games/${gameId}/submit`, payload);
    return mapSubmissionResponse(response.data?.data?.submission ?? {});
  },

  async getGameResult(gameId: string) {
    const response = await api.get(`/games/${gameId}/result`);
    const data = response.data?.data;
    return data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  },

  async getActivityDetail(gameId: string, activityKey: string) {
    const response = await api.get(`/games/${gameId}/activities/${activityKey}`);
    const data = response.data?.data;
    return data && typeof data === "object" ? (data as SomaticActivityDetail) : null;
  },
};

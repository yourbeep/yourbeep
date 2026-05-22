import api from "@services/api";
import type {
  CourseContentData,
  LearningContentItem,
  VideoStreamData,
  VideoWatchEventPayload,
} from "./learningTypes";

type RawContentResponse = {
  courseId?: string;
  title?: string;
  contentItems?: Array<{
    _id?: string;
    order?: number;
    type?: string;
    refId?: string;
    gameKey?: string | null;
    title?: string;
    description?: string | null;
    durationMinutes?: number | null;
    isFree?: boolean;
    videoId?: string | null;
    bunnyVideoId?: string | null;
    interactiveCueCount?: number;
    userStatus?: string;
  }>;
  progress?: {
    completed?: number;
    total?: number;
    percentComplete?: number;
  };
};

const mapContentItem = (
  item: NonNullable<RawContentResponse["contentItems"]>[number],
): LearningContentItem => ({
  id: String(item._id || item.refId || ""),
  order: Number(item.order ?? 0),
  type: item.type === "game" ? "game" : "video",
  refId: String(item.refId || ""),
  gameKey: typeof item.gameKey === "string" ? item.gameKey : null,
  title: String(item.title || "Untitled lesson"),
  description:
    typeof item.description === "string" && item.description.trim()
      ? item.description
      : "A guided step designed to help you move deeper into practice.",
  durationMinutes:
    typeof item.durationMinutes === "number" ? item.durationMinutes : null,
  isFree: Boolean(item.isFree),
  videoId: typeof item.videoId === "string" ? item.videoId : null,
  bunnyVideoId: typeof item.bunnyVideoId === "string" ? item.bunnyVideoId : null,
  interactiveCueCount: Number(item.interactiveCueCount ?? 0),
  userStatus: String(item.userStatus || "not_started"),
});

export const learningApi = {
  async getCourseContent(courseId: string): Promise<CourseContentData> {
    const response = await api.get(`/courses/${courseId}/content`);
    const data = (response.data?.data ?? {}) as RawContentResponse;

    return {
      courseId: String(data.courseId || courseId),
      title: String(data.title || "Course content"),
      contentItems: (data.contentItems ?? []).map(mapContentItem),
      progress: {
        completed: Number(data.progress?.completed ?? 0),
        total: Number(data.progress?.total ?? 0),
        percentComplete: Number(data.progress?.percentComplete ?? 0),
      },
    };
  },

  async getVideoStream(courseId: string, videoId: string): Promise<VideoStreamData> {
    const response = await api.get(`/courses/${courseId}/videos/${videoId}/stream`);
    const data = response.data?.data ?? {};

    return {
      streamUrl: String(data.streamUrl || ""),
      expiresIn: Number(data.expiresIn ?? 0),
      title: String(data.title || "Lesson"),
      durationSeconds: Number(data.durationSeconds ?? 0),
      thumbnailUrl: typeof data.thumbnailUrl === "string" ? data.thumbnailUrl : null,
      interactiveCues: Array.isArray(data.interactiveCues)
        ? data.interactiveCues.map((cue: Record<string, unknown>) => ({
            triggerAtSeconds: Number(cue.triggerAtSeconds ?? 0),
            gameId: String(cue.gameId || ""),
            gameKey: String(cue.gameKey || ""),
            gameTitle: String(cue.gameTitle || ""),
            subActivityKey:
              typeof cue.subActivityKey === "string" ? cue.subActivityKey : null,
            subActivityLabel:
              typeof cue.subActivityLabel === "string" ? cue.subActivityLabel : null,
            title: String(cue.title || ""),
            description: String(cue.description || ""),
            ctaLabel: String(cue.ctaLabel || "Start Activity"),
            pauseVideo: Boolean(cue.pauseVideo),
            isSkippable: Boolean(cue.isSkippable),
          }))
        : [],
    };
  },

  async recordWatchEvent(
    courseId: string,
    videoId: string,
    payload: VideoWatchEventPayload,
  ) {
    await api.post(`/courses/${courseId}/videos/${videoId}/watch-event`, payload);
  },
};

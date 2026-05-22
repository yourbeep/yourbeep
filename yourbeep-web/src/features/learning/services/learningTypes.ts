export type LearningContentItem = {
  id: string;
  order: number;
  type: "video" | "game";
  refId: string;
  gameKey: string | null;
  title: string;
  description: string;
  durationMinutes: number | null;
  isFree: boolean;
  videoId: string | null;
  bunnyVideoId: string | null;
  interactiveCueCount: number;
  userStatus: string;
};

export type CourseContentData = {
  courseId: string;
  title: string;
  contentItems: LearningContentItem[];
  progress: {
    completed: number;
    total: number;
    percentComplete: number;
  };
};

export type InteractiveCue = {
  triggerAtSeconds: number;
  gameId: string;
  gameKey: string;
  gameTitle: string;
  subActivityKey?: string | null;
  subActivityLabel?: string | null;
  title: string;
  description: string;
  ctaLabel: string;
  pauseVideo: boolean;
  isSkippable: boolean;
};

export type VideoStreamData = {
  streamUrl: string;
  expiresIn: number;
  title: string;
  durationSeconds: number;
  thumbnailUrl: string | null;
  interactiveCues: InteractiveCue[];
};

export type VideoWatchEventPayload = {
  watchedSeconds: number;
  positionSeconds: number;
  contentItemId?: string;
  completed: boolean;
};

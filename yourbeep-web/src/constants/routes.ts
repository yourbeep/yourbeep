export const appRoutes = {
  home: "/",
  auth: "/auth",
  dashboard: "/dashboard",
  courses: "/courses",
  games: "/games",
  contact: "/contact",
  terms: "/terms",
  privacy: "/privacy",
  refund: "/refund",
  courseDetail: (courseId: string) => `/courses/${courseId}`,
  coursePricing: (courseId: string) => `/courses/${courseId}/pricing`,
  courseLearn: (courseId: string) => `/courses/${courseId}/learn`,
  courseGame: (
    courseId: string,
    gameId: string,
    options?: {
      contentItemId?: string;
      videoId?: string;
      cueAt?: number;
      subActivityKey?: string;
    },
  ) => {
    const params = new URLSearchParams();
    if (options?.contentItemId) params.set("contentItemId", options.contentItemId);
    if (options?.videoId) params.set("videoId", options.videoId);
    if (typeof options?.cueAt === "number") params.set("cueAt", String(options.cueAt));
    if (options?.subActivityKey) params.set("subActivityKey", options.subActivityKey);
    const query = params.toString();
    return `/courses/${courseId}/games/${gameId}${query ? `?${query}` : ""}`;
  },
  courseGameRegion: (
    courseId: string,
    gameId: string,
    region: string,
    options?: {
      contentItemId?: string;
      videoId?: string;
    },
  ) => {
    const params = new URLSearchParams();
    if (options?.contentItemId) params.set("contentItemId", options.contentItemId);
    if (options?.videoId) params.set("videoId", options.videoId);
    const query = params.toString();
    return `/courses/${courseId}/games/${gameId}/regions/${region}${query ? `?${query}` : ""}`;
  },
  courseGameActivity: (
    courseId: string,
    gameId: string,
    activityKey: string,
    options?: {
      contentItemId?: string;
      videoId?: string;
      region?: string;
      sensation?: string;
    },
  ) => {
    const params = new URLSearchParams();
    if (options?.contentItemId) params.set("contentItemId", options.contentItemId);
    if (options?.videoId) params.set("videoId", options.videoId);
    if (options?.region) params.set("region", options.region);
    if (options?.sensation) params.set("sensation", options.sensation);
    const query = params.toString();
    return `/courses/${courseId}/games/${gameId}/activities/${activityKey}${query ? `?${query}` : ""}`;
  },
  courseVideo: (courseId: string, videoId: string, contentItemId?: string) =>
    `/courses/${courseId}/videos/${videoId}${contentItemId ? `?contentItemId=${contentItemId}` : ""}`,
} as const;

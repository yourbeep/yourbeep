import { AppError, env, httpJson } from "@yourbeep/shared";
import { Types } from "mongoose";
import { ActivityLogModel } from "../models/activity-log";
import { UserModel } from "../models/user";
import { getProgressionSnapshot, getTotalXpFromLogs } from "./progression.service";

type AuthUser = {
  id: string;
  email: string;
  firebaseUid: string;
  role: "user" | "admin";
};

type CommercePurchase = {
  courseId: string;
  planType: "six_month" | "annual";
  status: "pending" | "active" | "expired" | "cancelled" | "refunded";
  accessGranted?: boolean;
  expiryDate?: string | null;
};

type CourseContentItem = {
  _id: string;
  order: number;
  type: "video" | "game";
  refId: string;
  title: string;
  description?: string | null;
  durationMinutes?: number | null;
  isFree: boolean;
  videoId?: string | null;
  bunnyVideoId?: string | null;
  interactiveCueCount?: number;
  userStatus?: "completed" | "not_started" | "in_progress";
};

type CourseContentResponse = {
  courseId: string;
  title: string;
  contentItems: CourseContentItem[];
  progress: {
    completed: number;
    total: number;
    percentComplete: number;
  };
};

type ContentCourseDetail = {
  _id: string;
  title: string;
  thumbnail?: string | null;
  durationMinutes?: number | null;
  games?: Array<{ gameId: string; weight: number }>;
};

type SubmissionRecord = {
  _id: string;
  type: "awareness_states" | "somatic_states" | "pattern_awareness" | "reflect_act";
  score: number;
  completedAt?: string | null;
  resultData?: Record<string, unknown>;
  payload?: Record<string, unknown>;
};

type CourseSubmissionResponse = {
  submissions: SubmissionRecord[];
  finalCourseScore?: {
    finalScore: number;
    scaleMax: number;
  } | null;
};

type MasterCoursePayload = {
  title: string;
  description?: string | null;
  bunnyVideoId?: string | null;
  thumbnail?: string | null;
  durationSeconds?: number | null;
};

type HomeMetric = {
  id: "emotional_signal" | "physiological_efficiency" | "pattern_efficiency";
  title: string;
  subtitle: string;
  score: number;
  unit: "%";
  weeklyChange: number;
  trend: "up" | "down" | "baseline";
  icon: string;
};

type RecommendationCandidate = {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  durationMinutes: number;
  contentType: string;
  category: string;
  stateMatchScore: number;
  courseId: string | null;
  order: number;
};

const buildInternalAuthHeaders = (user: AuthUser) => ({
  "x-user-id": user.id,
  "x-user-email": user.email,
  "x-user-role": user.role,
  "x-firebase-uid": user.firebaseUid,
});

const toDate = (value?: string | Date | null) => (value ? new Date(value) : null);

const average = (values: number[]) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const round = (value: number) => Number(value.toFixed(2));

const roundPercent = (value: number) => Math.round(clamp(value, 0, 100));

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const subDays = (date: Date, days: number) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() - days);
  return copy;
};

const getWatchSeconds = (metadata?: Record<string, unknown>) => {
  const watchedSeconds = metadata?.watchedSeconds;
  return typeof watchedSeconds === "number" && Number.isFinite(watchedSeconds) ? watchedSeconds : 0;
};

const getWeakMetricId = (metrics: HomeMetric[]) =>
  [...metrics].sort((left, right) => left.score - right.score)[0]?.id ?? "emotional_signal";

const inferCategoryFromText = (value: string) => {
  const normalized = value.toLowerCase();

  if (
    normalized.includes("somatic") ||
    normalized.includes("breath") ||
    normalized.includes("body") ||
    normalized.includes("vagal") ||
    normalized.includes("recovery") ||
    normalized.includes("nervous")
  ) {
    return "RECOVERY";
  }

  if (
    normalized.includes("pattern") ||
    normalized.includes("reflect") ||
    normalized.includes("scribble") ||
    normalized.includes("awareness circles")
  ) {
    return "PATTERN";
  }

  return "VAGAL_TONE";
};

const getRecommendationMatch = (weakMetricId: HomeMetric["id"], value: string) => {
  const normalized = value.toLowerCase();

  if (
    weakMetricId === "emotional_signal" &&
    (normalized.includes("awareness") || normalized.includes("reflect"))
  ) {
    return 0.94;
  }

  if (
    weakMetricId === "physiological_efficiency" &&
    (normalized.includes("somatic") ||
      normalized.includes("body") ||
      normalized.includes("breath") ||
      normalized.includes("vagal") ||
      normalized.includes("recovery"))
  ) {
    return 0.93;
  }

  if (
    weakMetricId === "pattern_efficiency" &&
    (normalized.includes("pattern") || normalized.includes("scribble") || normalized.includes("circles"))
  ) {
    return 0.92;
  }

  return 0.68;
};

const calculateWindowChange = (current: number, previous: number) => {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }

  return round(((current - previous) / previous) * 100);
};

const buildMetricCard = (
  id: HomeMetric["id"],
  title: string,
  subtitle: string,
  icon: string,
  currentScore: number,
  previousScore: number,
): HomeMetric => {
  const score = roundPercent((currentScore / 3) * 100);
  const previous = roundPercent((previousScore / 3) * 100);
  const weeklyChange = round(score - previous);

  return {
    id,
    title,
    subtitle,
    score,
    unit: "%",
    weeklyChange,
    trend: weeklyChange > 0 ? "up" : weeklyChange < 0 ? "down" : "baseline",
    icon,
  };
};

const fetchUserPurchases = async (user: AuthUser) => {
  const data = await httpJson<{ success: boolean; data: { purchases: CommercePurchase[] } }>(
    `${env.COMMERCE_URL}/commerce/purchases`,
    {
      method: "GET",
      headers: buildInternalAuthHeaders(user),
    },
  );

  return data.data.purchases.filter((purchase) => purchase.accessGranted && purchase.status === "active");
};

const fetchCourseDetail = async (courseId: string, user: AuthUser) => {
  const data = await httpJson<{ success: boolean; data: ContentCourseDetail }>(
    `${env.CONTENT_URL}/courses/${courseId}`,
    {
      method: "GET",
      headers: buildInternalAuthHeaders(user),
    },
  );

  return data.data;
};

const fetchCourseContent = async (courseId: string, user: AuthUser) => {
  const data = await httpJson<{ success: boolean; data: CourseContentResponse }>(
    `${env.CONTENT_URL}/courses/${courseId}/content`,
    {
      method: "GET",
      headers: buildInternalAuthHeaders(user),
    },
  );

  return data.data;
};

const fetchCourseSubmissions = async (courseId: string, user: AuthUser) => {
  const data = await httpJson<{ success: boolean; data: CourseSubmissionResponse }>(
    `${env.CONTENT_URL}/courses/${courseId}/submissions`,
    {
      method: "GET",
      headers: buildInternalAuthHeaders(user),
    },
  );

  return data.data;
};

const fetchMasterCourse = async (user: AuthUser) => {
  const data = await httpJson<{ success: boolean; data: MasterCoursePayload }>(
    `${env.CONTENT_URL}/master-course`,
    {
      method: "GET",
      headers: buildInternalAuthHeaders(user),
    },
  ).catch(() => null);

  return data?.data ?? null;
};

const getLatestSubmissionByType = (submissions: SubmissionRecord[], type: SubmissionRecord["type"]) =>
  submissions
    .filter((submission) => submission.type === type)
    .sort((left, right) => {
      const leftTime = toDate(left.completedAt)?.getTime() ?? 0;
      const rightTime = toDate(right.completedAt)?.getTime() ?? 0;
      return rightTime - leftTime;
    })[0] ?? null;

const getWindowSubmissionAverage = (
  submissions: SubmissionRecord[],
  type: SubmissionRecord["type"],
  start: Date,
  end: Date,
) => {
  const scores = submissions
    .filter((submission) => submission.type === type)
    .filter((submission) => {
      const completedAt = toDate(submission.completedAt);
      return completedAt ? completedAt >= start && completedAt < end : false;
    })
    .map((submission) => submission.score);

  return average(scores);
};

export const getHomeDashboard = async (firebaseUid: string) => {
  const user = await UserModel.findOne({ firebaseUid, isActive: true });
  if (!user) {
    throw new AppError("User profile does not exist yet", 404, "USER_NOT_FOUND");
  }

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    firebaseUid: user.firebaseUid,
    role: user.role,
  };

  const activePurchases = await fetchUserPurchases(authUser);
  const [masterCourse, activityLogs] = await Promise.all([
    fetchMasterCourse(authUser),
    ActivityLogModel.find({ userId: new Types.ObjectId(user.id) }).sort({ completedAt: -1 }).limit(500),
  ]);

  const purchasedCourseIds = [...new Set(activePurchases.map((purchase) => String(purchase.courseId)))];
  const courseBundles = await Promise.all(
    purchasedCourseIds.map(async (courseId) => {
      const [detail, content, submissions] = await Promise.all([
        fetchCourseDetail(courseId, authUser).catch(() => null),
        fetchCourseContent(courseId, authUser).catch(() => null),
        fetchCourseSubmissions(courseId, authUser).catch(() => null),
      ]);

      return {
        courseId,
        detail,
        content,
        submissions,
      };
    }),
  );

  const submissions = courseBundles.flatMap((bundle) => bundle.submissions?.submissions ?? []);
  const now = new Date();
  const currentWindowStart = startOfDay(subDays(now, 6));
  const previousWindowStart = startOfDay(subDays(now, 13));

  const latestAwareness = getLatestSubmissionByType(submissions, "awareness_states");
  const latestSomatic = getLatestSubmissionByType(submissions, "somatic_states");
  const latestPattern = getLatestSubmissionByType(submissions, "pattern_awareness");

  const currentEmotionalAverage =
    getWindowSubmissionAverage(submissions, "awareness_states", currentWindowStart, now) || latestAwareness?.score || 0;
  const previousEmotionalAverage =
    getWindowSubmissionAverage(submissions, "awareness_states", previousWindowStart, currentWindowStart) ||
    currentEmotionalAverage;
  const currentPhysiologyAverage =
    getWindowSubmissionAverage(submissions, "somatic_states", currentWindowStart, now) || latestSomatic?.score || 0;
  const previousPhysiologyAverage =
    getWindowSubmissionAverage(submissions, "somatic_states", previousWindowStart, currentWindowStart) ||
    currentPhysiologyAverage;
  const currentPatternAverage =
    getWindowSubmissionAverage(submissions, "pattern_awareness", currentWindowStart, now) || latestPattern?.score || 0;
  const previousPatternAverage =
    getWindowSubmissionAverage(submissions, "pattern_awareness", previousWindowStart, currentWindowStart) ||
    currentPatternAverage;

  const metrics = [
    buildMetricCard(
      "emotional_signal",
      "Emotional Signal",
      "Coherence Level",
      "waves",
      currentEmotionalAverage,
      previousEmotionalAverage,
    ),
    buildMetricCard(
      "physiological_efficiency",
      "Physiological Efficiency",
      "Restoration Index",
      "moon",
      currentPhysiologyAverage,
      previousPhysiologyAverage,
    ),
    buildMetricCard(
      "pattern_efficiency",
      "Pattern Efficiency",
      "Restoration Index",
      "pattern",
      currentPatternAverage,
      previousPatternAverage,
    ),
  ];

  const trendScoreDelta = average([
    currentEmotionalAverage - previousEmotionalAverage,
    currentPhysiologyAverage - previousPhysiologyAverage,
    currentPatternAverage - previousPatternAverage,
  ]);

  const derivedXp = getTotalXpFromLogs(activityLogs);
  const totalXp = Math.max(user.points, derivedXp);
  const progression = getProgressionSnapshot(totalXp, trendScoreDelta);

  const currentWindowLogs = activityLogs.filter((entry) => entry.completedAt >= currentWindowStart);
  const previousWindowLogs = activityLogs.filter(
    (entry) => entry.completedAt >= previousWindowStart && entry.completedAt < currentWindowStart,
  );

  const observationCurrentMinutes = round(
    currentWindowLogs
      .filter((entry) => entry.type === "video_watch")
      .reduce((sum, entry) => sum + getWatchSeconds(entry.metadata), 0) / 60,
  );
  const observationPreviousMinutes = round(
    previousWindowLogs
      .filter((entry) => entry.type === "video_watch")
      .reduce((sum, entry) => sum + getWatchSeconds(entry.metadata), 0) / 60,
  );
  const reflectionCurrentMinutes = round(
    submissions
      .filter((submission) => {
        const completedAt = toDate(submission.completedAt);
        return completedAt ? completedAt >= currentWindowStart && completedAt <= now : false;
      })
      .reduce((sum, submission) => {
        if (submission.type === "somatic_states") {
          const regions = Array.isArray(submission.payload?.regions) ? submission.payload.regions : [];
          const seconds = regions.reduce((regionSum, region) => {
            if (!region || typeof region !== "object") {
              return regionSum;
            }

            const activities = Array.isArray((region as { activities?: unknown[] }).activities)
              ? ((region as { activities?: Array<{ durationSeconds?: number }> }).activities ?? [])
              : [];

            return (
              regionSum +
              activities.reduce(
                (activitySum, activity) =>
                  activitySum + (typeof activity?.durationSeconds === "number" ? activity.durationSeconds : 0),
                0,
              )
            );
          }, 0);

          return sum + seconds;
        }

        if (submission.type === "pattern_awareness") {
          const exercises = Array.isArray(submission.payload?.exercises) ? submission.payload.exercises : [];
          const seconds = exercises.reduce(
            (exerciseSum, exercise) =>
              exerciseSum +
              (exercise && typeof exercise === "object" && typeof (exercise as { durationSeconds?: number }).durationSeconds === "number"
                ? (exercise as { durationSeconds: number }).durationSeconds
                : 0),
            0,
          );

          return sum + seconds;
        }

        return sum + (submission.type === "reflect_act" ? 300 : 420);
      }, 0) / 60,
  );
  const reflectionPreviousMinutes = round(
    submissions
      .filter((submission) => {
        const completedAt = toDate(submission.completedAt);
        return completedAt ? completedAt >= previousWindowStart && completedAt < currentWindowStart : false;
      })
      .reduce((sum, submission) => {
        if (submission.type === "somatic_states") {
          const regions = Array.isArray(submission.payload?.regions) ? submission.payload.regions : [];
          const seconds = regions.reduce((regionSum, region) => {
            if (!region || typeof region !== "object") {
              return regionSum;
            }

            const activities = Array.isArray((region as { activities?: unknown[] }).activities)
              ? ((region as { activities?: Array<{ durationSeconds?: number }> }).activities ?? [])
              : [];

            return (
              regionSum +
              activities.reduce(
                (activitySum, activity) =>
                  activitySum + (typeof activity?.durationSeconds === "number" ? activity.durationSeconds : 0),
                0,
              )
            );
          }, 0);

          return sum + seconds;
        }

        if (submission.type === "pattern_awareness") {
          const exercises = Array.isArray(submission.payload?.exercises) ? submission.payload.exercises : [];
          const seconds = exercises.reduce(
            (exerciseSum, exercise) =>
              exerciseSum +
              (exercise && typeof exercise === "object" && typeof (exercise as { durationSeconds?: number }).durationSeconds === "number"
                ? (exercise as { durationSeconds: number }).durationSeconds
                : 0),
            0,
          );

          return sum + seconds;
        }

        return sum + (submission.type === "reflect_act" ? 300 : 420);
      }, 0) / 60,
  );

  const weakestMetricId = getWeakMetricId(metrics);

  const recommendationPool: RecommendationCandidate[] = courseBundles.flatMap((bundle) => {
    const detail = bundle.detail;
    const content = bundle.content;

    if (!detail || !content) {
      return [];
    }

    return content.contentItems
      .filter((item) => item.userStatus !== "completed")
      .map((item) => {
        const searchText = `${item.title} ${item.description ?? ""} ${detail.title}`;
        const stateMatchScore = getRecommendationMatch(weakestMetricId, searchText);

        return {
          id: item._id,
          title: item.title,
          thumbnailUrl: detail.thumbnail ?? null,
          durationMinutes: item.durationMinutes ?? detail.durationMinutes ?? 10,
          contentType: item.type,
          category: inferCategoryFromText(searchText),
          stateMatchScore: round(stateMatchScore),
          courseId: bundle.courseId,
          order: item.order,
        };
      });
  });

  if (masterCourse) {
    recommendationPool.push({
      id: "master-course",
      title: masterCourse.title,
      thumbnailUrl: masterCourse.thumbnail ?? null,
      durationMinutes: masterCourse.durationSeconds ? Math.ceil(masterCourse.durationSeconds / 60) : 15,
      contentType: "video",
      category: "RECOVERY",
      stateMatchScore: round(getRecommendationMatch(weakestMetricId, masterCourse.title)),
      courseId: null,
      order: 0,
    });
  }

  const recommendations = recommendationPool
    .sort((left, right) => right.stateMatchScore - left.stateMatchScore || left.order - right.order)
    .slice(0, 6)
    .map(({ order: _order, courseId: _courseId, ...item }) => item);

  const continueLearning = courseBundles
    .filter((bundle) => bundle.detail && bundle.content)
    .map((bundle) => {
      const nextItem = bundle.content!.contentItems.find((item) => item.userStatus !== "completed") ?? null;

      return {
        courseId: bundle.courseId,
        title: bundle.detail!.title,
        thumbnailUrl: bundle.detail!.thumbnail ?? null,
        percentComplete: bundle.content!.progress.percentComplete,
        nextItem: nextItem
          ? {
              itemId: nextItem._id,
              title: nextItem.title,
              type: nextItem.type,
              videoId: nextItem.videoId ?? null,
            }
          : null,
      };
    })
    .sort((left, right) => right.percentComplete - left.percentComplete);

  return {
    header: {
      user: {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatar ?? null,
      },
      greeting:
        now.getHours() < 12 ? "Good Morning" : now.getHours() < 17 ? "Good Afternoon" : "Good Evening",
      subtitle: "Let's check in with your current state",
      notifications: {
        unreadCount: 0,
      },
    },
    progression,
    activityEngagement: {
      observationTime: {
        minutes: observationCurrentMinutes,
        changePercentage: calculateWindowChange(observationCurrentMinutes, observationPreviousMinutes),
        trend:
          observationCurrentMinutes > observationPreviousMinutes
            ? "up"
            : observationCurrentMinutes < observationPreviousMinutes
              ? "down"
              : "baseline",
      },
      reflectionTime: {
        minutes: reflectionCurrentMinutes,
        changePercentage: calculateWindowChange(reflectionCurrentMinutes, reflectionPreviousMinutes),
        trend:
          reflectionCurrentMinutes > reflectionPreviousMinutes
            ? "up"
            : reflectionCurrentMinutes < reflectionPreviousMinutes
              ? "down"
              : "baseline",
      },
    },
    metrics,
    continueLearning,
    recommendations,
  };
};

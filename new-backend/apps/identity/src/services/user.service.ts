import { AppError, env, httpJson } from "@yourbeep/shared";
import { Types } from "mongoose";
import { ActivityLogModel } from "../models/activity-log";
import { ContactRequestModel } from "../models/contact-request";
import { NotificationCampaignModel } from "../models/notification-campaign";
import { SupportTicketModel } from "../models/support-ticket";
import { UserDeviceModel } from "../models/user-device";
import { UserModel } from "../models/user";
import { getNotificationCenterSummary } from "./notification.service";
import { getAdminTicketSummary } from "./support-ticket.service";
import { getHomeDashboard } from "./home.service";
import { getProgressionSnapshot, getTotalXpFromLogs } from "./progression.service";
import { deactivateUserDeviceByToken, upsertUserDevice } from "./user-device.service";
import type { z } from "zod";
import {
  adminDashboardQuerySchema,
  activityLogQuerySchema,
  paginationSchema,
  registerFcmSchema,
  removeFcmSchema,
  updateProfileSchema,
  updateRoleSchema,
} from "../validators";

type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
type PaginationInput = z.infer<typeof paginationSchema>;
type AdminDashboardQueryInput = z.infer<typeof adminDashboardQuerySchema>;
type ActivityLogQueryInput = z.infer<typeof activityLogQuerySchema>;
type RegisterFcmInput = z.infer<typeof registerFcmSchema>;
type RemoveFcmInput = z.infer<typeof removeFcmSchema>;
type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

type CommercePurchase = {
  _id?: string;
  id?: string;
  courseId: string;
  planType: "six_month" | "annual";
  status: "pending" | "active" | "expired" | "cancelled" | "refunded";
  expiryDate?: string | null;
  startDate?: string | null;
  accessGranted?: boolean;
  purchasedAt?: string | null;
};

type ContentCourseDetail = {
  _id: string;
  title: string;
  subtitle?: string;
  shortDescription?: string;
  description?: string;
  thumbnail?: string;
  trailerVideoId?: string;
  durationMinutes?: number;
  games?: Array<{ gameId: string; weight: number }>;
  pricing?: {
    region: string;
    currency: string;
    amount: number;
    displayPrice: string;
  };
  userProgress?: {
    hasPurchase: boolean;
    planType: string | null;
    expiresAt: string | null;
    gamesCompleted: number;
    gamesTotal: number;
    percentComplete: number;
  };
};

type ContentCourseResponse = {
  courseId: string;
  title: string;
  contentItems: Array<{
    _id: string;
    order: number;
    type: "video" | "game";
    refId: string;
    title: string;
    description?: string | null;
    durationMinutes?: number | null;
    isFree: boolean;
    userStatus?: "completed" | "not_started" | "in_progress";
  }>;
  progress: {
    completed: number;
    total: number;
    percentComplete: number;
  };
};

type CourseSubmissionResponse = {
  submissions: Array<{
    _id: string;
    type: "awareness_states" | "somatic_states" | "pattern_awareness" | "reflect_act";
    score: number;
    completedAt?: string | null;
  }>;
  finalCourseScore?: {
    finalScore: number;
    scaleMax: number;
  } | null;
};

type AdminRevenueMetrics = {
  monthlyRevenue: {
    current: number;
    previous: number;
    delta: number;
    percentChange: number;
  };
  monthlyRevenueAverage: {
    current: number;
    previous: number;
    delta: number;
    percentChange: number;
  };
  currentMonthPurchaseCount: number;
  previousMonthPurchaseCount: number;
};

type AdminDashboardAnalytics = {
  monthlyRevenue: {
    current: number;
    previous: number;
    delta: number;
    percentChange: number;
  };
  monthlyRevenueAverage: {
    current: number;
    previous: number;
    delta: number;
    percentChange: number;
  };
  currentMonthPurchaseCount: number;
  previousMonthPurchaseCount: number;
  revenueChart: Array<{
    label: string;
    amount: number;
  }>;
  recentTransactions: Array<{
    id: string;
    type: "subscription_renewed" | "purchase_completed";
    userId: string;
    courseId: string;
    amount: number;
    currency: string;
    planType: "six_month" | "annual";
    createdAt: string;
  }>;
};

type AdminUserPurchaseSummary = {
  userId: string;
  totalPurchases: number;
  activePurchases: number;
  totalSpent: number;
  lastPurchaseAt: string | Date | null;
  activeCoursesCount: number;
  planTypes: string[];
};

type AdminUserPurchasesPayload = {
  stats: {
    totalSpent: number;
    totalOrders: number;
    activePurchases: number;
    refundedPurchases: number;
    lastPurchaseAt: string | null;
  };
  purchases: Array<{
    _id: string;
    courseId: string;
    planType: "six_month" | "annual";
    status: "pending" | "active" | "expired" | "cancelled" | "refunded";
    region: string;
    currency: string;
    originalAmount: number;
    discountAmount: number;
    amountPaid: number;
    promotionCode: string | null;
    accessGranted: boolean;
    startDate: string | null;
    expiryDate: string | null;
    purchasedAt: string | null;
    renewedFromId: string | null;
    stripeRefundId: string | null;
  }>;
};

type AdminPromotionSummary = {
  total: number;
  active: number;
  scheduled: number;
  expired: number;
  inactive: number;
  archived: number;
  autoApply: number;
  totalRedemptions: number;
  currentMonthRedemptions: number;
  currentMonthDiscountGiven: number;
};

type DashboardTimeRange = {
  start: Date;
  end: Date;
  previousStart: Date;
  previousEnd: Date;
  label: string;
  preset: AdminDashboardQueryInput["period"];
};

type DashboardCourseEngagementItem = {
  courseId: string;
  title: string;
  totalEvents: number;
  uniqueUsers: number;
  videoViews: number;
  progressUpdates: number;
  gameSubmissions: number;
  completionRate: number;
};

type DashboardGameEngagementItem = {
  gameKey: string;
  totalEvents: number;
  uniqueUsers: number;
  submissions: number;
  lastPlayedAt: string | null;
};

const buildInternalAuthHeaders = (user: { id: string; email: string; firebaseUid: string; role: "user" | "admin" }) => ({
  "x-user-id": user.id,
  "x-user-email": user.email,
  "x-user-role": user.role,
  "x-firebase-uid": user.firebaseUid,
});

const fetchUserPurchases = async (user: { id: string; email: string; firebaseUid: string; role: "user" | "admin" }) => {
  const data = await httpJson<{ success: boolean; data: { purchases: CommercePurchase[] } }>(
    `${env.COMMERCE_URL}/commerce/purchases`,
    {
      method: "GET",
      headers: buildInternalAuthHeaders(user),
    },
  );

  return data.data.purchases;
};

const fetchCourseDetail = async (courseId: string) => {
  const data = await httpJson<{ success: boolean; data: ContentCourseDetail }>(
    `${env.CONTENT_URL}/courses/${courseId}`,
    {
      method: "GET",
    },
  );

  return data.data;
};

const fetchCourseContent = async (courseId: string, user: { id: string; email: string; firebaseUid: string; role: "user" | "admin" }) => {
  const data = await httpJson<{ success: boolean; data: ContentCourseResponse }>(
    `${env.CONTENT_URL}/courses/${courseId}/content`,
    {
      method: "GET",
      headers: buildInternalAuthHeaders(user),
    },
  );

  return data.data;
};

const fetchCourseSubmissions = async (courseId: string, user: { id: string; email: string; firebaseUid: string; role: "user" | "admin" }) => {
  const data = await httpJson<{ success: boolean; data: CourseSubmissionResponse }>(
    `${env.CONTENT_URL}/courses/${courseId}/submissions`,
    {
      method: "GET",
      headers: buildInternalAuthHeaders(user),
    },
  );

  return data.data;
};

const calculateChange = (current: number, previous: number) => {
  const delta = Number((current - previous).toFixed(2));
  const percentChange =
    previous === 0 ? (current === 0 ? 0 : 100) : Number((((current - previous) / previous) * 100).toFixed(2));

  return {
    current: Number(current.toFixed(2)),
    previous: Number(previous.toFixed(2)),
    delta,
    percentChange,
  };
};

const calculatePercentChange = (current: number, previous: number) =>
  previous === 0 ? (current === 0 ? 0 : 100) : Number((((current - previous) / previous) * 100).toFixed(2));

const DAY_MS = 86_400_000;

const resolveDashboardTimeRange = (query: AdminDashboardQueryInput): DashboardTimeRange => {
  const now = new Date();
  const end = query.to ? new Date(query.to) : now;

  if (query.period === "custom" && query.from && query.to) {
    const start = new Date(query.from);
    const duration = Math.max(DAY_MS, end.getTime() - start.getTime());
    return {
      start,
      end,
      previousStart: new Date(start.getTime() - duration),
      previousEnd: new Date(start.getTime()),
      label: `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
      preset: query.period,
    };
  }

  const dayCount = query.period === "7d" ? 7 : query.period === "90d" ? 90 : 30;
  const start = new Date(end.getTime() - (dayCount - 1) * DAY_MS);
  return {
    start,
    end,
    previousStart: new Date(start.getTime() - dayCount * DAY_MS),
    previousEnd: new Date(start.getTime()),
    label: `Last ${dayCount} days`,
    preset: query.period,
  };
};

const formatDashboardDayLabel = (value: Date) =>
  value.toLocaleDateString("en-US", { month: "short", day: "numeric" });

const fetchAdminRevenueMetrics = async () => {
  const data = await httpJson<{ success: boolean; data: AdminRevenueMetrics }>(
    `${env.COMMERCE_URL}/internal/admin/revenue-metrics`,
    {
      method: "GET",
      headers: {
        "x-internal-service-key": env.INTERNAL_SERVICE_SECRET,
      },
    },
  );

  return data.data;
};

const fetchAdminDashboardAnalytics = async () => {
  const data = await httpJson<{ success: boolean; data: AdminDashboardAnalytics }>(
    `${env.COMMERCE_URL}/internal/admin/dashboard-analytics`,
    {
      method: "GET",
      headers: {
        "x-internal-service-key": env.INTERNAL_SERVICE_SECRET,
      },
    },
  );

  return data.data;
};

const fetchAdminUserPurchaseSummary = async (userIds: string[]) => {
  const data = await httpJson<{ success: boolean; data: { items: AdminUserPurchaseSummary[] } }>(
    `${env.COMMERCE_URL}/internal/admin/user-purchase-summary`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-internal-service-key": env.INTERNAL_SERVICE_SECRET,
      },
      body: JSON.stringify({ userIds }),
    },
  );

  return data.data.items;
};

const fetchAdminUserPurchases = async (userId: string) => {
  const data = await httpJson<{ success: boolean; data: AdminUserPurchasesPayload }>(
    `${env.COMMERCE_URL}/internal/admin/users/${userId}/purchases`,
    {
      method: "GET",
      headers: {
        "x-internal-service-key": env.INTERNAL_SERVICE_SECRET,
      },
    },
  );

  return data.data;
};

const fetchAdminCourseMetrics = async () => {
  const data = await httpJson<{
    success: boolean;
    data: {
      activeCourses: {
        current: number;
        previous: number;
      };
    };
  }>(`${env.CONTENT_URL}/internal/admin/course-metrics`, {
    method: "GET",
    headers: {
      "x-internal-service-key": env.INTERNAL_SERVICE_SECRET,
    },
  });

  return data.data;
};

const fetchAdminPromotionSummary = async () => {
  const data = await httpJson<{ success: boolean; data: AdminPromotionSummary }>(
    `${env.COMMERCE_URL}/internal/admin/promotion-summary`,
    {
      method: "GET",
      headers: {
        "x-internal-service-key": env.INTERNAL_SERVICE_SECRET,
      },
    },
  );

  return data.data;
};

export const getCurrentUser = async (firebaseUid: string) => {
  const user = await UserModel.findOne({ firebaseUid, isActive: true });

  if (!user) {
    throw new AppError("User profile does not exist yet", 404, "USER_NOT_FOUND");
  }

  return user;
};

export const getCurrentUserProfile = async (firebaseUid: string) => {
  const user = await getCurrentUser(firebaseUid);
  const [recentSessions, recentActivity] = await Promise.all([
    UserDeviceModel.find({ userId: new Types.ObjectId(user.id), isActive: true })
      .sort({ lastSeenAt: -1 })
      .limit(5),
    ActivityLogModel.find({ userId: new Types.ObjectId(user.id) })
      .sort({ completedAt: -1 })
      .limit(8),
  ]);

  return {
    ...user.toObject(),
    sessionSummary: {
      totalDevices: recentSessions.length,
      activeWebSessions: recentSessions.filter((session) => session.platform === "web").length,
      activeMobileSessions: recentSessions.filter((session) => session.platform !== "web").length,
      lastLoginAt: user.lastActiveAt ?? null,
    },
    recentSessions: recentSessions.map((session) => ({
      id: session.id,
      platform: session.platform,
      notificationsEnabled: session.notificationsEnabled,
      firstSeenAt: session.createdAt,
      lastSeenAt: session.lastSeenAt,
      tokenAttached: Boolean(session.fcmToken),
      ipAddress: session.ipAddress ?? null,
      userAgent: session.userAgent ?? null,
      deviceName: session.deviceName ?? null,
      countryCode: session.countryCode ?? null,
      regionName: session.regionName ?? null,
      city: session.city ?? null,
      locationLabel: session.locationLabel ?? null,
    })),
    recentAccessActivity: recentActivity.map((entry) => ({
      id: entry.id,
      type: entry.type,
      courseId: entry.courseId?.toString() ?? null,
      gameKey: entry.gameKey ?? null,
      completedAt: entry.completedAt,
      metadata: entry.metadata ?? {},
    })),
  };
};

export const updateCurrentUser = async (firebaseUid: string, payload: UpdateProfileInput) => {
  const user = await UserModel.findOneAndUpdate(
    { firebaseUid, isActive: true },
    { $set: payload },
    { new: true },
  );

  if (!user) {
    throw new AppError("User profile does not exist yet", 404, "USER_NOT_FOUND");
  }

  return user;
};

export const getCurrentUserStats = async (firebaseUid: string) => {
  const user = await getCurrentUser(firebaseUid);
  const activityLogs = await ActivityLogModel.find({ userId: new Types.ObjectId(user.id) })
    .sort({ completedAt: -1 })
    .limit(500);
  const totalXp = Math.max(user.points, getTotalXpFromLogs(activityLogs));
  const progression = getProgressionSnapshot(totalXp, 0);
  const minutesWatched = Math.round(
    activityLogs
      .filter((entry) => entry.type === "video_watch")
      .reduce((sum, entry) => {
        const watchedSeconds = entry.metadata?.watchedSeconds;
        return sum + (typeof watchedSeconds === "number" ? watchedSeconds : 0);
      }, 0) / 60,
  );
  const gamesCompleted = activityLogs.filter((entry) => entry.type === "game_submission").length;
  const courseProgressUpdates = activityLogs.filter((entry) => entry.type === "course_progress").length;

  return {
    userLevel: progression.level,
    points: totalXp,
    streakDays: user.streakDays,
    badges: user.badges,
    progression: {
      currentXp: progression.currentXp,
      nextLevelXp: progression.nextLevelXp,
      progressPercentage: progression.progressPercentage,
      stateTrend: progression.stateTrend,
      stateDirection: progression.stateDirection,
    },
    activitySummary: {
      totalActivities: activityLogs.length,
      gamesCompleted,
      courseProgressUpdates,
      minutesWatched,
    },
  };
};

export const getCurrentUserPurchases = async (firebaseUid: string) => {
  const user = await getCurrentUser(firebaseUid);
  return {
    purchases: await fetchUserPurchases({
      id: user.id,
      email: user.email,
      firebaseUid: user.firebaseUid,
      role: user.role,
    }),
  };
};

export const getCurrentUserProgress = async (firebaseUid: string) => {
  const user = await getCurrentUser(firebaseUid);
  const authUser = {
    id: user.id,
    email: user.email,
    firebaseUid: user.firebaseUid,
    role: user.role,
  };
  const purchases = await fetchUserPurchases(authUser);

  const coursePurchases = purchases.filter((purchase) =>
    ["active", "expired", "cancelled", "refunded"].includes(purchase.status),
  );

  const courses = await Promise.all(
    coursePurchases.map(async (purchase) => {
      const [course, content, submissions] = await Promise.all([
        fetchCourseDetail(String(purchase.courseId)).catch(() => null),
        fetchCourseContent(String(purchase.courseId), authUser).catch(() => null),
        fetchCourseSubmissions(String(purchase.courseId), authUser).catch(() => null),
      ]);
      const gamesTotal = course?.games?.length ?? 0;
      const percentComplete = content?.progress.percentComplete ?? course?.userProgress?.percentComplete ?? 0;
      const gamesCompleted =
        course?.userProgress?.gamesCompleted ?? Math.round((gamesTotal * percentComplete) / 100);
      const nextItem = content?.contentItems.find((item) => item.userStatus !== "completed") ?? null;
      const lastCompletedAt = submissions?.submissions
        .map((submission) => submission.completedAt)
        .filter((value): value is string => Boolean(value))
        .sort()
        .at(-1) ?? null;

      return {
        courseId: purchase.courseId,
        title: course?.title ?? "Course",
        thumbnail: course?.thumbnail ?? null,
        planType: purchase.planType,
        status: purchase.status,
        expiryDate: purchase.expiryDate ?? null,
        progress: {
          gamesCompleted,
          gamesTotal,
          percentComplete,
          contentCompleted: content?.progress.completed ?? 0,
          contentTotal: content?.progress.total ?? 0,
        },
        finalCourseScore: submissions?.finalCourseScore ?? null,
        nextItem: nextItem
          ? {
              itemId: nextItem._id,
              title: nextItem.title,
              type: nextItem.type,
              order: nextItem.order,
            }
          : null,
        lastCompletedAt,
      };
    }),
  );

  return {
    summary: {
      totalCourses: courses.length,
      activeCourses: courses.filter((course) => course.status === "active").length,
      completedCourses: courses.filter((course) => course.progress.percentComplete >= 100).length,
      averageCompletion:
        courses.length > 0
          ? Math.round(courses.reduce((sum, course) => sum + course.progress.percentComplete, 0) / courses.length)
          : 0,
    },
    courses,
  };
};

export const getCurrentUserDashboard = async (firebaseUid: string) => {
  return getHomeDashboard(firebaseUid);
};

export const getCurrentUserActivityLog = async (firebaseUid: string, query: ActivityLogQueryInput) => {
  const user = await getCurrentUser(firebaseUid);
  const filter: Record<string, unknown> = {
    userId: new Types.ObjectId(user.id),
  };

  if (query.courseId) {
    filter.courseId = new Types.ObjectId(query.courseId);
  }

  if (query.gameKey) {
    filter.gameKey = query.gameKey;
  }

  if (query.from || query.to) {
    filter.completedAt = {
      ...(query.from ? { $gte: new Date(query.from) } : {}),
      ...(query.to ? { $lte: new Date(query.to) } : {}),
    };
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    ActivityLogModel.find(filter).sort({ completedAt: -1 }).skip(skip).limit(query.limit),
    ActivityLogModel.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
    },
  };
};

export const registerFcmToken = async (firebaseUid: string, payload: RegisterFcmInput) => {
  const user = await UserModel.findOneAndUpdate(
    { firebaseUid, isActive: true },
    { $addToSet: { fcmTokens: payload.fcmToken } },
    { new: true },
  );

  if (!user) {
    throw new AppError("User profile does not exist yet", 404, "USER_NOT_FOUND");
  }

  if (payload.deviceType) {
    await upsertUserDevice({
      userId: user.id,
      platform: payload.deviceType,
      fcmToken: payload.fcmToken,
      notificationsEnabled: true,
    });
  }

  return { fcmTokens: user.fcmTokens };
};

export const removeFcmToken = async (firebaseUid: string, payload: RemoveFcmInput) => {
  const user = await UserModel.findOneAndUpdate(
    { firebaseUid, isActive: true },
    { $pull: { fcmTokens: payload.fcmToken } },
    { new: true },
  );

  if (!user) {
    throw new AppError("User profile does not exist yet", 404, "USER_NOT_FOUND");
  }

  await deactivateUserDeviceByToken(payload.fcmToken);

  return { fcmTokens: user.fcmTokens };
};

export const listUsers = async (query: PaginationInput) => {
  const filter: Record<string, unknown> = {};

  if (query.q) {
    filter.$or = [
      { name: { $regex: query.q, $options: "i" } },
      { email: { $regex: query.q, $options: "i" } },
    ];
  }

  if (query.role) {
    filter.role = query.role;
  }

  if (query.region) {
    filter.region = query.region;
  }

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive;
  }

  const skip = (query.page - 1) * query.limit;

  if (query.planType) {
    const matchedUsers = await UserModel.find(filter).sort({ createdAt: -1 });
    const purchaseSummaries = await fetchAdminUserPurchaseSummary(matchedUsers.map((user) => user.id));
    const purchaseSummaryMap = new Map(purchaseSummaries.map((item) => [item.userId, item]));

    const filteredUsers = matchedUsers.filter((user) =>
      (purchaseSummaryMap.get(user.id)?.planTypes ?? []).includes(query.planType as string),
    );

    return {
      items: filteredUsers.slice(skip, skip + query.limit),
      pagination: {
        page: query.page,
        limit: query.limit,
        total: filteredUsers.length,
      },
    };
  }

  const [items, total] = await Promise.all([
    UserModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
    UserModel.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
    },
  };
};

export const getAdminDashboard = async (query: AdminDashboardQueryInput) => {
  const now = new Date();
  const range = resolveDashboardTimeRange(query);
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const activeWindowStart = range.start;
  const previousActiveWindowStart = range.previousStart;

  const studentBaseFilter: Record<string, unknown> = { role: "user" };
  if (query.q) {
    studentBaseFilter.$or = [
      { name: { $regex: query.q, $options: "i" } },
      { email: { $regex: query.q, $options: "i" } },
    ];
  }
  if (query.region) {
    studentBaseFilter.region = query.region;
  }
  if (query.isActive !== undefined) {
    studentBaseFilter.isActive = query.isActive;
  }

  const studentsFilter = { ...studentBaseFilter };
  const skip = (query.page - 1) * query.limit;

  const [
    totalStudentsCurrent,
    totalStudentsPrevious,
    matchedStudents,
    recentStudentsRaw,
    revenueMetrics,
    dashboardAnalytics,
    courseMetrics,
    promotionSummary,
  ] = await Promise.all([
    UserModel.countDocuments({ role: "user", isActive: true }),
    UserModel.countDocuments({ role: "user", isActive: true, createdAt: { $lt: currentMonthStart } }),
    UserModel.find(studentsFilter).sort({ createdAt: -1 }),
    UserModel.find({ role: "user", isActive: true }).sort({ createdAt: -1 }).limit(7),
    fetchAdminRevenueMetrics(),
    fetchAdminDashboardAnalytics(),
    fetchAdminCourseMetrics(),
    fetchAdminPromotionSummary(),
  ]);

  const [
    activeUsersCurrent,
    activeUsersPrevious,
    currentMonthSignups,
    previousMonthSignups,
    weeklyActivityAgg,
    sessionActivityAgg,
    engagementAgg,
    quarterNewUsers,
    quarterReturningUsers,
    notificationCenter,
    ticketCenter,
    recentTickets,
    recentContacts,
    recentCampaigns,
    activeUserPlatformDevices,
  ] = await Promise.all([
    UserModel.countDocuments({ role: "user", isActive: true, lastActiveAt: { $gte: activeWindowStart } }),
    UserModel.countDocuments({
      role: "user",
      isActive: true,
      lastActiveAt: { $gte: previousActiveWindowStart, $lt: activeWindowStart },
    }),
    UserModel.countDocuments({ role: "user", isActive: true, createdAt: { $gte: currentMonthStart } }),
    UserModel.countDocuments({
      role: "user",
      isActive: true,
      createdAt: { $gte: previousMonthStart, $lt: currentMonthStart },
    }),
    ActivityLogModel.aggregate<{ _id: string; users: Set<string> }>([
      {
        $match: {
          completedAt: { $gte: range.start, $lte: range.end },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$completedAt",
            },
          },
          users: { $addToSet: "$userId" },
        },
      },
    ]),
    ActivityLogModel.aggregate<{ _id: string; users: string[]; sessions: number }>([
      {
        $match: {
          completedAt: { $gte: range.start, $lte: range.end },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$completedAt",
            },
          },
          users: { $addToSet: "$userId" },
          sessions: { $sum: 1 },
        },
      },
    ]),
    ActivityLogModel.aggregate<{
      _id: { courseId?: Types.ObjectId; gameKey?: string | null };
      totalEvents: number;
      users: string[];
      videoViews: number;
      progressUpdates: number;
      gameSubmissions: number;
      lastPlayedAt: Date | null;
    }>([
      {
        $match: {
          completedAt: { $gte: range.start, $lte: range.end },
        },
      },
      {
        $group: {
          _id: {
            courseId: "$courseId",
            gameKey: "$gameKey",
          },
          totalEvents: { $sum: 1 },
          users: { $addToSet: "$userId" },
          videoViews: {
            $sum: {
              $cond: [{ $eq: ["$type", "video_watch"] }, 1, 0],
            },
          },
          progressUpdates: {
            $sum: {
              $cond: [{ $eq: ["$type", "course_progress"] }, 1, 0],
            },
          },
          gameSubmissions: {
            $sum: {
              $cond: [{ $eq: ["$type", "game_submission"] }, 1, 0],
            },
          },
          lastPlayedAt: { $max: "$completedAt" },
        },
      },
    ]),
    UserModel.aggregate<{ _id: number; count: number }>([
      {
        $match: {
          role: "user",
          isActive: true,
          createdAt: { $gte: new Date(now.getFullYear() - 1, now.getMonth(), 1) },
        },
      },
      {
        $group: {
          _id: { $ceil: { $divide: [{ $month: "$createdAt" }, 3] } },
          count: { $sum: 1 },
        },
      },
    ]),
    UserModel.aggregate<{ _id: number; count: number }>([
      {
        $match: {
          role: "user",
          isActive: true,
          lastActiveAt: { $gte: new Date(now.getFullYear() - 1, now.getMonth(), 1) },
        },
      },
      {
        $addFields: {
          activeQuarter: { $ceil: { $divide: [{ $month: "$lastActiveAt" }, 3] } },
          signupQuarter: { $ceil: { $divide: [{ $month: "$createdAt" }, 3] } },
        },
      },
      {
        $match: {
          $expr: { $lt: ["$signupQuarter", "$activeQuarter"] },
        },
      },
      {
        $group: {
          _id: "$activeQuarter",
          count: { $sum: 1 },
        },
      },
    ]),
    getNotificationCenterSummary(),
    getAdminTicketSummary(),
    SupportTicketModel.find({}).sort({ updatedAt: -1 }).limit(5),
    ContactRequestModel.find({}).sort({ createdAt: -1 }).limit(5),
    NotificationCampaignModel.find({ status: "sent" }).sort({ sentAt: -1 }).limit(5),
    UserDeviceModel.find({
      isActive: true,
      lastSeenAt: { $gte: activeWindowStart },
    })
      .sort({ lastSeenAt: -1 })
      .select("userId platform lastSeenAt"),
  ]);

  const matchedStudentIds = matchedStudents.map((student) => student.id);
  const recentStudentIds = recentStudentsRaw.map((student) => student.id);
  const allPurchaseSummaries = matchedStudentIds.length
    ? await fetchAdminUserPurchaseSummary(matchedStudentIds)
    : [];
  const purchaseSummaryMap = new Map(allPurchaseSummaries.map((item) => [item.userId, item]));
  const recentPurchaseSummaries = recentStudentIds.length
    ? await fetchAdminUserPurchaseSummary(recentStudentIds)
    : [];
  const recentPurchaseSummaryMap = new Map(
    recentPurchaseSummaries.map((item) => [item.userId, item]),
  );
  const selectedPlanType = query.planType;

  const filteredStudents = selectedPlanType
    ? matchedStudents.filter((student) =>
        (purchaseSummaryMap.get(student.id)?.planTypes ?? []).includes(selectedPlanType),
      )
    : matchedStudents;

  const totalStudentsTable = filteredStudents.length;
  const students = filteredStudents.slice(skip, skip + query.limit);

  const engagementCourseIds = [
    ...new Set(
      engagementAgg
        .map((item) => item._id.courseId?.toString())
        .filter((value): value is string => Boolean(value)),
    ),
  ].slice(0, 8);
  const engagementCourseDetails = await Promise.all(
    engagementCourseIds.map(async (courseId) => [courseId, await fetchCourseDetail(courseId).catch(() => null)] as const),
  );
  const courseTitleMap = new Map(
    engagementCourseDetails.map(([courseId, course]) => [courseId, course?.title ?? `Course ${courseId.slice(-6)}`]),
  );
  const courseProgressMap = new Map<string, { completed: number; total: number }>();
  for (const item of filteredStudents) {
    const purchase = purchaseSummaryMap.get(item.id);
    if (!purchase) continue;
    // no-op for now; course completion fallback stays activity-based below
  }

  const courseEngagementMap = new Map<string, DashboardCourseEngagementItem>();
  const gameEngagementMap = new Map<string, DashboardGameEngagementItem>();
  for (const item of engagementAgg) {
    const courseId = item._id.courseId?.toString();
    const gameKey = item._id.gameKey ?? null;
    const uniqueUsers = Array.isArray(item.users) ? item.users.length : 0;

    if (courseId) {
      const existing = courseEngagementMap.get(courseId) ?? {
        courseId,
        title: courseTitleMap.get(courseId) ?? `Course ${courseId.slice(-6)}`,
        totalEvents: 0,
        uniqueUsers: 0,
        videoViews: 0,
        progressUpdates: 0,
        gameSubmissions: 0,
        completionRate: 0,
      };
      existing.totalEvents += item.totalEvents;
      existing.uniqueUsers += uniqueUsers;
      existing.videoViews += item.videoViews;
      existing.progressUpdates += item.progressUpdates;
      existing.gameSubmissions += item.gameSubmissions;
      courseEngagementMap.set(courseId, existing);
    }

    if (gameKey) {
      const existing = gameEngagementMap.get(gameKey) ?? {
        gameKey,
        totalEvents: 0,
        uniqueUsers: 0,
        submissions: 0,
        lastPlayedAt: null,
      };
      existing.totalEvents += item.totalEvents;
      existing.uniqueUsers += uniqueUsers;
      existing.submissions += item.gameSubmissions;
      existing.lastPlayedAt =
        !existing.lastPlayedAt || (item.lastPlayedAt && item.lastPlayedAt.toISOString() > existing.lastPlayedAt)
          ? item.lastPlayedAt?.toISOString() ?? existing.lastPlayedAt
          : existing.lastPlayedAt;
      gameEngagementMap.set(gameKey, existing);
    }
  }

  const courseEngagement = [...courseEngagementMap.values()]
    .map((item) => ({
      ...item,
      completionRate:
        item.uniqueUsers > 0 ? Number(((item.progressUpdates / item.uniqueUsers) * 100).toFixed(2)) : 0,
    }))
    .sort((left, right) => right.totalEvents - left.totalEvents)
    .slice(0, 6);

  const gameEngagement = [...gameEngagementMap.values()]
    .sort((left, right) => right.totalEvents - left.totalEvents)
    .slice(0, 6);

  const stats = {
    totalUsers: {
      value: totalStudentsCurrent,
      changePercent: calculatePercentChange(totalStudentsCurrent, totalStudentsPrevious),
    },
    activeUsers: {
      value: activeUsersCurrent,
      changePercent: calculatePercentChange(activeUsersCurrent, activeUsersPrevious),
    },
    revenue: {
      value: dashboardAnalytics.monthlyRevenue.current,
      changePercent: dashboardAnalytics.monthlyRevenue.percentChange,
    },
    orders: {
      value: dashboardAnalytics.currentMonthPurchaseCount,
      changePercent: calculatePercentChange(
        dashboardAnalytics.currentMonthPurchaseCount,
        dashboardAnalytics.previousMonthPurchaseCount,
      ),
    },
    newSignups: {
      value: currentMonthSignups,
      changePercent: calculatePercentChange(currentMonthSignups, previousMonthSignups),
    },
    conversionRate: {
      value:
        currentMonthSignups > 0
          ? Number(((dashboardAnalytics.currentMonthPurchaseCount / currentMonthSignups) * 100).toFixed(2))
          : 0,
      changePercent: calculatePercentChange(
        currentMonthSignups > 0 ? dashboardAnalytics.currentMonthPurchaseCount / currentMonthSignups : 0,
        previousMonthSignups > 0 ? dashboardAnalytics.previousMonthPurchaseCount / previousMonthSignups : 0,
      ),
    },
  };

  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyActivityMap = new Map(
    weeklyActivityAgg.map((item) => [item._id, Array.isArray(item.users) ? item.users.length : 0]),
  );
  const rangeDayCount =
    Math.max(1, Math.floor((range.end.getTime() - range.start.getTime()) / DAY_MS) + 1);
  const weeklyActivity = Array.from({ length: rangeDayCount }, (_, index) => {
    const day = new Date(range.start.getTime() + index * DAY_MS);
    const key = day.toISOString().slice(0, 10);
    return {
      day: rangeDayCount <= 7 ? weekdayLabels[day.getDay()] : formatDashboardDayLabel(day),
      users: weeklyActivityMap.get(key) ?? 0,
    };
  });

  const sessionActivityMap = new Map(
    sessionActivityAgg.map((item) => [
      item._id,
      {
        uniqueUsers: Array.isArray(item.users) ? item.users.length : 0,
        sessions: item.sessions ?? 0,
      },
    ]),
  );
  const sessionActivity = Array.from({ length: rangeDayCount }, (_, index) => {
    const day = new Date(range.start.getTime() + index * DAY_MS);
    const key = day.toISOString().slice(0, 10);
    const item = sessionActivityMap.get(key);
    return {
      label: rangeDayCount <= 7 ? weekdayLabels[day.getDay()] : formatDashboardDayLabel(day),
      uniqueUsers: item?.uniqueUsers ?? 0,
      sessions: item?.sessions ?? 0,
    };
  });

  const quarterNewMap = new Map(quarterNewUsers.map((item) => [item._id, item.count]));
  const quarterReturningMap = new Map(quarterReturningUsers.map((item) => [item._id, item.count]));
  const userGrowth = [1, 2, 3, 4].map((quarter) => ({
    quarter: `Q${quarter}`,
    newUsers: quarterNewMap.get(quarter) ?? 0,
    returningUsers: quarterReturningMap.get(quarter) ?? 0,
  }));

  const totalActive = activeUsersCurrent;
  const latestPlatformByUser = new Map<string, "web" | "ios" | "android">();
  for (const device of activeUserPlatformDevices) {
    const userId = device.userId.toString();
    if (!latestPlatformByUser.has(userId)) {
      latestPlatformByUser.set(userId, device.platform);
    }
  }
  const platformCounts = { web: 0, ios: 0, android: 0 };
  for (const platform of latestPlatformByUser.values()) {
    platformCounts[platform] += 1;
  }
  const measuredActive = latestPlatformByUser.size;
  const percentageFor = (count: number) =>
    totalActive > 0 ? Number(((count / totalActive) * 100).toFixed(2)) : 0;
  const webPercentage = percentageFor(platformCounts.web);
  const iosPercentage = percentageFor(platformCounts.ios);
  const androidPercentage = percentageFor(platformCounts.android);

  const recentUserRegistrations = await UserModel.find({ role: "user", isActive: true })
    .find({ createdAt: { $gte: range.start, $lte: range.end } })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("name createdAt");

  const recentActivity = [
    ...recentUserRegistrations.map((user) => ({
      id: `user_${user.id}`,
      type: "user_registered",
      message: `${user.name} registered a new account.`,
      createdAt: user.createdAt.toISOString(),
    })),
    ...dashboardAnalytics.recentTransactions.map((transaction) => ({
      id: `purchase_${transaction.id}`,
      type: transaction.type,
      message:
        transaction.type === "subscription_renewed"
          ? `Subscription renewed (${transaction.currency} ${transaction.amount}).`
          : `Purchase completed (${transaction.currency} ${transaction.amount}).`,
      createdAt: transaction.createdAt,
    })),
    ...recentTickets.map((ticket) => ({
      id: `ticket_${ticket.id}`,
      type: "support_ticket",
      message: `Support ticket ${ticket.ticketNumber} updated: ${ticket.subject}.`,
      createdAt: ticket.updatedAt.toISOString(),
    })),
    ...recentContacts.map((contact) => ({
      id: `contact_${contact.id}`,
      type: "contact_request",
      message: `${contact.name} sent a get in touch request about ${contact.topic.replace(/_/g, " ")}.`,
      createdAt: contact.createdAt.toISOString(),
    })),
    ...recentCampaigns.map((campaign) => ({
      id: `campaign_${campaign.id}`,
      type: "notification_campaign_sent",
      message: `Notification campaign sent: ${campaign.title}.`,
      createdAt: (campaign.sentAt ?? campaign.updatedAt).toISOString(),
    })),
  ]
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 12);

  return {
    stats,
    weeklyActivity,
    revenueChart: dashboardAnalytics.revenueChart,
    userGrowth,
    platformUsage: {
      totalActive,
      measuredActiveUsers: measuredActive,
      untrackedActiveUsers: Math.max(0, totalActive - measuredActive),
      segments: [
        { platform: "Web", percentage: webPercentage },
        { platform: "iOS", percentage: iosPercentage },
        { platform: "Android", percentage: androidPercentage },
      ],
    },
    recentActivity,
    period: {
      preset: range.preset,
      label: range.label,
      startDate: range.start.toISOString(),
      endDate: range.end.toISOString(),
    },
    sessionActivity,
    engagement: {
      courses: courseEngagement,
      games: gameEngagement,
    },
    systemStatus: {
      status: "operational",
      message: "All Systems Operational",
    },
    overview: {
      totalStudents: calculateChange(totalStudentsCurrent, totalStudentsPrevious),
      activeCourses: calculateChange(
        courseMetrics.activeCourses.current,
        courseMetrics.activeCourses.previous,
      ),
      monthlyRevenue: revenueMetrics.monthlyRevenue,
      monthlyRevenueAverage: revenueMetrics.monthlyRevenueAverage,
    },
    promotions: promotionSummary,
    notificationCenter,
    ticketCenter,
    students: {
      items: students.map((student) => {
        const purchase = purchaseSummaryMap.get(student.id);
        return {
          _id: student.id,
          name: student.name,
          email: student.email,
          avatar: student.avatar ?? null,
          region: student.region ?? null,
          timezone: student.timezone,
          isActive: student.isActive,
          joinedAt: student.createdAt,
          lastActiveAt: student.lastActiveAt,
          totalPurchases: purchase?.totalPurchases ?? 0,
          activePurchases: purchase?.activePurchases ?? 0,
          activeCoursesCount: purchase?.activeCoursesCount ?? 0,
          totalSpent: purchase?.totalSpent ?? 0,
          lastPurchaseAt: purchase?.lastPurchaseAt ?? null,
          planTypes: purchase?.planTypes ?? [],
        };
      }),
      pagination: {
        page: query.page,
        limit: query.limit,
        total: totalStudentsTable,
      },
    },
    recentStudents: recentStudentsRaw.map((student) => {
      const purchase = recentPurchaseSummaryMap.get(student.id);
      return {
        _id: student.id,
        name: student.name,
        email: student.email,
        avatar: student.avatar ?? null,
        region: student.region ?? null,
        timezone: student.timezone,
        isActive: student.isActive,
        joinedAt: student.createdAt,
        lastActiveAt: student.lastActiveAt,
        totalPurchases: purchase?.totalPurchases ?? 0,
        activePurchases: purchase?.activePurchases ?? 0,
        activeCoursesCount: purchase?.activeCoursesCount ?? 0,
        totalSpent: purchase?.totalSpent ?? 0,
        lastPurchaseAt: purchase?.lastPurchaseAt ? new Date(purchase.lastPurchaseAt).toISOString() : null,
        planTypes: purchase?.planTypes ?? [],
      };
    }),
  };
};

export const getUserById = async (id: string) => {
  const user = await UserModel.findById(id);

  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  const [activityLogs, progressData, purchaseData] = await Promise.all([
    ActivityLogModel.find({ userId: new Types.ObjectId(user.id) }).sort({ completedAt: -1 }).limit(300),
    getCurrentUserProgress(user.firebaseUid),
    fetchAdminUserPurchases(user.id),
  ]);

  const enrolledCourseDetails = await Promise.all(
    progressData.courses.map(async (course) => {
      const detail = await fetchCourseDetail(String(course.courseId)).catch(() => null);
      return {
        courseId: String(course.courseId),
        title: detail?.title ?? course.title,
        thumbnail: detail?.thumbnail ?? course.thumbnail ?? null,
        durationMinutes: detail?.durationMinutes ?? null,
        status: course.status,
        planType: course.planType,
        expiryDate: course.expiryDate,
        percentComplete: course.progress.percentComplete,
        contentCompleted: course.progress.contentCompleted,
        contentTotal: course.progress.contentTotal,
        gamesCompleted: course.progress.gamesCompleted,
        gamesTotal: course.progress.gamesTotal,
        finalCourseScore: course.finalCourseScore?.finalScore ?? null,
        nextItem: course.nextItem,
        lastCompletedAt: course.lastCompletedAt,
      };
    }),
  );

  const totalXp = Math.max(user.points, getTotalXpFromLogs(activityLogs));
  const progression = getProgressionSnapshot(totalXp, 0);

  const monthlyTrendMap = new Map<string, { label: string; completions: number; watchMinutes: number }>();
  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setMonth(date.getMonth() - offset);
    const label = date.toLocaleString("en-US", { month: "short" });
    monthlyTrendMap.set(label, { label, completions: 0, watchMinutes: 0 });
  }

  for (const entry of activityLogs) {
    const label = entry.completedAt.toLocaleString("en-US", { month: "short" });
    const bucket = monthlyTrendMap.get(label);
    if (!bucket) {
      continue;
    }

    if (entry.type === "game_submission" || entry.type === "course_progress") {
      bucket.completions += 1;
    }
    if (entry.type === "video_watch") {
      const watchedSeconds = entry.metadata?.watchedSeconds;
      bucket.watchMinutes += typeof watchedSeconds === "number" ? watchedSeconds / 60 : 0;
    }
  }

  const recentActivity = activityLogs.slice(0, 12).map((entry) => ({
    id: entry.id,
    type: entry.type,
    title: entry.title,
    courseId: entry.courseId?.toString() ?? null,
    gameKey: entry.gameKey ?? null,
    createdAt: entry.completedAt.toISOString(),
    metadata: entry.metadata ?? {},
  }));

  const completionRates = progressData.courses.map((course) => course.progress.percentComplete);
  const courseCompletionRate =
    completionRates.length > 0
      ? Math.round(completionRates.reduce((sum, value) => sum + value, 0) / completionRates.length)
      : 0;

  return {
    _id: user.id,
    firebaseUid: user.firebaseUid,
    name: user.name,
    email: user.email,
    avatar: user.avatar ?? null,
    timezone: user.timezone,
    region: user.region ?? null,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLoginAt: user.lastActiveAt,
    progression: {
      level: progression.level,
      totalXp,
      currentXp: progression.currentXp,
      nextLevelXp: progression.nextLevelXp,
      progressPercentage: progression.progressPercentage,
      streakDays: user.streakDays,
      badges: user.badges,
    },
    stats: {
      enrolledCourses: progressData.summary.totalCourses,
      activeCourses: progressData.summary.activeCourses,
      completedCourses: progressData.summary.completedCourses,
      averageCompletionRate: progressData.summary.averageCompletion,
      courseCompletionRate,
      totalMoneySpent: purchaseData.stats.totalSpent,
      totalOrders: purchaseData.stats.totalOrders,
      activePurchases: purchaseData.stats.activePurchases,
      refundedPurchases: purchaseData.stats.refundedPurchases,
      lastPurchaseAt: purchaseData.stats.lastPurchaseAt,
    },
    enrolledCourses: enrolledCourseDetails,
    learningTrend: [...monthlyTrendMap.values()].map((item) => ({
      label: item.label,
      completions: item.completions,
      watchMinutes: Math.round(item.watchMinutes),
    })),
    paymentHistory: purchaseData.purchases,
    recentActivity,
  };
};

export const updateUserRole = async (id: string, payload: UpdateRoleInput) => {
  const user = await UserModel.findByIdAndUpdate(id, { $set: payload }, { new: true });

  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  return user;
};

export const softDeleteUser = async (id: string) => {
  const user = await UserModel.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true });

  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  return user;
};

export const restoreUser = async (id: string) => {
  const user = await UserModel.findByIdAndUpdate(id, { $set: { isActive: true } }, { new: true });

  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  return user;
};

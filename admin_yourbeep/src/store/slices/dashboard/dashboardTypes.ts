export type DashboardStat = {
  value: number;
  changePercent: number;
};

export type WeeklyActivityPoint = {
  day: string;
  users: number;
};

export type RevenuePoint = {
  label: string;
  amount: number;
};

export type UserGrowthPoint = {
  quarter: string;
  newUsers: number;
  returningUsers: number;
};

export type PlatformSegment = {
  platform: string;
  percentage: number;
};

export type RecentActivityItem = {
  id: string;
  type: string;
  message: string;
  createdAt: string;
};

export type SessionActivityPoint = {
  label: string;
  uniqueUsers: number;
  sessions: number;
};

export type CourseEngagementItem = {
  courseId: string;
  title: string;
  totalEvents: number;
  uniqueUsers: number;
  videoViews: number;
  progressUpdates: number;
  gameSubmissions: number;
  completionRate: number;
};

export type GameEngagementItem = {
  gameKey: string;
  totalEvents: number;
  uniqueUsers: number;
  submissions: number;
  lastPlayedAt: string | null;
};

export type OverviewMetric = {
  current: number;
  previous: number;
  delta: number;
  percentChange: number;
};

export type StudentTableItem = {
  _id: string;
  name: string;
  email: string;
  avatar: string | null;
  region: string | null;
  timezone: string | null;
  isActive: boolean;
  joinedAt: string;
  lastActiveAt: string | null;
  totalPurchases: number;
  activePurchases: number;
  activeCoursesCount: number;
  totalSpent: number;
  lastPurchaseAt: string | null;
  planTypes: string[];
};

export type DashboardPayload = {
  stats: {
    totalUsers: DashboardStat;
    activeUsers: DashboardStat;
    revenue: DashboardStat;
    orders: DashboardStat;
    newSignups: DashboardStat;
    conversionRate: DashboardStat;
  };
  weeklyActivity: WeeklyActivityPoint[];
  revenueChart: RevenuePoint[];
  userGrowth: UserGrowthPoint[];
  platformUsage: {
    totalActive: number;
    measuredActiveUsers: number;
    untrackedActiveUsers: number;
    segments: PlatformSegment[];
  };
  recentActivity: RecentActivityItem[];
  period: {
    preset: DashboardPeriodPreset;
    label: string;
    startDate: string;
    endDate: string;
  };
  sessionActivity: SessionActivityPoint[];
  engagement: {
    courses: CourseEngagementItem[];
    games: GameEngagementItem[];
  };
  systemStatus: {
    status: "operational" | "degraded" | "outage";
    message: string;
  };
  overview: {
    totalStudents: OverviewMetric;
    activeCourses: OverviewMetric;
    monthlyRevenue: OverviewMetric;
    monthlyRevenueAverage: OverviewMetric;
  };
  promotions: {
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
  notificationCenter?: Record<string, unknown>;
  ticketCenter?: Record<string, unknown>;
  students: {
    items: StudentTableItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  };
  recentStudents: StudentTableItem[];
};

export type DashboardPeriodPreset = "7d" | "30d" | "90d" | "custom";

export type DashboardFilters = {
  page?: number;
  limit?: number;
  q?: string;
  isActive?: boolean;
  region?: string;
  planType?: "six_month" | "annual";
  period?: DashboardPeriodPreset;
  from?: string;
  to?: string;
};

export type DashboardState = {
  data: DashboardPayload | null;
  filters: Required<DashboardFilters>;
  loading: boolean;
  error: string | null;
};

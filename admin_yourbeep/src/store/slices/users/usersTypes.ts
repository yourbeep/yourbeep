export type UserListItem = {
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

export type UserListPayload = {
  stats: {
    totalUsers: {
      value: number;
      changePercent: number;
    };
    activeUsers: {
      value: number;
      changePercent: number;
    };
    newSignups: {
      value: number;
      changePercent: number;
    };
  };
  overview: {
    totalStudents: {
      current: number;
      previous: number;
      delta: number;
      percentChange: number;
    };
    monthlyRevenue: {
      current: number;
      previous: number;
      delta: number;
      percentChange: number;
    };
  };
  students: {
    items: UserListItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  };
};

export type UsersFilters = {
  page?: number;
  limit?: number;
  q?: string;
  region?: string;
  planType?: "six_month" | "annual";
  isActive?: boolean;
};

export type UsersState = {
  data: UserListPayload | null;
  filters: {
    page: number;
    limit: number;
    q: string;
    region?: string;
    planType?: "six_month" | "annual";
    isActive?: boolean;
  };
  loading: boolean;
  error: string | null;
};

export type AdminUserDetail = {
  _id: string;
  firebaseUid: string;
  name: string;
  email: string;
  avatar: string | null;
  timezone: string;
  region: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  progression: {
    level: number;
    totalXp: number;
    currentXp: number;
    nextLevelXp: number;
    progressPercentage: number;
    streakDays: number;
    badges: string[];
  };
  stats: {
    enrolledCourses: number;
    activeCourses: number;
    completedCourses: number;
    averageCompletionRate: number;
    courseCompletionRate: number;
    totalMoneySpent: number;
    totalOrders: number;
    activePurchases: number;
    refundedPurchases: number;
    lastPurchaseAt: string | null;
  };
  enrolledCourses: Array<{
    courseId: string;
    title: string;
    subtitle?: string | null;
    thumbnail?: string | null;
    progressPercent: number;
    completed: boolean;
    isActive: boolean;
    planType: string | null;
    region: string | null;
    expiryDate: string | null;
  }>;
  learningTrend: Array<{
    label: string;
    completions: number;
    watchMinutes: number;
  }>;
  paymentHistory: Array<{
    id: string;
    purchaseId: string;
    courseId: string;
    courseTitle: string | null;
    amount: number;
    currency: string;
    status: string;
    planType: string;
    promotionCode: string | null;
    accessGranted: boolean;
    startDate: string | null;
    expiryDate: string | null;
    purchasedAt: string | null;
    renewedFromId: string | null;
    stripeRefundId: string | null;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    courseId: string | null;
    gameKey: string | null;
    createdAt: string;
    metadata: Record<string, unknown>;
  }>;
};

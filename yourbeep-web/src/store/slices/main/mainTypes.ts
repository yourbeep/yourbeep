export type MainDashboardMetric = {
  id: string;
  title: string;
  subtitle: string;
  score: number;
  unit: string;
  weeklyChange: number;
  trend: "up" | "down" | "baseline";
  icon: string;
};

export type MainRecommendation = {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  durationMinutes: number;
  contentType: string;
  category: string;
  stateMatchScore: number;
};

export type MainContinueLearningItem = {
  courseId: string;
  title: string;
  thumbnailUrl: string | null;
  percentComplete: number;
  nextItem: {
    itemId: string;
    title: string;
    type: string;
    videoId: string | null;
  } | null;
};

export type MainDashboardData = {
  header: {
    user: {
      id: string;
      name: string;
      avatarUrl: string | null;
    };
    greeting: string;
    subtitle: string;
    notifications: {
      unreadCount: number;
    };
  };
  progression: {
    level: number;
    totalXp: number;
    currentXp: number;
    nextLevelXp: number;
    progressPercentage: number;
    stateTrend: string;
    stateDirection: string;
  };
  activityEngagement: {
    observationTime: {
      minutes: number;
      changePercentage: number;
      trend: "up" | "down" | "baseline";
    };
    reflectionTime: {
      minutes: number;
      changePercentage: number;
      trend: "up" | "down" | "baseline";
    };
  };
  metrics: MainDashboardMetric[];
  continueLearning: MainContinueLearningItem[];
  recommendations: MainRecommendation[];
};

export type MainState = {
  dashboard: MainDashboardData | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;
};

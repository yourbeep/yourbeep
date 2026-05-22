export type AdminProfile = {
  _id: string;
  firebaseUid: string;
  name: string;
  email: string;
  avatar: string | null;
  timezone: string | null;
  region: string | null;
  phoneCountryCode: string | null;
  role: "admin" | "user";
  isActive: boolean;
  userLevel: number;
  points: number;
  streakDays: number;
  badges: string[];
  fcmTokens: string[];
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string | null;
  sessionSummary?: {
    totalDevices: number;
    activeWebSessions: number;
    activeMobileSessions: number;
    lastLoginAt: string | null;
  };
  recentSessions?: Array<{
    id: string;
    platform: "web" | "ios" | "android";
    notificationsEnabled: boolean;
    firstSeenAt: string;
    lastSeenAt: string;
    tokenAttached: boolean;
    ipAddress: string | null;
    userAgent: string | null;
    deviceName: string | null;
    countryCode: string | null;
    regionName: string | null;
    city: string | null;
    locationLabel: string | null;
  }>;
  recentAccessActivity?: Array<{
    id: string;
    type: string;
    courseId: string | null;
    gameKey: string | null;
    completedAt: string;
    metadata?: Record<string, unknown>;
  }>;
};

export type UpdateAdminProfilePayload = {
  name?: string;
  avatar?: string;
  timezone?: string;
  phoneCountryCode?: string;
};

export type ProfileState = {
  data: AdminProfile | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
};

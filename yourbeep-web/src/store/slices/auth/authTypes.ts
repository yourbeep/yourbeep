export type AuthUser = {
  id: string;
  firebaseUid: string;
  email: string;
  fullName: string;
  role: "user" | "admin";
  avatar?: string | null;
  timezone?: string | null;
  region?: string | null;
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
};

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type RegisterPayload = LoginPayload & {
  fullName: string;
};

export type SocialLoginProvider = "google" | "apple";

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type AuthState = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
};

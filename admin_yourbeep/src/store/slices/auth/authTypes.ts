export type AuthUser = {
  id: string;
  firebaseUid: string;
  email: string;
  fullName: string;
  role: "admin" | "user";
  avatar?: string | null;
  timezone?: string | null;
  region?: string | null;
};

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
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

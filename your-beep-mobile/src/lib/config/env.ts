const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const envVars = ((globalThis as any).process?.env ?? {}) as Record<string, string | undefined>;

export const env = {
  apiBaseUrl: envVars.EXPO_PUBLIC_API_BASE_URL ?? '',
  apiBearerToken: envVars.EXPO_PUBLIC_API_BEARER_TOKEN ?? '',
  firebaseApiKey: envVars.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  firebaseAppId: envVars.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
  firebaseAuthDomain: envVars.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  googleAndroidClientId: envVars.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? '',
  googleIosClientId: envVars.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '',
  googleWebClientId: envVars.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
  firebaseMessagingSenderId: envVars.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  firebaseProjectId: envVars.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  firebaseStorageBucket: envVars.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  useMocks: envVars.EXPO_PUBLIC_USE_MOCKS !== 'false',
  requestTimeoutMs: toNumber(envVars.EXPO_PUBLIC_REQUEST_TIMEOUT_MS, 10000),
} as const;

export const hasApiBaseUrl = env.apiBaseUrl.trim().length > 0;
export const hasFirebaseClientConfig =
  env.firebaseApiKey.trim().length > 0 &&
  env.firebaseAuthDomain.trim().length > 0 &&
  env.firebaseProjectId.trim().length > 0 &&
  env.firebaseStorageBucket.trim().length > 0 &&
  env.firebaseMessagingSenderId.trim().length > 0 &&
  env.firebaseAppId.trim().length > 0;

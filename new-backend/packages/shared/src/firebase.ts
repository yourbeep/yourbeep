import { readFileSync } from "node:fs";
import { App, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { getMessaging } from "firebase-admin/messaging";
import { env } from "./env";
import { AppError } from "./errors";

const normalizePrivateKey = (value?: string) => value?.replace(/\\n/g, "\n");

type ServiceAccountConfig = {
  project_id: string;
  client_email: string;
  private_key: string;
};

const readServiceAccountFile = (): ServiceAccountConfig | null => {
  if (!env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    return null;
  }

  try {
    const raw = readFileSync(env.FIREBASE_SERVICE_ACCOUNT_PATH, "utf8");
    return JSON.parse(raw) as ServiceAccountConfig;
  } catch {
    throw new AppError(
      "Firebase service account file could not be read",
      500,
      "FIREBASE_CONFIG_INVALID",
    );
  }
};

const hasFirebaseConfig = () =>
  Boolean(env.FIREBASE_SERVICE_ACCOUNT_PATH) ||
  Boolean(env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY);

const getFirebaseCredentials = () => {
  const serviceAccount = readServiceAccountFile();

  if (serviceAccount) {
    return {
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    };
  }

  return {
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: normalizePrivateKey(env.FIREBASE_PRIVATE_KEY),
  };
};

export const getFirebaseAdminApp = (): App => {
  if (getApps().length > 0) {
    return getApp();
  }

  if (!hasFirebaseConfig()) {
    throw new AppError(
      "Firebase Admin credentials are not configured",
      500,
      "FIREBASE_CONFIG_MISSING",
    );
  }

  const credentials = getFirebaseCredentials();

  return initializeApp({
    credential: cert({
      projectId: credentials.projectId,
      clientEmail: credentials.clientEmail,
      privateKey: credentials.privateKey,
    }),
    projectId: credentials.projectId,
  });
};

export const verifyFirebaseIdToken = async (token: string): Promise<DecodedIdToken> => {
  try {
    const app = getFirebaseAdminApp();
    return await getAuth(app).verifyIdToken(token);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    const code = (error as { code?: string }).code;
    if (code === "auth/id-token-expired") {
      throw new AppError("Token expired", 401, "TOKEN_EXPIRED");
    }

    throw new AppError("Invalid token", 401, "TOKEN_INVALID");
  }
};

export const deleteFirebaseUser = async (firebaseUid: string) => {
  const app = getFirebaseAdminApp();
  await getAuth(app).deleteUser(firebaseUid);
};

export const getFirebaseMessaging = () => {
  const app = getFirebaseAdminApp();
  return getMessaging(app);
};

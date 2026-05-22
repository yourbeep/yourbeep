import type { NextFunction, Request, Response } from "express";
import { AppError } from "./errors";
import { verifyFirebaseIdToken } from "./firebase";
import type { AuthContext, AuthenticatedRequest, UserRole } from "./types";

const getBearerToken = (authorization?: string): string | null => {
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
};

export const getRequestAuth = (req: Request): AuthContext | null => {
  if (req.auth) {
    return req.auth;
  }

  const internalHeaders =
    typeof req.headers["x-user-id"] === "string" &&
    typeof req.headers["x-user-email"] === "string" &&
    typeof req.headers["x-firebase-uid"] === "string";

  if (internalHeaders) {
    return {
      id: String(req.headers["x-user-id"]),
      email: String(req.headers["x-user-email"]),
      firebaseUid: String(req.headers["x-firebase-uid"]),
      role: (String(req.headers["x-user-role"] ?? "user") as UserRole) ?? "user",
    };
  }

  return null;
};

export const authenticateFirebaseToken = async (req: Request): Promise<AuthContext> => {
  const existing = getRequestAuth(req);
  if (existing) {
    return existing;
  }

  const token = getBearerToken(req.headers.authorization);
  if (!token) {
    throw new AppError("Missing bearer token", 401, "TOKEN_INVALID");
  }

  const decoded = await verifyFirebaseIdToken(token);
  const auth: AuthContext = {
    id: decoded.uid,
    firebaseUid: decoded.uid,
    email: decoded.email ?? "",
    role: "user",
  };

  if (!auth.email) {
    throw new AppError("Firebase token is missing email", 401, "TOKEN_INVALID");
  }

  (req as AuthenticatedRequest).auth = auth;
  return auth;
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const auth = getRequestAuth(req);

  if (!auth) {
    return next(new AppError("Missing or invalid bearer token", 401, "TOKEN_INVALID"));
  }

  (req as AuthenticatedRequest).auth = auth;
  return next();
};

export const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
  const auth = getRequestAuth(req);

  if (!auth) {
    return next(new AppError("Missing or invalid bearer token", 401, "TOKEN_INVALID"));
  }

  if (auth.role !== "admin") {
    return next(new AppError("Admin access required", 403, "FORBIDDEN"));
  }

  (req as AuthenticatedRequest).auth = auth;
  return next();
};

export const requireInternalService = (secret: string) => (req: Request, _res: Response, next: NextFunction) => {
  if (req.headers["x-internal-service-key"] !== secret) {
    return next(new AppError("Invalid internal service key", 403, "FORBIDDEN"));
  }

  return next();
};

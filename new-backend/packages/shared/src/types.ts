export type UserRole = "user" | "admin";

export interface AuthContext {
  id: string;
  email: string;
  firebaseUid: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
      requestId?: string;
      id?: string;
      rawBody?: string;
    }
  }
}

export type AuthenticatedRequest = Express.Request;

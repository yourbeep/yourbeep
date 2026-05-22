import type { NextFunction, Request, Response } from "express";
import { logger } from "./logger";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code: string | undefined;
  public details?: unknown;

  constructor(message: string, statusCode: number, code?: string, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const isAppError = (value: unknown): value is AppError => value instanceof AppError;

const getErrorCode = (statusCode: number): string => {
  const codes: Record<number, string> = {
    400: "VALIDATION_ERROR",
    401: "TOKEN_INVALID",
    402: "PAYMENT_FAILED",
    403: "UNAUTHORIZED",
    404: "NOT_FOUND",
    409: "CONFLICT",
    422: "BUSINESS_RULE_VIOLATION",
    500: "INTERNAL_SERVER_ERROR",
  };

  return codes[statusCode] || "UNKNOWN_ERROR";
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let error = err as Error & {
    statusCode?: number;
    code?: string;
    details?: unknown;
    errors?: Record<string, { message: string }>;
  };

  logger.error({ err }, "Request failed");

  if (err.name === "CastError") {
    error = new AppError("Resource not found", 404);
  }

  if (err.name === "MongoServerError" && (err as { code?: number }).code === 11000) {
    error = new AppError("Duplicate field value entered", 400, "VALIDATION_ERROR");
  }

  if (err.name === "ValidationError") {
    const message = Object.values(error.errors ?? {})
      .map((value) => value.message)
      .join(", ");
    error = new AppError(message || "Validation failed", 400, "VALIDATION_ERROR");
  }

  if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid token", 401, "TOKEN_INVALID");
  }

  if (err.name === "TokenExpiredError") {
    error = new AppError("Token expired", 401, "TOKEN_EXPIRED");
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      code: error.code || getErrorCode(error.statusCode || 500),
      message: error.message || "Server Error",
      ...(error.details !== undefined ? { details: error.details } : {}),
    },
    timestamp: new Date().toISOString(),
  });
};

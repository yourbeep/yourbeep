import type { Response } from "express";

export const success = <T>(res: Response, data: T, message = "OK", statusCode = 200) =>
  res.status(statusCode).json({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  });

export const failure = (
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown,
) =>
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
    timestamp: new Date().toISOString(),
  });

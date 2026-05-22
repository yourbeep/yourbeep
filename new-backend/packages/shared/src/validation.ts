import { z, ZodError } from "zod";
import { AppError } from "./errors";

export const parseBody = <T>(schema: z.ZodType<T>, payload: unknown): T => {
  try {
    return schema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Request validation failed", 400, "VALIDATION_ERROR", error.flatten());
    }

    throw error;
  }
};

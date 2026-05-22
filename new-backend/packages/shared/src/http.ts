import { AppError } from "./errors";

export const httpJson = async <T>(input: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "error" in data
        ? String((data as { error?: { message?: string } }).error?.message ?? "HTTP request failed")
        : "HTTP request failed";

    throw new AppError(message, response.status, "UPSTREAM_REQUEST_FAILED", data);
  }

  return data as T;
};

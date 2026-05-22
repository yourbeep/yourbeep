export const getApiErrorMessage = (
  payload: unknown,
  fallback = "Something went wrong.",
) => {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const record = payload as {
    message?: string;
    error?: { message?: string };
    data?: { message?: string };
  };

  return (
    record.error?.message ||
    record.data?.message ||
    record.message ||
    fallback
  );
};


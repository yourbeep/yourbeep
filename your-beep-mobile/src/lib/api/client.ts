import { env, hasApiBaseUrl } from '@/lib/config/env';
import { logger } from '@/lib/logger';

import { ApiEnvelope, ApiError, ApiRequestOptions, QueryParams } from './types';

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

let runtimeApiBearerToken = env.apiBearerToken;

const buildQueryString = (query?: QueryParams) => {
  if (!query) {
    return '';
  }

  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    searchParams.append(key, String(value));
  });

  const output = searchParams.toString();

  return output ? `?${output}` : '';
};

const buildUrl = (path: string, query?: QueryParams) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const queryString = buildQueryString(query);

  return `${env.apiBaseUrl}${normalizedPath}${queryString}`;
};

const normalizeResponse = <TData>(payload: ApiEnvelope<TData> | TData): TData => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data;
  }

  return payload as TData;
};

export async function apiRequest<TResponse, TBody = unknown>(
  path: string,
  options: ApiRequestOptions<TBody> = {},
) {
  if (!hasApiBaseUrl) {
    throw new ApiError(
      'Missing EXPO_PUBLIC_API_BASE_URL. Add the backend URL when the APIs are ready.',
      0,
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.requestTimeoutMs);

  const method = options.method ?? 'GET';
  const url = buildUrl(path, options.query);

  logger.debug('API', `→ ${method} ${url}`, options.body ?? undefined);

  try {
    const authHeader =
      options.headers?.Authorization ??
      options.headers?.authorization ??
      (runtimeApiBearerToken ? `Bearer ${runtimeApiBearerToken}` : undefined);

    const response = await fetch(url, {
      body: options.body ? JSON.stringify(options.body) : undefined,
      headers: {
        ...defaultHeaders,
        ...options.headers,
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      method,
      signal: options.signal ?? controller.signal,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      logger.error('API', `✗ ${method} ${url} → ${response.status}`, payload);
      throw new ApiError(
        (payload && typeof payload === 'object' && 'message' in payload && payload.message) ||
          `Request failed with status ${response.status}.`,
        response.status,
        payload,
      );
    }

    logger.info('API', `✓ ${method} ${url} → ${response.status}`);
    return normalizeResponse<TResponse>(payload);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      logger.warn('API', `⏱ ${method} ${url} → timed out after ${env.requestTimeoutMs}ms`);
      throw new ApiError('Request timed out.', 408);
    }

    logger.error('API', `✗ ${method} ${url} → network error`, error);
    throw new ApiError('Unexpected network error.', 500, error);
  } finally {
    clearTimeout(timeout);
  }
}

export function setApiBearerToken(token: string | null | undefined) {
  runtimeApiBearerToken = token?.trim() ? token : '';
}

export function resetApiBearerToken() {
  runtimeApiBearerToken = env.apiBearerToken;
}

export function getApiBearerToken() {
  return runtimeApiBearerToken;
}

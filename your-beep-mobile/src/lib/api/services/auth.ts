import { apiRequest } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { AuthSyncResponse, CurrentUserProfileResponse } from '@/lib/api/types';

interface AuthSyncPayload {
  deviceType?: 'android' | 'ios' | 'web';
  fcmToken?: string;
  region?: string;
  timezone?: string;
}

export function syncAuthenticatedUser(payload: AuthSyncPayload = {}) {
  return apiRequest<AuthSyncResponse>(apiEndpoints.auth.sync, {
    body: {
      ...payload,
    },
    method: 'POST',
  });
}

export function fetchCurrentUser() {
  return apiRequest<CurrentUserProfileResponse>(apiEndpoints.auth.me);
}

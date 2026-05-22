import { apiRequest } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import {
  CurrentUserDashboard,
  CurrentUserProfileResponse,
  CurrentUserProgressResponse,
  CurrentUserStats,
} from '@/lib/api/types';

export function fetchUserProfile() {
  return apiRequest<CurrentUserProfileResponse>(apiEndpoints.identity.me);
}

export function fetchUserStats() {
  return apiRequest<CurrentUserStats>(apiEndpoints.identity.stats);
}

export function fetchUserDashboard() {
  return apiRequest<CurrentUserDashboard>(apiEndpoints.identity.dashboard);
}

export function fetchUserProgress() {
  return apiRequest<CurrentUserProgressResponse>(apiEndpoints.identity.progress);
}

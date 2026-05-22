import { apiRequest } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { ReflectionSnapshot } from '@/lib/api/types';

export function fetchDailyReflection() {
  return apiRequest<ReflectionSnapshot>(apiEndpoints.reflections.daily);
}

export function fetchWeeklyReflection() {
  return apiRequest<ReflectionSnapshot[]>(apiEndpoints.reflections.weekly);
}

import { apiRequest } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { SomaticRegion, SomaticSelectionPayload } from '@/lib/api/types';

export function submitSomaticSelection(payload: SomaticSelectionPayload) {
  return apiRequest<void>(apiEndpoints.somatics.selection, {
    body: payload,
    method: 'POST',
  });
}

export function fetchSomaticAwarenessTests(region: SomaticRegion) {
  return apiRequest<string[]>(apiEndpoints.somatics.awarenessTests(region));
}

export function fetchSomaticActivities(region: SomaticRegion) {
  return apiRequest<string[]>(apiEndpoints.somatics.activities(region));
}

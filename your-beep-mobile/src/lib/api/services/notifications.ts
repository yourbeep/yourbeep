import { apiRequest } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { DeviceRegistrationResponse } from '@/lib/api/types';

export function registerDevice(fcmToken: string, deviceType: 'android' | 'ios' | 'web' = 'android') {
  return apiRequest<DeviceRegistrationResponse>(apiEndpoints.notifications.registerDevice, {
    body: {
      deviceType,
      fcmToken,
    },
    method: 'POST',
  });
}

export function unregisterDevice(fcmToken: string) {
  return apiRequest<DeviceRegistrationResponse>(apiEndpoints.notifications.registerDevice, {
    body: { fcmToken },
    method: 'DELETE',
  });
}

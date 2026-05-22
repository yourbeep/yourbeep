import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadPlatformSettings } from '@/features/settings/store/settings-slice';

type NotificationsModule = {
  addNotificationResponseListener?: (listener: (event: { notification: unknown }) => void) => {
    remove: () => void;
  };
  getExpoPushTokenAsync: () => Promise<{ data: string }>;
  requestPermissionsAsync: () => Promise<{ status: string }>;
};

// expo-notifications is not available in Expo Go with SDK 53
// It requires a development build. Dynamically import to avoid crashes.
let Notifications: NotificationsModule | null = null;
try {
  Notifications = require('expo-notifications') as NotificationsModule;
} catch (error) {
  console.warn('expo-notifications not available (requires development build):', error);
}

/**
 * AppInitializer
 * Handles app initialization tasks on mount:
 * - Load platform settings from admin portal
 * - Request notification permissions (if available)
 * - Register FCM token for push notifications
 * - Set up notification listeners
 */
export function AppInitializer() {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Load platform settings on app mount
    // These settings control all dynamic content: FAQ, contacts, etc.
    void dispatch(loadPlatformSettings());
  }, [dispatch]);

  useEffect(() => {
    if (!authState.isAuthenticated || !Notifications) {
      return;
    }

    let notificationSubscription: { remove: () => void } | undefined;

    const setupNotifications = async () => {
      try {
        // Request notification permissions
        const { status } = await Notifications!.requestPermissionsAsync();
        
        if (status !== 'granted') {
          console.warn('Notification permissions not granted');
          return;
        }

        // Get the FCM token (Expo will return an Expo push token)
        const expoPushToken = await Notifications!.getExpoPushTokenAsync();
        console.log('Expo push token:', expoPushToken.data);

        // Register the token with the backend
        // Note: The backend will handle FCM token registration
        // This is typically done in the auth flow

        // Listen for incoming notifications
        if (typeof Notifications!.addNotificationResponseListener === 'function') {
          notificationSubscription = Notifications!.addNotificationResponseListener(
            ({ notification }: { notification: unknown }) => {
              console.log('Notification received:', notification);
            },
          );
        }
      } catch (error) {
        console.error('Failed to setup notifications:', error);
      }
    };

    void setupNotifications();

    return () => {
      if (notificationSubscription) {
        notificationSubscription.remove();
      }
    };
  }, [authState.isAuthenticated]);

  return null;
}

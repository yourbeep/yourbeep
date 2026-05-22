import { PropsWithChildren, useEffect } from 'react';
import { Platform } from 'react-native';

import { syncAuthenticatedUser } from '@/lib/api';
import { resetApiBearerToken, setApiBearerToken } from '@/lib/api/client';
import { observeFirebaseIdToken } from '@/lib/firebase/client';
import {
  clearAuthSession,
  setAuthError,
  setAuthReady,
  setAuthSession,
  setSyncStatus,
} from '@/features/auth/store/auth-slice';
import { useAppDispatch } from '@/store/hooks';

export function AuthSessionBootstrap({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let active = true;

    const unsubscribe = observeFirebaseIdToken(async (firebaseUser) => {
      if (!active) {
        return;
      }

      if (!firebaseUser) {
        resetApiBearerToken();
        dispatch(clearAuthSession());
        dispatch(setAuthReady(true));
        return;
      }

      try {
        const token = await firebaseUser.getIdToken();

        if (!active) {
          return;
        }

        setApiBearerToken(token);
        dispatch(
          setAuthSession({
            email: firebaseUser.email,
            firebaseUid: firebaseUser.uid,
            token,
          }),
        );
        dispatch(setSyncStatus('syncing'));

        await syncAuthenticatedUser({
          deviceType: Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });

        if (!active) {
          return;
        }

        dispatch(setSyncStatus('synced'));
      } catch (error) {
        if (!active) {
          return;
        }

        dispatch(
          setAuthError(
            error instanceof Error ? error.message : 'Could not sync the authenticated user.',
          ),
        );
      } finally {
        if (active) {
          dispatch(setAuthReady(true));
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [dispatch]);

  return children;
}

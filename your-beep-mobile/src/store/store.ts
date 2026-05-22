import { authReducer } from '@/features/auth/store/auth-slice';
import { configureStore } from '@reduxjs/toolkit';

import { somaticReducer } from '@/features/somatic/store/somatic-slice';
import { uiReducer } from '@/features/ui/store/ui-slice';
import { settingsReducer } from '@/features/settings/store/settings-slice';
import { notificationsReducer } from '@/features/notifications/store/notifications-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    somatic: somaticReducer,
    ui: uiReducer,
    settings: settingsReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

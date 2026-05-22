import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type AuthSyncStatus = 'idle' | 'syncing' | 'synced' | 'failed';

interface AuthState {
  email: string | null;
  error: string | null;
  firebaseUid: string | null;
  isAuthenticated: boolean;
  isReady: boolean;
  syncStatus: AuthSyncStatus;
  token: string | null;
}

const initialState: AuthState = {
  email: null,
  error: null,
  firebaseUid: null,
  isAuthenticated: false,
  isReady: false,
  syncStatus: 'idle',
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthSession: () => initialState,
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.syncStatus = action.payload ? 'failed' : state.syncStatus;
    },
    setAuthReady(state, action: PayloadAction<boolean>) {
      state.isReady = action.payload;
    },
    setAuthSession(
      state,
      action: PayloadAction<{
        email: string | null;
        firebaseUid: string | null;
        token: string | null;
      }>,
    ) {
      state.email = action.payload.email;
      state.firebaseUid = action.payload.firebaseUid;
      state.isAuthenticated = Boolean(action.payload.token);
      state.token = action.payload.token;
      state.error = null;
    },
    setSyncStatus(state, action: PayloadAction<AuthSyncStatus>) {
      state.syncStatus = action.payload;
      if (action.payload !== 'failed') {
        state.error = null;
      }
    },
  },
});

export const { clearAuthSession, setAuthError, setAuthReady, setAuthSession, setSyncStatus } =
  authSlice.actions;

export const authReducer = authSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchPlatformSettings } from '@/lib/api';
import type { PlatformSettings } from '@/lib/api/types';

interface SettingsState {
  platformSettings: PlatformSettings | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  platformSettings: null,
  isLoading: false,
  error: null,
};

export const loadPlatformSettings = createAsyncThunk(
  'settings/loadPlatformSettings',
  async (_, { rejectWithValue }) => {
    try {
      const settings = await fetchPlatformSettings();
      return settings;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to load platform settings',
      );
    }
  },
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadPlatformSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadPlatformSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.platformSettings = action.payload;
        state.error = null;
      })
      .addCase(loadPlatformSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const settingsReducer = settingsSlice.reducer;

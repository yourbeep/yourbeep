import { createSlice } from "@reduxjs/toolkit";
import type { GamesState } from "./gamesTypes";
import {
  createAdminGame,
  deleteAdminGame,
  fetchAdminGamesLibrary,
  restoreAdminGame,
  updateAdminGame,
} from "./gamesThunk";

const initialState: GamesState = {
  items: [],
  hasLoaded: false,
  loading: false,
  mutating: false,
  error: null,
};

const replaceGame = (state: GamesState, game: any) => {
  const exists = state.items.some((item) => item._id === game._id);
  state.items = exists
    ? state.items.map((item) => (item._id === game._id ? { ...item, ...game } : item))
    : [game, ...state.items];
};

const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminGamesLibrary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminGamesLibrary.fulfilled, (state, action) => {
        state.loading = false;
        state.hasLoaded = true;
        state.items = action.payload;
      })
      .addCase(fetchAdminGamesLibrary.rejected, (state, action) => {
        state.loading = false;
        state.hasLoaded = true;
        state.error = String(action.payload || "Unable to load game library.");
      });

    [createAdminGame, updateAdminGame, deleteAdminGame, restoreAdminGame].forEach(
      (thunk) => {
        builder
          .addCase(thunk.pending, (state) => {
            state.mutating = true;
            state.error = null;
          })
          .addCase(thunk.fulfilled, (state, action) => {
            state.mutating = false;
            replaceGame(state, action.payload);
          })
          .addCase(thunk.rejected, (state, action) => {
            state.mutating = false;
            state.error = String(action.payload || "Unable to save game.");
          });
      },
    );
  },
});

export const gamesReducer = gamesSlice.reducer;
export default gamesSlice.reducer;

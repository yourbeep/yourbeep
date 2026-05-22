import { createSlice } from "@reduxjs/toolkit";
import { fetchAdminCourses, fetchAdminGames } from "./coursesThunk";
import type { CoursesState } from "./coursesTypes";

const initialState: CoursesState = {
  courses: [],
  games: [],
  hasLoadedCourses: false,
  hasLoadedGames: false,
  loadingCourses: false,
  loadingGames: false,
  error: null,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminCourses.pending, (state) => {
        state.loadingCourses = true;
        state.error = null;
      })
      .addCase(fetchAdminCourses.fulfilled, (state, action) => {
        state.loadingCourses = false;
        state.hasLoadedCourses = true;
        state.courses = action.payload;
      })
      .addCase(fetchAdminCourses.rejected, (state, action) => {
        state.loadingCourses = false;
        state.hasLoadedCourses = true;
        state.error = String(action.payload || "Unable to load courses.");
      })
      .addCase(fetchAdminGames.pending, (state) => {
        state.loadingGames = true;
        state.error = null;
      })
      .addCase(fetchAdminGames.fulfilled, (state, action) => {
        state.loadingGames = false;
        state.hasLoadedGames = true;
        state.games = action.payload;
      })
      .addCase(fetchAdminGames.rejected, (state, action) => {
        state.loadingGames = false;
        state.hasLoadedGames = true;
        state.error = String(action.payload || "Unable to load games.");
      });
  },
});

export const coursesReducer = coursesSlice.reducer;
export default coursesSlice.reducer;

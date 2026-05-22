import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers } from "./usersThunk";
import type { UsersState } from "./usersTypes";

const initialState: UsersState = {
  data: null,
  filters: {
    page: 1,
    limit: 10,
    q: "",
    region: undefined,
    planType: undefined,
    isActive: undefined,
  },
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.filters = {
          page: action.meta.arg?.page ?? 1,
          limit: action.meta.arg?.limit ?? 10,
          q: action.meta.arg?.q ?? "",
          region: action.meta.arg?.region,
          planType: action.meta.arg?.planType,
          isActive: action.meta.arg?.isActive,
        };
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload || "Unable to load students.");
      });
  },
});

export const usersReducer = usersSlice.reducer;
export default usersSlice.reducer;

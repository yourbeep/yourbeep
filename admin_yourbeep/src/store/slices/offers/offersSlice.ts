import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPromotionDetail,
  archivePromotion,
  createPromotion,
  fetchPromotions,
  fetchPromotionSummary,
  restorePromotion,
  updatePromotion,
} from "./offersThunk";
import type { OffersState } from "./offersTypes";

const initialState: OffersState = {
  summary: null,
  list: null,
  selectedPromotion: null,
  filters: {
    page: 1,
    limit: 20,
    q: "",
    status: undefined,
    courseId: undefined,
  },
  loadingSummary: false,
  loadingList: false,
  loadingDetail: false,
  mutating: false,
  error: null,
};

const offersSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    clearSelectedPromotion: (state) => {
      state.selectedPromotion = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromotionSummary.pending, (state) => {
        state.loadingSummary = true;
        state.error = null;
      })
      .addCase(fetchPromotionSummary.fulfilled, (state, action) => {
        state.loadingSummary = false;
        state.summary = action.payload;
      })
      .addCase(fetchPromotionSummary.rejected, (state, action) => {
        state.loadingSummary = false;
        state.error = String(action.payload || "Unable to load promotion summary.");
      })
      .addCase(fetchPromotions.pending, (state, action) => {
        state.loadingList = true;
        state.error = null;
        state.filters = {
          page: action.meta.arg?.page ?? 1,
          limit: action.meta.arg?.limit ?? 20,
          q: action.meta.arg?.q ?? "",
          status: action.meta.arg?.status,
          courseId: action.meta.arg?.courseId,
        };
      })
      .addCase(fetchPromotions.fulfilled, (state, action) => {
        state.loadingList = false;
        state.list = action.payload;
      })
      .addCase(fetchPromotions.rejected, (state, action) => {
        state.loadingList = false;
        state.error = String(action.payload || "Unable to load promotions.");
      })
      .addCase(fetchPromotionDetail.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(fetchPromotionDetail.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.selectedPromotion = action.payload;
      })
      .addCase(fetchPromotionDetail.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = String(action.payload || "Unable to load promotion detail.");
      });

    [createPromotion, updatePromotion, archivePromotion, restorePromotion].forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.mutating = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state) => {
          state.mutating = false;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.mutating = false;
          state.error = String(action.payload || "Unable to save promotion.");
        });
    });
  },
});

export const { clearSelectedPromotion } = offersSlice.actions;
export const offersReducer = offersSlice.reducer;
export default offersSlice.reducer;

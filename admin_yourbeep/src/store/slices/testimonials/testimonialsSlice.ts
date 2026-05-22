import { createSlice } from "@reduxjs/toolkit";
import type { TestimonialsState } from "./testimonialsTypes";
import {
  createAdminTestimonial,
  fetchTestimonialDetail,
  fetchTestimonials,
  hideAdminTestimonial,
  updateAdminTestimonial,
} from "./testimonialsThunk";

const initialState: TestimonialsState = {
  list: null,
  selectedTestimonial: null,
  filters: {
    page: 1,
    limit: 10,
    q: "",
  },
  loadingList: false,
  loadingDetail: false,
  mutating: false,
  error: null,
};

const replaceInList = (state: TestimonialsState, testimonial: any) => {
  if (!state.list) return;
  state.list.items = state.list.items.map((item) =>
    item._id === testimonial._id ? { ...item, ...testimonial } : item,
  );
};

const testimonialsSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {
    clearTestimonialsError: (state) => {
      state.error = null;
    },
    clearSelectedTestimonial: (state) => {
      state.selectedTestimonial = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loadingList = false;
        state.list = action.payload;
        state.filters = {
          ...state.filters,
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
        };
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loadingList = false;
        state.error = String(action.payload || "Unable to load testimonials.");
      })
      .addCase(fetchTestimonialDetail.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(fetchTestimonialDetail.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.selectedTestimonial = action.payload;
        replaceInList(state, action.payload);
      })
      .addCase(fetchTestimonialDetail.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = String(action.payload || "Unable to load testimonial detail.");
      });

    [createAdminTestimonial, updateAdminTestimonial, hideAdminTestimonial].forEach(
      (thunk) => {
        builder
          .addCase(thunk.pending, (state) => {
            state.mutating = true;
            state.error = null;
          })
          .addCase(thunk.fulfilled, (state, action) => {
            state.mutating = false;
            state.selectedTestimonial = action.payload;
            replaceInList(state, action.payload);
          })
          .addCase(thunk.rejected, (state, action) => {
            state.mutating = false;
            state.error = String(action.payload || "Unable to save testimonial.");
          });
      },
    );
  },
});

export const { clearSelectedTestimonial, clearTestimonialsError } =
  testimonialsSlice.actions;
export const testimonialsReducer = testimonialsSlice.reducer;
export default testimonialsSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import type { NotificationsState } from "./notificationsTypes";
import {
  cancelNotificationCampaign,
  createNotificationCampaign,
  fetchNotificationCampaignDetail,
  fetchNotificationCampaigns,
  fetchNotificationSummary,
  previewNotificationAudience,
  sendNotificationCampaign,
  updateNotificationCampaign,
} from "./notificationsThunk";

const initialState: NotificationsState = {
  summary: null,
  list: null,
  selectedCampaign: null,
  audiencePreview: null,
  filters: {
    page: 1,
    limit: 10,
    q: "",
  },
  loadingSummary: false,
  loadingList: false,
  loadingDetail: false,
  previewLoading: false,
  mutating: false,
  error: null,
};

const replaceCampaignInList = (state: NotificationsState, campaign: any) => {
  if (!state.list) return;
  state.list.items = state.list.items.map((item) =>
    item._id === campaign._id ? { ...item, ...campaign } : item,
  );
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotificationsError: (state) => {
      state.error = null;
    },
    clearAudiencePreview: (state) => {
      state.audiencePreview = null;
    },
    clearSelectedCampaign: (state) => {
      state.selectedCampaign = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationSummary.pending, (state) => {
        state.loadingSummary = true;
        state.error = null;
      })
      .addCase(fetchNotificationSummary.fulfilled, (state, action) => {
        state.loadingSummary = false;
        state.summary = action.payload;
      })
      .addCase(fetchNotificationSummary.rejected, (state, action) => {
        state.loadingSummary = false;
        state.error = String(action.payload || "Unable to load notification summary.");
      })
      .addCase(fetchNotificationCampaigns.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(fetchNotificationCampaigns.fulfilled, (state, action) => {
        state.loadingList = false;
        state.list = action.payload;
        state.filters = {
          ...state.filters,
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
        };
      })
      .addCase(fetchNotificationCampaigns.rejected, (state, action) => {
        state.loadingList = false;
        state.error = String(action.payload || "Unable to load notification campaigns.");
      })
      .addCase(fetchNotificationCampaignDetail.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(fetchNotificationCampaignDetail.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.selectedCampaign = action.payload;
        replaceCampaignInList(state, action.payload);
      })
      .addCase(fetchNotificationCampaignDetail.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = String(action.payload || "Unable to load notification campaign.");
      })
      .addCase(previewNotificationAudience.pending, (state) => {
        state.previewLoading = true;
        state.error = null;
      })
      .addCase(previewNotificationAudience.fulfilled, (state, action) => {
        state.previewLoading = false;
        state.audiencePreview = action.payload;
      })
      .addCase(previewNotificationAudience.rejected, (state, action) => {
        state.previewLoading = false;
        state.error = String(action.payload || "Unable to preview notification audience.");
      });

    [createNotificationCampaign, updateNotificationCampaign, sendNotificationCampaign, cancelNotificationCampaign].forEach(
      (thunk) => {
        builder
          .addCase(thunk.pending, (state) => {
            state.mutating = true;
            state.error = null;
          })
          .addCase(thunk.fulfilled, (state, action) => {
            state.mutating = false;
            state.selectedCampaign = action.payload;
            replaceCampaignInList(state, action.payload);
          })
          .addCase(thunk.rejected, (state, action) => {
            state.mutating = false;
            state.error = String(action.payload || "Unable to save notification campaign.");
          });
      },
    );
  },
});

export const { clearAudiencePreview, clearNotificationsError, clearSelectedCampaign } =
  notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;
export default notificationsSlice.reducer;

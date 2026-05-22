import { createSlice } from "@reduxjs/toolkit";
import type { SupportState } from "./supportTypes";
import {
  fetchAdminTicketDetail,
  fetchAdminTickets,
  fetchContactRequestDetail,
  fetchContactRequests,
  fetchSupportSummary,
  replyToAdminTicket,
  updateAdminTicket,
  updateContactRequest,
} from "./supportThunk";

const initialState: SupportState = {
  summary: null,
  tickets: null,
  contacts: null,
  selectedTicket: null,
  selectedContact: null,
  ticketsFilters: {
    page: 1,
    limit: 10,
    q: "",
  },
  contactsFilters: {
    page: 1,
    limit: 10,
    q: "",
  },
  loadingSummary: false,
  loadingTickets: false,
  loadingContacts: false,
  loadingTicketDetail: false,
  loadingContactDetail: false,
  mutating: false,
  error: null,
};

const replaceTicketInList = (state: SupportState, ticket: any) => {
  if (!state.tickets) return;
  state.tickets.items = state.tickets.items.map((item) =>
    item._id === ticket._id ? { ...item, ...ticket } : item,
  );
};

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    clearSupportError: (state) => {
      state.error = null;
    },
    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
    },
    clearSelectedContact: (state) => {
      state.selectedContact = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupportSummary.pending, (state) => {
        state.loadingSummary = true;
        state.error = null;
      })
      .addCase(fetchSupportSummary.fulfilled, (state, action) => {
        state.loadingSummary = false;
        state.summary = action.payload;
      })
      .addCase(fetchSupportSummary.rejected, (state, action) => {
        state.loadingSummary = false;
        state.error = String(action.payload || "Unable to load support summary.");
      })
      .addCase(fetchAdminTickets.pending, (state) => {
        state.loadingTickets = true;
        state.error = null;
      })
      .addCase(fetchAdminTickets.fulfilled, (state, action) => {
        state.loadingTickets = false;
        state.tickets = action.payload;
        state.ticketsFilters = {
          ...state.ticketsFilters,
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
        };
      })
      .addCase(fetchAdminTickets.rejected, (state, action) => {
        state.loadingTickets = false;
        state.error = String(action.payload || "Unable to load support tickets.");
      })
      .addCase(fetchAdminTicketDetail.pending, (state) => {
        state.loadingTicketDetail = true;
        state.error = null;
      })
      .addCase(fetchAdminTicketDetail.fulfilled, (state, action) => {
        state.loadingTicketDetail = false;
        state.selectedTicket = action.payload;
        replaceTicketInList(state, action.payload);
      })
      .addCase(fetchAdminTicketDetail.rejected, (state, action) => {
        state.loadingTicketDetail = false;
        state.error = String(action.payload || "Unable to load support ticket.");
      })
      .addCase(fetchContactRequests.pending, (state) => {
        state.loadingContacts = true;
        state.error = null;
      })
      .addCase(fetchContactRequests.fulfilled, (state, action) => {
        state.loadingContacts = false;
        state.contacts = action.payload;
        state.contactsFilters = {
          ...state.contactsFilters,
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
        };
      })
      .addCase(fetchContactRequests.rejected, (state, action) => {
        state.loadingContacts = false;
        state.error = String(action.payload || "Unable to load get in touch requests.");
      })
      .addCase(fetchContactRequestDetail.pending, (state) => {
        state.loadingContactDetail = true;
        state.error = null;
      })
      .addCase(fetchContactRequestDetail.fulfilled, (state, action) => {
        state.loadingContactDetail = false;
        state.selectedContact = action.payload;
        if (state.contacts) {
          state.contacts.items = state.contacts.items.map((item) =>
            item._id === action.payload._id ? action.payload : item,
          );
        }
      })
      .addCase(fetchContactRequestDetail.rejected, (state, action) => {
        state.loadingContactDetail = false;
        state.error = String(action.payload || "Unable to load get in touch request.");
      });

    [replyToAdminTicket, updateAdminTicket].forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.mutating = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.mutating = false;
          state.selectedTicket = action.payload;
          replaceTicketInList(state, action.payload);
        })
        .addCase(thunk.rejected, (state, action) => {
          state.mutating = false;
          state.error = String(action.payload || "Unable to save support ticket.");
        });
    });

    builder
      .addCase(updateContactRequest.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(updateContactRequest.fulfilled, (state, action) => {
        state.mutating = false;
        state.selectedContact = action.payload;
        if (state.contacts) {
          state.contacts.items = state.contacts.items.map((item) =>
            item._id === action.payload._id ? action.payload : item,
          );
        }
      })
      .addCase(updateContactRequest.rejected, (state, action) => {
        state.mutating = false;
        state.error = String(action.payload || "Unable to update get in touch request.");
      });
  },
});

export const { clearSupportError, clearSelectedTicket, clearSelectedContact } =
  supportSlice.actions;
export const supportReducer = supportSlice.reducer;
export default supportSlice.reducer;

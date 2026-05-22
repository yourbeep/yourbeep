import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { supportApi } from "../../../features/support/services/supportApi";
import { getApiErrorMessage } from "../../../utils/apiError";
import type {
  ContactRequestItem,
  ContactRequestsFilters,
  SupportListPayload,
  SupportSummary,
  SupportTicketItem,
  SupportTicketsFilters,
} from "./supportTypes";

const mapTicket = (ticket: any): SupportTicketItem => ({
  _id: String(ticket?._id || ""),
  ticketNumber: String(ticket?.ticketNumber || ""),
  userId: String(ticket?.userId || ""),
  type: ticket?.type || "general_support",
  subject: String(ticket?.subject || ""),
  description: String(ticket?.description || ""),
  status: ticket?.status || "open",
  priority: ticket?.priority || "medium",
  courseId: ticket?.courseId ? String(ticket.courseId) : null,
  purchaseId: ticket?.purchaseId ? String(ticket.purchaseId) : null,
  videoId: ticket?.videoId ? String(ticket.videoId) : null,
  gameId: ticket?.gameId ? String(ticket.gameId) : null,
  assignedAdminId: ticket?.assignedAdminId ? String(ticket.assignedAdminId) : null,
  tags: Array.isArray(ticket?.tags) ? ticket.tags : [],
  messages: Array.isArray(ticket?.messages)
    ? ticket.messages.map((message: any) => ({
        senderType: message?.senderType || "user",
        senderId: message?.senderId ? String(message.senderId) : null,
        body: String(message?.body || ""),
        attachments: Array.isArray(message?.attachments) ? message.attachments : [],
        createdAt: String(message?.createdAt || new Date().toISOString()),
      }))
    : [],
  lastReplyAt: String(ticket?.lastReplyAt || ticket?.updatedAt || ticket?.createdAt || new Date().toISOString()),
  lastReplyBy: ticket?.lastReplyBy || "user",
  resolvedAt: ticket?.resolvedAt || null,
  closedAt: ticket?.closedAt || null,
  createdAt: String(ticket?.createdAt || new Date().toISOString()),
  updatedAt: String(ticket?.updatedAt || new Date().toISOString()),
  user: ticket?.user
    ? {
        _id: String(ticket.user._id || ""),
        name: String(ticket.user.name || ""),
        email: String(ticket.user.email || ""),
      }
    : null,
});

const mapContact = (request: any): ContactRequestItem => ({
  _id: String(request?._id || ""),
  name: String(request?.name || ""),
  email: String(request?.email || ""),
  topic: request?.topic || "general_support",
  subject: String(request?.subject || ""),
  message: String(request?.message || ""),
  phoneCountryCode:
    typeof request?.phoneCountryCode === "string" ? request.phoneCountryCode : null,
  userId: request?.userId ? String(request.userId) : null,
  status: request?.status || "new",
  notes: typeof request?.notes === "string" ? request.notes : null,
  createdAt: String(request?.createdAt || new Date().toISOString()),
  updatedAt: String(request?.updatedAt || new Date().toISOString()),
});

const mapPagination = (pagination: any, fallbackPage: number, fallbackLimit: number) => ({
  page: Number(pagination?.page || fallbackPage),
  limit: Number(pagination?.limit || fallbackLimit),
  total: Number(pagination?.total || 0),
});

export const fetchSupportSummary = createAsyncThunk<
  SupportSummary,
  void,
  { rejectValue: string }
>("support/fetchSummary", async (_, { rejectWithValue }) => {
  try {
    const response = await supportApi.getSummary();
    const data = response.data?.data ?? {};

    return {
      total: Number(data.total || 0),
      open: Number(data.open || 0),
      inProgress: Number(data.inProgress || 0),
      waitingOnUser: Number(data.waitingOnUser || 0),
      resolved: Number(data.resolved || 0),
      closed: Number(data.closed || 0),
      urgent: Number(data.urgent || 0),
      high: Number(data.high || 0),
      medium: Number(data.medium || 0),
      low: Number(data.low || 0),
      refundRelated: Number(data.refundRelated || 0),
      accountAccess: Number(data.accountAccess || 0),
      courseAccess: Number(data.courseAccess || 0),
      videoAccess: Number(data.videoAccess || 0),
      recent: Array.isArray(data.recent) ? data.recent.map(mapTicket) : [],
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load support summary."),
      );
    }

    return rejectWithValue("Unable to load support summary.");
  }
});

export const fetchAdminTickets = createAsyncThunk<
  SupportListPayload<SupportTicketItem>,
  SupportTicketsFilters | void,
  { rejectValue: string }
>("support/fetchTickets", async (filters, { rejectWithValue }) => {
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 10;

  try {
    const response = await supportApi.listTickets({
      page,
      limit,
      ...(filters?.q ? { q: filters.q } : {}),
      ...(filters?.type ? { type: filters.type } : {}),
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.priority ? { priority: filters.priority } : {}),
    });

    const data = response.data?.data ?? {};
    return {
      items: Array.isArray(data.items) ? data.items.map(mapTicket) : [],
      pagination: mapPagination(data.pagination, page, limit),
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load support tickets."),
      );
    }

    return rejectWithValue("Unable to load support tickets.");
  }
});

export const fetchAdminTicketDetail = createAsyncThunk<
  SupportTicketItem,
  string,
  { rejectValue: string }
>("support/fetchTicketDetail", async (ticketId, { rejectWithValue }) => {
  try {
    const response = await supportApi.getTicket(ticketId);
    return mapTicket(response.data?.data?.ticket ?? {});
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load support ticket."),
      );
    }

    return rejectWithValue("Unable to load support ticket.");
  }
});

export const replyToAdminTicket = createAsyncThunk<
  SupportTicketItem,
  { ticketId: string; body: string; attachments?: string[] },
  { rejectValue: string }
>("support/replyTicket", async ({ ticketId, body, attachments }, { rejectWithValue }) => {
  try {
    const response = await supportApi.replyToTicket(ticketId, {
      body,
      attachments: attachments ?? [],
    });

    return mapTicket(response.data?.data?.ticket ?? {});
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to reply to support ticket."),
      );
    }

    return rejectWithValue("Unable to reply to support ticket.");
  }
});

export const updateAdminTicket = createAsyncThunk<
  SupportTicketItem,
  {
    ticketId: string;
    payload: {
      type?: string;
      status?: string;
      priority?: string;
      assignedAdminId?: string | null;
      tags?: string[];
    };
  },
  { rejectValue: string }
>("support/updateTicket", async ({ ticketId, payload }, { rejectWithValue }) => {
  try {
    const response = await supportApi.updateTicket(ticketId, payload);
    return mapTicket(response.data?.data?.ticket ?? {});
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to update support ticket."),
      );
    }

    return rejectWithValue("Unable to update support ticket.");
  }
});

export const fetchContactRequests = createAsyncThunk<
  SupportListPayload<ContactRequestItem>,
  ContactRequestsFilters | void,
  { rejectValue: string }
>("support/fetchContactRequests", async (filters, { rejectWithValue }) => {
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 10;

  try {
    const response = await supportApi.listContactRequests({
      page,
      limit,
      ...(filters?.q ? { q: filters.q } : {}),
      ...(filters?.topic ? { topic: filters.topic } : {}),
      ...(filters?.status ? { status: filters.status } : {}),
    });

    const data = response.data?.data ?? {};
    return {
      items: Array.isArray(data.items) ? data.items.map(mapContact) : [],
      pagination: mapPagination(data.pagination, page, limit),
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load get in touch requests."),
      );
    }

    return rejectWithValue("Unable to load get in touch requests.");
  }
});

export const fetchContactRequestDetail = createAsyncThunk<
  ContactRequestItem,
  string,
  { rejectValue: string }
>("support/fetchContactDetail", async (requestId, { rejectWithValue }) => {
  try {
    const response = await supportApi.getContactRequest(requestId);
    return mapContact(response.data?.data?.request ?? {});
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load get in touch request."),
      );
    }

    return rejectWithValue("Unable to load get in touch request.");
  }
});

export const updateContactRequest = createAsyncThunk<
  ContactRequestItem,
  { requestId: string; payload: { status?: string; notes?: string } },
  { rejectValue: string }
>("support/updateContactRequest", async ({ requestId, payload }, { rejectWithValue }) => {
  try {
    const response = await supportApi.updateContactRequest(requestId, payload);
    return mapContact(response.data?.data?.request ?? {});
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to update get in touch request."),
      );
    }

    return rejectWithValue("Unable to update get in touch request.");
  }
});

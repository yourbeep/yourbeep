import api from "../../../services/api";
import type {
  ContactRequestStatus,
  ContactRequestTopic,
  SupportTicketPriority,
  SupportTicketStatus,
  SupportTicketType,
} from "../../../store/slices/support";

type ListTicketsParams = {
  page?: number;
  limit?: number;
  q?: string;
  type?: SupportTicketType;
  status?: SupportTicketStatus;
  priority?: SupportTicketPriority;
};

type TicketReplyPayload = {
  body: string;
  attachments?: string[];
};

type TicketUpdatePayload = {
  type?: SupportTicketType;
  status?: SupportTicketStatus;
  priority?: SupportTicketPriority;
  assignedAdminId?: string | null;
  tags?: string[];
};

type ListContactRequestsParams = {
  page?: number;
  limit?: number;
  q?: string;
  topic?: ContactRequestTopic;
  status?: ContactRequestStatus;
};

type ContactRequestUpdatePayload = {
  status?: ContactRequestStatus;
  notes?: string;
};

export const supportApi = {
  getSummary: () => api.get("/admin/tickets/summary"),
  listTickets: (params: ListTicketsParams) =>
    api.get("/admin/tickets", { params }),
  getTicket: (ticketId: string) => api.get(`/admin/tickets/${ticketId}`),
  replyToTicket: (ticketId: string, payload: TicketReplyPayload) =>
    api.post(`/admin/tickets/${ticketId}/replies`, payload),
  updateTicket: (ticketId: string, payload: TicketUpdatePayload) =>
    api.patch(`/admin/tickets/${ticketId}`, payload),
  listContactRequests: (params: ListContactRequestsParams) =>
    api.get("/admin/get-in-touch", { params }),
  getContactRequest: (requestId: string) =>
    api.get(`/admin/get-in-touch/${requestId}`),
  updateContactRequest: (
    requestId: string,
    payload: ContactRequestUpdatePayload,
  ) => api.patch(`/admin/get-in-touch/${requestId}`, payload),
};

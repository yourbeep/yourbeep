export type SupportTicketStatus =
  | "open"
  | "in_progress"
  | "waiting_on_user"
  | "resolved"
  | "closed";

export type SupportTicketPriority = "low" | "medium" | "high" | "urgent";

export type SupportTicketType =
  | "refund_related"
  | "account_access"
  | "course_access"
  | "video_access"
  | "payment_issue"
  | "game_issue"
  | "technical_issue"
  | "general_support";

export type SupportTicketMessage = {
  senderType: "user" | "admin" | "system";
  senderId: string | null;
  body: string;
  attachments: string[];
  createdAt: string;
};

export type SupportTicketUser = {
  _id: string;
  name: string;
  email: string;
} | null;

export type SupportTicketItem = {
  _id: string;
  ticketNumber: string;
  userId: string;
  type: SupportTicketType;
  subject: string;
  description: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  courseId: string | null;
  purchaseId: string | null;
  videoId: string | null;
  gameId: string | null;
  assignedAdminId: string | null;
  tags: string[];
  messages: SupportTicketMessage[];
  lastReplyAt: string;
  lastReplyBy: "user" | "admin" | "system";
  resolvedAt: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: SupportTicketUser;
};

export type ContactRequestStatus = "new" | "reviewed" | "replied" | "closed";

export type ContactRequestTopic =
  | "refund_related"
  | "account_access"
  | "course_access"
  | "video_access"
  | "payment_issue"
  | "game_issue"
  | "technical_issue"
  | "general_support"
  | "partnership"
  | "feedback";

export type ContactRequestItem = {
  _id: string;
  name: string;
  email: string;
  topic: ContactRequestTopic;
  subject: string;
  message: string;
  phoneCountryCode: string | null;
  userId: string | null;
  status: ContactRequestStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SupportSummary = {
  total: number;
  open: number;
  inProgress: number;
  waitingOnUser: number;
  resolved: number;
  closed: number;
  urgent: number;
  high: number;
  medium: number;
  low: number;
  refundRelated: number;
  accountAccess: number;
  courseAccess: number;
  videoAccess: number;
  recent: SupportTicketItem[];
};

export type SupportListPayload<T> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};

export type SupportTicketsFilters = {
  page: number;
  limit: number;
  q: string;
  type?: SupportTicketType;
  status?: SupportTicketStatus;
  priority?: SupportTicketPriority;
};

export type ContactRequestsFilters = {
  page: number;
  limit: number;
  q: string;
  topic?: ContactRequestTopic;
  status?: ContactRequestStatus;
};

export type SupportState = {
  summary: SupportSummary | null;
  tickets: SupportListPayload<SupportTicketItem> | null;
  contacts: SupportListPayload<ContactRequestItem> | null;
  selectedTicket: SupportTicketItem | null;
  selectedContact: ContactRequestItem | null;
  ticketsFilters: SupportTicketsFilters;
  contactsFilters: ContactRequestsFilters;
  loadingSummary: boolean;
  loadingTickets: boolean;
  loadingContacts: boolean;
  loadingTicketDetail: boolean;
  loadingContactDetail: boolean;
  mutating: boolean;
  error: string | null;
};

import type {
  ContactRequestStatus,
  ContactRequestTopic,
  SupportTicketPriority,
  SupportTicketStatus,
  SupportTicketType,
} from "../../../store/slices/support";

export const ticketTypeLabel = (value: string) =>
  String(value || "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const ticketStatusLabel = (value: string) =>
  String(value || "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const formatDateTime = (value?: string | null) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatRelativeTime = (value?: string | null) => {
  if (!value) return "N/A";

  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.round(diffMs / 60000));
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  return `${days}d ago`;
};

export const priorityTone: Record<SupportTicketPriority, string> = {
  urgent: "bg-[#fff0ee] text-[#c44536]",
  high: "bg-[#fff6e5] text-[#b7791f]",
  medium: "bg-[#edf7f0] text-[#2f6e3e]",
  low: "bg-[#f4f5ef] text-[#687465]",
};

export const statusTone: Record<SupportTicketStatus, string> = {
  open: "bg-[#eef7ee] text-[#2f6e3e]",
  in_progress: "bg-[#eef6fb] text-[#286f8f]",
  waiting_on_user: "bg-[#fff8ea] text-[#9a7a19]",
  resolved: "bg-[#f2f4eb] text-[#5d6d57]",
  closed: "bg-[#f3f4ef] text-[#72806e]",
};

export const contactStatusTone: Record<ContactRequestStatus, string> = {
  new: "bg-[#eef7ee] text-[#2f6e3e]",
  reviewed: "bg-[#eef6fb] text-[#286f8f]",
  replied: "bg-[#fff8ea] text-[#9a7a19]",
  closed: "bg-[#f3f4ef] text-[#72806e]",
};

export const supportTicketTypeOptions: SupportTicketType[] = [
  "refund_related",
  "account_access",
  "course_access",
  "video_access",
  "payment_issue",
  "game_issue",
  "technical_issue",
  "general_support",
];

export const supportTicketStatusOptions: SupportTicketStatus[] = [
  "open",
  "in_progress",
  "waiting_on_user",
  "resolved",
  "closed",
];

export const supportTicketPriorityOptions: SupportTicketPriority[] = [
  "urgent",
  "high",
  "medium",
  "low",
];

export const contactTopicOptions: ContactRequestTopic[] = [
  "refund_related",
  "account_access",
  "course_access",
  "video_access",
  "payment_issue",
  "game_issue",
  "technical_issue",
  "general_support",
  "partnership",
  "feedback",
];

export const contactStatusOptions: ContactRequestStatus[] = [
  "new",
  "reviewed",
  "replied",
  "closed",
];

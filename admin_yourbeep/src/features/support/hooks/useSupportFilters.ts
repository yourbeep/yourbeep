import { useState } from "react";
import type {
  ContactRequestStatus,
  ContactRequestTopic,
  ContactRequestsFilters,
  SupportTicketPriority,
  SupportTicketStatus,
  SupportTicketType,
  SupportTicketsFilters,
} from "../../../store/slices/support";

export function useSupportFilters(
  initialTickets: SupportTicketsFilters,
  initialContacts: ContactRequestsFilters,
) {
  const [ticketsSearch, setTicketsSearch] = useState(initialTickets.q);
  const [ticketType, setTicketType] = useState<SupportTicketType | "">(
    initialTickets.type || "",
  );
  const [ticketStatus, setTicketStatus] = useState<SupportTicketStatus | "">(
    initialTickets.status || "",
  );
  const [ticketPriority, setTicketPriority] = useState<
    SupportTicketPriority | ""
  >(initialTickets.priority || "");

  const [contactsSearch, setContactsSearch] = useState(initialContacts.q);
  const [contactTopic, setContactTopic] = useState<ContactRequestTopic | "">(
    initialContacts.topic || "",
  );
  const [contactStatus, setContactStatus] = useState<ContactRequestStatus | "">(
    initialContacts.status || "",
  );

  return {
    ticketsSearch,
    setTicketsSearch,
    ticketType,
    setTicketType,
    ticketStatus,
    setTicketStatus,
    ticketPriority,
    setTicketPriority,
    contactsSearch,
    setContactsSearch,
    contactTopic,
    setContactTopic,
    contactStatus,
    setContactStatus,
  };
}

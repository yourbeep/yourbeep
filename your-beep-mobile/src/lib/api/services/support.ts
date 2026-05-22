import { apiRequest } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import {
  CreateGetInTouchInput,
  CreateGetInTouchResponse,
  CreateSupportTicketInput,
  SupportTicketDetailResponse,
  SupportTicketListResponse,
  SupportTicketReplyInput,
  SupportTicketRecord,
} from '@/lib/api/types';

export function createSupportTicket(payload: CreateSupportTicketInput) {
  return apiRequest<{ ticket: SupportTicketRecord }>(apiEndpoints.support.createTicket, {
    body: payload,
    method: 'POST',
  });
}

export function fetchSupportTickets() {
  return apiRequest<SupportTicketListResponse>(apiEndpoints.support.listTickets);
}

export function fetchSupportTicketDetail(ticketId: string) {
  return apiRequest<SupportTicketDetailResponse>(apiEndpoints.support.ticketDetail(ticketId));
}

export function replySupportTicket(ticketId: string, payload: SupportTicketReplyInput) {
  return apiRequest<{ ticket: SupportTicketRecord }>(apiEndpoints.support.replyTicket(ticketId), {
    body: payload,
    method: 'POST',
  });
}

export function closeSupportTicket(ticketId: string) {
  return apiRequest<{ ticket: SupportTicketRecord }>(apiEndpoints.support.closeTicket(ticketId), {
    method: 'PATCH',
  });
}

export function createGetInTouchRequest(payload: CreateGetInTouchInput) {
  return apiRequest<CreateGetInTouchResponse>(apiEndpoints.support.getInTouch, {
    body: payload,
    method: 'POST',
  });
}

import { parseBody, success } from "@yourbeep/shared";
import type { Request, Response } from "express";
import {
  adminSupportTicketListQuerySchema,
  adminSupportTicketUpdateSchema,
  createSupportTicketSchema,
  supportTicketListQuerySchema,
  supportTicketReplySchema,
} from "../validators";
import {
  closeCurrentUserTicket,
  createSupportTicket,
  getAdminTicketById,
  getAdminTicketSummary,
  getCurrentUserTicketById,
  listAdminTickets,
  listCurrentUserTickets,
  replyToAdminTicket,
  replyToCurrentUserTicket,
  updateAdminTicket,
} from "../services/support-ticket.service";

export const createSupportTicketController = async (req: Request, res: Response) => {
  const payload = parseBody(createSupportTicketSchema, req.body);
  const data = await createSupportTicket(req.auth!.id, payload);
  return success(res, data, "Support ticket created", 201);
};

export const listCurrentUserTicketsController = async (req: Request, res: Response) => {
  const query = parseBody(supportTicketListQuerySchema, req.query);
  const data = await listCurrentUserTickets(req.auth!.id, query);
  return success(res, data, "Support tickets");
};

export const getCurrentUserTicketByIdController = async (req: Request, res: Response) => {
  const data = await getCurrentUserTicketById(req.auth!.id, String(req.params.ticketId));
  return success(res, data, "Support ticket detail");
};

export const replyToCurrentUserTicketController = async (req: Request, res: Response) => {
  const payload = parseBody(supportTicketReplySchema, req.body);
  const data = await replyToCurrentUserTicket(req.auth!.id, String(req.params.ticketId), payload);
  return success(res, data, "Support ticket replied");
};

export const closeCurrentUserTicketController = async (req: Request, res: Response) => {
  const data = await closeCurrentUserTicket(req.auth!.id, String(req.params.ticketId));
  return success(res, data, "Support ticket closed");
};

export const listAdminTicketsController = async (req: Request, res: Response) => {
  const query = parseBody(adminSupportTicketListQuerySchema, req.query);
  const data = await listAdminTickets(query);
  return success(res, data, "Admin support tickets");
};

export const getAdminTicketByIdController = async (req: Request, res: Response) => {
  const data = await getAdminTicketById(String(req.params.ticketId));
  return success(res, data, "Admin support ticket detail");
};

export const replyToAdminTicketController = async (req: Request, res: Response) => {
  const payload = parseBody(supportTicketReplySchema, req.body);
  const data = await replyToAdminTicket(req.auth!.id, String(req.params.ticketId), payload);
  return success(res, data, "Admin replied to support ticket");
};

export const updateAdminTicketController = async (req: Request, res: Response) => {
  const payload = parseBody(adminSupportTicketUpdateSchema, req.body);
  const data = await updateAdminTicket(String(req.params.ticketId), payload);
  return success(res, data, "Support ticket updated");
};

export const getAdminTicketSummaryController = async (_req: Request, res: Response) => {
  const data = await getAdminTicketSummary();
  return success(res, data, "Support ticket summary");
};

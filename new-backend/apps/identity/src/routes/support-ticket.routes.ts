import { Router } from "express";
import { asyncHandler, requireAdmin, requireAuth } from "@yourbeep/shared";
import {
  closeCurrentUserTicketController,
  createSupportTicketController,
  getAdminTicketByIdController,
  getAdminTicketSummaryController,
  getCurrentUserTicketByIdController,
  listAdminTicketsController,
  listCurrentUserTicketsController,
  replyToAdminTicketController,
  replyToCurrentUserTicketController,
  updateAdminTicketController,
} from "../controllers/support-ticket.controller";

export const supportTicketRouter = Router();

supportTicketRouter.post("/tickets", requireAuth, asyncHandler(createSupportTicketController));
supportTicketRouter.get("/tickets", requireAuth, asyncHandler(listCurrentUserTicketsController));
supportTicketRouter.get("/tickets/:ticketId", requireAuth, asyncHandler(getCurrentUserTicketByIdController));
supportTicketRouter.post("/tickets/:ticketId/replies", requireAuth, asyncHandler(replyToCurrentUserTicketController));
supportTicketRouter.patch("/tickets/:ticketId/close", requireAuth, asyncHandler(closeCurrentUserTicketController));

supportTicketRouter.get("/admin/tickets", requireAdmin, asyncHandler(listAdminTicketsController));
supportTicketRouter.get("/admin/tickets/summary", requireAdmin, asyncHandler(getAdminTicketSummaryController));
supportTicketRouter.get("/admin/tickets/:ticketId", requireAdmin, asyncHandler(getAdminTicketByIdController));
supportTicketRouter.post("/admin/tickets/:ticketId/replies", requireAdmin, asyncHandler(replyToAdminTicketController));
supportTicketRouter.patch("/admin/tickets/:ticketId", requireAdmin, asyncHandler(updateAdminTicketController));

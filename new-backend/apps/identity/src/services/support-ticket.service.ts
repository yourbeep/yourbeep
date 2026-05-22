import { AppError } from "@yourbeep/shared";
import { Types } from "mongoose";
import { SupportTicketModel, type SupportTicketRecord } from "../models/support-ticket";
import { UserModel } from "../models/user";
import type { z } from "zod";
import {
  adminSupportTicketListQuerySchema,
  adminSupportTicketUpdateSchema,
  createSupportTicketSchema,
  supportTicketListQuerySchema,
  supportTicketReplySchema,
} from "../validators";

type CreateSupportTicketInput = z.infer<typeof createSupportTicketSchema>;
type SupportTicketReplyInput = z.infer<typeof supportTicketReplySchema>;
type SupportTicketListQuery = z.infer<typeof supportTicketListQuerySchema>;
type AdminSupportTicketListQuery = z.infer<typeof adminSupportTicketListQuerySchema>;
type AdminSupportTicketUpdateInput = z.infer<typeof adminSupportTicketUpdateSchema>;

const buildTicketNumber = () => {
  const now = new Date();
  const date =
    `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TKT-${date}-${random}`;
};

const serializeTicket = (ticket: SupportTicketRecord) => ({
  _id: ticket.id,
  ticketNumber: ticket.ticketNumber,
  userId: String(ticket.userId),
  type: ticket.type,
  subject: ticket.subject,
  description: ticket.description,
  status: ticket.status,
  priority: ticket.priority,
  courseId: ticket.courseId ? String(ticket.courseId) : null,
  purchaseId: ticket.purchaseId ?? null,
  videoId: ticket.videoId ? String(ticket.videoId) : null,
  gameId: ticket.gameId ? String(ticket.gameId) : null,
  assignedAdminId: ticket.assignedAdminId ? String(ticket.assignedAdminId) : null,
  tags: ticket.tags,
  messages: ticket.messages.map((message) => ({
    senderType: message.senderType,
    senderId: message.senderId ? String(message.senderId) : null,
    body: message.body,
    attachments: message.attachments,
    createdAt: message.createdAt,
  })),
  lastReplyAt: ticket.lastReplyAt,
  lastReplyBy: ticket.lastReplyBy,
  resolvedAt: ticket.resolvedAt ?? null,
  closedAt: ticket.closedAt ?? null,
  createdAt: ticket.createdAt,
  updatedAt: ticket.updatedAt,
});

const ensureUserExists = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user || !user.isActive) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  return user;
};

const getTicketById = async (ticketId: string) => {
  const ticket = await SupportTicketModel.findById(ticketId);
  if (!ticket) {
    throw new AppError("Support ticket not found", 404, "NOT_FOUND");
  }

  return ticket;
};

const applyAdminStatusSideEffects = (ticket: SupportTicketRecord, nextStatus: SupportTicketRecord["status"]) => {
  ticket.status = nextStatus;

  switch (nextStatus) {
    case "resolved":
      ticket.resolvedAt = new Date();
      ticket.closedAt = undefined;
      break;
    case "closed":
      ticket.closedAt = new Date();
      if (!ticket.resolvedAt) {
        ticket.resolvedAt = new Date();
      }
      break;
    default:
      ticket.resolvedAt = undefined;
      ticket.closedAt = undefined;
      break;
  }
};

export const createSupportTicket = async (userId: string, payload: CreateSupportTicketInput) => {
  await ensureUserExists(userId);

  const ticket = await SupportTicketModel.create({
    ticketNumber: buildTicketNumber(),
    userId: new Types.ObjectId(userId),
    type: payload.type,
    subject: payload.subject,
    description: payload.description,
    status: "open",
    priority: payload.priority ?? (payload.type === "refund_related" ? "high" : "medium"),
    courseId: payload.courseId ? new Types.ObjectId(payload.courseId) : undefined,
    purchaseId: payload.purchaseId,
    videoId: payload.videoId ? new Types.ObjectId(payload.videoId) : undefined,
    gameId: payload.gameId ? new Types.ObjectId(payload.gameId) : undefined,
    tags: [],
    messages: [
      {
        senderType: "user",
        senderId: new Types.ObjectId(userId),
        body: payload.description,
        attachments: payload.attachments ?? [],
        createdAt: new Date(),
      },
    ],
    lastReplyAt: new Date(),
    lastReplyBy: "user",
  });

  return { ticket: serializeTicket(ticket) };
};

export const listCurrentUserTickets = async (userId: string, query: SupportTicketListQuery) => {
  const filter: Record<string, unknown> = {
    userId: new Types.ObjectId(userId),
  };

  if (query.type) {
    filter.type = query.type;
  }
  if (query.status) {
    filter.status = query.status;
  }
  if (query.q) {
    filter.$or = [
      { ticketNumber: { $regex: query.q, $options: "i" } },
      { subject: { $regex: query.q, $options: "i" } },
      { description: { $regex: query.q, $options: "i" } },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    SupportTicketModel.find(filter).sort({ lastReplyAt: -1, createdAt: -1 }).skip(skip).limit(query.limit),
    SupportTicketModel.countDocuments(filter),
  ]);

  return {
    items: items.map(serializeTicket),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
    },
  };
};

export const getCurrentUserTicketById = async (userId: string, ticketId: string) => {
  const ticket = await SupportTicketModel.findOne({
    _id: new Types.ObjectId(ticketId),
    userId: new Types.ObjectId(userId),
  });

  if (!ticket) {
    throw new AppError("Support ticket not found", 404, "NOT_FOUND");
  }

  return { ticket: serializeTicket(ticket) };
};

export const replyToCurrentUserTicket = async (userId: string, ticketId: string, payload: SupportTicketReplyInput) => {
  const ticket = await SupportTicketModel.findOne({
    _id: new Types.ObjectId(ticketId),
    userId: new Types.ObjectId(userId),
  });

  if (!ticket) {
    throw new AppError("Support ticket not found", 404, "NOT_FOUND");
  }

  if (ticket.status === "closed") {
    throw new AppError("Closed tickets cannot be replied to", 422, "TICKET_CLOSED");
  }

  ticket.messages.push({
    senderType: "user",
    senderId: new Types.ObjectId(userId),
    body: payload.body,
    attachments: payload.attachments ?? [],
    createdAt: new Date(),
  });
  ticket.lastReplyAt = new Date();
  ticket.lastReplyBy = "user";
  if (ticket.status === "resolved") {
    ticket.status = "waiting_on_user";
    ticket.resolvedAt = undefined;
  }
  await ticket.save();

  return { ticket: serializeTicket(ticket) };
};

export const closeCurrentUserTicket = async (userId: string, ticketId: string) => {
  const ticket = await SupportTicketModel.findOne({
    _id: new Types.ObjectId(ticketId),
    userId: new Types.ObjectId(userId),
  });

  if (!ticket) {
    throw new AppError("Support ticket not found", 404, "NOT_FOUND");
  }

  ticket.status = "closed";
  ticket.closedAt = new Date();
  if (!ticket.resolvedAt) {
    ticket.resolvedAt = new Date();
  }
  ticket.lastReplyAt = new Date();
  ticket.lastReplyBy = "user";
  await ticket.save();

  return { ticket: serializeTicket(ticket) };
};

export const listAdminTickets = async (query: AdminSupportTicketListQuery) => {
  const filter: Record<string, unknown> = {};

  if (query.type) filter.type = query.type;
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.assignedAdminId) filter.assignedAdminId = new Types.ObjectId(query.assignedAdminId);
  if (query.userId) filter.userId = new Types.ObjectId(query.userId);
  if (query.q) {
    filter.$or = [
      { ticketNumber: { $regex: query.q, $options: "i" } },
      { subject: { $regex: query.q, $options: "i" } },
      { description: { $regex: query.q, $options: "i" } },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    SupportTicketModel.find(filter).sort({ lastReplyAt: -1, createdAt: -1 }).skip(skip).limit(query.limit),
    SupportTicketModel.countDocuments(filter),
  ]);

  const userIds = [...new Set(items.map((ticket) => String(ticket.userId)))];
  const users = await UserModel.find({ _id: { $in: userIds.map((id) => new Types.ObjectId(id)) } }).select(
    "_id name email",
  );
  const userMap = new Map(users.map((user) => [String(user._id), user]));

  return {
    items: items.map((ticket) => ({
      ...serializeTicket(ticket),
      user: (() => {
        const user = userMap.get(String(ticket.userId));
        return user
          ? {
              _id: String(user._id),
              name: user.name,
              email: user.email,
            }
          : null;
      })(),
    })),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
    },
  };
};

export const getAdminTicketById = async (ticketId: string) => {
  const ticket = await getTicketById(ticketId);
  const user = await UserModel.findById(ticket.userId).select("_id name email");

  return {
    ticket: {
      ...serializeTicket(ticket),
      user: user
        ? {
            _id: String(user._id),
            name: user.name,
            email: user.email,
          }
        : null,
    },
  };
};

export const replyToAdminTicket = async (adminId: string, ticketId: string, payload: SupportTicketReplyInput) => {
  await ensureUserExists(adminId);
  const ticket = await getTicketById(ticketId);

  if (ticket.status === "closed") {
    throw new AppError("Closed tickets cannot be replied to", 422, "TICKET_CLOSED");
  }

  ticket.messages.push({
    senderType: "admin",
    senderId: new Types.ObjectId(adminId),
    body: payload.body,
    attachments: payload.attachments ?? [],
    createdAt: new Date(),
  });
  ticket.lastReplyAt = new Date();
  ticket.lastReplyBy = "admin";

  if (ticket.status === "open") {
    ticket.status = "in_progress";
  } else if (ticket.status === "waiting_on_user") {
    ticket.status = "in_progress";
  }

  if (!ticket.assignedAdminId) {
    ticket.assignedAdminId = new Types.ObjectId(adminId);
  }

  await ticket.save();
  return { ticket: serializeTicket(ticket) };
};

export const updateAdminTicket = async (ticketId: string, payload: AdminSupportTicketUpdateInput) => {
  const ticket = await getTicketById(ticketId);

  if (payload.type) ticket.type = payload.type;
  if (payload.priority) ticket.priority = payload.priority;
  if (payload.tags) ticket.tags = payload.tags;

  if (payload.assignedAdminId !== undefined) {
    ticket.assignedAdminId = payload.assignedAdminId ? new Types.ObjectId(payload.assignedAdminId) : undefined;
  }

  if (payload.status) {
    applyAdminStatusSideEffects(ticket, payload.status);
  }

  await ticket.save();
  return { ticket: serializeTicket(ticket) };
};

export const getAdminTicketSummary = async () => {
  const tickets = await SupportTicketModel.find({});
  const counts = {
    total: tickets.length,
    open: 0,
    inProgress: 0,
    waitingOnUser: 0,
    resolved: 0,
    closed: 0,
    urgent: 0,
    high: 0,
    medium: 0,
    low: 0,
    refundRelated: 0,
    accountAccess: 0,
    courseAccess: 0,
    videoAccess: 0,
  };

  for (const ticket of tickets) {
    if (ticket.status === "open") counts.open += 1;
    if (ticket.status === "in_progress") counts.inProgress += 1;
    if (ticket.status === "waiting_on_user") counts.waitingOnUser += 1;
    if (ticket.status === "resolved") counts.resolved += 1;
    if (ticket.status === "closed") counts.closed += 1;

    if (ticket.priority === "urgent") counts.urgent += 1;
    if (ticket.priority === "high") counts.high += 1;
    if (ticket.priority === "medium") counts.medium += 1;
    if (ticket.priority === "low") counts.low += 1;

    if (ticket.type === "refund_related") counts.refundRelated += 1;
    if (ticket.type === "account_access") counts.accountAccess += 1;
    if (ticket.type === "course_access") counts.courseAccess += 1;
    if (ticket.type === "video_access") counts.videoAccess += 1;
  }

  const recent = await SupportTicketModel.find({}).sort({ createdAt: -1 }).limit(5);

  return {
    ...counts,
    recent: recent.map(serializeTicket),
  };
};

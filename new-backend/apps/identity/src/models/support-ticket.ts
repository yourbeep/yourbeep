import { Schema, model, models, Types, type HydratedDocument } from "mongoose";

export type SupportTicketType =
  | "refund_related"
  | "account_access"
  | "course_access"
  | "video_access"
  | "payment_issue"
  | "game_issue"
  | "technical_issue"
  | "general_support";

export type SupportTicketStatus =
  | "open"
  | "in_progress"
  | "waiting_on_user"
  | "resolved"
  | "closed";

export type SupportTicketPriority = "low" | "medium" | "high" | "urgent";

export interface SupportTicketMessage {
  senderType: "user" | "admin" | "system";
  senderId?: Types.ObjectId;
  body: string;
  attachments: string[];
  createdAt: Date;
}

export interface SupportTicketDocument {
  ticketNumber: string;
  userId: Types.ObjectId;
  type: SupportTicketType;
  subject: string;
  description: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  courseId?: Types.ObjectId;
  purchaseId?: string;
  videoId?: Types.ObjectId;
  gameId?: Types.ObjectId;
  assignedAdminId?: Types.ObjectId;
  tags: string[];
  messages: SupportTicketMessage[];
  lastReplyAt: Date;
  lastReplyBy: "user" | "admin" | "system";
  resolvedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type SupportTicketRecord = HydratedDocument<SupportTicketDocument>;

const supportTicketMessageSchema = new Schema<SupportTicketMessage>(
  {
    senderType: { type: String, enum: ["user", "admin", "system"], required: true },
    senderId: { type: Schema.Types.ObjectId },
    body: { type: String, required: true, maxlength: 5000 },
    attachments: { type: [String], default: [] },
    createdAt: { type: Date, default: () => new Date() },
  },
  { _id: false },
);

const supportTicketSchema = new Schema<SupportTicketDocument>(
  {
    ticketNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    type: {
      type: String,
      enum: [
        "refund_related",
        "account_access",
        "course_access",
        "video_access",
        "payment_issue",
        "game_issue",
        "technical_issue",
        "general_support",
      ],
      required: true,
      index: true,
    },
    subject: { type: String, required: true, maxlength: 160 },
    description: { type: String, required: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ["open", "in_progress", "waiting_on_user", "resolved", "closed"],
      default: "open",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      index: true,
    },
    courseId: { type: Schema.Types.ObjectId, index: true },
    purchaseId: { type: String, index: true },
    videoId: { type: Schema.Types.ObjectId },
    gameId: { type: Schema.Types.ObjectId },
    assignedAdminId: { type: Schema.Types.ObjectId, index: true },
    tags: { type: [String], default: [] },
    messages: { type: [supportTicketMessageSchema], default: [] },
    lastReplyAt: { type: Date, default: () => new Date(), index: true },
    lastReplyBy: { type: String, enum: ["user", "admin", "system"], default: "user" },
    resolvedAt: { type: Date },
    closedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

supportTicketSchema.index({ userId: 1, createdAt: -1 });
supportTicketSchema.index({ status: 1, priority: 1, createdAt: -1 });

export const SupportTicketModel =
  models.SupportTicket || model<SupportTicketDocument>("SupportTicket", supportTicketSchema);

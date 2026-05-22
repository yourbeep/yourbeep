import { AppError } from "@yourbeep/shared";
import { ContactRequestModel, type ContactRequestRecord } from "../models/contact-request";
import type { z } from "zod";
import {
  contactRequestListQuerySchema,
  createContactRequestSchema,
  updateContactRequestSchema,
} from "../validators";

type CreateContactRequestInput = z.infer<typeof createContactRequestSchema>;
type ContactRequestListQuery = z.infer<typeof contactRequestListQuerySchema>;
type UpdateContactRequestInput = z.infer<typeof updateContactRequestSchema>;

const serializeContactRequest = (item: ContactRequestRecord) => ({
  _id: item.id,
  name: item.name,
  email: item.email,
  topic: item.topic,
  subject: item.subject,
  message: item.message,
  phoneCountryCode: item.phoneCountryCode ?? null,
  userId: item.userId ?? null,
  status: item.status,
  notes: item.notes ?? null,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

export const createContactRequest = async (payload: CreateContactRequestInput) => {
  const item = await ContactRequestModel.create(payload);
  return { request: serializeContactRequest(item) };
};

export const listContactRequests = async (query: ContactRequestListQuery) => {
  const filter: Record<string, unknown> = {};
  if (query.topic) filter.topic = query.topic;
  if (query.status) filter.status = query.status;
  if (query.q) {
    filter.$or = [
      { name: { $regex: query.q, $options: "i" } },
      { email: { $regex: query.q, $options: "i" } },
      { subject: { $regex: query.q, $options: "i" } },
      { message: { $regex: query.q, $options: "i" } },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    ContactRequestModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
    ContactRequestModel.countDocuments(filter),
  ]);

  return {
    items: items.map(serializeContactRequest),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
    },
  };
};

export const getContactRequestById = async (requestId: string) => {
  const item = await ContactRequestModel.findById(requestId);
  if (!item) {
    throw new AppError("Contact request not found", 404, "NOT_FOUND");
  }

  return { request: serializeContactRequest(item) };
};

export const updateContactRequest = async (requestId: string, payload: UpdateContactRequestInput) => {
  const item = await ContactRequestModel.findByIdAndUpdate(requestId, { $set: payload }, { new: true });
  if (!item) {
    throw new AppError("Contact request not found", 404, "NOT_FOUND");
  }

  return { request: serializeContactRequest(item) };
};

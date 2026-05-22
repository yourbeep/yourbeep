import { parseBody, success } from "@yourbeep/shared";
import type { Request, Response } from "express";
import {
  contactRequestListQuerySchema,
  createContactRequestSchema,
  updateContactRequestSchema,
} from "../validators";
import {
  createContactRequest,
  getContactRequestById,
  listContactRequests,
  updateContactRequest,
} from "../services/contact-request.service";

export const createContactRequestController = async (req: Request, res: Response) => {
  const payload = parseBody(createContactRequestSchema, req.body);
  const data = await createContactRequest(payload);
  return success(res, data, "Get in touch request created", 201);
};

export const listContactRequestsController = async (req: Request, res: Response) => {
  const query = parseBody(contactRequestListQuerySchema, req.query);
  const data = await listContactRequests(query);
  return success(res, data, "Contact requests");
};

export const getContactRequestByIdController = async (req: Request, res: Response) => {
  const data = await getContactRequestById(String(req.params.requestId));
  return success(res, data, "Contact request detail");
};

export const updateContactRequestController = async (req: Request, res: Response) => {
  const payload = parseBody(updateContactRequestSchema, req.body);
  const data = await updateContactRequest(String(req.params.requestId), payload);
  return success(res, data, "Contact request updated");
};

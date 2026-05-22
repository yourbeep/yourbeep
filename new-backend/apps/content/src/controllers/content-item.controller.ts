import { parseBody, success } from "@yourbeep/shared";
import type { Request, Response } from "express";
import {
  createContentItem,
  listCourseContentItems,
  reorderContentItems,
  softDeleteContentItem,
  updateContentItem,
} from "../services/content-item.service";
import { createContentItemSchema, reorderContentSchema, updateContentItemSchema } from "../validators";

export const listCourseContentItemsController = async (req: Request, res: Response) => {
  const data = await listCourseContentItems(String(req.params.courseId));
  return success(res, data, "Course content items");
};

export const createContentItemController = async (req: Request, res: Response) => {
  const payload = parseBody(createContentItemSchema, req.body);
  const item = await createContentItem(String(req.params.courseId), payload);
  return success(res, { item }, "Content item created", 201);
};

export const updateContentItemController = async (req: Request, res: Response) => {
  const payload = parseBody(updateContentItemSchema, req.body);
  const item = await updateContentItem(String(req.params.itemId), payload);
  return success(res, { item }, "Content item updated");
};

export const deleteContentItemController = async (req: Request, res: Response) => {
  const item = await softDeleteContentItem(String(req.params.itemId));
  return success(res, { item }, "Content item soft-deleted");
};

export const reorderContentItemsController = async (req: Request, res: Response) => {
  const payload = parseBody(reorderContentSchema, req.body);
  const data = await reorderContentItems(String(req.params.courseId), payload);
  return success(res, data, "Content items reordered");
};

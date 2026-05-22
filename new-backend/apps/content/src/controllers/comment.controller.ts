import { parseBody, success } from "@yourbeep/shared";
import type { Request, Response } from "express";
import {
  adminDeleteComment,
  createContentItemComment,
  createCourseComment,
  listContentItemComments,
  listCourseComments,
} from "../services/comment.service";
import { createCommentSchema, listCommentsQuerySchema } from "../validators";

export const listCourseCommentsController = async (req: Request, res: Response) => {
  const query = parseBody(listCommentsQuerySchema, req.query);
  const data = await listCourseComments(String(req.params.courseId), query);
  return success(res, data, "Course comments");
};

export const createCourseCommentController = async (req: Request, res: Response) => {
  const payload = parseBody(createCommentSchema, req.body);
  const comment = await createCourseComment(req.auth!.id, String(req.params.courseId), payload);
  return success(res, { comment }, "Course comment created", 201);
};

export const listContentItemCommentsController = async (req: Request, res: Response) => {
  const query = parseBody(listCommentsQuerySchema, req.query);
  const data = await listContentItemComments(String(req.params.itemId), query);
  return success(res, data, "Content item comments");
};

export const createContentItemCommentController = async (req: Request, res: Response) => {
  const payload = parseBody(createCommentSchema, req.body);
  const comment = await createContentItemComment(req.auth!.id, String(req.params.itemId), payload);
  return success(res, { comment }, "Content item comment created", 201);
};

export const deleteCommentController = async (req: Request, res: Response) => {
  const data = await adminDeleteComment(String(req.params.commentId));
  return success(res, data, "Comment deleted");
};

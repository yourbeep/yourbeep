import { Router } from "express";
import { asyncHandler, requireAdmin, requireAuth } from "@yourbeep/shared";
import {
  createContentItemCommentController,
  createCourseCommentController,
  deleteCommentController,
  listContentItemCommentsController,
  listCourseCommentsController,
} from "../controllers/comment.controller";

export const commentRouter = Router();

commentRouter.get("/courses/:courseId/comments", requireAuth, asyncHandler(listCourseCommentsController));
commentRouter.post("/courses/:courseId/comments", requireAuth, asyncHandler(createCourseCommentController));

commentRouter.get("/content/:itemId/comments", requireAuth, asyncHandler(listContentItemCommentsController));
commentRouter.post("/content/:itemId/comments", requireAuth, asyncHandler(createContentItemCommentController));

commentRouter.delete("/admin/comments/:commentId", requireAdmin, asyncHandler(deleteCommentController));

import { Router } from "express";
import { asyncHandler, requireAdmin } from "@yourbeep/shared";
import {
  createContentItemController,
  deleteContentItemController,
  listCourseContentItemsController,
  reorderContentItemsController,
  updateContentItemController,
} from "../controllers/content-item.controller";

export const contentItemRouter = Router();

contentItemRouter.get(
  "/admin/courses/:courseId/content",
  requireAdmin,
  asyncHandler(listCourseContentItemsController),
);
contentItemRouter.post(
  "/admin/courses/:courseId/content",
  requireAdmin,
  asyncHandler(createContentItemController),
);
contentItemRouter.put(
  "/admin/courses/:courseId/content/reorder",
  requireAdmin,
  asyncHandler(reorderContentItemsController),
);
contentItemRouter.put("/admin/content/:itemId", requireAdmin, asyncHandler(updateContentItemController));
contentItemRouter.delete(
  "/admin/content/:itemId",
  requireAdmin,
  asyncHandler(deleteContentItemController),
);

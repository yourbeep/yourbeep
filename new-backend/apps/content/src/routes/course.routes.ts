import { Router } from "express";
import { asyncHandler, requireAdmin, requireAuth } from "@yourbeep/shared";
import {
  createCourseController,
  deleteCourseController,
  getCourseContentController,
  getCourseDetailController,
  listAdminCoursesController,
  listCoursesController,
  restoreCourseController,
  updateCourseController,
} from "../controllers/course.controller";

export const courseRouter = Router();

courseRouter.get("/courses", asyncHandler(listCoursesController));
courseRouter.get("/courses/:courseId", asyncHandler(getCourseDetailController));
courseRouter.get("/courses/:courseId/content", requireAuth, asyncHandler(getCourseContentController));

courseRouter.get("/admin/courses", requireAdmin, asyncHandler(listAdminCoursesController));
courseRouter.post("/admin/courses", requireAdmin, asyncHandler(createCourseController));
courseRouter.put("/admin/courses/:id", requireAdmin, asyncHandler(updateCourseController));
courseRouter.delete("/admin/courses/:id", requireAdmin, asyncHandler(deleteCourseController));
courseRouter.post("/admin/courses/:id/restore", requireAdmin, asyncHandler(restoreCourseController));

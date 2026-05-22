import { Router } from "express";
import { asyncHandler, requireAdmin, requireAuth } from "@yourbeep/shared";
import {
  createMasterCourseController,
  getMasterCourseController,
  updateMasterCourseController,
} from "../controllers/master-course.controller";

export const masterCourseRouter = Router();

masterCourseRouter.get("/master-course", requireAuth, asyncHandler(getMasterCourseController));
masterCourseRouter.post("/admin/master-course", requireAdmin, asyncHandler(createMasterCourseController));
masterCourseRouter.patch("/admin/master-course", requireAdmin, asyncHandler(updateMasterCourseController));

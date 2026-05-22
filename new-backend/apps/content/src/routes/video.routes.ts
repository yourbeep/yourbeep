import { Router } from "express";
import { asyncHandler, requireAdmin, requireAuth } from "@yourbeep/shared";
import {
  bunnyWebhookController,
  getBunnyHealthController,
  getAdminCourseVideoStreamController,
  getAdminCourseTrailerStreamController,
  getCourseTrailerStreamController,
  createCourseTrailerUploadController,
  createCourseVideoUploadController,
  createMasterCourseUploadController,
  deleteVideoController,
  getCourseVideoStreamController,
  getMasterCourseStreamController,
  recordCourseVideoWatchController,
  updateVideoController,
} from "../controllers/video.controller";

export const videoRouter = Router();

videoRouter.get(
  "/admin/bunny/health",
  asyncHandler(getBunnyHealthController),
);

videoRouter.post(
  "/admin/courses/:courseId/videos/upload-url",
  requireAdmin,
  asyncHandler(createCourseVideoUploadController),
);
videoRouter.post(
  "/admin/courses/:courseId/trailer/upload-url",
  requireAdmin,
  asyncHandler(createCourseTrailerUploadController),
);
videoRouter.get(
  "/admin/courses/:courseId/trailer/stream",
  requireAdmin,
  asyncHandler(getAdminCourseTrailerStreamController),
);
videoRouter.get(
  "/courses/:courseId/trailer/stream",
  asyncHandler(getCourseTrailerStreamController),
);
videoRouter.get(
  "/admin/videos/:videoId/stream",
  requireAdmin,
  asyncHandler(getAdminCourseVideoStreamController),
);
videoRouter.post(
  "/admin/master-course/upload-url",
  requireAdmin,
  asyncHandler(createMasterCourseUploadController),
);
videoRouter.post("/webhooks/bunny/stream", asyncHandler(bunnyWebhookController));
videoRouter.get(
  "/courses/:courseId/videos/:videoId/stream",
  requireAuth,
  asyncHandler(getCourseVideoStreamController),
);
videoRouter.post(
  "/courses/:courseId/videos/:videoId/watch-event",
  requireAuth,
  asyncHandler(recordCourseVideoWatchController),
);
videoRouter.get("/master-course/stream", requireAuth, asyncHandler(getMasterCourseStreamController));
videoRouter.patch("/admin/videos/:videoId", requireAdmin, asyncHandler(updateVideoController));
videoRouter.delete("/admin/videos/:videoId", requireAdmin, asyncHandler(deleteVideoController));

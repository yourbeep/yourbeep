import { Router } from "express";
import { asyncHandler, requireAdmin, requireAuth } from "@yourbeep/shared";
import {
  deleteSubmissionController,
  getActivityDetailController,
  getCourseSubmissionsController,
  getGameResultController,
  getSubmissionByIdController,
  getSubmissionByIdForAdminController,
  submitGameController,
} from "../controllers/submission.controller";

export const submissionRouter = Router();

submissionRouter.post("/games/:gameId/submit", requireAuth, asyncHandler(submitGameController));
submissionRouter.get("/games/:gameId/result", requireAuth, asyncHandler(getGameResultController));
submissionRouter.get(
  "/games/:gameId/activities/:activityKey",
  requireAuth,
  asyncHandler(getActivityDetailController),
);
submissionRouter.get(
  "/courses/:courseId/submissions",
  requireAuth,
  asyncHandler(getCourseSubmissionsController),
);
submissionRouter.get(
  "/submissions/:submissionId",
  requireAuth,
  asyncHandler(getSubmissionByIdController),
);
submissionRouter.get(
  "/admin/submissions/:submissionId",
  requireAdmin,
  asyncHandler(getSubmissionByIdForAdminController),
);
submissionRouter.delete(
  "/admin/submissions/:submissionId",
  requireAdmin,
  asyncHandler(deleteSubmissionController),
);

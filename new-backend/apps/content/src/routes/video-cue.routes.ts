import { Router } from "express";
import { asyncHandler, requireAdmin } from "@yourbeep/shared";
import {
  createVideoCueController,
  deleteVideoCueController,
  listVideoCuesController,
  updateVideoCueController,
} from "../controllers/video-cue.controller";

export const videoCueRouter = Router();

videoCueRouter.get("/admin/videos/:videoId/cues", requireAdmin, asyncHandler(listVideoCuesController));
videoCueRouter.post("/admin/videos/:videoId/cues", requireAdmin, asyncHandler(createVideoCueController));
videoCueRouter.put("/admin/video-cues/:cueId", requireAdmin, asyncHandler(updateVideoCueController));
videoCueRouter.delete("/admin/video-cues/:cueId", requireAdmin, asyncHandler(deleteVideoCueController));

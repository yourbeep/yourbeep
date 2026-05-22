import { parseBody, success } from "@yourbeep/shared";
import type { Request, Response } from "express";
import {
  createOrReplaceMasterCourseVideo,
  getMasterCourseVideo,
  updateMasterCourseVideo,
} from "../services/master-course.service";
import { createMasterCourseSchema, updateMasterCourseSchema } from "../validators";

export const getMasterCourseController = async (_req: Request, res: Response) => {
  const data = await getMasterCourseVideo();
  return success(res, data, "Master course video");
};

export const createMasterCourseController = async (req: Request, res: Response) => {
  const payload = parseBody(createMasterCourseSchema, req.body);
  const video = await createOrReplaceMasterCourseVideo(payload);
  return success(res, { video }, "Master course video created", 201);
};

export const updateMasterCourseController = async (req: Request, res: Response) => {
  const payload = parseBody(updateMasterCourseSchema, req.body);
  const video = await updateMasterCourseVideo(payload);
  return success(res, { video }, "Master course video updated");
};

import { parseBody, success } from "@yourbeep/shared";
import type { Request, Response } from "express";
import {
  createVideoCue,
  listVideoCues,
  softDeleteVideoCue,
  updateVideoCue,
} from "../services/video-cue.service";
import { createVideoCueSchema, updateVideoCueSchema } from "../validators";

export const listVideoCuesController = async (req: Request, res: Response) => {
  const data = await listVideoCues(String(req.params.videoId));
  return success(res, data, "Video cues");
};

export const createVideoCueController = async (req: Request, res: Response) => {
  const payload = parseBody(createVideoCueSchema, req.body);
  const cue = await createVideoCue(String(req.params.videoId), payload);
  return success(res, { cue }, "Video cue created", 201);
};

export const updateVideoCueController = async (req: Request, res: Response) => {
  const payload = parseBody(updateVideoCueSchema, req.body);
  const cue = await updateVideoCue(String(req.params.cueId), payload);
  return success(res, { cue }, "Video cue updated");
};

export const deleteVideoCueController = async (req: Request, res: Response) => {
  const cue = await softDeleteVideoCue(String(req.params.cueId));
  return success(res, { cue }, "Video cue deleted");
};

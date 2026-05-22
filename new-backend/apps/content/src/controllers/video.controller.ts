import { parseBody, success } from "@yourbeep/shared";
import type { Request, Response } from "express";
import {
  getAdminCourseVideoStream,
  getAdminCourseTrailerStream,
  getBunnyHealth,
  getCourseTrailerStream,
  createCourseTrailerUpload,
  createCourseVideoUpload,
  createMasterCourseUpload,
  getCourseVideoStream,
  getMasterCourseStream,
  processBunnyWebhook,
  recordCourseVideoWatch,
  softDeleteVideo,
  updateVideo,
} from "../services/video.service";
import {
  bunnyWebhookSchema,
  createTrailerUploadSchema,
  createVideoUploadSchema,
  recordVideoWatchSchema,
  updateVideoSchema,
} from "../validators";

export const createCourseVideoUploadController = async (req: Request, res: Response) => {
  const payload = parseBody(createVideoUploadSchema, req.body);
  const data = await createCourseVideoUpload(String(req.params.courseId), req.auth!.id, payload);
  return success(res, data, "Course video upload URL created", 201);
};

export const createCourseTrailerUploadController = async (req: Request, res: Response) => {
  const payload = parseBody(createTrailerUploadSchema, req.body);
  const data = await createCourseTrailerUpload(String(req.params.courseId), req.auth!.id, payload);
  return success(res, data, "Course trailer upload URL created", 201);
};

export const getBunnyHealthController = async (_req: Request, res: Response) => {
  const data = await getBunnyHealth();
  return success(res, data, "Bunny health");
};

export const getAdminCourseTrailerStreamController = async (req: Request, res: Response) => {
  const data = await getAdminCourseTrailerStream(String(req.params.courseId));
  return success(res, data, "Course trailer stream");
};

export const getCourseTrailerStreamController = async (req: Request, res: Response) => {
  const data = await getCourseTrailerStream(String(req.params.courseId));
  return success(res, data, "Course trailer stream");
};

export const createMasterCourseUploadController = async (req: Request, res: Response) => {
  const payload = parseBody(createVideoUploadSchema, req.body);
  const data = await createMasterCourseUpload(req.auth!.id, payload);
  return success(res, data, "Master course upload URL created", 201);
};

export const bunnyWebhookController = async (req: Request, res: Response) => {
  const payload = parseBody(bunnyWebhookSchema, req.body);
  const data = await processBunnyWebhook(req.rawBody ?? JSON.stringify(req.body), req.headers, payload);
  return success(res, data, "Bunny webhook processed");
};

export const getCourseVideoStreamController = async (req: Request, res: Response) => {
  const data = await getCourseVideoStream(req.auth!.id, String(req.params.courseId), String(req.params.videoId));
  return success(res, data, "Course video stream");
};

export const getAdminCourseVideoStreamController = async (req: Request, res: Response) => {
  const data = await getAdminCourseVideoStream(String(req.params.videoId));
  return success(res, data, "Admin course video stream");
};

export const recordCourseVideoWatchController = async (req: Request, res: Response) => {
  const payload = parseBody(recordVideoWatchSchema, req.body);
  const data = await recordCourseVideoWatch(
    req.auth!.id,
    String(req.params.courseId),
    String(req.params.videoId),
    payload,
  );
  return success(res, data, "Course video watch event recorded", 201);
};

export const getMasterCourseStreamController = async (_req: Request, res: Response) => {
  const data = await getMasterCourseStream();
  return success(res, data, "Master course stream");
};

export const updateVideoController = async (req: Request, res: Response) => {
  const payload = parseBody(updateVideoSchema, req.body);
  const video = await updateVideo(String(req.params.videoId), payload);
  return success(res, { video }, "Video updated");
};

export const deleteVideoController = async (req: Request, res: Response) => {
  const video = await softDeleteVideo(String(req.params.videoId));
  return success(res, { video }, "Video soft-deleted");
};

import { AppError } from "@yourbeep/shared";
import { MasterCourseVideoModel } from "../models/master-course-video";
import { VideoModel } from "../models/video";
import type { z } from "zod";
import { createMasterCourseSchema, updateMasterCourseSchema } from "../validators";

type CreateMasterCourseInput = z.infer<typeof createMasterCourseSchema>;
type UpdateMasterCourseInput = z.infer<typeof updateMasterCourseSchema>;

export const getMasterCourseVideo = async () => {
  const masterCourse = await MasterCourseVideoModel.findOne({ isActive: true }).sort({ updatedAt: -1 });

  if (!masterCourse) {
    throw new AppError("Master course video not found", 404, "NOT_FOUND");
  }

  const linkedVideo =
    (masterCourse.videoId ? await VideoModel.findById(masterCourse.videoId) : null) ??
    (masterCourse.bunnyVideoId
      ? await VideoModel.findOne({ bunnyVideoId: masterCourse.bunnyVideoId, isMasterCourse: true })
      : null);

  const isReady = Boolean(linkedVideo?.isActive && linkedVideo?.bunnyVideoId);

  return {
    title: linkedVideo?.title ?? masterCourse.title,
    description: linkedVideo?.description ?? masterCourse.description ?? null,
    videoUrl: masterCourse.videoUrl ?? null,
    bunnyVideoId: linkedVideo?.bunnyVideoId ?? masterCourse.bunnyVideoId ?? null,
    durationSeconds: linkedVideo?.durationSeconds ?? masterCourse.durationSeconds ?? null,
    thumbnail: linkedVideo?.thumbnailUrl ?? masterCourse.thumbnail ?? null,
    videoId: linkedVideo?.id ?? masterCourse.videoId?.toString() ?? null,
    streamEndpoint: isReady ? "/master-course/stream" : null,
    playbackStatus: isReady ? "ready" : "processing",
    updatedAt: linkedVideo?.updatedAt ?? masterCourse.updatedAt,
  };
};

export const createOrReplaceMasterCourseVideo = async (payload: CreateMasterCourseInput) => {
  const linkedVideo = payload.bunnyVideoId
    ? await VideoModel.findOne({ bunnyVideoId: payload.bunnyVideoId, isMasterCourse: true })
    : null;

  await MasterCourseVideoModel.updateMany({}, { $set: { isActive: false } });

  await MasterCourseVideoModel.create({
    ...payload,
    title: linkedVideo?.title ?? payload.title,
    description: linkedVideo?.description ?? payload.description,
    videoId: linkedVideo?._id,
    bunnyVideoId: linkedVideo?.bunnyVideoId ?? payload.bunnyVideoId,
    durationSeconds: linkedVideo?.durationSeconds ?? payload.durationSeconds,
    thumbnail: linkedVideo?.thumbnailUrl ?? payload.thumbnail,
    isActive: payload.isActive ?? true,
  });

  return getMasterCourseVideo();
};

export const updateMasterCourseVideo = async (payload: UpdateMasterCourseInput) => {
  const masterCourse = await MasterCourseVideoModel.findOne({ isActive: true }).sort({ updatedAt: -1 });

  if (!masterCourse) {
    throw new AppError("Master course video not found", 404, "NOT_FOUND");
  }

  Object.assign(masterCourse, payload);
  await masterCourse.save();

  const linkedVideo =
    (masterCourse.videoId ? await VideoModel.findById(masterCourse.videoId) : null) ??
    (masterCourse.bunnyVideoId
      ? await VideoModel.findOne({ bunnyVideoId: masterCourse.bunnyVideoId, isMasterCourse: true })
      : null);

  if (linkedVideo) {
    if (payload.title) {
      linkedVideo.title = payload.title;
    }
    if (payload.description !== undefined) {
      linkedVideo.description = payload.description;
    }
    if (payload.bunnyVideoId) {
      linkedVideo.bunnyVideoId = payload.bunnyVideoId;
    }
    if (payload.durationSeconds !== undefined) {
      linkedVideo.durationSeconds = payload.durationSeconds;
    }
    if (payload.thumbnail !== undefined) {
      linkedVideo.thumbnailUrl = payload.thumbnail;
    }
    await linkedVideo.save();
  }

  return getMasterCourseVideo();
};

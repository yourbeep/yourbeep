import { AppError, env, httpJson } from "@yourbeep/shared";
import { Types } from "mongoose";
import { ContentItemModel } from "../models/content-item";
import { CourseModel } from "../models/course";
import { MasterCourseVideoModel } from "../models/master-course-video";
import { VideoModel } from "../models/video";
import { VideoCueModel } from "../models/video-cue";
import {
  buildBunnyThumbnailUrl,
  buildBunnyUploadUrl,
  buildSignedBunnyStreamUrl,
  createBunnyVideo,
  deleteBunnyVideo,
  getBunnyVideoDetails,
  listBunnyVideos,
  verifyBunnyWebhookSignature,
} from "./bunny-video.service";
import { GENERAL_SECTION_KEY } from "./content-structure.service";
import type { z } from "zod";
import {
  bunnyWebhookSchema,
  createTrailerUploadSchema,
  createMasterCourseSchema,
  createVideoUploadSchema,
  recordVideoWatchSchema,
  updateVideoSchema,
} from "../validators";
import { getPlayableVideoCues } from "./video-cue.service";

type CreateVideoUploadInput = z.infer<typeof createVideoUploadSchema>;
type CreateTrailerUploadInput = z.infer<typeof createTrailerUploadSchema>;
type UpdateVideoInput = z.infer<typeof updateVideoSchema>;
type BunnyWebhookInput = z.infer<typeof bunnyWebhookSchema>;
type CreateMasterCourseInput = z.infer<typeof createMasterCourseSchema>;
type RecordVideoWatchInput = z.infer<typeof recordVideoWatchSchema>;

const ensureCourseExists = async (courseId: string) => {
  const course = await CourseModel.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404, "NOT_FOUND");
  }
  return course;
};

const normalizeSectionKey = (value?: string | null) =>
  value?.trim() || GENERAL_SECTION_KEY;

const ensureCourseSectionExists = (
  course: Awaited<ReturnType<typeof ensureCourseExists>>,
  sectionKey: string,
) => {
  if (
    sectionKey !== GENERAL_SECTION_KEY &&
    !(course.sections ?? []).some((section: { key: string }) => section.key === sectionKey)
  ) {
    throw new AppError("Section not found", 404, "SECTION_NOT_FOUND");
  }
};

const verifyCourseAccess = async (userId: string, courseId: string) => {
  const response = await httpJson<{ success: boolean; data: { hasAccess: boolean } }>(
    `${env.COMMERCE_URL}/internal/purchases/${userId}/${courseId}`,
    {
      method: "GET",
      headers: {
        "x-internal-service-key": env.INTERNAL_SERVICE_SECRET,
      },
    },
  );

  if (!response.data.hasAccess) {
    throw new AppError("User has not purchased this course", 403, "COURSE_NOT_PURCHASED");
  }
};

const shiftContentOrder = async (courseId: string, sectionKey: string, order: number) => {
  await ContentItemModel.updateMany(
    {
      courseId: new Types.ObjectId(courseId),
      sectionKey,
      order: { $gte: order },
      isActive: true,
    },
    { $inc: { order: 1 } },
  );
};

const buildArchivedOrderValue = () =>
  -1 * (Date.now() + Math.floor(Math.random() * 1000));

const ensureCourseVideoIsReady = async (video: InstanceType<typeof VideoModel>) => {
  if (video.isActive) {
    return video;
  }

  const bunnyVideo = await getBunnyVideoDetails(video.bunnyVideoId);
  const bunnyStatus = Number(bunnyVideo.status ?? -1);
  const isReady = bunnyStatus === 3 || bunnyStatus === 4;

  if (!isReady) {
    throw new AppError(
      "Video upload is still processing. Please try again shortly.",
      409,
      "VIDEO_NOT_READY",
    );
  }

  video.isActive = true;
  video.durationSeconds = Number(
    bunnyVideo.length ?? bunnyVideo.videoLength ?? video.durationSeconds ?? 0,
  );
  video.thumbnailUrl = buildBunnyThumbnailUrl(video.bunnyVideoId);
  await video.save();

  return video;
};

export const createCourseVideoUpload = async (
  courseId: string,
  uploadedBy: string,
  payload: CreateVideoUploadInput,
) => {
  const course = await ensureCourseExists(courseId);
  const sectionKey = normalizeSectionKey(payload.sectionKey);
  ensureCourseSectionExists(course, sectionKey);
  await shiftContentOrder(courseId, sectionKey, payload.order);

  const bunnyVideo = await createBunnyVideo(payload.title);

  const video = await VideoModel.create({
    courseId: new Types.ObjectId(courseId),
    title: payload.title,
    description: payload.description,
    bunnyVideoId: bunnyVideo.guid,
    bunnyLibraryId: env.BUNNY_STREAM_LIBRARY_ID!,
    order: payload.order,
    isMasterCourse: false,
    isActive: false,
    uploadedBy: new Types.ObjectId(uploadedBy),
  });

  await ContentItemModel.create({
    courseId: new Types.ObjectId(courseId),
    type: "video",
    refId: video._id,
    sectionKey,
    order: payload.order,
    title: payload.title,
    description: payload.description,
    isFree: false,
    isActive: true,
  });

  return {
    uploadUrl: buildBunnyUploadUrl(bunnyVideo.guid),
    videoId: video.id,
    bunnyVideoId: bunnyVideo.guid,
    method: "PUT",
    headers: {
      AccessKey: env.BUNNY_STREAM_API_KEY!,
      "Content-Type": "video/mp4",
    },
    note: "Upload directly from admin client to this URL using PUT",
  };
};

export const getBunnyHealth = async () => {
  const config = {
    libraryId: env.BUNNY_STREAM_LIBRARY_ID ?? null,
    cdnHostname: env.BUNNY_CDN_HOSTNAME ?? null,
    hasStreamApiKey: Boolean(env.BUNNY_STREAM_API_KEY),
    hasReadonlyApiKey: Boolean(env.BUNNY_STREAM_READONLY_API_KEY),
    hasTokenAuthKey: Boolean(env.BUNNY_TOKEN_AUTH_KEY),
  };

  const readonly = {
    ok: false,
    totalItems: null as number | null,
    sampleVideoGuid: null as string | null,
    error: null as string | null,
  };

  const write = {
    ok: false,
    testVideoGuid: null as string | null,
    cleanupOk: false,
    error: null as string | null,
  };

  try {
    const list = await listBunnyVideos();
    readonly.ok = true;
    readonly.totalItems = typeof list.totalItems === "number" ? list.totalItems : null;
    readonly.sampleVideoGuid = list.items?.[0]?.guid ?? null;
  } catch (error) {
    readonly.error = error instanceof Error ? error.message : "Readonly Bunny check failed";
  }

  try {
    const title = `healthcheck-${Date.now()}`;
    const created = await createBunnyVideo(title);
    write.ok = true;
    write.testVideoGuid = created.guid;

    if (created.guid) {
      try {
        await deleteBunnyVideo(created.guid);
        write.cleanupOk = true;
      } catch (cleanupError) {
        write.error =
          cleanupError instanceof Error
            ? `Write check passed but cleanup failed: ${cleanupError.message}`
            : "Write check passed but cleanup failed";
      }
    }
  } catch (error) {
    write.error = error instanceof Error ? error.message : "Write Bunny check failed";
  }

  return {
    ok: readonly.ok && write.ok,
    checkedAt: new Date().toISOString(),
    config,
    readonly,
    write,
  };
};

export const createCourseTrailerUpload = async (
  courseId: string,
  uploadedBy: string,
  payload: CreateTrailerUploadInput,
) => {
  const course = await ensureCourseExists(courseId);
  const bunnyVideo = await createBunnyVideo(payload.title);

  const video = await VideoModel.create({
    courseId: new Types.ObjectId(courseId),
    title: payload.title,
    description: payload.description,
    bunnyVideoId: bunnyVideo.guid,
    bunnyLibraryId: env.BUNNY_STREAM_LIBRARY_ID!,
    order: 1,
    isMasterCourse: false,
    isActive: false,
    uploadedBy: new Types.ObjectId(uploadedBy),
  });

  course.trailerVideoId = video.id;
  await course.save();

  return {
    uploadUrl: buildBunnyUploadUrl(bunnyVideo.guid),
    videoId: video.id,
    bunnyVideoId: bunnyVideo.guid,
    method: "PUT",
    headers: {
      AccessKey: env.BUNNY_STREAM_API_KEY!,
      "Content-Type": "video/mp4",
    },
    note: "Upload directly from admin client to this URL using PUT",
  };
};

export const getAdminCourseTrailerStream = async (courseId: string) => {
  const course = await ensureCourseExists(courseId);

  if (!course.trailerVideoId) {
    throw new AppError("Course trailer not found", 404, "VIDEO_NOT_FOUND");
  }

  const video = await VideoModel.findOne({
    _id: new Types.ObjectId(course.trailerVideoId),
    courseId: new Types.ObjectId(courseId),
    isMasterCourse: false,
  });

  if (!video) {
    throw new AppError("Course trailer not found", 404, "VIDEO_NOT_FOUND");
  }

  await ensureCourseVideoIsReady(video);

  const signed = buildSignedBunnyStreamUrl(video.bunnyVideoId);
  return {
    ...signed,
    videoId: video.id,
    title: video.title,
    durationSeconds: video.durationSeconds ?? null,
    thumbnailUrl: video.thumbnailUrl ?? null,
  };
};

export const getCourseTrailerStream = async (courseId: string) => {
  const course = await ensureCourseExists(courseId);

  if (!course.isActive || !course.isPublished) {
    throw new AppError("Course trailer not available", 404, "VIDEO_NOT_FOUND");
  }

  if (!course.trailerVideoId) {
    throw new AppError("Course trailer not found", 404, "VIDEO_NOT_FOUND");
  }

  const video = await VideoModel.findOne({
    _id: new Types.ObjectId(course.trailerVideoId),
    courseId: new Types.ObjectId(courseId),
    isMasterCourse: false,
  });

  if (!video) {
    throw new AppError("Course trailer not found", 404, "VIDEO_NOT_FOUND");
  }

  await ensureCourseVideoIsReady(video);

  const signed = buildSignedBunnyStreamUrl(video.bunnyVideoId);
  return {
    ...signed,
    videoId: video.id,
    title: video.title,
    durationSeconds: video.durationSeconds ?? null,
    thumbnailUrl: video.thumbnailUrl ?? null,
  };
};

export const createMasterCourseUpload = async (
  uploadedBy: string,
  payload: CreateVideoUploadInput,
) => {
  const bunnyVideo = await createBunnyVideo(payload.title);

  const video = await VideoModel.create({
    courseId: null,
    title: payload.title,
    description: payload.description,
    bunnyVideoId: bunnyVideo.guid,
    bunnyLibraryId: env.BUNNY_STREAM_LIBRARY_ID!,
    order: payload.order,
    isMasterCourse: true,
    isActive: false,
    uploadedBy: new Types.ObjectId(uploadedBy),
  });

  await MasterCourseVideoModel.updateMany({}, { $set: { isActive: false } });
  await MasterCourseVideoModel.create({
    title: payload.title,
    description: payload.description,
    videoId: video._id,
    bunnyVideoId: bunnyVideo.guid,
    isActive: true,
  });

  return {
    uploadUrl: buildBunnyUploadUrl(bunnyVideo.guid),
    videoId: video.id,
    bunnyVideoId: bunnyVideo.guid,
    method: "PUT",
    headers: {
      AccessKey: env.BUNNY_STREAM_API_KEY!,
      "Content-Type": "video/mp4",
    },
    note: "Upload directly from admin client to this URL using PUT",
  };
};

export const processBunnyWebhook = async (
  rawBody: string,
  headers: Record<string, string | string[] | undefined>,
  payload: BunnyWebhookInput,
) => {
  verifyBunnyWebhookSignature(rawBody, headers);

  const video = await VideoModel.findOne({ bunnyVideoId: payload.VideoGuid });
  if (!video) {
    throw new AppError("Video not found", 404, "VIDEO_NOT_FOUND");
  }

  if (payload.Status === 3 || payload.Status === 4) {
    video.isActive = true;
    video.durationSeconds = payload.VideoLength ?? video.durationSeconds;
    video.thumbnailUrl = buildBunnyThumbnailUrl(video.bunnyVideoId);
    await video.save();

    if (video.isMasterCourse) {
      const master = await MasterCourseVideoModel.findOne({ isActive: true }).sort({ updatedAt: -1 });
      if (master) {
        master.durationSeconds = video.durationSeconds;
        master.thumbnail = video.thumbnailUrl;
        master.bunnyVideoId = video.bunnyVideoId;
        await master.save();
      }
    }
  }

  return {
    bunnyVideoId: payload.VideoGuid,
    status: payload.Status,
    videoId: video.id,
    isActive: video.isActive,
  };
};

export const getCourseVideoStream = async (userId: string, courseId: string, videoId: string) => {
  await verifyCourseAccess(userId, courseId);

  const video = await VideoModel.findOne({
    _id: new Types.ObjectId(videoId),
    courseId: new Types.ObjectId(courseId),
    isMasterCourse: false,
  });

  if (!video) {
    throw new AppError("Video not found", 404, "VIDEO_NOT_FOUND");
  }

  await ensureCourseVideoIsReady(video);

  const signed = buildSignedBunnyStreamUrl(video.bunnyVideoId);
  const interactiveCues = await getPlayableVideoCues(courseId, videoId);

  return {
    ...signed,
    title: video.title,
    durationSeconds: video.durationSeconds ?? null,
    thumbnailUrl: video.thumbnailUrl ?? null,
    interactiveCues,
  };
};

export const getAdminCourseVideoStream = async (videoId: string) => {
  const video = await VideoModel.findById(videoId);

  if (!video || video.isMasterCourse) {
    throw new AppError("Video not found", 404, "VIDEO_NOT_FOUND");
  }

  await ensureCourseVideoIsReady(video);

  const signed = buildSignedBunnyStreamUrl(video.bunnyVideoId);
  return {
    ...signed,
    videoId: video.id,
    title: video.title,
    durationSeconds: video.durationSeconds ?? null,
    thumbnailUrl: video.thumbnailUrl ?? null,
  };
};

export const getMasterCourseStream = async () => {
  const master = await MasterCourseVideoModel.findOne({ isActive: true }).sort({ updatedAt: -1 });
  if (!master || !master.bunnyVideoId) {
    throw new AppError("Master course video not found", 404, "VIDEO_NOT_FOUND");
  }

  const video =
    (master.videoId ? await VideoModel.findById(master.videoId) : null) ??
    (await VideoModel.findOne({ bunnyVideoId: master.bunnyVideoId, isMasterCourse: true }));

  if (!video) {
    throw new AppError("Master course video not found", 404, "VIDEO_NOT_FOUND");
  }

  const signed = buildSignedBunnyStreamUrl(video.bunnyVideoId);
  return {
    ...signed,
    title: master.title,
    durationSeconds: video.durationSeconds ?? master.durationSeconds ?? null,
    thumbnailUrl: video.thumbnailUrl ?? master.thumbnail ?? null,
  };
};

export const recordCourseVideoWatch = async (
  userId: string,
  courseId: string,
  videoId: string,
  payload: RecordVideoWatchInput,
) => {
  await verifyCourseAccess(userId, courseId);

  const video = await VideoModel.findOne({
    _id: new Types.ObjectId(videoId),
    courseId: new Types.ObjectId(courseId),
    isMasterCourse: false,
  });

  if (!video) {
    throw new AppError("Video not found", 404, "VIDEO_NOT_FOUND");
  }

  const contentItem =
    payload.contentItemId
      ? await ContentItemModel.findOne({
          _id: new Types.ObjectId(payload.contentItemId),
          refId: video._id,
          type: "video",
          courseId: new Types.ObjectId(courseId),
          isActive: true,
        })
      : await ContentItemModel.findOne({
          refId: video._id,
          type: "video",
          courseId: new Types.ObjectId(courseId),
          isActive: true,
        });

  await httpJson(`${env.IDENTITY_URL}/internal/activity-log`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-internal-service-key": env.INTERNAL_SERVICE_SECRET,
    },
    body: JSON.stringify({
      userId,
      courseId,
      type: "video_watch",
      title: `${video.title} watched`,
      metadata: {
        videoId,
        contentItemId: contentItem?.id ?? payload.contentItemId ?? null,
        bunnyVideoId: video.bunnyVideoId,
        watchedSeconds: payload.watchedSeconds,
        positionSeconds: payload.positionSeconds ?? null,
        completed: payload.completed ?? false,
      },
      completedAt: new Date().toISOString(),
    }),
  });

  return {
    videoId,
    watchedSeconds: payload.watchedSeconds,
    positionSeconds: payload.positionSeconds ?? null,
    completed: payload.completed ?? false,
  };
};

export const updateVideo = async (videoId: string, payload: UpdateVideoInput) => {
  const video = await VideoModel.findById(videoId);
  if (!video) {
    throw new AppError("Video not found", 404, "VIDEO_NOT_FOUND");
  }

  const linkedContentItem = await ContentItemModel.findOne({ refId: video._id, type: "video" });
  const course = video.courseId ? await ensureCourseExists(String(video.courseId)) : null;
  const currentSectionKey = normalizeSectionKey(linkedContentItem?.sectionKey);
  const nextSectionKey = normalizeSectionKey(payload.sectionKey ?? linkedContentItem?.sectionKey);

  if (course) {
    ensureCourseSectionExists(course, nextSectionKey);
  }

  if (
    linkedContentItem &&
    payload.order &&
    (payload.order !== linkedContentItem.order || nextSectionKey !== currentSectionKey)
  ) {
    if (nextSectionKey !== currentSectionKey) {
      await ContentItemModel.updateMany(
        {
          courseId: linkedContentItem.courseId,
          sectionKey: currentSectionKey,
          order: { $gt: linkedContentItem.order },
          isActive: true,
        },
        { $inc: { order: -1 } },
      );

      await ContentItemModel.updateMany(
        {
          courseId: linkedContentItem.courseId,
          sectionKey: nextSectionKey,
          order: { $gte: payload.order },
          isActive: true,
        },
        { $inc: { order: 1 } },
      );
    } else if (payload.order > linkedContentItem.order) {
      await ContentItemModel.updateMany(
        {
          courseId: linkedContentItem.courseId,
          sectionKey: currentSectionKey,
          order: { $gt: linkedContentItem.order, $lte: payload.order },
          isActive: true,
        },
        { $inc: { order: -1 } },
      );
    } else {
      await ContentItemModel.updateMany(
        {
          courseId: linkedContentItem.courseId,
          sectionKey: currentSectionKey,
          order: { $gte: payload.order, $lt: linkedContentItem.order },
          isActive: true,
        },
        { $inc: { order: 1 } },
      );
    }
  }

  if (payload.title) {
    video.title = payload.title;
  }
  if (payload.description !== undefined) {
    video.description = payload.description;
  }
  if (payload.order !== undefined) {
    video.order = payload.order;
  }
  if (payload.thumbnailUrl !== undefined) {
    video.thumbnailUrl = payload.thumbnailUrl;
  }
  await video.save();

  await ContentItemModel.findOneAndUpdate(
    { refId: video._id, type: "video" },
    {
      $set: {
        ...(payload.title ? { title: payload.title } : {}),
        ...(payload.description !== undefined ? { description: payload.description } : {}),
        ...(payload.order !== undefined ? { order: payload.order } : {}),
        ...(payload.sectionKey !== undefined ? { sectionKey: nextSectionKey } : {}),
      },
    },
  );

  return video;
};

export const softDeleteVideo = async (videoId: string) => {
  const video = await VideoModel.findByIdAndUpdate(videoId, { $set: { isActive: false } }, { new: true });
  if (!video) {
    throw new AppError("Video not found", 404, "VIDEO_NOT_FOUND");
  }

  const linkedContentItem = await ContentItemModel.findOne({
    refId: video._id,
    type: "video",
  });

  if (linkedContentItem) {
    const currentOrder = linkedContentItem.order;
    await ContentItemModel.findByIdAndUpdate(linkedContentItem._id, {
      $set: { isActive: false, order: buildArchivedOrderValue() },
    });
    await ContentItemModel.updateMany(
      {
        courseId: linkedContentItem.courseId,
        sectionKey: normalizeSectionKey(linkedContentItem.sectionKey),
        order: { $gt: currentOrder },
        isActive: true,
      },
      { $inc: { order: -1 } },
    );
  } else {
    await ContentItemModel.findOneAndUpdate(
      { refId: video._id, type: "video" },
      { $set: { isActive: false } },
    );
  }

  await VideoCueModel.updateMany({ videoId: video._id }, { $set: { isActive: false } });

  if (video.isMasterCourse) {
    await MasterCourseVideoModel.updateMany({ videoId: video._id }, { $set: { isActive: false } });
  }

  return video;
};

export const attachMasterCourseVideoMetadata = async (payload: CreateMasterCourseInput) => {
  const master = await MasterCourseVideoModel.findOne({ isActive: true }).sort({ updatedAt: -1 });
  if (!master) {
    throw new AppError("Master course video not found", 404, "NOT_FOUND");
  }

  Object.assign(master, payload);
  await master.save();
  return master;
};

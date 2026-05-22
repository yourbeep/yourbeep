import { AppError } from "@yourbeep/shared";
import { Types } from "mongoose";
import { ContentItemModel } from "../models/content-item";
import { CourseModel } from "../models/course";
import { GameModel } from "../models/game";
import { VideoModel } from "../models/video";
import {
  GENERAL_SECTION_KEY,
  groupContentItemsBySection,
  sortContentItemsBySectionOrder,
} from "./content-structure.service";
import type { z } from "zod";
import {
  createContentItemSchema,
  reorderContentSchema,
  updateContentItemSchema,
} from "../validators";

type CreateContentItemInput = z.infer<typeof createContentItemSchema>;
type UpdateContentItemInput = z.infer<typeof updateContentItemSchema>;
type ReorderContentInput = z.infer<typeof reorderContentSchema>;

const buildArchivedOrderValue = () =>
  -1 * (Date.now() + Math.floor(Math.random() * 1000));

const normalizeSectionKey = (value?: string | null) =>
  value?.trim() || GENERAL_SECTION_KEY;

const ensureCourseExists = async (courseId: string) => {
  const course = await CourseModel.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404, "NOT_FOUND");
  }

  return course;
};

const ensureRefExists = async (type: "video" | "game", refId: string) => {
  if (type === "game") {
    const game = await GameModel.findById(refId);
    if (!game) {
      throw new AppError("Game not found", 404, "GAME_NOT_FOUND");
    }
    return;
  }

  if (type === "video") {
    const video = await VideoModel.findById(refId);
    if (!video) {
      throw new AppError("Video not found", 404, "VIDEO_NOT_FOUND");
    }
  }
};

export const listCourseContentItems = async (courseId: string) => {
  const course = await ensureCourseExists(courseId);
  const items = await ContentItemModel.find({ courseId, isActive: true });
  const videoIds = items
    .filter((item) => item.type === "video")
    .map((item) => new Types.ObjectId(String(item.refId)));

  const videos = videoIds.length
    ? await VideoModel.find({ _id: { $in: videoIds } }).select(
        "_id bunnyVideoId thumbnailUrl durationSeconds isActive title description order",
      )
    : [];

  const videoMap = new Map(videos.map((video) => [String(video._id), video]));

  const serializedItems = sortContentItemsBySectionOrder(
    items.map((item) => {
      const video = item.type === "video" ? videoMap.get(String(item.refId)) : null;
      return {
        ...item.toObject(),
        refId: String(item.refId),
        sectionKey: normalizeSectionKey(item.sectionKey),
        videoId: item.type === "video" ? String(item.refId) : null,
        bunnyVideoId: video?.bunnyVideoId ?? null,
        thumbnailUrl: video?.thumbnailUrl ?? null,
        durationSeconds: video?.durationSeconds ?? null,
        videoStatus: item.type === "video" ? (video?.isActive ? "ready" : "processing") : null,
      };
    }),
    course.sections ?? [],
  );

  return {
    items: serializedItems,
    sections: course.sections ?? [],
    contentSections: groupContentItemsBySection(serializedItems, course.sections ?? []).sections,
  };
};

export const createContentItem = async (courseId: string, payload: CreateContentItemInput) => {
  const course = await ensureCourseExists(courseId);
  await ensureRefExists(payload.type, payload.refId);

  const sectionKey = normalizeSectionKey(payload.sectionKey);
  const sectionExists =
    sectionKey === GENERAL_SECTION_KEY ||
    (course.sections ?? []).some((section: { key: string }) => section.key === sectionKey);

  if (!sectionExists) {
    throw new AppError("Section not found", 404, "SECTION_NOT_FOUND");
  }

  await ContentItemModel.updateMany(
    { courseId, sectionKey, order: { $gte: payload.order }, isActive: true },
    { $inc: { order: 1 } },
  );

  return ContentItemModel.create({
    ...payload,
    courseId: new Types.ObjectId(courseId),
    refId: new Types.ObjectId(payload.refId),
    sectionKey,
  });
};

export const updateContentItem = async (itemId: string, payload: UpdateContentItemInput) => {
  const current = await ContentItemModel.findById(itemId);
  if (!current) {
    throw new AppError("Content item not found", 404, "CONTENT_ITEM_NOT_FOUND");
  }

  const course = await ensureCourseExists(String(current.courseId));
  const nextSectionKey = normalizeSectionKey(payload.sectionKey ?? current.sectionKey);
  const currentSectionKey = normalizeSectionKey(current.sectionKey);

  const sectionExists =
    nextSectionKey === GENERAL_SECTION_KEY ||
    (course.sections ?? []).some((section: { key: string }) => section.key === nextSectionKey);

  if (!sectionExists) {
    throw new AppError("Section not found", 404, "SECTION_NOT_FOUND");
  }

  if (payload.order && (payload.order !== current.order || nextSectionKey !== currentSectionKey)) {
    if (nextSectionKey !== currentSectionKey) {
      await ContentItemModel.updateMany(
        {
          courseId: current.courseId,
          sectionKey: currentSectionKey,
          order: { $gt: current.order },
          isActive: true,
        },
        { $inc: { order: -1 } },
      );

      await ContentItemModel.updateMany(
        {
          courseId: current.courseId,
          sectionKey: nextSectionKey,
          order: { $gte: payload.order },
          isActive: true,
        },
        { $inc: { order: 1 } },
      );
    } else if (payload.order > current.order) {
      await ContentItemModel.updateMany(
        {
          courseId: current.courseId,
          sectionKey: currentSectionKey,
          order: { $gt: current.order, $lte: payload.order },
          isActive: true,
        },
        { $inc: { order: -1 } },
      );
    } else {
      await ContentItemModel.updateMany(
        {
          courseId: current.courseId,
          sectionKey: currentSectionKey,
          order: { $gte: payload.order, $lt: current.order },
          isActive: true,
        },
        { $inc: { order: 1 } },
      );
    }
  }

  const item = await ContentItemModel.findByIdAndUpdate(
    itemId,
    { $set: { ...payload, sectionKey: nextSectionKey } },
    { new: true },
  );
  if (!item) {
    throw new AppError("Content item not found", 404, "CONTENT_ITEM_NOT_FOUND");
  }

  return item;
};

export const softDeleteContentItem = async (itemId: string) => {
  const current = await ContentItemModel.findById(itemId);
  if (!current) {
    throw new AppError("Content item not found", 404, "CONTENT_ITEM_NOT_FOUND");
  }

  const currentOrder = current.order;
  const item = await ContentItemModel.findByIdAndUpdate(
    itemId,
    { $set: { isActive: false, order: buildArchivedOrderValue() } },
    { new: true },
  );
  if (!item) {
    throw new AppError("Content item not found", 404, "CONTENT_ITEM_NOT_FOUND");
  }

  await ContentItemModel.updateMany(
    {
      courseId: item.courseId,
      sectionKey: normalizeSectionKey(item.sectionKey),
      order: { $gt: currentOrder },
      isActive: true,
    },
    { $inc: { order: -1 } },
  );

  return item;
};

export const reorderContentItems = async (courseId: string, payload: ReorderContentInput) => {
  await ensureCourseExists(courseId);

  const items = await ContentItemModel.find({
    _id: { $in: payload.items.map((item) => new Types.ObjectId(item.itemId)) },
    courseId,
    isActive: true,
  });

  if (items.length !== payload.items.length) {
    throw new AppError("One or more content items do not exist", 404, "CONTENT_ITEM_NOT_FOUND");
  }

  await Promise.all(
    payload.items.map((item) =>
      ContentItemModel.findByIdAndUpdate(item.itemId, { $set: { order: item.order } }),
    ),
  );

  return listCourseContentItems(courseId);
};

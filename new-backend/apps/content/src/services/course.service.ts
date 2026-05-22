import { AppError, env, httpJson } from "@yourbeep/shared";
import { Types } from "mongoose";
import { ContentItemModel } from "../models/content-item";
import { CourseDocument, CourseModel } from "../models/course";
import { GameModel } from "../models/game";
import { SubmissionModel } from "../models/submission";
import { VideoCueModel } from "../models/video-cue";
import { VideoModel } from "../models/video";
import {
  groupContentItemsBySection,
  sortContentItemsBySectionOrder,
} from "./content-structure.service";
import type { z } from "zod";
import { createCourseSchema, updateCourseSchema } from "../validators";

type CreateCourseInput = z.infer<typeof createCourseSchema>;
type UpdateCourseInput = z.infer<typeof updateCourseSchema>;

const ensureWeightSum = (games: { weight: number }[]) => {
  if (games.reduce((sum, item) => sum + item.weight, 0) !== 100) {
    throw new AppError("Game weights must sum to exactly 100", 422, "INVALID_WEIGHT_SUM");
  }
};

const ensureGamesExist = async (gameIds: string[]) => {
  const count = await GameModel.countDocuments({
    _id: { $in: gameIds.map((id) => new Types.ObjectId(id)) },
    isActive: true,
  });

  if (count !== gameIds.length) {
    throw new AppError("One or more games do not exist", 404, "GAME_NOT_FOUND");
  }
};

const getUserAccess = async (userId: string, courseId: string) => {
  try {
    const response = await httpJson<{
      success: boolean;
      data: {
        hasAccess: boolean;
      };
    }>(`${env.COMMERCE_URL}/internal/purchases/${userId}/${courseId}`, {
      method: "GET",
      headers: {
        "x-internal-service-key": env.INTERNAL_SERVICE_SECRET,
      },
    });

    return response.data.hasAccess;
  } catch {
    return false;
  }
};

const getUserProgressForCourse = async (userId: string, course: CourseDocument & { _id: Types.ObjectId }) => {
  const completedGameIds = await SubmissionModel.aggregate<{ _id: Types.ObjectId }>([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        courseId: course._id,
        isComplete: true,
      },
    },
    {
      $group: {
        _id: "$gameId",
      },
    },
  ]);

  const gamesTotal = course.games.length;
  const gamesCompleted = completedGameIds.length;
  const percentComplete = gamesTotal ? Math.round((gamesCompleted / gamesTotal) * 100) : 0;

  return {
    gamesCompleted,
    gamesTotal,
    percentComplete,
  };
};

const buildCourseCard = async (course: CourseDocument & { _id: Types.ObjectId }, userId?: string) => {
  const gameCount = course.games.length;
  const hasAccess = userId ? await getUserAccess(userId, String(course._id)) : false;
  const progress = userId && hasAccess ? await getUserProgressForCourse(userId, course) : {
    gamesCompleted: 0,
    gamesTotal: gameCount,
    percentComplete: 0,
  };

  return {
    _id: course._id,
    title: course.title,
    subtitle: course.subtitle,
    shortDescription: course.shortDescription,
    thumbnail: course.thumbnail,
    bannerImage: course.bannerImage,
    overview: course.overview,
    trailerVideoId: course.trailerVideoId,
    sections: course.sections ?? [],
    durationMinutes: course.durationMinutes,
    estimatedDurationText: course.estimatedDurationText,
    difficultyLevel: course.difficultyLevel,
    language: course.language,
    certificateIncluded: Boolean(course.certificateIncluded),
    communityAccess: Boolean(course.communityAccess),
    instructor: course.instructor,
    whatYouWillLearn: course.whatYouWillLearn ?? [],
    courseHighlights: course.courseHighlights ?? [],
    whoItsFor: course.whoItsFor ?? [],
    whoItsNotFor: course.whoItsNotFor ?? [],
    faq: course.faq ?? [],
    featuredTestimonial: course.featuredTestimonial,
    gameCount,
    pricing: {
      region: "IN",
      currency: "INR",
      amount: 999,
      displayPrice: "INR 999",
    },
    userProgress: {
      hasPurchase: hasAccess,
      planType: hasAccess ? "annual" : null,
      expiresAt: null,
      gamesCompleted: progress.gamesCompleted,
      gamesTotal: progress.gamesTotal,
      percentComplete: progress.percentComplete,
    },
  };
};

export const listPublishedCourses = async (userId?: string) => {
  const courses = await CourseModel.find({ isActive: true, isPublished: true }).sort({ createdAt: -1 });
  const items = await Promise.all(courses.map((course) => buildCourseCard(course as CourseDocument & { _id: Types.ObjectId }, userId)));
  return { courses: items };
};

export const getCourseDetail = async (courseId: string, userId?: string) => {
  const course = await CourseModel.findOne({ _id: courseId, isActive: true }).populate("games.gameId");
  if (!course) {
    throw new AppError("Course not found", 404, "NOT_FOUND");
  }

  const contentItems = await ContentItemModel.find({ courseId, isActive: true });
  const card = await buildCourseCard(course as CourseDocument & { _id: Types.ObjectId }, userId);
  const lessonCount = contentItems.filter((item) => item.type === "video").length;
  const practiceCount = contentItems.filter((item) => item.type === "game").length;
  const serializedContentItems = sortContentItemsBySectionOrder(
    contentItems.map((item) => ({
      ...item.toObject(),
      refId: String(item.refId),
      sectionKey: item.sectionKey,
    })),
    course.sections ?? [],
  );

  return {
    ...card,
    description: course.description,
    instructor: course.instructor,
    games: course.games,
    contentItems: serializedContentItems,
    contentSections: groupContentItemsBySection(serializedContentItems, course.sections ?? []).sections,
    lessonCount,
    practiceCount,
    isPublished: course.isPublished,
  };
};

export const getCourseContent = async (courseId: string, userId: string) => {
  const course = await CourseModel.findOne({ _id: courseId, isActive: true });
  if (!course) {
    throw new AppError("Course not found", 404, "NOT_FOUND");
  }

  const hasAccess = await getUserAccess(userId, courseId);
  const items = await ContentItemModel.find({
    courseId,
    isActive: true,
    ...(hasAccess ? {} : { isFree: true }),
  });

  if (!hasAccess && !items.length) {
    throw new AppError("Course is not purchased", 403, "COURSE_NOT_PURCHASED");
  }

  const completedGameIds = hasAccess
    ? await SubmissionModel.aggregate<{ _id: Types.ObjectId }>([
        {
          $match: {
            userId: new Types.ObjectId(userId),
            courseId: new Types.ObjectId(courseId),
            isComplete: true,
          },
        },
        {
          $group: {
            _id: "$gameId",
          },
        },
      ])
    : [];
  const completedSet = new Set(completedGameIds.map((item) => String(item._id)));
  const videoItems = items.filter((item) => item.type === "video");
  const gameItems = items.filter((item) => item.type === "game");
  const videoIds = videoItems.map((item) => new Types.ObjectId(String(item.refId)));
  const gameIds = gameItems.map((item) => new Types.ObjectId(String(item.refId)));
  const [videos, cues, games] = await Promise.all([
    videoIds.length ? VideoModel.find({ _id: { $in: videoIds } }).select("_id bunnyVideoId") : [],
    videoIds.length
      ? VideoCueModel.find({ videoId: { $in: videoIds }, isActive: true }).select("videoId")
      : [],
    gameIds.length ? GameModel.find({ _id: { $in: gameIds } }).select("_id key title description") : [],
  ]);
  const videoMap = new Map(videos.map((video) => [String(video._id), video]));
  const gameMap = new Map(games.map((game) => [String(game._id), game]));
  const cueCountByVideoId = cues.reduce<Map<string, number>>((map, cue) => {
    const key = String(cue.videoId);
    map.set(key, (map.get(key) ?? 0) + 1);
    return map;
  }, new Map());

  const serializedContentItems = sortContentItemsBySectionOrder(
    items.map((item) => ({
      _id: item._id,
      order: item.order,
      type: item.type,
      refId: String(item.refId),
      sectionKey: item.sectionKey,
      title:
        item.type === "game"
          ? gameMap.get(String(item.refId))?.title ?? item.title
          : item.title,
      description:
        item.type === "game"
          ? gameMap.get(String(item.refId))?.description ?? item.description ?? null
          : item.description ?? null,
      durationMinutes: item.durationMinutes,
      isFree: item.isFree,
      videoId: item.type === "video" ? String(item.refId) : null,
      bunnyVideoId: item.type === "video" ? videoMap.get(String(item.refId))?.bunnyVideoId ?? null : null,
      gameKey: item.type === "game" ? gameMap.get(String(item.refId))?.key ?? null : null,
      interactiveCueCount: item.type === "video" ? cueCountByVideoId.get(String(item.refId)) ?? 0 : 0,
      userStatus: item.type === "game" && completedSet.has(String(item.refId)) ? "completed" : "not_started",
    })),
    course.sections ?? [],
  );

  return {
    courseId: String(course._id),
    title: course.title,
    sections: course.sections ?? [],
    contentItems: serializedContentItems,
    contentSections: groupContentItemsBySection(serializedContentItems, course.sections ?? []).sections,
    progress: {
      completed: completedSet.size,
      total: items.length,
      percentComplete: items.length ? Math.round((completedSet.size / items.length) * 100) : 0,
    },
  };
};

export const listAdminCourses = async () => {
  const items = await CourseModel.find({}).sort({ createdAt: -1 });
  return { items };
};

export const createCourse = async (payload: CreateCourseInput, createdBy: string) => {
  ensureWeightSum(payload.games);
  await ensureGamesExist(payload.games.map((game) => game.gameId));

  const course = await CourseModel.create({
    ...payload,
    createdBy: new Types.ObjectId(createdBy),
  });

  return course;
};

export const updateCourse = async (id: string, payload: UpdateCourseInput) => {
  if (payload.games) {
    ensureWeightSum(payload.games);
    await ensureGamesExist(payload.games.map((game) => game.gameId));
  }

  const course = await CourseModel.findByIdAndUpdate(id, { $set: payload }, { new: true });
  if (!course) {
    throw new AppError("Course not found", 404, "NOT_FOUND");
  }

  return course;
};

export const softDeleteCourse = async (id: string) => {
  const course = await CourseModel.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true });
  if (!course) {
    throw new AppError("Course not found", 404, "NOT_FOUND");
  }

  return course;
};

export const restoreCourse = async (id: string) => {
  const course = await CourseModel.findByIdAndUpdate(id, { $set: { isActive: true } }, { new: true });
  if (!course) {
    throw new AppError("Course not found", 404, "NOT_FOUND");
  }

  return course;
};

export const getCourseGameIds = async (courseId: string) => {
  const course = await CourseModel.findOne({ _id: courseId, isActive: true });
  if (!course) {
    throw new AppError("Course not found", 404, "NOT_FOUND");
  }

  return {
    courseId,
    gameIds: course.games.map((item: { gameId: Types.ObjectId }) => String(item.gameId)),
  };
};

export const getAdminCourseMetrics = async () => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const currentActiveCourses = await CourseModel.countDocuments({
    isActive: true,
    isPublished: true,
  });

  const previousActiveCourses = await CourseModel.countDocuments({
    isActive: true,
    isPublished: true,
    createdAt: { $lt: currentMonthStart },
  });

  return {
    activeCourses: {
      current: currentActiveCourses,
      previous: previousActiveCourses,
    },
  };
};

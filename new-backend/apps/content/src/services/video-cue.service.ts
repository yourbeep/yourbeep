import { AppError } from "@yourbeep/shared";
import { Types } from "mongoose";
import { CourseModel } from "../models/course";
import { GameModel } from "../models/game";
import { VideoModel } from "../models/video";
import { VideoCueModel } from "../models/video-cue";
import type { z } from "zod";
import { createVideoCueSchema, updateVideoCueSchema } from "../validators";
import { ensureValidGameSubActivity, getGameSubActivity } from "./game-subactivities.service";

type CreateVideoCueInput = z.infer<typeof createVideoCueSchema>;
type UpdateVideoCueInput = z.infer<typeof updateVideoCueSchema>;

const ensureVideoExists = async (videoId: string) => {
  const video = await VideoModel.findById(videoId);
  if (!video || video.isMasterCourse || !video.courseId) {
    throw new AppError("Course video not found", 404, "VIDEO_NOT_FOUND");
  }

  return video;
};

const ensureGameAssignableToCourse = async (courseId: string, gameId: string) => {
  const [course, game] = await Promise.all([
    CourseModel.findById(courseId),
    GameModel.findOne({ _id: gameId, isActive: true }),
  ]);

  if (!course) {
    throw new AppError("Course not found", 404, "NOT_FOUND");
  }

  if (!game) {
    throw new AppError("Game not found", 404, "GAME_NOT_FOUND");
  }

  const existsInCourse = course.games.some((item: { gameId: Types.ObjectId }) => String(item.gameId) === gameId);
  if (!existsInCourse) {
    throw new AppError("Game is not part of this course", 422, "GAME_NOT_IN_COURSE");
  }

  return game;
};

const serializeCue = (cue: {
  _id: Types.ObjectId;
  courseId: Types.ObjectId;
  videoId: Types.ObjectId;
  gameId: Types.ObjectId;
  subActivityKey?: string;
  triggerAtSeconds: number;
  title?: string;
  description?: string;
  ctaLabel?: string;
  pauseVideo: boolean;
  isSkippable: boolean;
  isActive: boolean;
}) => ({
  _id: String(cue._id),
  courseId: String(cue.courseId),
  videoId: String(cue.videoId),
  gameId: String(cue.gameId),
  subActivityKey: cue.subActivityKey ?? null,
  triggerAtSeconds: cue.triggerAtSeconds,
  title: cue.title ?? null,
  description: cue.description ?? null,
  ctaLabel: cue.ctaLabel ?? null,
  pauseVideo: cue.pauseVideo,
  isSkippable: cue.isSkippable,
  isActive: cue.isActive,
});

export const listVideoCues = async (videoId: string) => {
  await ensureVideoExists(videoId);
  const items = await VideoCueModel.find({ videoId, isActive: true }).sort({ triggerAtSeconds: 1, createdAt: 1 });
  return { items: items.map(serializeCue) };
};

export const createVideoCue = async (videoId: string, payload: CreateVideoCueInput) => {
  const video = await ensureVideoExists(videoId);
  const game = await ensureGameAssignableToCourse(String(video.courseId), payload.gameId);

  if (payload.subActivityKey) {
    try {
      ensureValidGameSubActivity(game.key, payload.subActivityKey);
    } catch (error) {
      throw new AppError(
        error instanceof Error ? error.message : "Unsupported game sub activity",
        422,
        "VALIDATION_ERROR",
      );
    }
  }

  const cue = await VideoCueModel.create({
    courseId: video.courseId,
    videoId: video._id,
    gameId: new Types.ObjectId(payload.gameId),
    subActivityKey: payload.subActivityKey,
    triggerAtSeconds: payload.triggerAtSeconds,
    title: payload.title,
    description: payload.description,
    ctaLabel: payload.ctaLabel,
    pauseVideo: payload.pauseVideo ?? true,
    isSkippable: payload.isSkippable ?? false,
    isActive: true,
  });

  return cue;
};

export const updateVideoCue = async (cueId: string, payload: UpdateVideoCueInput) => {
  const cue = await VideoCueModel.findById(cueId);
  if (!cue) {
    throw new AppError("Video cue not found", 404, "VIDEO_CUE_NOT_FOUND");
  }

  let gameKey: string | null = null;
  if (payload.gameId) {
    const game = await ensureGameAssignableToCourse(String(cue.courseId), payload.gameId);
    cue.gameId = new Types.ObjectId(payload.gameId);
    gameKey = game.key;
  }

  if (payload.subActivityKey !== undefined) {
    if (!gameKey) {
      const game = await GameModel.findById(cue.gameId).select("key");
      if (!game) {
        throw new AppError("Game not found", 404, "GAME_NOT_FOUND");
      }
      gameKey = game.key;
    }

    if (payload.subActivityKey) {
      if (!gameKey) {
        throw new AppError("Game not found", 404, "GAME_NOT_FOUND");
      }

      try {
        ensureValidGameSubActivity(gameKey, payload.subActivityKey);
      } catch (error) {
        throw new AppError(
          error instanceof Error ? error.message : "Unsupported game sub activity",
          422,
          "VALIDATION_ERROR",
        );
      }
    }

    cue.subActivityKey = payload.subActivityKey || undefined;
  }

  if (payload.triggerAtSeconds !== undefined) cue.triggerAtSeconds = payload.triggerAtSeconds;
  if (payload.title !== undefined) cue.title = payload.title;
  if (payload.description !== undefined) cue.description = payload.description;
  if (payload.ctaLabel !== undefined) cue.ctaLabel = payload.ctaLabel;
  if (payload.pauseVideo !== undefined) cue.pauseVideo = payload.pauseVideo;
  if (payload.isSkippable !== undefined) cue.isSkippable = payload.isSkippable;
  if (payload.isActive !== undefined) cue.isActive = payload.isActive;

  await cue.save();
  return cue;
};

export const softDeleteVideoCue = async (cueId: string) => {
  const cue = await VideoCueModel.findByIdAndUpdate(cueId, { $set: { isActive: false } }, { new: true });
  if (!cue) {
    throw new AppError("Video cue not found", 404, "VIDEO_CUE_NOT_FOUND");
  }

  return cue;
};

export const getPlayableVideoCues = async (courseId: string, videoId: string) => {
  const items = await VideoCueModel.find({
    courseId: new Types.ObjectId(courseId),
    videoId: new Types.ObjectId(videoId),
    isActive: true,
  }).sort({ triggerAtSeconds: 1, createdAt: 1 });

  if (!items.length) {
    return [];
  }

  const gameIds = [...new Set(items.map((item) => String(item.gameId)))];
  const games = await GameModel.find({ _id: { $in: gameIds.map((id) => new Types.ObjectId(id)) } }).select(
    "_id key title description",
  );
  const gameMap = new Map(games.map((game) => [String(game._id), game]));

  return items.map((cue) => {
    const game = gameMap.get(String(cue.gameId));
    const subActivity =
      game?.key && cue.subActivityKey
        ? getGameSubActivity(game.key, cue.subActivityKey)
        : null;
    return {
      ...serializeCue(cue),
      gameKey: game?.key ?? null,
      gameTitle: game?.title ?? null,
      gameDescription: game?.description ?? null,
      subActivityLabel: subActivity?.label ?? null,
    };
  });
};

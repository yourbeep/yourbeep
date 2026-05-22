import { AppError } from "@yourbeep/shared";
import { Types } from "mongoose";
import { ActivityLogModel } from "../models/activity-log";
import { UserModel } from "../models/user";
import { getLevelFromXp, getXpAwardForActivity } from "./progression.service";

export const getInternalUserById = async (userId: string) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  return user;
};

export const getInternalUserByFirebaseUid = async (firebaseUid: string) => {
  const user = await UserModel.findOne({ firebaseUid });

  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  return user;
};

export const createActivityLog = async (payload: {
  userId: string;
  courseId?: string;
  gameKey?: string;
  type: "game_submission" | "video_watch" | "course_progress";
  title: string;
  metadata?: Record<string, unknown>;
  completedAt: string;
}) => {
  const completedAt = new Date(payload.completedAt);
  const entry = await ActivityLogModel.create({
    userId: new Types.ObjectId(payload.userId),
    courseId: payload.courseId ? new Types.ObjectId(payload.courseId) : undefined,
    gameKey: payload.gameKey,
    type: payload.type,
    title: payload.title,
    metadata: payload.metadata,
    completedAt,
  });

  const user = await UserModel.findById(payload.userId);
  if (user) {
    const awardedXp = getXpAwardForActivity({ type: payload.type, metadata: payload.metadata });
    const previousLastActiveAt = user.lastActiveAt ?? user.createdAt ?? completedAt;
    const previousKey = previousLastActiveAt.toISOString().slice(0, 10);
    const todayKey = completedAt.toISOString().slice(0, 10);

    user.points += awardedXp;
    user.userLevel = getLevelFromXp(user.points);
    user.lastActiveAt = completedAt;
    if (todayKey !== previousKey) {
      const yesterday = new Date(completedAt);
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      const yesterdayKey = yesterday.toISOString().slice(0, 10);
      user.streakDays = previousKey === yesterdayKey ? user.streakDays + 1 : 1;
    } else if (!user.streakDays) {
      user.streakDays = 1;
    }

    await user.save();
  }

  return entry;
};

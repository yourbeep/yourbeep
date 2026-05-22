import { parseBody, success } from "@yourbeep/shared";
import type { Request, Response } from "express";
import { createActivityLog, getInternalUserByFirebaseUid, getInternalUserById } from "../services/internal.service";
import { sendInternalNotification } from "../services/notification.service";
import { internalNotificationSchema } from "../validators";

export const getInternalUserByIdController = async (req: Request, res: Response) => {
  const user = await getInternalUserById(String(req.params.userId));
  return success(res, { user }, "Internal user lookup");
};

export const getInternalUserByFirebaseUidController = async (req: Request, res: Response) => {
  const user = await getInternalUserByFirebaseUid(String(req.params.uid));
  return success(res, { user }, "Internal firebase user lookup");
};

export const sendInternalNotificationController = async (req: Request, res: Response) => {
  const payload = parseBody(internalNotificationSchema, req.body);
  const data = await sendInternalNotification(payload);
  return success(res, data, "Notification sent");
};

export const createActivityLogController = async (req: Request, res: Response) => {
  const entry = await createActivityLog(req.body as {
    userId: string;
    courseId?: string;
    gameKey?: string;
    type: "game_submission" | "video_watch" | "course_progress";
    title: string;
    metadata?: Record<string, unknown>;
    completedAt: string;
  });

  return success(res, { entry }, "Activity log created", 201);
};

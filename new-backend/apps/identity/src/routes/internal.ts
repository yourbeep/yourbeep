import { Router } from "express";
import { asyncHandler, env, requireInternalService } from "@yourbeep/shared";
import {
  createActivityLogController,
  getInternalUserByFirebaseUidController,
  getInternalUserByIdController,
  sendInternalNotificationController,
} from "../controllers/internal.controller";

export const internalRouter = Router();

internalRouter.use(requireInternalService(env.INTERNAL_SERVICE_SECRET));

internalRouter.get("/users/:userId", asyncHandler(getInternalUserByIdController));
internalRouter.get("/users/firebase/:uid", asyncHandler(getInternalUserByFirebaseUidController));
internalRouter.post("/notifications/send", asyncHandler(sendInternalNotificationController));
internalRouter.post("/activity-log", asyncHandler(createActivityLogController));

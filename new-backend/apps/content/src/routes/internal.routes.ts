import { Router } from "express";
import { asyncHandler, env, requireInternalService } from "@yourbeep/shared";
import { getAdminCourseMetricsController, getCourseGameIdsController } from "../controllers/internal.controller";

export const internalRouter = Router();

internalRouter.use(requireInternalService(env.INTERNAL_SERVICE_SECRET));
internalRouter.get("/courses/:courseId/games", asyncHandler(getCourseGameIdsController));
internalRouter.get("/admin/course-metrics", asyncHandler(getAdminCourseMetricsController));

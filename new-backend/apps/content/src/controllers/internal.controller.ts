import { success } from "@yourbeep/shared";
import type { Request, Response } from "express";
import { getAdminCourseMetrics, getCourseGameIds } from "../services/course.service";

export const getCourseGameIdsController = async (req: Request, res: Response) => {
  const data = await getCourseGameIds(String(req.params.courseId));
  return success(res, data, "Course game ids");
};

export const getAdminCourseMetricsController = async (_req: Request, res: Response) => {
  const data = await getAdminCourseMetrics();
  return success(res, data, "Admin course metrics");
};

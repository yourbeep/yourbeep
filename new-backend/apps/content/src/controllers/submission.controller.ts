import { parseBody, success } from "@yourbeep/shared";
import type { Request, Response } from "express";
import {
  deleteSubmission,
  getActivityDetailByKey,
  getCourseSubmissions,
  getGameResult,
  getSubmissionById,
  getSubmissionByIdForAdmin,
  submitGame,
} from "../services/submission.service";
import { submitGameSchema } from "../validators";

export const submitGameController = async (req: Request, res: Response) => {
  const payload = parseBody(submitGameSchema, req.body);
  const submission = await submitGame(req.auth!.id, String(req.params.gameId), payload);
  return success(res, { submission }, "Game submitted", 201);
};

export const getGameResultController = async (req: Request, res: Response) => {
  const data = await getGameResult(req.auth!.id, String(req.params.gameId));
  return success(res, data, "Game result");
};

export const getCourseSubmissionsController = async (req: Request, res: Response) => {
  const data = await getCourseSubmissions(req.auth!.id, String(req.params.courseId));
  return success(res, data, "Course submissions");
};

export const getSubmissionByIdController = async (req: Request, res: Response) => {
  const submission = await getSubmissionById(req.auth!.id, String(req.params.submissionId));
  return success(res, { submission }, "Submission detail");
};

export const getSubmissionByIdForAdminController = async (req: Request, res: Response) => {
  const submission = await getSubmissionByIdForAdmin(String(req.params.submissionId));
  return success(res, { submission }, "Admin submission detail");
};

export const deleteSubmissionController = async (req: Request, res: Response) => {
  const data = await deleteSubmission(String(req.params.submissionId));
  return success(res, data, "Submission deleted");
};

export const getActivityDetailController = async (req: Request, res: Response) => {
  const data = await getActivityDetailByKey(String(req.params.gameId), String(req.params.activityKey));
  return success(res, data, "Activity detail");
};

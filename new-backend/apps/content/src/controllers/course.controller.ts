import { getRequestAuth, parseBody, success } from "@yourbeep/shared";
import type { Request, Response } from "express";
import {
  createCourse,
  getCourseContent,
  getCourseDetail,
  listAdminCourses,
  listPublishedCourses,
  restoreCourse,
  softDeleteCourse,
  updateCourse,
} from "../services/course.service";
import { createCourseSchema, updateCourseSchema } from "../validators";

export const listCoursesController = async (req: Request, res: Response) => {
  const auth = getRequestAuth(req);
  const data = await listPublishedCourses(auth?.id);
  return success(res, data, "Courses list");
};

export const getCourseDetailController = async (req: Request, res: Response) => {
  const auth = getRequestAuth(req);
  const data = await getCourseDetail(String(req.params.courseId), auth?.id);
  return success(res, data, "Course detail");
};

export const getCourseContentController = async (req: Request, res: Response) => {
  const data = await getCourseContent(String(req.params.courseId), req.auth!.id);
  return success(res, data, "Course content");
};

export const listAdminCoursesController = async (_req: Request, res: Response) => {
  const data = await listAdminCourses();
  return success(res, data, "Admin courses list");
};

export const createCourseController = async (req: Request, res: Response) => {
  const payload = parseBody(createCourseSchema, req.body);
  const course = await createCourse(payload, req.auth!.id);
  return success(res, { course }, "Course created", 201);
};

export const updateCourseController = async (req: Request, res: Response) => {
  const payload = parseBody(updateCourseSchema, req.body);
  const course = await updateCourse(String(req.params.id), payload);
  return success(res, { course }, "Course updated");
};

export const deleteCourseController = async (req: Request, res: Response) => {
  const course = await softDeleteCourse(String(req.params.id));
  return success(res, { course }, "Course soft-deleted");
};

export const restoreCourseController = async (req: Request, res: Response) => {
  const course = await restoreCourse(String(req.params.id));
  return success(res, { course }, "Course restored");
};

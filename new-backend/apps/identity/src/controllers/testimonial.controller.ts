import { parseBody, success } from "@yourbeep/shared";
import type { Request, Response } from "express";
import {
  adminCreateTestimonialSchema,
  adminTestimonialListQuerySchema,
  adminUpdateTestimonialSchema,
  createTestimonialSchema,
  publicTestimonialListQuerySchema,
} from "../validators";
import {
  createAdminTestimonial,
  createTestimonial,
  getAdminTestimonialById,
  hideAdminTestimonial,
  listAdminTestimonials,
  listPublicTestimonials,
  updateAdminTestimonial,
} from "../services/testimonial.service";

export const createTestimonialController = async (req: Request, res: Response) => {
  const payload = parseBody(createTestimonialSchema, req.body);
  const data = await createTestimonial(req.auth!.id, payload);
  return success(res, data, "Testimonial submitted", 201);
};

export const listPublicTestimonialsController = async (req: Request, res: Response) => {
  const query = parseBody(publicTestimonialListQuerySchema, req.query);
  const data = await listPublicTestimonials(query);
  return success(res, data, "Testimonials");
};

export const listAdminTestimonialsController = async (req: Request, res: Response) => {
  const query = parseBody(adminTestimonialListQuerySchema, req.query);
  const data = await listAdminTestimonials(query);
  return success(res, data, "Admin testimonials");
};

export const getAdminTestimonialByIdController = async (req: Request, res: Response) => {
  const data = await getAdminTestimonialById(String(req.params.testimonialId));
  return success(res, data, "Admin testimonial detail");
};

export const createAdminTestimonialController = async (req: Request, res: Response) => {
  const payload = parseBody(adminCreateTestimonialSchema, req.body);
  const data = await createAdminTestimonial(req.auth!.id, payload);
  return success(res, data, "Admin testimonial created", 201);
};

export const updateAdminTestimonialController = async (req: Request, res: Response) => {
  const payload = parseBody(adminUpdateTestimonialSchema, req.body);
  const data = await updateAdminTestimonial(String(req.params.testimonialId), req.auth!.id, payload);
  return success(res, data, "Testimonial updated");
};

export const hideAdminTestimonialController = async (req: Request, res: Response) => {
  const data = await hideAdminTestimonial(String(req.params.testimonialId));
  return success(res, data, "Testimonial hidden");
};

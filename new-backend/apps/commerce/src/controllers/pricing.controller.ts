import { parseBody, success } from "@yourbeep/shared";
import type { Request, Response } from "express";
import {
  deleteCoursePricing,
  getCoursePrice,
  listCoursePricing,
  resolveUserRegion,
  upsertPricing,
} from "../services/pricing.service";
import { pricingUpsertSchema } from "../validators";

export const getCoursePriceController = async (req: Request, res: Response) => {
  const region = resolveUserRegion(req.headers as Record<string, unknown>);
  const data = await getCoursePrice(String(req.params.courseId), region);
  return success(res, data, "Course pricing");
};

export const getCoursePriceByRegionController = async (req: Request, res: Response) => {
  const data = await getCoursePrice(String(req.params.courseId), String(req.params.region));
  return success(res, data, "Course pricing");
};

export const listCoursePricingController = async (req: Request, res: Response) => {
  const data = await listCoursePricing(String(req.params.courseId));
  return success(res, data, "Course pricing list");
};

export const upsertPricingController = async (req: Request, res: Response) => {
  const payload = parseBody(pricingUpsertSchema, req.body);
  const pricing = await upsertPricing(String(req.params.courseId), payload);
  return success(res, { pricing }, "Pricing upserted");
};

export const deleteCoursePricingController = async (req: Request, res: Response) => {
  const pricing = await deleteCoursePricing(String(req.params.courseId), String(req.params.region));
  return success(res, { pricing }, "Pricing deleted");
};

import { AppError } from "@yourbeep/shared";
import { Types } from "mongoose";
import { TestimonialModel, type TestimonialRecord } from "../models/testimonial";
import { UserModel } from "../models/user";
import type { z } from "zod";
import {
  adminCreateTestimonialSchema,
  adminTestimonialListQuerySchema,
  adminUpdateTestimonialSchema,
  createTestimonialSchema,
  publicTestimonialListQuerySchema,
} from "../validators";

type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
type AdminCreateTestimonialInput = z.infer<typeof adminCreateTestimonialSchema>;
type PublicTestimonialListQuery = z.infer<typeof publicTestimonialListQuerySchema>;
type AdminTestimonialListQuery = z.infer<typeof adminTestimonialListQuerySchema>;
type AdminUpdateTestimonialInput = z.infer<typeof adminUpdateTestimonialSchema>;

const serializeTestimonial = (item: TestimonialRecord) => ({
  _id: item.id,
  userId: item.userId ? item.userId.toString() : null,
  courseId: item.courseId ? item.courseId.toString() : null,
  source: item.source,
  status: item.status,
  featured: item.featured,
  displayName: item.displayName,
  avatar: item.avatar ?? null,
  roleLabel: item.roleLabel ?? null,
  headline: item.headline ?? null,
  quote: item.quote,
  rating: item.rating,
  adminNotes: item.adminNotes ?? null,
  rejectionReason: item.rejectionReason ?? null,
  featuredOrder: item.featuredOrder ?? null,
  createdByAdminId: item.createdByAdminId ? item.createdByAdminId.toString() : null,
  approvedByAdminId: item.approvedByAdminId ? item.approvedByAdminId.toString() : null,
  approvedAt: item.approvedAt ?? null,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const getTestimonialById = async (testimonialId: string) => {
  const item = await TestimonialModel.findById(testimonialId);
  if (!item) {
    throw new AppError("Testimonial not found", 404, "NOT_FOUND");
  }
  return item;
};

export const createTestimonial = async (userId: string, payload: CreateTestimonialInput) => {
  const user = await UserModel.findById(userId);
  if (!user || !user.isActive) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  const item = await TestimonialModel.create({
    userId: new Types.ObjectId(userId),
    courseId: payload.courseId ? new Types.ObjectId(payload.courseId) : undefined,
    source: "user",
    status: "pending",
    featured: false,
    displayName: user.name,
    avatar: user.avatar,
    roleLabel: payload.roleLabel,
    headline: payload.headline,
    quote: payload.quote,
    rating: payload.rating,
  });

  return { testimonial: serializeTestimonial(item) };
};

export const listPublicTestimonials = async (query: PublicTestimonialListQuery) => {
  const filter: Record<string, unknown> = {
    status: "approved",
  };

  if (query.courseId) filter.courseId = new Types.ObjectId(query.courseId);
  if (query.featuredOnly) filter.featured = true;

  const items = await TestimonialModel.find(filter)
    .sort({ featured: -1, featuredOrder: 1, approvedAt: -1, createdAt: -1 })
    .limit(query.limit);

  return {
    items: items.map(serializeTestimonial),
  };
};

export const listAdminTestimonials = async (query: AdminTestimonialListQuery) => {
  const filter: Record<string, unknown> = {};
  if (query.status) filter.status = query.status;
  if (query.source) filter.source = query.source;
  if (query.featured !== undefined) filter.featured = query.featured;
  if (query.courseId) filter.courseId = new Types.ObjectId(query.courseId);
  if (query.q) {
    filter.$or = [
      { displayName: { $regex: query.q, $options: "i" } },
      { headline: { $regex: query.q, $options: "i" } },
      { quote: { $regex: query.q, $options: "i" } },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    TestimonialModel.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(query.limit),
    TestimonialModel.countDocuments(filter),
  ]);

  return {
    items: items.map(serializeTestimonial),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
    },
  };
};

export const getAdminTestimonialById = async (testimonialId: string) => {
  const item = await getTestimonialById(testimonialId);
  return { testimonial: serializeTestimonial(item) };
};

export const createAdminTestimonial = async (
  adminId: string,
  payload: AdminCreateTestimonialInput,
) => {
  const item = await TestimonialModel.create({
    userId: payload.userId ? new Types.ObjectId(payload.userId) : undefined,
    courseId: payload.courseId ? new Types.ObjectId(payload.courseId) : undefined,
    source: "admin",
    status: payload.status ?? "approved",
    featured: payload.featured ?? false,
    displayName: payload.displayName,
    avatar: payload.avatar,
    roleLabel: payload.roleLabel,
    headline: payload.headline,
    quote: payload.quote,
    rating: payload.rating,
    adminNotes: payload.adminNotes,
    featuredOrder: payload.featuredOrder,
    createdByAdminId: new Types.ObjectId(adminId),
    approvedByAdminId:
      payload.status === "approved" ? new Types.ObjectId(adminId) : undefined,
    approvedAt: payload.status === "approved" ? new Date() : undefined,
  });

  return { testimonial: serializeTestimonial(item) };
};

export const updateAdminTestimonial = async (
  testimonialId: string,
  adminId: string,
  payload: AdminUpdateTestimonialInput,
) => {
  const item = await getTestimonialById(testimonialId);

  if (payload.status !== undefined) {
    item.status = payload.status;
    if (payload.status === "approved") {
      item.approvedByAdminId = new Types.ObjectId(adminId);
      item.approvedAt = new Date();
    }
  }

  if (payload.featured !== undefined) item.featured = payload.featured;
  if (payload.featuredOrder !== undefined) item.featuredOrder = payload.featuredOrder;
  if (payload.headline !== undefined) item.headline = payload.headline;
  if (payload.quote !== undefined) item.quote = payload.quote;
  if (payload.rating !== undefined) item.rating = payload.rating;
  if (payload.roleLabel !== undefined) item.roleLabel = payload.roleLabel;
  if (payload.avatar !== undefined) item.avatar = payload.avatar;
  if (payload.displayName !== undefined) item.displayName = payload.displayName;
  if (payload.courseId !== undefined) {
    item.courseId = payload.courseId ? new Types.ObjectId(payload.courseId) : undefined;
  }
  if (payload.adminNotes !== undefined) item.adminNotes = payload.adminNotes;
  if (payload.rejectionReason !== undefined) item.rejectionReason = payload.rejectionReason;

  await item.save();
  return { testimonial: serializeTestimonial(item) };
};

export const hideAdminTestimonial = async (testimonialId: string) => {
  const item = await getTestimonialById(testimonialId);
  item.status = "hidden";
  item.featured = false;
  await item.save();
  return { testimonial: serializeTestimonial(item) };
};

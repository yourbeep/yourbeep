import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { testimonialsApi } from "../../../features/reviews/services/testimonialsApi";
import { getApiErrorMessage } from "../../../utils/apiError";
import type {
  TestimonialItem,
  TestimonialsFilters,
  TestimonialsListPayload,
} from "./testimonialsTypes";

const mapTestimonial = (item: any): TestimonialItem => ({
  _id: String(item?._id || ""),
  userId: item?.userId ? String(item.userId) : null,
  courseId: item?.courseId ? String(item.courseId) : null,
  source: item?.source || "user",
  status: item?.status || "pending",
  featured: Boolean(item?.featured),
  displayName: String(item?.displayName || ""),
  avatar: typeof item?.avatar === "string" ? item.avatar : null,
  roleLabel: typeof item?.roleLabel === "string" ? item.roleLabel : null,
  headline: typeof item?.headline === "string" ? item.headline : null,
  quote: String(item?.quote || ""),
  rating: Number(item?.rating || 0),
  adminNotes: typeof item?.adminNotes === "string" ? item.adminNotes : null,
  rejectionReason:
    typeof item?.rejectionReason === "string" ? item.rejectionReason : null,
  featuredOrder:
    typeof item?.featuredOrder === "number" ? item.featuredOrder : null,
  createdByAdminId: item?.createdByAdminId ? String(item.createdByAdminId) : null,
  approvedByAdminId: item?.approvedByAdminId ? String(item.approvedByAdminId) : null,
  approvedAt: item?.approvedAt ? String(item.approvedAt) : null,
  createdAt: String(item?.createdAt || new Date().toISOString()),
  updatedAt: String(item?.updatedAt || new Date().toISOString()),
});

const mapPagination = (pagination: any, fallbackPage: number, fallbackLimit: number) => ({
  page: Number(pagination?.page || fallbackPage),
  limit: Number(pagination?.limit || fallbackLimit),
  total: Number(pagination?.total || 0),
});

export const fetchTestimonials = createAsyncThunk<
  TestimonialsListPayload,
  TestimonialsFilters | void,
  { rejectValue: string }
>("testimonials/fetchTestimonials", async (filters, { rejectWithValue }) => {
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 10;
  try {
    const response = await testimonialsApi.listTestimonials({
      page,
      limit,
      ...(filters?.q ? { q: filters.q } : {}),
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.source ? { source: filters.source } : {}),
      ...(typeof filters?.featured === "boolean"
        ? { featured: String(filters.featured) }
        : {}),
      ...(filters?.courseId ? { courseId: filters.courseId } : {}),
    });
    const data = response.data?.data ?? {};
    return {
      items: Array.isArray(data.items) ? data.items.map(mapTestimonial) : [],
      pagination: mapPagination(data.pagination, page, limit),
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load testimonials."),
      );
    }
    return rejectWithValue("Unable to load testimonials.");
  }
});

export const fetchTestimonialDetail = createAsyncThunk<
  TestimonialItem,
  string,
  { rejectValue: string }
>("testimonials/fetchDetail", async (testimonialId, { rejectWithValue }) => {
  try {
    const response = await testimonialsApi.getTestimonial(testimonialId);
    return mapTestimonial(response.data?.data?.testimonial ?? {});
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load testimonial detail."),
      );
    }
    return rejectWithValue("Unable to load testimonial detail.");
  }
});

export const createAdminTestimonial = createAsyncThunk<
  TestimonialItem,
  Record<string, unknown>,
  { rejectValue: string }
>("testimonials/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await testimonialsApi.createTestimonial(payload);
    return mapTestimonial(response.data?.data?.testimonial ?? {});
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to create testimonial."),
      );
    }
    return rejectWithValue("Unable to create testimonial.");
  }
});

export const updateAdminTestimonial = createAsyncThunk<
  TestimonialItem,
  { testimonialId: string; payload: Record<string, unknown> },
  { rejectValue: string }
>("testimonials/update", async ({ testimonialId, payload }, { rejectWithValue }) => {
  try {
    const response = await testimonialsApi.updateTestimonial(testimonialId, payload);
    return mapTestimonial(response.data?.data?.testimonial ?? {});
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to update testimonial."),
      );
    }
    return rejectWithValue("Unable to update testimonial.");
  }
});

export const hideAdminTestimonial = createAsyncThunk<
  TestimonialItem,
  string,
  { rejectValue: string }
>("testimonials/hide", async (testimonialId, { rejectWithValue }) => {
  try {
    const response = await testimonialsApi.hideTestimonial(testimonialId);
    return mapTestimonial(response.data?.data?.testimonial ?? {});
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to hide testimonial."),
      );
    }
    return rejectWithValue("Unable to hide testimonial.");
  }
});

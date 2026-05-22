import type { Dispatch, SetStateAction } from "react";
import type { TestimonialItem, TestimonialSource, TestimonialStatus } from "../../store/slices/testimonials";

export type ReviewCourseOption = {
  _id: string;
  title: string;
};

export type TestimonialFormValues = {
  displayName: string;
  avatar: string;
  roleLabel: string;
  headline: string;
  quote: string;
  rating: number;
  courseId: string;
  status: TestimonialStatus;
  source: TestimonialSource;
  featured: boolean;
  featuredOrder: string;
  adminNotes: string;
  rejectionReason: string;
};

export type SetTestimonialForm = Dispatch<SetStateAction<TestimonialFormValues>>;

export type TestimonialPayload = {
  displayName: string;
  avatar?: string;
  roleLabel?: string;
  headline?: string;
  quote: string;
  rating: number;
  courseId?: string;
  status: TestimonialStatus;
  source: TestimonialSource;
  featured: boolean;
  featuredOrder?: number;
  adminNotes?: string;
  rejectionReason?: string;
};

export function createEmptyTestimonialForm(): TestimonialFormValues {
  return {
    displayName: "",
    avatar: "",
    roleLabel: "",
    headline: "",
    quote: "",
    rating: 5,
    courseId: "",
    status: "approved",
    source: "admin",
    featured: false,
    featuredOrder: "",
    adminNotes: "",
    rejectionReason: "",
  };
}

export function createTestimonialFormFromItem(
  testimonial: Partial<TestimonialItem> | null | undefined,
): TestimonialFormValues {
  const empty = createEmptyTestimonialForm();

  if (!testimonial) {
    return empty;
  }

  return {
    displayName: testimonial.displayName || empty.displayName,
    avatar: testimonial.avatar || empty.avatar,
    roleLabel: testimonial.roleLabel || empty.roleLabel,
    headline: testimonial.headline || empty.headline,
    quote: testimonial.quote || empty.quote,
    rating: testimonial.rating || empty.rating,
    courseId: testimonial.courseId || empty.courseId,
    status: testimonial.status || empty.status,
    source: testimonial.source || empty.source,
    featured: Boolean(testimonial.featured),
    featuredOrder:
      typeof testimonial.featuredOrder === "number"
        ? String(testimonial.featuredOrder)
        : empty.featuredOrder,
    adminNotes: testimonial.adminNotes || empty.adminNotes,
    rejectionReason: testimonial.rejectionReason || empty.rejectionReason,
  };
}

export function buildTestimonialPayload(
  form: TestimonialFormValues,
): TestimonialPayload {
  return {
    displayName: form.displayName.trim(),
    ...(form.avatar.trim() ? { avatar: form.avatar.trim() } : {}),
    ...(form.roleLabel.trim() ? { roleLabel: form.roleLabel.trim() } : {}),
    ...(form.headline.trim() ? { headline: form.headline.trim() } : {}),
    quote: form.quote.trim(),
    rating: Number(form.rating),
    ...(form.courseId ? { courseId: form.courseId } : {}),
    status: form.status,
    source: form.source,
    featured: form.featured,
    ...(form.featuredOrder.trim()
      ? { featuredOrder: Number(form.featuredOrder) }
      : {}),
    ...(form.adminNotes.trim() ? { adminNotes: form.adminNotes.trim() } : {}),
    ...(form.rejectionReason.trim()
      ? { rejectionReason: form.rejectionReason.trim() }
      : {}),
  };
}

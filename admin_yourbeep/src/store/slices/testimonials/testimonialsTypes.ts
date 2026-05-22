export type TestimonialStatus = "pending" | "approved" | "rejected" | "hidden";
export type TestimonialSource = "user" | "admin";

export type TestimonialItem = {
  _id: string;
  userId: string | null;
  courseId: string | null;
  source: TestimonialSource;
  status: TestimonialStatus;
  featured: boolean;
  displayName: string;
  avatar: string | null;
  roleLabel: string | null;
  headline: string | null;
  quote: string;
  rating: number;
  adminNotes: string | null;
  rejectionReason: string | null;
  featuredOrder: number | null;
  createdByAdminId: string | null;
  approvedByAdminId: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TestimonialsListPayload = {
  items: TestimonialItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};

export type TestimonialsFilters = {
  page: number;
  limit: number;
  q: string;
  status?: TestimonialStatus;
  source?: TestimonialSource;
  featured?: boolean;
  courseId?: string;
};

export type TestimonialsState = {
  list: TestimonialsListPayload | null;
  selectedTestimonial: TestimonialItem | null;
  filters: TestimonialsFilters;
  loadingList: boolean;
  loadingDetail: boolean;
  mutating: boolean;
  error: string | null;
};

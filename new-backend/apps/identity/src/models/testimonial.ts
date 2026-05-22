import { Schema, model, models, Types, type HydratedDocument } from "mongoose";

export type TestimonialStatus = "pending" | "approved" | "rejected" | "hidden";
export type TestimonialSource = "user" | "admin";

export interface TestimonialDocument {
  userId?: Types.ObjectId;
  courseId?: Types.ObjectId;
  source: TestimonialSource;
  status: TestimonialStatus;
  featured: boolean;
  displayName: string;
  avatar?: string;
  roleLabel?: string;
  headline?: string;
  quote: string;
  rating: number;
  adminNotes?: string;
  rejectionReason?: string;
  featuredOrder?: number;
  createdByAdminId?: Types.ObjectId;
  approvedByAdminId?: Types.ObjectId;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type TestimonialRecord = HydratedDocument<TestimonialDocument>;

const testimonialSchema = new Schema<TestimonialDocument>(
  {
    userId: { type: Schema.Types.ObjectId, index: true },
    courseId: { type: Schema.Types.ObjectId, index: true },
    source: { type: String, enum: ["user", "admin"], default: "user", index: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "hidden"],
      default: "pending",
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    displayName: { type: String, required: true, maxlength: 120 },
    avatar: { type: String },
    roleLabel: { type: String, maxlength: 120 },
    headline: { type: String, maxlength: 160 },
    quote: { type: String, required: true, maxlength: 3000 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    adminNotes: { type: String, maxlength: 2000 },
    rejectionReason: { type: String, maxlength: 1000 },
    featuredOrder: { type: Number, min: 0 },
    createdByAdminId: { type: Schema.Types.ObjectId },
    approvedByAdminId: { type: Schema.Types.ObjectId },
    approvedAt: { type: Date },
  },
  { timestamps: true },
);

testimonialSchema.index({ status: 1, featured: 1, createdAt: -1 });

export const TestimonialModel =
  models.Testimonial || model<TestimonialDocument>("Testimonial", testimonialSchema);

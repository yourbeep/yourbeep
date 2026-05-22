import { Schema, model, models, Types } from "mongoose";

export interface CourseGameEntry {
  gameId: Types.ObjectId;
  weight: number;
}

export interface CourseFaqEntry {
  question: string;
  answer: string;
}

export interface CourseSectionEntry {
  key: string;
  title: string;
  description?: string;
  order: number;
}

export interface CourseTestimonialEntry {
  quote: string;
  name: string;
  role?: string;
  avatar?: string;
}

export interface CourseDocument {
  title: string;
  subtitle?: string;
  description: string;
  shortDescription?: string;
  thumbnail?: string;
  bannerImage?: string;
  overview?: string;
  trailerVideoId?: string;
  games: CourseGameEntry[];
  sections: CourseSectionEntry[];
  instructor?: {
    name: string;
    title?: string;
    bio?: string;
    avatar?: string;
  };
  durationMinutes?: number;
  estimatedDurationText?: string;
  difficultyLevel?: "beginner" | "intermediate" | "advanced";
  language?: string;
  certificateIncluded?: boolean;
  communityAccess?: boolean;
  whatYouWillLearn: string[];
  courseHighlights: string[];
  whoItsFor: string[];
  whoItsNotFor: string[];
  faq: CourseFaqEntry[];
  featuredTestimonial?: CourseTestimonialEntry;
  isSeeded: boolean;
  isActive: boolean;
  isPublished: boolean;
  createdBy: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const courseGameSchema = new Schema<CourseGameEntry>(
  {
    gameId: { type: Schema.Types.ObjectId, ref: "Game", required: true },
    weight: { type: Number, required: true, min: 1, max: 100 },
  },
  { _id: false },
);

const courseFaqSchema = new Schema<CourseFaqEntry>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false },
);

const courseSectionSchema = new Schema<CourseSectionEntry>(
  {
    key: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    order: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const courseTestimonialSchema = new Schema<CourseTestimonialEntry>(
  {
    quote: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String },
    avatar: { type: String },
  },
  { _id: false },
);

const courseSchema = new Schema<CourseDocument>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String, required: true },
    shortDescription: { type: String },
    thumbnail: { type: String },
    bannerImage: { type: String },
    overview: { type: String },
    trailerVideoId: { type: String },
    games: { type: [courseGameSchema], default: [] },
    sections: { type: [courseSectionSchema], default: [] },
    instructor: {
      name: { type: String },
      title: { type: String },
      bio: { type: String },
      avatar: { type: String },
    },
    durationMinutes: { type: Number },
    estimatedDurationText: { type: String },
    difficultyLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    language: { type: String },
    certificateIncluded: { type: Boolean, default: false },
    communityAccess: { type: Boolean, default: false },
    whatYouWillLearn: { type: [String], default: [] },
    courseHighlights: { type: [String], default: [] },
    whoItsFor: { type: [String], default: [] },
    whoItsNotFor: { type: [String], default: [] },
    faq: { type: [courseFaqSchema], default: [] },
    featuredTestimonial: { type: courseTestimonialSchema, required: false },
    isSeeded: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
  },
);

export const CourseModel = models.Course || model<CourseDocument>("Course", courseSchema);

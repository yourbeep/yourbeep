import { Schema, model, models, Types } from "mongoose";

export interface ContentItemDocument {
  courseId: Types.ObjectId;
  type: "video" | "game";
  refId: Types.ObjectId;
  sectionKey: string;
  order: number;
  title: string;
  description?: string;
  durationMinutes?: number;
  isFree: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const contentItemSchema = new Schema<ContentItemDocument>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    type: { type: String, enum: ["video", "game"], required: true },
    refId: { type: Schema.Types.ObjectId, required: true },
    sectionKey: { type: String, required: true, default: "general", index: true },
    order: { type: Number, required: true, min: 1 },
    title: { type: String, required: true },
    description: { type: String },
    durationMinutes: { type: Number, min: 0 },
    isFree: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

contentItemSchema.index({ courseId: 1, sectionKey: 1, order: 1 }, { unique: true });

export const ContentItemModel =
  models.ContentItem || model<ContentItemDocument>("ContentItem", contentItemSchema);

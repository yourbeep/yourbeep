import { Schema, model, models, Types } from "mongoose";

export interface VideoDocument {
  courseId?: Types.ObjectId | null;
  title: string;
  description?: string;
  bunnyVideoId: string;
  bunnyLibraryId: string;
  durationSeconds?: number;
  thumbnailUrl?: string;
  order: number;
  isMasterCourse: boolean;
  isActive: boolean;
  uploadedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const videoSchema = new Schema<VideoDocument>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", default: null, index: true },
    title: { type: String, required: true },
    description: { type: String },
    bunnyVideoId: { type: String, required: true, unique: true, index: true },
    bunnyLibraryId: { type: String, required: true },
    durationSeconds: { type: Number },
    thumbnailUrl: { type: String },
    order: { type: Number, required: true, min: 1 },
    isMasterCourse: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: false },
    uploadedBy: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true },
);

export const VideoModel = models.Video || model<VideoDocument>("Video", videoSchema);

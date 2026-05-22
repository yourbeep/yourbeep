import { Types } from "mongoose";
import { Schema, model, models } from "mongoose";

export interface MasterCourseVideoDocument {
  title: string;
  description?: string;
  videoId?: Types.ObjectId;
  videoUrl?: string;
  bunnyVideoId?: string;
  durationSeconds?: number;
  thumbnail?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const masterCourseVideoSchema = new Schema<MasterCourseVideoDocument>(
  {
    title: { type: String, required: true },
    description: { type: String },
    videoId: { type: Schema.Types.ObjectId, ref: "Video" },
    videoUrl: { type: String },
    bunnyVideoId: { type: String },
    durationSeconds: { type: Number },
    thumbnail: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

export const MasterCourseVideoModel =
  models.MasterCourseVideo || model<MasterCourseVideoDocument>("MasterCourseVideo", masterCourseVideoSchema);

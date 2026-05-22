import { Schema, model, models, Types } from "mongoose";

export interface VideoCueDocument {
  courseId: Types.ObjectId;
  videoId: Types.ObjectId;
  gameId: Types.ObjectId;
  subActivityKey?: string;
  triggerAtSeconds: number;
  title?: string;
  description?: string;
  ctaLabel?: string;
  pauseVideo: boolean;
  isSkippable: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const videoCueSchema = new Schema<VideoCueDocument>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    videoId: { type: Schema.Types.ObjectId, ref: "Video", required: true, index: true },
    gameId: { type: Schema.Types.ObjectId, ref: "Game", required: true, index: true },
    subActivityKey: { type: String, maxlength: 120 },
    triggerAtSeconds: { type: Number, required: true, min: 0 },
    title: { type: String, maxlength: 160 },
    description: { type: String, maxlength: 500 },
    ctaLabel: { type: String, maxlength: 80 },
    pauseVideo: { type: Boolean, default: true },
    isSkippable: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

videoCueSchema.index({ videoId: 1, triggerAtSeconds: 1 });

export const VideoCueModel = models.VideoCue || model<VideoCueDocument>("VideoCue", videoCueSchema);

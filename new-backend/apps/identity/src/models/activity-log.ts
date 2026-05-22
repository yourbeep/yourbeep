import { Schema, model, models, Types } from "mongoose";

export interface ActivityLogDocument {
  userId: Types.ObjectId;
  courseId?: Types.ObjectId;
  gameKey?: string;
  type: "game_submission" | "video_watch" | "course_progress";
  title: string;
  metadata?: Record<string, unknown>;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const activityLogSchema = new Schema<ActivityLogDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, index: true },
    gameKey: { type: String, index: true },
    type: {
      type: String,
      enum: ["game_submission", "video_watch", "course_progress"],
      required: true,
    },
    title: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
    completedAt: { type: Date, required: true, index: true },
  },
  { timestamps: true },
);

activityLogSchema.index({ userId: 1, completedAt: -1 });

export const ActivityLogModel =
  models.ActivityLog || model<ActivityLogDocument>("ActivityLog", activityLogSchema);

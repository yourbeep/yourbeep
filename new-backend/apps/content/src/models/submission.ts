import { Schema, model, models, Types } from "mongoose";

export interface SubmissionDocument {
  userId: Types.ObjectId;
  gameId: Types.ObjectId;
  courseId: Types.ObjectId;
  type: "awareness_states" | "somatic_states" | "pattern_awareness" | "reflect_act";
  payload: Record<string, unknown>;
  score: number;
  resultData?: Record<string, unknown>;
  isComplete: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const submissionSchema = new Schema<SubmissionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    gameId: { type: Schema.Types.ObjectId, required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, required: true, index: true },
    type: {
      type: String,
      enum: ["awareness_states", "somatic_states", "pattern_awareness", "reflect_act"],
      required: true,
    },
    payload: { type: Schema.Types.Mixed, required: true },
    score: { type: Number, required: true, min: 1, max: 3 },
    resultData: { type: Schema.Types.Mixed },
    isComplete: { type: Boolean, default: true },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

submissionSchema.index({ userId: 1, courseId: 1, gameId: 1, createdAt: -1 });

export const SubmissionModel =
  models.Submission || model<SubmissionDocument>("Submission", submissionSchema);

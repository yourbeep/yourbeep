import { Schema, model, models, Types } from "mongoose";

export interface CommentDocument {
  targetType: "course" | "content_item";
  courseId: Types.ObjectId;
  contentItemId?: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  userAvatar?: string;
  body: string;
  parentCommentId?: Types.ObjectId;
  isEdited: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<CommentDocument>(
  {
    targetType: { type: String, enum: ["course", "content_item"], required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    contentItemId: { type: Schema.Types.ObjectId, ref: "ContentItem", index: true },
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    body: { type: String, required: true, maxlength: 2000 },
    parentCommentId: { type: Schema.Types.ObjectId, ref: "Comment", index: true },
    isEdited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

commentSchema.index({ courseId: 1, createdAt: -1 });
commentSchema.index({ contentItemId: 1, createdAt: -1 });
commentSchema.index({ parentCommentId: 1, createdAt: 1 });

export const CommentModel = models.Comment || model<CommentDocument>("Comment", commentSchema);

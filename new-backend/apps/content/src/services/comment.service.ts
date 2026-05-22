import { AppError, env, httpJson } from "@yourbeep/shared";
import { Types } from "mongoose";
import { CommentModel } from "../models/comment";
import { ContentItemModel } from "../models/content-item";
import { CourseModel } from "../models/course";
import type { z } from "zod";
import { createCommentSchema, listCommentsQuerySchema } from "../validators";

type CreateCommentInput = z.infer<typeof createCommentSchema>;
type ListCommentsQuery = z.infer<typeof listCommentsQuerySchema>;

const internalHeaders = () => ({
  "x-internal-service-key": env.INTERNAL_SERVICE_SECRET,
});

const verifyPaidAccess = async (userId: string, courseId: string) => {
  const response = await httpJson<{ success: boolean; data: { hasAccess: boolean } }>(
    `${env.COMMERCE_URL}/internal/purchases/${userId}/${courseId}`,
    {
      method: "GET",
      headers: internalHeaders(),
    },
  );

  if (!response.data.hasAccess) {
    throw new AppError("User has not purchased this course", 403, "COURSE_NOT_PURCHASED");
  }
};

const getUserSnapshot = async (userId: string) => {
  const response = await httpJson<{
    success: boolean;
    data: {
      user: {
        _id: string;
        name: string;
        avatar?: string;
      };
    };
  }>(`${env.IDENTITY_URL}/internal/users/${userId}`, {
    method: "GET",
    headers: internalHeaders(),
  });

  return response.data.user;
};

const formatComment = (comment: any, replies: any[] = []) => ({
  _id: comment._id,
  targetType: comment.targetType,
  courseId: comment.courseId,
  contentItemId: comment.contentItemId ?? null,
  body: comment.isDeleted ? null : comment.body,
  isDeleted: comment.isDeleted,
  isEdited: comment.isEdited,
  parentCommentId: comment.parentCommentId ?? null,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
  author: {
    userId: comment.userId,
    name: comment.userName,
    avatar: comment.userAvatar ?? null,
  },
  replies,
  replyCount: replies.length,
});

const ensureCourseExists = async (courseId: string) => {
  const course = await CourseModel.findOne({ _id: new Types.ObjectId(courseId), isActive: true });
  if (!course) {
    throw new AppError("Course not found", 404, "NOT_FOUND");
  }
  return course;
};

const ensureContentItemExists = async (itemId: string) => {
  const contentItem = await ContentItemModel.findOne({
    _id: new Types.ObjectId(itemId),
    isActive: true,
  });
  if (!contentItem) {
    throw new AppError("Content item not found", 404, "NOT_FOUND");
  }
  return contentItem;
};

const ensureReplyParent = async (
  parentCommentId: string,
  targetType: "course" | "content_item",
  courseId: string,
  contentItemId?: string,
) => {
  const parent = await CommentModel.findOne({
    _id: new Types.ObjectId(parentCommentId),
    targetType,
    courseId: new Types.ObjectId(courseId),
    ...(contentItemId ? { contentItemId: new Types.ObjectId(contentItemId) } : { contentItemId: { $exists: false } }),
  });

  if (!parent) {
    throw new AppError("Parent comment not found", 404, "NOT_FOUND");
  }

  if (parent.parentCommentId) {
    throw new AppError("Replies to replies are not supported", 422, "VALIDATION_ERROR");
  }

  return parent;
};

const listTargetComments = async (
  filter: Record<string, unknown>,
  query: ListCommentsQuery,
) => {
  const skip = (query.page - 1) * query.limit;
  const [parents, total] = await Promise.all([
    CommentModel.find({
      ...filter,
      parentCommentId: { $exists: false },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(query.limit),
    CommentModel.countDocuments({
      ...filter,
      parentCommentId: { $exists: false },
    }),
  ]);

  const parentIds = parents.map((comment) => comment._id);
  const replies = parentIds.length
    ? await CommentModel.find({ parentCommentId: { $in: parentIds } }).sort({ createdAt: 1 })
    : [];

  const repliesByParent = new Map<string, any[]>();
  for (const reply of replies) {
    const key = String(reply.parentCommentId);
    const group = repliesByParent.get(key) ?? [];
    group.push(formatComment(reply));
    repliesByParent.set(key, group);
  }

  return {
    items: parents.map((comment) => formatComment(comment, repliesByParent.get(String(comment._id)) ?? [])),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
    },
  };
};

export const listCourseComments = async (courseId: string, query: ListCommentsQuery) => {
  await ensureCourseExists(courseId);
  return listTargetComments({ targetType: "course", courseId: new Types.ObjectId(courseId) }, query);
};

export const createCourseComment = async (userId: string, courseId: string, payload: CreateCommentInput) => {
  await ensureCourseExists(courseId);
  await verifyPaidAccess(userId, courseId);
  if (payload.parentCommentId) {
    await ensureReplyParent(payload.parentCommentId, "course", courseId);
  }

  const user = await getUserSnapshot(userId);
  const comment = await CommentModel.create({
    targetType: "course",
    courseId: new Types.ObjectId(courseId),
    userId: new Types.ObjectId(userId),
    userName: user.name,
    userAvatar: user.avatar,
    body: payload.body.trim(),
    parentCommentId: payload.parentCommentId ? new Types.ObjectId(payload.parentCommentId) : undefined,
  });

  return formatComment(comment);
};

export const listContentItemComments = async (itemId: string, query: ListCommentsQuery) => {
  const contentItem = await ensureContentItemExists(itemId);
  return listTargetComments(
    {
      targetType: "content_item",
      courseId: contentItem.courseId,
      contentItemId: contentItem._id,
    },
    query,
  );
};

export const createContentItemComment = async (
  userId: string,
  itemId: string,
  payload: CreateCommentInput,
) => {
  const contentItem = await ensureContentItemExists(itemId);
  await verifyPaidAccess(userId, String(contentItem.courseId));
  if (payload.parentCommentId) {
    await ensureReplyParent(payload.parentCommentId, "content_item", String(contentItem.courseId), itemId);
  }

  const user = await getUserSnapshot(userId);
  const comment = await CommentModel.create({
    targetType: "content_item",
    courseId: contentItem.courseId,
    contentItemId: contentItem._id,
    userId: new Types.ObjectId(userId),
    userName: user.name,
    userAvatar: user.avatar,
    body: payload.body.trim(),
    parentCommentId: payload.parentCommentId ? new Types.ObjectId(payload.parentCommentId) : undefined,
  });

  return formatComment(comment);
};

export const adminDeleteComment = async (commentId: string) => {
  const comment = await CommentModel.findById(commentId);
  if (!comment) {
    throw new AppError("Comment not found", 404, "NOT_FOUND");
  }

  comment.isDeleted = true;
  comment.deletedAt = new Date();
  comment.body = "[removed by admin]";
  await comment.save();

  return { deleted: true, commentId: comment.id };
};

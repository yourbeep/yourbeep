import { apiRequest } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import {
  CommentListResponse,
  CommentMutationResponse,
  CourseContentResponse,
  CourseDetailResponse,
  CourseListResponse,
  CoursePricingResponse,
  MasterCourseResponse,
  VideoCueListResponse,
  VideoStreamResponse,
} from '@/lib/api/types';

export function fetchCourses() {
  return apiRequest<CourseListResponse>(apiEndpoints.content.courses);
}

export function fetchCourseDetail(courseId: string) {
  return apiRequest<CourseDetailResponse>(apiEndpoints.content.courseDetail(courseId));
}

export function fetchCourseContent(courseId: string) {
  return apiRequest<CourseContentResponse>(apiEndpoints.content.courseContent(courseId));
}

export function fetchCourseComments(courseId: string) {
  return apiRequest<CommentListResponse>(apiEndpoints.content.courseComments(courseId));
}

export function createCourseComment(courseId: string, content: string, parentCommentId?: string) {
  return apiRequest<CommentMutationResponse>(apiEndpoints.content.courseComments(courseId), {
    body: { content, parentCommentId },
    method: 'POST',
  });
}

export function fetchContentComments(contentItemId: string) {
  return apiRequest<CommentListResponse>(apiEndpoints.content.contentComments(contentItemId));
}

export function createContentComment(contentItemId: string, content: string, parentCommentId?: string) {
  return apiRequest<CommentMutationResponse>(apiEndpoints.content.contentComments(contentItemId), {
    body: { content, parentCommentId },
    method: 'POST',
  });
}

export function fetchMasterCourse() {
  return apiRequest<MasterCourseResponse>(apiEndpoints.content.masterCourse);
}

export function fetchMasterCourseStream() {
  return apiRequest<VideoStreamResponse>(apiEndpoints.content.masterCourseStream);
}

export function fetchCoursePrice(courseId: string) {
  return apiRequest<CoursePricingResponse>(apiEndpoints.content.coursePrice(courseId));
}

export function fetchCoursePriceForRegion(courseId: string, region: string) {
  return apiRequest<CoursePricingResponse>(apiEndpoints.content.coursePriceForRegion(courseId, region));
}

export function fetchCourseVideoStream(courseId: string, videoId: string) {
  return apiRequest<VideoStreamResponse>(apiEndpoints.content.courseVideoStream(courseId, videoId));
}

export function fetchVideoCues(videoId: string) {
  return apiRequest<VideoCueListResponse>(apiEndpoints.content.videoCues(videoId));
}

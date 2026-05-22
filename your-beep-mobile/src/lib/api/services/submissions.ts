import { apiRequest } from '../client';
import { apiEndpoints } from '../endpoints';

import type {
  CourseSubmissionsResponse,
  GameActivityDetailResponse,
  GameResultResponse,
  RecordCourseVideoWatchInput,
  SubmissionDetailResponse,
  SubmitGameInput,
} from '../types';

export const submitGame = (gameId: string, payload: SubmitGameInput) =>
  apiRequest<{ submission: Record<string, unknown> }>(
    apiEndpoints.content.gameSubmit(gameId),
    {
      body: payload,
      method: 'POST',
    },
  );

export const fetchGameResult = (gameId: string) =>
  apiRequest<Record<string, unknown> | GameResultResponse>(apiEndpoints.content.gameResult(gameId));

export const fetchGameActivity = (gameId: string, activityKey: string) =>
  apiRequest<GameActivityDetailResponse>(apiEndpoints.content.gameActivity(gameId, activityKey));

export const fetchCourseSubmissions = (courseId: string) =>
  apiRequest<CourseSubmissionsResponse>(apiEndpoints.content.courseSubmissions(courseId));

export const fetchSubmissionDetail = (submissionId: string) =>
  apiRequest<SubmissionDetailResponse>(apiEndpoints.content.submissionDetail(submissionId));

export const recordCourseVideoWatch = (
  courseId: string,
  videoId: string,
  payload: RecordCourseVideoWatchInput,
) =>
  apiRequest<{ recorded: boolean }>(apiEndpoints.content.courseVideoWatchEvent(courseId, videoId), {
    body: payload,
    method: 'POST',
  });

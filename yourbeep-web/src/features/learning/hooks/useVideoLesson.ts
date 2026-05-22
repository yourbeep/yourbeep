import { useEffect, useMemo, useRef, useState } from "react";
import { getApiErrorMessage } from "@utils/apiError";
import { learningApi } from "../services/learningApi";
import type { CourseContentData, VideoStreamData } from "../services/learningTypes";

export const useVideoLesson = (
  courseId?: string,
  videoId?: string,
  contentItemId?: string,
) => {
  const [stream, setStream] = useState<VideoStreamData | null>(null);
  const [content, setContent] = useState<CourseContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastSavedSecondRef = useRef(0);

  useEffect(() => {
    if (!courseId || !videoId) {
      setLoading(false);
      setError("Video not found.");
      return;
    }

    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const [streamResponse, contentResponse] = await Promise.all([
          learningApi.getVideoStream(courseId, videoId),
          learningApi.getCourseContent(courseId),
        ]);

        if (active) {
          setStream(streamResponse);
          setContent(contentResponse);
        }
      } catch (err) {
        if (active) {
          setError(
            getApiErrorMessage(err, "Unable to load this lesson right now."),
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [courseId, videoId]);

  useEffect(() => {
    return () => {
      if (!courseId || !videoId || !videoRef.current) return;

      const video = videoRef.current;
      const watchedSeconds = Math.floor(video.currentTime || 0);
      const completed =
        Boolean(video.duration) && video.duration > 0
          ? watchedSeconds / video.duration >= 0.95
          : false;

      if (watchedSeconds <= 0 || watchedSeconds === lastSavedSecondRef.current) {
        return;
      }

      lastSavedSecondRef.current = watchedSeconds;

      void learningApi.recordWatchEvent(courseId, videoId, {
        watchedSeconds,
        positionSeconds: watchedSeconds,
        contentItemId,
        completed,
      });
    };
  }, [contentItemId, courseId, videoId]);

  const activeItem = useMemo(() => {
    if (!content || !videoId) return null;
    return (
      content.contentItems.find(
        (item) => item.videoId === videoId || item.refId === videoId || item.id === contentItemId,
      ) ?? null
    );
  }, [content, contentItemId, videoId]);

  return {
    stream,
    content,
    activeItem,
    videoRef,
    loading,
    error,
  };
};

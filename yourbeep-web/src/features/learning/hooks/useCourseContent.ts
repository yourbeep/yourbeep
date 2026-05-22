import { useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "@utils/apiError";
import { learningApi } from "../services/learningApi";
import type { CourseContentData } from "../services/learningTypes";

export const useCourseContent = (courseId?: string) => {
  const [content, setContent] = useState<CourseContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      setError("Course not found.");
      return;
    }

    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await learningApi.getCourseContent(courseId);
        if (active) {
          setContent(response);
        }
      } catch (err) {
        if (active) {
          setError(
            getApiErrorMessage(err, "Unable to load your course content right now."),
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
  }, [courseId]);

  const firstVideo = useMemo(
    () => content?.contentItems.find((item) => item.type === "video" && item.videoId) ?? null,
    [content],
  );

  return {
    content,
    firstVideo,
    loading,
    error,
  };
};

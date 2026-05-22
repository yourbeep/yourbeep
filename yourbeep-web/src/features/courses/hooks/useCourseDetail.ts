import { useEffect, useState } from "react";
import { getApiErrorMessage } from "@utils/apiError";
import { courseApi } from "../services/courseApi";
import type { CourseDetailPageData, CourseTrailerStream } from "../services/courseTypes";

export const useCourseDetail = (courseId: string | undefined) => {
  const [course, setCourse] = useState<CourseDetailPageData | null>(null);
  const [trailer, setTrailer] = useState<CourseTrailerStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!courseId) {
      setError("Course not found.");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const item = await courseApi.getCourseDetail(courseId);
        if (!active) return;
        setCourse(item);

        if (item.trailerVideoId) {
          try {
            const trailerData = await courseApi.getCourseTrailerStream(courseId);
            if (!active) return;
            setTrailer(trailerData);
          } catch {
            if (!active) return;
            setTrailer(null);
          }
        } else {
          setTrailer(null);
        }
      } catch (loadError) {
        if (!active) return;
        setError(
          getApiErrorMessage(loadError, "Unable to load course details."),
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [courseId]);

  return { course, trailer, loading, error };
};

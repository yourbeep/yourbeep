import { useEffect, useState } from "react";
import { getApiErrorMessage } from "@utils/apiError";
import { courseApi } from "../services/courseApi";
import type { CourseCardItem } from "../services/courseTypes";

export const useCourseLibrary = () => {
  const [courses, setCourses] = useState<CourseCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const items = await courseApi.getCourseLibrary();
        if (!active) return;
        setCourses(items);
      } catch (loadError) {
        if (!active) return;
        setError(getApiErrorMessage(loadError, "Unable to load courses."));
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  return { courses, loading, error };
};

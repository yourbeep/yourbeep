import { useEffect } from "react";
import { BookOpenText } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchAdminCourses } from "../../../store/slices/courses";
import CoursesOverviewCards from "../components/CoursesOverviewCards";
import CoursesPageSkeleton from "../components/CoursesPageSkeleton";
import CoursesTable from "../components/CoursesTable";

export default function CoursesPage() {
  const dispatch = useAppDispatch();
  const { courses, hasLoadedCourses, loadingCourses, error } = useAppSelector(
    (state) => state.courses,
  );

  useEffect(() => {
    if (!hasLoadedCourses && !loadingCourses) {
      dispatch(fetchAdminCourses());
    }
  }, [dispatch, hasLoadedCourses, loadingCourses]);

  if (loadingCourses && !courses.length) {
    return <CoursesPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#e8eadf] bg-white p-6 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d9e7d2] bg-[#f4f9ef] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3b6b47]">
            <BookOpenText className="h-3.5 w-3.5" />
            Course Library
          </div>
          <h1 className="mt-4 text-[28px] font-bold tracking-tight text-gray-900">
            Review drafts, published courses, and archived learning products
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Keep the course catalog organized with a clear view of course status,
            activity composition, publishing progress, and last updated content.
          </p>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-[#f3e2b4] bg-[#fff9ea] px-4 py-3 text-sm text-[#9a7a19]">
          Courses could not be refreshed completely: {error}
        </div>
      ) : null}

      <CoursesOverviewCards courses={courses} loading={loadingCourses && !courses.length} />
      <CoursesTable courses={courses} loading={loadingCourses && !courses.length} />
    </div>
  );
}

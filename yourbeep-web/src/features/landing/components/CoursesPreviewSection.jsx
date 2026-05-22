import { useNavigate } from "react-router-dom";
import { appRoutes } from "@constants/routes";
import { useCourseLibrary } from "@features/courses/hooks/useCourseLibrary";
import { useAppSelector } from "@store";

const CoursePreviewSkeleton = () => (
  <article className="overflow-hidden rounded-[24px] bg-white shadow-sm">
    <div className="h-[210px] animate-pulse bg-[#e8e4da]" />
    <div className="space-y-3 p-5">
      <div className="h-3 w-24 animate-pulse rounded bg-[#eceae4]" />
      <div className="h-6 w-3/4 animate-pulse rounded bg-[#eceae4]" />
      <div className="h-4 w-1/3 animate-pulse rounded bg-[#eceae4]" />
    </div>
  </article>
);

const CoursesPreviewSection = () => {
  const navigate = useNavigate();
  const { courses, loading, error } = useCourseLibrary();
  const { user, token } = useAppSelector((state) => state.auth);
  const isAuthenticated = Boolean(user && token);

  const handleCourseClick = (courseId) => {
    if (!isAuthenticated) {
      navigate(`${appRoutes.auth}?tab=signin`);
      return;
    }

    navigate(appRoutes.courseDetail(courseId));
  };

  return (
    <section id="courses" className="bg-[#eeeae0] px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-[1320px]">
        <div className="rounded-[20px] bg-gradient-to-r from-[#1a3a44] via-[#2a6878] to-[#3a9898] px-6 py-4">
          <span className="text-lg font-bold tracking-tight text-white md:text-[20px]">
            Courses
          </span>
        </div>

        <h2 className="mt-8 text-2xl font-bold text-[var(--accent)] md:text-[32px]">
          Step Into Clarity
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-7 text-[#5a6a6a]">
          Simple practices that reveal how you think and feel, so you can
          respond with intention.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {loading ? (
            <>
              <CoursePreviewSkeleton />
              <CoursePreviewSkeleton />
            </>
          ) : error ? (
            <p className="text-sm text-[#5a6a6a] sm:col-span-2 lg:col-span-3">{error}</p>
          ) : courses.length ? (
            courses.map((course) => (
              <button
                key={course.id}
                type="button"
                onClick={() => handleCourseClick(course.id)}
                className="overflow-hidden rounded-[24px] bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="h-[210px] overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9aacac]">
                      {course.subtitle || "Guided course"}
                    </span>
                    <span className="text-xs text-[#b0c0c0]">
                      {course.gamesCount > 0
                        ? `${course.gamesCount} game${course.gamesCount === 1 ? "" : "s"}`
                        : course.durationMinutes > 0
                          ? `${course.durationMinutes} min`
                          : "Self-paced"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text)]">{course.title}</h3>
                  {course.instructor?.name ? (
                    <p className="mt-1 text-sm text-[#8a9a9a]">with {course.instructor.name}</p>
                  ) : null}
                  <div className="mt-5 flex items-center gap-3">
                    <span className="text-xs font-semibold tracking-wide text-[var(--text)]">
                      LEARN MORE
                    </span>
                    <div className="h-px flex-1 rounded bg-[var(--text)]" />
                  </div>
                </div>
              </button>
            ))
          ) : (
            <p className="text-sm text-[#5a6a6a] sm:col-span-2 lg:col-span-3">
              Courses will appear here once they are published.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CoursesPreviewSection;

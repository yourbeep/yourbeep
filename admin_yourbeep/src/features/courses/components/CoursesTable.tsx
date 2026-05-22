import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";
import { StatusPill } from "../../../components/ui/StatusPill";
import type { AdminCourse } from "../../../store/slices/courses";

const statusVariant = {
  published: "success",
  draft: "warning",
  archived: "muted",
} as const;

const getStatus = (course: AdminCourse) => {
  if (!course.isActive) {
    return "archived";
  }
  return course.isPublished ? "published" : "draft";
};

type CoursesTableProps = {
  courses: AdminCourse[];
  loading?: boolean;
};

function CourseRowSkeleton() {
  return (
    <tr className="border-t border-gray-100">
      {Array.from({ length: 7 }).map((_, index) => (
        <td key={index} className="px-6 py-4">
          <ShimmerBlock
            className={`h-4 ${
              index === 0 ? "w-full max-w-[220px]" : "w-full max-w-[110px]"
            }`}
          />
          {index === 0 ? <ShimmerBlock className="mt-2 h-3 w-32" /> : null}
        </td>
      ))}
    </tr>
  );
}

export default function CoursesTable({
  courses,
  loading = false,
}: CoursesTableProps) {
  return (
    <section className="rounded-[28px] border border-[#e7eadf] bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="mb-1 text-lg font-bold text-gray-900">
            Course Inventory
          </h2>
          <p className="text-sm text-gray-500">
            Manage drafts, live courses, and archived records from one place.
          </p>
        </div>
        <Link
          to="/courses/create"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0B57D0] px-4 text-sm font-semibold text-white no-underline shadow-[0_8px_18px_rgba(11,87,208,0.22)] transition hover:bg-[#0948ad]"
        >
          Start a new course
          <MdArrowOutward className="text-base" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[#f9faf7] text-left">
              {[
                "Course",
                "Status",
                "Games",
                "Duration",
                "Instructor",
                "Last Updated",
                "Action",
              ].map((head) => (
                <th
                  key={head}
                  className="px-6 py-4 text-[11px] font-bold uppercase tracking-wide text-gray-500"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && !courses.length ? (
              Array.from({ length: 6 }).map((_, index) => (
                <CourseRowSkeleton key={index} />
              ))
            ) : courses.length ? (
              courses.map((course, index) => {
                const status = getStatus(course);
                return (
                  <motion.tr
                    key={course._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, delay: index * 0.02 }}
                    className="border-t border-gray-100 transition hover:bg-[#fcfcf7]"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {course.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {course.shortDescription || course.subtitle || course._id}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill
                        variant={statusVariant[status]}
                        className="capitalize"
                        dot
                      >
                        {status}
                      </StatusPill>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {course.games.length}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {course.durationMinutes ? `${course.durationMinutes} min` : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {course.instructor?.name || "Not set"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(course.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/courses/create?courseId=${course._id}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)] no-underline hover:text-[var(--primary-dark)]"
                      >
                        Manage
                        <MdArrowOutward className="text-base" />
                      </Link>
                    </td>
                  </motion.tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <p className="text-base font-semibold text-[#203321]">
                    No courses available yet
                  </p>
                  <p className="mt-2 text-sm text-[#72806e]">
                    Start a new course to build your first learning flow.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import {
  MdDrafts,
  MdOutlineAutoStories,
  MdOutlineSchedule,
  MdPublic,
} from "react-icons/md";
import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";
import type { AdminCourse } from "../../../store/slices/courses";

type CoursesOverviewCardsProps = {
  courses: AdminCourse[];
  loading?: boolean;
};

export default function CoursesOverviewCards({
  courses,
  loading = false,
}: CoursesOverviewCardsProps) {
  const totalCourses = courses.length;
  const publishedCourses = courses.filter(
    (course) => course.isPublished && course.isActive,
  ).length;
  const draftCourses = courses.filter(
    (course) => !course.isPublished && course.isActive,
  ).length;
  const archivedCourses = courses.filter((course) => !course.isActive).length;

  const stats = [
    {
      title: "Total Courses",
      value: totalCourses,
      note: "Current course inventory",
      icon: MdOutlineAutoStories,
    },
    {
      title: "Published",
      value: publishedCourses,
      note: "Visible to learners",
      icon: MdPublic,
    },
    {
      title: "Drafts",
      value: draftCourses,
      note: "Still being prepared",
      icon: MdOutlineSchedule,
    },
    {
      title: "Archived",
      value: archivedCourses,
      note: "Soft-deleted or disabled",
      icon: MdDrafts,
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ title, value, note, icon: Icon }, index) => (
        <motion.article
          key={title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.03 }}
          className="rounded-[24px] border border-[#e7eadf] bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
                {title}
              </p>
              {loading ? (
                <ShimmerBlock className="mt-3 h-9 w-20" />
              ) : (
                <p className="mt-2 text-[30px] font-bold tracking-tight text-gray-900">
                  {value}
                </p>
              )}
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]">
              <Icon className="text-[22px]" />
            </div>
          </div>
          {loading ? (
            <ShimmerBlock className="h-4 w-32" />
          ) : (
            <p className="text-sm text-gray-500">{note}</p>
          )}
        </motion.article>
      ))}
    </section>
  );
}

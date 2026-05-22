import { motion } from "framer-motion";
import { BookOpen, ListFilter, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainButton from "@components/ui/MainButton";
import MainInput from "@components/ui/MainInput";
import IconButton from "@components/ui/IconButton";
import showToast from "@utils/showToast";
import { appRoutes } from "@constants/routes";
import MainPageShell from "@features/main/components/MainPageShell";
import CourseCard from "../components/CourseCard";
import CoursesPageSkeleton from "../components/CoursesPageSkeleton";
import MasterclassRequestCard from "../components/MasterclassRequestCard";
import { useCourseLibrary } from "../hooks/useCourseLibrary";

const CoursesPage = () => {
  const navigate = useNavigate();
  const { courses, loading, error } = useCourseLibrary();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (error) {
      showToast({
        type: "error",
        message: "Unable to load courses",
        options: {
          description: error,
        },
      });
    }
  }, [error]);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return courses;

    return courses.filter((course) =>
      [course.title, course.description, course.subtitle]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [courses, search]);

  return (
    <MainPageShell activeItem="Courses">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.26 }}
        className="relative mb-8 overflow-hidden rounded-[32px] border border-[rgba(39,107,115,0.10)] bg-[linear-gradient(135deg,#f7f5ee_0%,#eef6f1_48%,#e0ece7_100%)] px-6 py-8 shadow-[0_24px_60px_rgba(39,107,115,0.08)] md:px-8 md:py-10"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-[rgba(39,107,115,0.10)] blur-3xl" />
          <div className="absolute right-0 top-0 h-full w-[42%] bg-[radial-gradient(circle_at_top_right,rgba(219,111,74,0.16),transparent_48%)]" />
          <div className="absolute bottom-[-20px] right-24 h-32 w-32 rounded-full bg-white/60 blur-3xl" />
        </div>

        <div className="relative z-[1] flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[720px]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#46727a] shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
              <Sparkles className="h-3.5 w-3.5" />
              YourBeep Learning Library
            </div>
            <h1 className="max-w-[760px] text-[2.5rem] font-bold leading-[1.02] tracking-[-0.05em] text-[#193039] md:text-[3.5rem]">
              Courses for deeper self-observation, emotional clarity, and
              lasting inner steadiness.
            </h1>
            <p className="mt-4 max-w-[620px] text-[0.96rem] leading-[1.8] text-[#5d7579] md:text-[1rem]">
              Explore guided pathways that combine reflective video lessons,
              grounded practices, and interactive activities to help you build a
              more stable relationship with your thoughts, feelings, and daily
              patterns.
            </p>
          </div>

          <div className="grid max-w-[340px] grid-cols-2 gap-3">
            <div className="rounded-[22px] border border-white/70 bg-white/78 px-4 py-4 shadow-[0_12px_24px_rgba(0,0,0,0.04)] backdrop-blur">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6f8788]">
                Available
              </p>
              <p className="text-[1.65rem] font-bold text-[#193039]">
                {courses.length}
              </p>
              <div className="mt-2 flex items-center gap-2 text-[12px] text-[#668084]">
                <BookOpen className="h-3.5 w-3.5" />
                Curated pathways
              </div>
            </div>
            <div className="rounded-[22px] border border-white/70 bg-white/78 px-4 py-4 shadow-[0_12px_24px_rgba(0,0,0,0.04)] backdrop-blur">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6f8788]">
                Access
              </p>
              <p className="text-[1.65rem] font-bold text-[#193039]">
                {courses.filter((course) => course.hasAccess).length}
              </p>
              <p className="mt-2 text-[12px] text-[#668084]">
                Ready to continue
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.26, delay: 0.04 }}
        className="mb-10 flex flex-col gap-4 rounded-[28px] border border-[rgba(39,107,115,0.10)] bg-white/90 px-5 py-5 shadow-[0_12px_32px_rgba(26,46,56,0.05)] md:flex-row md:items-center"
      >
        <MainInput
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by topic, mood, or course name"
          wrapperClassName="flex-1"
          inputClassName="rounded-full bg-[#f8fbfa]"
          endAdornment={<Search className="h-4 w-4 text-[var(--muted)]" />}
        />
        <div className="flex items-center gap-3">
          <IconButton
            type="button"
            icon={<ListFilter className="h-4 w-4" />}
            variant="outline"
            size="md"
            aria-label="Course filters"
          />
          <p className="text-[12px] font-medium text-[#6f8788]">
            {filteredCourses.length} course
            {filteredCourses.length === 1 ? "" : "s"} visible
          </p>
        </div>
      </motion.div>

      {loading && !courses.length ? <CoursesPageSkeleton /> : null}

      {!loading && error ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 rounded-2xl bg-white px-6 py-5 text-sm text-[#7a4545] shadow-sm"
        >
          {error}
        </motion.div>
      ) : null}

      {!loading && !error ? (
        <motion.div
          layout
          className="mb-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onContinue={(courseId) => navigate(appRoutes.courseLearn(courseId))}
              onBuy={(courseId) => navigate(appRoutes.coursePricing(courseId))}
              onInfo={(courseId) => navigate(appRoutes.courseDetail(courseId))}
            />
          ))}
        </motion.div>
      ) : null}

      {!loading && !error && !filteredCourses.length ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14 rounded-[28px] border border-[rgba(39,107,115,0.08)] bg-white px-7 py-10 text-center shadow-[0_14px_40px_rgba(26,46,56,0.05)]"
        >
          <h2 className="text-[1.35rem] font-semibold text-[#193039]">
            No courses match your search
          </h2>
          <p className="mx-auto mt-2 max-w-[440px] text-sm leading-7 text-[#6d8083]">
            Try a broader keyword or clear the search to browse the full
            collection of learning journeys.
          </p>
          <div className="mt-5">
            <MainButton variant="outline" onClick={() => setSearch("")}>
              Clear search
            </MainButton>
          </div>
        </motion.div>
      ) : null}

      <MasterclassRequestCard />
    </MainPageShell>
  );
};

export default CoursesPage;

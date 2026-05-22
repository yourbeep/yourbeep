import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock3,
  Globe,
  GraduationCap,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainButton from "@components/ui/MainButton";
import StatusPill from "@components/ui/StatusPill";
import showToast from "@utils/showToast";
import { appRoutes } from "@constants/routes";
import MainPageShell from "@features/main/components/MainPageShell";
import FaqAccordion from "../components/FaqAccordion";
import CourseDetailsPageSkeleton from "../components/CourseDetailsPageSkeleton";
import { useCourseDetail } from "../hooks/useCourseDetail";

const difficultyLabel: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const buildCourseCtaLabel = (
  hasAccess: boolean,
  annualAmount?: number,
  sixMonthAmount?: number,
  displayPrice?: string,
) => {
  if (hasAccess) {
    return "Continue course";
  }

  if (annualAmount) {
    return `Enroll now INR ${annualAmount}`;
  }

  if (sixMonthAmount) {
    return `Enroll now INR ${sixMonthAmount}`;
  }

  if (displayPrice) {
    return `Enroll now ${displayPrice}`;
  }

  return "Enroll now";
};

const buildPricingSummary = (
  annualAmount?: number,
  sixMonthAmount?: number,
  displayPrice?: string,
  region?: string,
) => {
  if (annualAmount) {
    return `Annual access from INR ${annualAmount}`;
  }

  if (sixMonthAmount) {
    return `6 month access from INR ${sixMonthAmount}`;
  }

  if (displayPrice) {
    return region ? `${displayPrice} in ${region}` : displayPrice;
  }

  return "Pricing updates are shared inside checkout.";
};

const CourseDetailsPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { course, trailer, loading, error } = useCourseDetail(courseId);

  useEffect(() => {
    if (error) {
      showToast({
        type: "error",
        message: "Unable to load course details",
        options: {
          description: error,
        },
      });
    }
  }, [error]);

  if (loading) {
    return (
      <MainPageShell activeItem="Courses">
        <CourseDetailsPageSkeleton />
      </MainPageShell>
    );
  }

  if (error || !course) {
    return (
      <MainPageShell activeItem="Courses">
        <div className="rounded-[28px] border border-[rgba(39,107,115,0.08)] bg-white px-8 py-16 text-center shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
          <p className="text-base font-semibold text-[#1a2e38]">
            We couldn&apos;t load this course.
          </p>
          <p className="mt-2 text-sm text-[#6c7a7a]">
            {error || "Course not found."}
          </p>
        </div>
      </MainPageShell>
    );
  }

  const heroImage = course.bannerImage || course.thumbnail;
  const ctaLabel = buildCourseCtaLabel(
    course.hasAccess,
    course.pricing.annualAmount,
    course.pricing.sixMonthAmount,
    course.pricing.displayPrice,
  );
  const pricingSummary = buildPricingSummary(
    course.pricing.annualAmount,
    course.pricing.sixMonthAmount,
    course.pricing.displayPrice,
    course.pricing.region,
  );
  const durationLabel =
    course.estimatedDurationText ||
    (course.durationMinutes ? `${course.durationMinutes} mins of guided material` : null);
  const extrasLabel = [
    course.certificateIncluded ? "Certificate included" : null,
    course.communityAccess ? "Community access" : null,
  ]
    .filter(Boolean)
    .join(" | ");

  return (
    <MainPageShell activeItem="Courses">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="relative overflow-hidden rounded-[36px] border border-[rgba(39,107,115,0.10)] bg-[#17353d] shadow-[0_28px_70px_rgba(19,53,61,0.22)]"
      >
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={course.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(14,28,33,0.92)_0%,rgba(14,28,33,0.72)_42%,rgba(14,28,33,0.36)_100%)]" />
        </div>

        <div className="relative z-[1] grid gap-8 px-6 py-8 md:px-8 md:py-10 xl:grid-cols-[minmax(0,1.12fr)_360px] xl:items-end">
          <div className="max-w-[780px]">
            <StatusPill tone="primary" className="mb-4 bg-white/12 text-white">
              Masterclass
            </StatusPill>
            <h1 className="max-w-[760px] text-[2.5rem] font-bold leading-[1.02] tracking-[-0.05em] text-white md:text-[4rem]">
              {course.title}
            </h1>
            {course.subtitle ? (
              <p className="mt-3 text-[0.95rem] font-medium uppercase tracking-[0.18em] text-white/60">
                {course.subtitle}
              </p>
            ) : null}
            <p className="mt-4 max-w-[660px] text-[1rem] leading-[1.85] text-white/76">
              {course.overview || course.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {durationLabel ? (
                <StatusPill tone="muted" className="bg-white/10 text-white/82">
                  {durationLabel}
                </StatusPill>
              ) : null}
              {course.difficultyLevel ? (
                <StatusPill tone="muted" className="bg-white/10 text-white/82">
                  {difficultyLabel[course.difficultyLevel] || course.difficultyLevel}
                </StatusPill>
              ) : null}
              {course.language ? (
                <StatusPill tone="muted" className="bg-white/10 text-white/82">
                  {course.language}
                </StatusPill>
              ) : null}
              <StatusPill
                tone={course.hasAccess ? "success" : "warning"}
                className={
                  course.hasAccess
                    ? "bg-[#dff4e7] text-[#245f42]"
                    : "bg-[#fbefdb] text-[#8b5b15]"
                }
              >
                {course.hasAccess ? "Access unlocked" : "Purchase required"}
              </StatusPill>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <MainButton
                onClick={() =>
                  navigate(
                    course.hasAccess
                      ? appRoutes.courseLearn(course.id)
                      : appRoutes.coursePricing(course.id),
                  )
                }
                headIcon={<PlayCircle className="h-4 w-4" />}
                tailIcon={<ArrowRight className="h-4 w-4" />}
              >
                {ctaLabel}
              </MainButton>
              <MainButton
                variant="outline"
                onClick={() => navigate(appRoutes.courses)}
              >
                Back to library
              </MainButton>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/10 p-5 text-white backdrop-blur-md">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
              Snapshot
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-[20px] bg-white/10 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
                  Lessons
                </p>
                <p className="mt-2 text-[1.75rem] font-bold">{course.lessonCount}</p>
              </div>
              <div className="rounded-[20px] bg-white/10 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
                  Practices
                </p>
                <p className="mt-2 text-[1.75rem] font-bold">{course.practiceCount}</p>
              </div>
              <div className="rounded-[20px] bg-white/10 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
                  Games
                </p>
                <p className="mt-2 text-[1.75rem] font-bold">{course.gamesCount}</p>
              </div>
              <div className="rounded-[20px] bg-white/10 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
                  Progress
                </p>
                <p className="mt-2 text-[1.75rem] font-bold">{course.progressPercent}%</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          {course.description && course.description !== course.overview ? (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: 0.03 }}
              className="rounded-[32px] border border-[rgba(39,107,115,0.08)] bg-white p-6 shadow-[0_14px_36px_rgba(17,24,39,0.05)]"
            >
              <StatusPill tone="muted" className="mb-3 gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Why this course exists
              </StatusPill>
              <p className="max-w-[760px] text-[0.98rem] leading-8 text-[#556a6e]">
                {course.description}
              </p>
            </motion.section>
          ) : null}

          {trailer?.streamUrl ? (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: 0.06 }}
              className="rounded-[32px] border border-[rgba(39,107,115,0.08)] bg-white p-6 shadow-[0_14px_36px_rgba(17,24,39,0.05)]"
            >
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <StatusPill tone="primary" className="mb-3 gap-1.5">
                    <PlayCircle className="h-3.5 w-3.5" />
                    Course trailer
                  </StatusPill>
                  <h2 className="text-[2rem] font-bold tracking-[-0.04em] text-[#1a2e38]">
                    Preview the journey before you begin
                  </h2>
                </div>
                <div className="text-right text-xs text-[#72806e]">
                  {trailer.durationSeconds
                    ? `${Math.ceil(trailer.durationSeconds / 60)} mins`
                    : "Trailer"}
                </div>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-[#e5ece8] bg-[#071319]">
                <video
                  controls
                  preload="metadata"
                  poster={trailer.thumbnailUrl || undefined}
                  src={trailer.streamUrl}
                  className="aspect-video w-full bg-black object-contain"
                />
              </div>
            </motion.section>
          ) : null}

          {course.whatYouWillLearn.length ? (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: 0.08 }}
              className="rounded-[32px] border border-[rgba(39,107,115,0.08)] bg-white p-6 shadow-[0_14px_36px_rgba(17,24,39,0.05)]"
            >
              <div className="mb-5">
                <StatusPill tone="primary" className="mb-3 gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  What you will learn
                </StatusPill>
                <h2 className="text-[2rem] font-bold tracking-[-0.04em] text-[#1a2e38]">
                  The capabilities this course is designed to build
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {course.whatYouWillLearn.map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-[#e5ece8] bg-[#f8fbfa] p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-[var(--primary-soft)] p-2 text-[var(--primary)]">
                        <Check className="h-4 w-4" />
                      </div>
                      <p className="text-sm leading-7 text-[#556a6e]">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          ) : null}

          {course.contentPreview?.length ? (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: 0.1 }}
              className="rounded-[32px] border border-[rgba(39,107,115,0.08)] bg-white p-6 shadow-[0_14px_36px_rgba(17,24,39,0.05)]"
            >
              <div className="mb-5">
                <StatusPill tone="muted" className="mb-3 gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" />
                  Inside the course
                </StatusPill>
                <h2 className="text-[2rem] font-bold tracking-[-0.04em] text-[#1a2e38]">
                  The lesson and practice flow you will move through
                </h2>
              </div>

              <div className="space-y-3">
                {course.contentPreview.slice(0, 6).map((item, index) => (
                  <div
                    key={item.id}
                    className="grid gap-4 rounded-[24px] border border-[#e5ece8] bg-[#fbfcfb] p-5 md:grid-cols-[60px_minmax(0,1fr)] md:items-start"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#eef6f2] text-sm font-bold text-[var(--primary)]">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[1rem] font-semibold text-[#1a2e38]">
                          {item.title}
                        </h3>
                        <StatusPill tone="muted">{item.type}</StatusPill>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-[#607476]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          ) : null}

          {(course.whoItsFor.length || course.whoItsNotFor.length) ? (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: 0.12 }}
              className="grid gap-6 md:grid-cols-2"
            >
              {course.whoItsFor.length ? (
                <div className="rounded-[32px] border border-[rgba(39,107,115,0.08)] bg-white p-6 shadow-[0_14px_36px_rgba(17,24,39,0.05)]">
                  <h2 className="text-[1.6rem] font-bold tracking-[-0.04em] text-[#1a2e38]">
                    Who this is for
                  </h2>
                  <div className="mt-5 space-y-3">
                    {course.whoItsFor.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-[#e8f5ec] p-2 text-[#24744e]">
                          <Check className="h-4 w-4" />
                        </div>
                        <p className="text-sm leading-7 text-[#607476]">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {course.whoItsNotFor.length ? (
                <div className="rounded-[32px] border border-[rgba(39,107,115,0.08)] bg-white p-6 shadow-[0_14px_36px_rgba(17,24,39,0.05)]">
                  <h2 className="text-[1.6rem] font-bold tracking-[-0.04em] text-[#1a2e38]">
                    Who this is not for
                  </h2>
                  <div className="mt-5 space-y-3">
                    {course.whoItsNotFor.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-[#fbefdb] p-2 text-[#a56712]">
                          <X className="h-4 w-4" />
                        </div>
                        <p className="text-sm leading-7 text-[#607476]">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </motion.section>
          ) : null}

          {course.faq.length ? (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: 0.16 }}
              className="rounded-[32px] border border-[rgba(39,107,115,0.08)] bg-white p-6 shadow-[0_14px_36px_rgba(17,24,39,0.05)]"
            >
              <h2 className="text-[2rem] font-bold tracking-[-0.04em] text-[#1a2e38]">
                Frequently asked questions
              </h2>
              <div className="mt-4">
                {course.faq.map((item) => (
                  <FaqAccordion
                    key={item.question}
                    item={{ q: item.question, a: item.answer }}
                  />
                ))}
              </div>
            </motion.section>
          ) : null}
        </div>

        <div className="space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, delay: 0.06 }}
            className="rounded-[32px] border border-[rgba(39,107,115,0.08)] bg-white p-6 shadow-[0_14px_36px_rgba(17,24,39,0.05)]"
          >
            <h2 className="text-[1.4rem] font-bold tracking-[-0.03em] text-[#1a2e38]">
              At a glance
            </h2>
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 rounded-[20px] bg-[#f7faf9] px-4 py-4">
                <Clock3 className="h-4 w-4 text-[var(--primary)]" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b8082]">
                    Duration
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#20343b]">
                    {durationLabel || "Self-paced learning"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-[20px] bg-[#f7faf9] px-4 py-4">
                <Globe className="h-4 w-4 text-[var(--primary)]" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b8082]">
                    Language
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#20343b]">
                    {course.language || "English"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-[20px] bg-[#f7faf9] px-4 py-4">
                <GraduationCap className="h-4 w-4 text-[var(--primary)]" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b8082]">
                    Difficulty
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#20343b]">
                    {course.difficultyLevel
                      ? difficultyLabel[course.difficultyLevel] || course.difficultyLevel
                      : "Beginner"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-[20px] bg-[#f7faf9] px-4 py-4">
                <ShieldCheck className="h-4 w-4 text-[var(--primary)]" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b8082]">
                    Extras
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#20343b]">
                    {extrasLabel || "Core course content"}
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, delay: 0.1 }}
            className="rounded-[32px] border border-[rgba(39,107,115,0.08)] bg-white p-6 shadow-[0_14px_36px_rgba(17,24,39,0.05)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[1.4rem] font-bold tracking-[-0.03em] text-[#1a2e38]">
                  Access and progress
                </h2>
                <p className="mt-2 text-sm leading-7 text-[#607476]">
                  {course.hasAccess
                    ? `You have completed ${course.gamesCompleted ?? 0} of ${
                        course.gamesTotal ?? course.gamesCount
                      } guided checkpoints and you are ${course.progressPercent}% through the journey.`
                    : pricingSummary}
                </p>
              </div>
              <StatusPill tone={course.hasAccess ? "success" : "warning"}>
                {course.hasAccess
                  ? course.planType
                    ? `${course.planType} plan`
                    : "Unlocked"
                  : "Locked"}
              </StatusPill>
            </div>

            <div className="mt-5 rounded-[20px] bg-[#f7faf9] p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-[#43595f]">Completion</span>
                <span className="font-semibold text-[#1a2e38]">
                  {course.progressPercent}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-[#e5ece8]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(135deg,var(--primary)_0%,var(--primary-strong)_100%)]"
                  style={{ width: `${Math.max(0, Math.min(course.progressPercent, 100))}%` }}
                />
              </div>
            </div>

            <div className="mt-5">
              <MainButton
                fullWidth
                onClick={() =>
                  navigate(
                    course.hasAccess
                      ? appRoutes.courseLearn(course.id)
                      : appRoutes.coursePricing(course.id),
                  )
                }
                tailIcon={<ArrowRight className="h-4 w-4" />}
              >
                {ctaLabel}
              </MainButton>
            </div>
          </motion.section>

          {course.courseHighlights.length ? (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: 0.14 }}
              className="rounded-[32px] border border-[rgba(39,107,115,0.08)] bg-white p-6 shadow-[0_14px_36px_rgba(17,24,39,0.05)]"
            >
              <h2 className="text-[1.4rem] font-bold tracking-[-0.03em] text-[#1a2e38]">
                Highlights
              </h2>
              <div className="mt-5 space-y-3">
                {course.courseHighlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-[20px] bg-[#f7faf9] px-4 py-4"
                  >
                    <Sparkles className="mt-1 h-4 w-4 text-[var(--primary)]" />
                    <p className="text-sm leading-7 text-[#607476]">{item}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          ) : null}

          {course.gameTitles?.length ? (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: 0.18 }}
              className="rounded-[32px] border border-[rgba(39,107,115,0.08)] bg-white p-6 shadow-[0_14px_36px_rgba(17,24,39,0.05)]"
            >
              <h2 className="text-[1.4rem] font-bold tracking-[-0.03em] text-[#1a2e38]">
                Practice types included
              </h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {course.gameTitles.map((item) => (
                  <StatusPill key={item} tone="muted">
                    {item}
                  </StatusPill>
                ))}
              </div>
            </motion.section>
          ) : null}

          {course.instructor?.name ? (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: 0.22 }}
              className="rounded-[32px] border border-[rgba(39,107,115,0.08)] bg-white p-6 shadow-[0_14px_36px_rgba(17,24,39,0.05)]"
            >
              <h2 className="text-[1.4rem] font-bold tracking-[-0.03em] text-[#1a2e38]">
                Meet your guide
              </h2>
              <div className="mt-5 flex items-start gap-4">
                <img
                  src={course.instructor.avatar || course.thumbnail}
                  alt={course.instructor.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-[1rem] font-semibold text-[#1a2e38]">
                    {course.instructor.name}
                  </p>
                  {course.instructor.title ? (
                    <p className="mt-1 text-sm font-medium text-[#4f6f73]">
                      {course.instructor.title}
                    </p>
                  ) : null}
                  {course.instructor.bio ? (
                    <p className="mt-3 text-sm leading-7 text-[#607476]">
                      {course.instructor.bio}
                    </p>
                  ) : null}
                </div>
              </div>
            </motion.section>
          ) : null}

          {course.featuredTestimonial ? (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: 0.26 }}
              className="rounded-[32px] border border-[rgba(39,107,115,0.08)] bg-[#18373f] p-6 text-white shadow-[0_16px_36px_rgba(24,55,63,0.18)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
                Featured testimonial
              </p>
              <p className="mt-4 text-[1rem] leading-8 text-white/85">
                "{course.featuredTestimonial.quote}"
              </p>
              <div className="mt-5 flex items-center gap-3">
                <img
                  src={course.featuredTestimonial.avatar || course.thumbnail}
                  alt={course.featuredTestimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">
                    {course.featuredTestimonial.name}
                  </p>
                  {course.featuredTestimonial.role ? (
                    <p className="text-sm text-white/60">
                      {course.featuredTestimonial.role}
                    </p>
                  ) : null}
                </div>
              </div>
            </motion.section>
          ) : null}
        </div>
      </div>
    </MainPageShell>
  );
};

export default CourseDetailsPage;

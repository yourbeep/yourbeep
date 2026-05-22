import { motion } from "framer-motion";
import { BookOpenText, PlayCircle, Sparkles } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainPageShell from "@features/main/components/MainPageShell";
import StatusPill from "@components/ui/StatusPill";
import MainButton from "@components/ui/MainButton";
import showToast from "@utils/showToast";
import { appRoutes } from "@constants/routes";
import CourseContentHero from "../components/CourseContentHero";
import ContentItemCard from "../components/ContentItemCard";
import CourseContentPageSkeleton from "../components/CourseContentPageSkeleton";
import { useCourseContent } from "../hooks/useCourseContent";
import type { LearningContentItem } from "../services/learningTypes";

const CourseContentPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { content, firstVideo, loading, error } = useCourseContent(courseId);

  useEffect(() => {
    if (error) {
      showToast({
        type: "error",
        message: "Unable to load course content",
        options: {
          description: error,
        },
      });
    }
  }, [error]);

  const openVideo = (item: LearningContentItem) => {
    if (!courseId || !item.videoId) return;
    navigate(appRoutes.courseVideo(courseId, item.videoId, item.id));
  };

  const openGame = (item: LearningContentItem) => {
    if (!courseId) return;
    navigate(
      appRoutes.courseGame(courseId, item.refId, {
        contentItemId: item.id,
      }),
    );
  };

  const sections = useMemo(() => {
    const items = content?.contentItems ?? [];

    return {
      lessons: items.filter((item) => item.type === "video"),
      practices: items.filter((item) => item.type === "game"),
    };
  }, [content]);

  if (loading) {
    return (
      <MainPageShell activeItem="Courses">
        <CourseContentPageSkeleton />
      </MainPageShell>
    );
  }

  if (error || !content || !courseId) {
    return (
      <MainPageShell activeItem="Courses">
        <div className="rounded-[28px] border border-[rgba(39,107,115,0.08)] bg-white px-8 py-16 text-center shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
          <p className="text-base font-semibold text-[#1a2e38]">
            We couldn&apos;t load this learning path.
          </p>
          <p className="mt-2 text-sm text-[#6c7a7a]">
            {error || "Course content not found."}
          </p>
        </div>
      </MainPageShell>
    );
  }

  return (
    <MainPageShell activeItem="Courses">
      <CourseContentHero
        content={content}
        firstVideo={firstVideo}
        onStartLearning={() => firstVideo && openVideo(firstVideo)}
      />

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24 }}
            className="mb-8"
          >
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <StatusPill tone="muted" className="mb-3 gap-1.5">
                  <BookOpenText className="h-3.5 w-3.5" />
                  Course roadmap
                </StatusPill>
                <h2 className="text-[2rem] font-bold tracking-[-0.04em] text-[#1a2e38] md:text-[2.4rem]">
                  Lessons and practices
                </h2>
                <p className="mt-2 max-w-[620px] text-sm leading-7 text-[#617273]">
                  A tighter, easier-to-scan curriculum view so you can move
                  through the path without feeling buried in oversized cards.
                </p>
              </div>
              {firstVideo ? (
                <MainButton
                  variant="outline"
                  headIcon={<PlayCircle className="h-4 w-4" />}
                  onClick={() => openVideo(firstVideo)}
                >
                  Resume first lesson
                </MainButton>
              ) : null}
            </div>
          </motion.section>

          <section className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: 0.02 }}
              className="rounded-[28px] border border-[rgba(39,107,115,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfb_100%)] p-5 shadow-[0_14px_36px_rgba(17,24,39,0.05)] md:p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-[1.25rem] font-semibold tracking-[-0.03em] text-[#1a2e38]">
                    Lesson sequence
                  </h3>
                  <p className="mt-1 text-sm text-[#6b7f82]">
                    Video-based walkthroughs that move the core ideas forward.
                  </p>
                </div>
                <StatusPill tone="primary">
                  {sections.lessons.length} lesson
                  {sections.lessons.length === 1 ? "" : "s"}
                </StatusPill>
              </div>

              <div className="space-y-3">
                {sections.lessons.map((item) => (
                  <ContentItemCard
                    key={item.id}
                    item={item}
                    onOpenVideo={openVideo}
                    onOpenGame={openGame}
                  />
                ))}
              </div>
            </motion.div>

            {sections.practices.length ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: 0.06 }}
                className="rounded-[28px] border border-[rgba(39,107,115,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfb_100%)] p-5 shadow-[0_14px_36px_rgba(17,24,39,0.05)] md:p-6"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-[1.25rem] font-semibold tracking-[-0.03em] text-[#1a2e38]">
                      Interactive practices
                    </h3>
                    <p className="mt-1 text-sm text-[#6b7f82]">
                      Guided activity moments to slow down and apply what the
                      lesson is teaching.
                    </p>
                  </div>
                  <StatusPill tone="muted">
                    {sections.practices.length} practice
                    {sections.practices.length === 1 ? "" : "s"}
                  </StatusPill>
                </div>

                <div className="space-y-3">
                  {sections.practices.map((item) => (
                    <ContentItemCard
                      key={item.id}
                      item={item}
                      onOpenVideo={openVideo}
                      onOpenGame={openGame}
                    />
                  ))}
                </div>
              </motion.div>
            ) : null}
          </section>
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.24, delay: 0.08 }}
          className="space-y-4"
        >
          <div className="rounded-[28px] border border-[rgba(39,107,115,0.08)] bg-white p-5 shadow-[0_12px_32px_rgba(17,24,39,0.05)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6d8587]">
              In this path
            </p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-[20px] bg-[#f5f8f7] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6d8587]">
                  Lessons
                </p>
                <p className="mt-1 text-[1.7rem] font-bold tracking-[-0.04em] text-[#1a2e38]">
                  {sections.lessons.length}
                </p>
              </div>
              <div className="rounded-[20px] bg-[#f5f8f7] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6d8587]">
                  Practices
                </p>
                <p className="mt-1 text-[1.7rem] font-bold tracking-[-0.04em] text-[#1a2e38]">
                  {sections.practices.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[rgba(39,107,115,0.08)] bg-[#18373f] p-5 text-white shadow-[0_16px_36px_rgba(24,55,63,0.18)]">
            <StatusPill tone="muted" className="bg-white/10 text-white/80">
              Learning note
            </StatusPill>
            <h3 className="mt-4 text-[1.15rem] font-semibold tracking-[-0.03em]">
              Stay slow on purpose
            </h3>
            <p className="mt-2 text-sm leading-7 text-white/68">
              The strongest results often come from revisiting a lesson,
              pausing at the cue moments, and opening the practices only when
              you are ready to reflect honestly.
            </p>
            {firstVideo ? (
              <div className="mt-5">
                <MainButton
                  variant="soft"
                  fullWidth
                  onClick={() => openVideo(firstVideo)}
                >
                  Continue from the top
                </MainButton>
              </div>
            ) : null}
          </div>
        </motion.aside>
      </div>
    </MainPageShell>
  );
};

export default CourseContentPage;

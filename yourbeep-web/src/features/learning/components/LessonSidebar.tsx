import { motion } from "framer-motion";
import { Clock3, Gamepad2, PlayCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainButton from "@components/ui/MainButton";
import StatusPill from "@components/ui/StatusPill";
import { appRoutes } from "@constants/routes";
import type { CourseContentData } from "../services/learningTypes";

type LessonSidebarProps = {
  courseId: string;
  content: CourseContentData | null;
  activeVideoId?: string;
};

const LessonSidebar = ({
  courseId,
  content,
  activeVideoId,
}: LessonSidebarProps) => {
  const navigate = useNavigate();

  return (
    <motion.aside
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.24 }}
      className="sticky top-24 rounded-[28px] border border-[rgba(39,107,115,0.08)] bg-white/95 p-4 shadow-[0_18px_44px_rgba(17,24,39,0.06)] backdrop-blur"
    >
      <div className="mb-4 rounded-[22px] bg-[linear-gradient(135deg,#f6f7ef_0%,#edf5f0_100%)] p-4">
        <StatusPill tone="primary" className="mb-3 gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Course guide
        </StatusPill>
        <h3 className="text-[1rem] font-semibold leading-6 tracking-[-0.02em] text-[#1a2e38]">
          {content?.title || "Course"}
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <StatusPill tone="muted" className="gap-1.5">
            <PlayCircle className="h-3.5 w-3.5" />
            {content?.contentItems.filter((item) => item.type === "video").length ?? 0} lessons
          </StatusPill>
          <StatusPill tone="muted" className="gap-1.5">
            <Gamepad2 className="h-3.5 w-3.5" />
            {content?.contentItems.filter((item) => item.type === "game").length ?? 0} practices
          </StatusPill>
        </div>
      </div>

      <div className="space-y-2">
        {content?.contentItems.map((lesson, index) => {
          const isActive = Boolean(lesson.videoId && lesson.videoId === activeVideoId);
          const isCompleted = lesson.userStatus === "completed";
          const isVideo = lesson.type === "video";

          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => {
                if (lesson.type === "video" && lesson.videoId) {
                  navigate(appRoutes.courseVideo(courseId, lesson.videoId, lesson.id));
                  return;
                }

                navigate(
                  appRoutes.courseGame(courseId, lesson.refId, {
                    contentItemId: lesson.id,
                    videoId: activeVideoId,
                  }),
                );
              }}
              className={`group w-full rounded-[20px] border px-3 py-3 text-left transition ${
                isActive
                  ? "border-[rgba(39,107,115,0.18)] bg-[linear-gradient(135deg,#eff7f3_0%,#f7faf8_100%)] shadow-[0_10px_24px_rgba(39,107,115,0.08)]"
                  : "border-transparent bg-[#fafcfb] hover:border-[rgba(39,107,115,0.10)] hover:bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] text-sm font-semibold ${
                    isActive
                      ? "bg-[var(--primary)] text-white"
                      : isCompleted
                        ? "bg-[#e8f5ec] text-[#24744e]"
                        : "bg-[#edf3ef] text-[#5d7771]"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-1 text-[13px] font-semibold leading-5 text-[#1a2e38]">
                      {lesson.title}
                    </p>
                    {isActive ? (
                      <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[var(--primary)]" />
                    ) : null}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#788b8d]">
                    <span className="inline-flex items-center gap-1">
                      {isVideo ? (
                        <PlayCircle className="h-3.5 w-3.5" />
                      ) : (
                        <Gamepad2 className="h-3.5 w-3.5" />
                      )}
                      {isVideo ? "Lesson" : "Practice"}
                    </span>
                    {lesson.durationMinutes ? (
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" />
                        {lesson.durationMinutes} min
                      </span>
                    ) : null}
                    {lesson.interactiveCueCount > 0 ? (
                      <span>{lesson.interactiveCueCount} cue{lesson.interactiveCueCount === 1 ? "" : "s"}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <MainButton
          fullWidth
          variant="outline"
          onClick={() => navigate(appRoutes.courseLearn(courseId))}
        >
          View course map
        </MainButton>
      </div>
    </motion.aside>
  );
};

export default LessonSidebar;

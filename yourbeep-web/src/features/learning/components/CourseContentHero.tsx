import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import MainButton from "@components/ui/MainButton";
import StatusPill from "@components/ui/StatusPill";
import type { CourseContentData, LearningContentItem } from "../services/learningTypes";

type CourseContentHeroProps = {
  content: CourseContentData;
  firstVideo: LearningContentItem | null;
  onStartLearning: () => void;
};

const CourseContentHero = ({
  content,
  firstVideo,
  onStartLearning,
}: CourseContentHeroProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="relative overflow-hidden rounded-[32px] border border-[rgba(39,107,115,0.10)] bg-[linear-gradient(135deg,#f7f5ee_0%,#eef6f1_48%,#e0ece7_100%)] p-7 shadow-[0_22px_54px_rgba(39,107,115,0.08)] md:p-8"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-[rgba(39,107,115,0.12)] blur-3xl" />
        <div className="absolute right-0 top-0 h-full w-[38%] bg-[radial-gradient(circle_at_top_right,rgba(219,111,74,0.14),transparent_48%)]" />
      </div>

      <div className="relative z-[1] grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <StatusPill tone="primary" className="mb-4 gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Guided course path
          </StatusPill>
          <h1 className="max-w-[760px] text-[2.15rem] font-bold leading-[1.04] tracking-[-0.05em] text-[#1a2e38] md:text-[3.1rem]">
            {content.title}
          </h1>
          <p className="mt-4 max-w-[650px] text-[0.96rem] leading-[1.8] text-[#607476]">
            Move through each lesson in order, revisit practices when needed,
            and use the interactive cues as moments to slow down and deepen the
            work instead of rushing through it.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <MainButton
              onClick={onStartLearning}
              disabled={!firstVideo}
              headIcon={<PlayCircle className="h-4 w-4" />}
              tailIcon={<ArrowRight className="h-4 w-4" />}
            >
              Start learning
            </MainButton>
            <StatusPill tone="muted" className="px-4 py-3 text-[12px]">
              {content.progress.completed}/{content.progress.total} completed
            </StatusPill>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          <div className="rounded-[24px] border border-white/65 bg-white/78 p-5 shadow-[0_12px_24px_rgba(0,0,0,0.04)] backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6d8587]">
              Completion
            </p>
            <p className="mt-2 text-[2.3rem] font-bold tracking-[-0.04em] text-[#1a2e38]">
              {content.progress.percentComplete}%
            </p>
            <div className="mt-4 h-2.5 rounded-full bg-[#dbe6e0]">
              <div
                className="h-full rounded-full bg-[var(--primary)]"
                style={{ width: `${content.progress.percentComplete}%` }}
              />
            </div>
          </div>

          <div className="rounded-[24px] border border-white/65 bg-white/78 p-5 shadow-[0_12px_24px_rgba(0,0,0,0.04)] backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6d8587]">
              Total items
            </p>
            <p className="mt-2 text-[2rem] font-bold tracking-[-0.04em] text-[#1a2e38]">
              {content.contentItems.length}
            </p>
            <p className="mt-2 text-[13px] leading-6 text-[#607476]">
              Lessons and practices in this path.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/65 bg-[#1a3a44] p-5 text-white shadow-[0_16px_28px_rgba(26,58,68,0.16)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
              Next up
            </p>
            <p className="mt-2 text-[1rem] font-semibold leading-7">
              {firstVideo
                ? firstVideo.title
                : "Your next lesson will appear here once content is available."}
            </p>
            <p className="mt-2 text-[13px] leading-6 text-white/68">
              {firstVideo
                ? "Pick up exactly where the path begins and keep the pace steady."
                : "No lesson is ready to start yet."}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CourseContentHero;

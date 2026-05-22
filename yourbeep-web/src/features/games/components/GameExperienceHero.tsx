import { motion } from "framer-motion";
import MainButton from "@components/ui/MainButton";
import StatusPill from "@components/ui/StatusPill";
import type { CourseGameLesson } from "../services/gameExperienceTypes";

type GameExperienceHeroProps = {
  lesson: CourseGameLesson;
  courseTitle: string;
  onBack: () => void;
  compact?: boolean;
};

const statusLabels: Record<string, string> = {
  completed: "Completed",
  in_progress: "In progress",
  not_started: "Not started",
};

const GameExperienceHero = ({
  lesson,
  courseTitle,
  onBack,
  compact = false,
}: GameExperienceHeroProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className={`rounded-[24px] border border-[rgba(39,107,115,0.12)] bg-[linear-gradient(135deg,#143845_0%,#255b67_52%,#347785_100%)] text-white shadow-[0_22px_52px_rgba(17,45,52,0.16)] ${
        compact ? "px-4 py-4 sm:px-5 sm:py-4" : "rounded-[32px] px-8 py-8"
      }`}
    >
      <div
        className={`flex flex-col lg:flex-row lg:items-end lg:justify-between ${
          compact ? "gap-3 sm:flex-row sm:items-center" : "gap-6"
        }`}
      >
        <div className={compact ? "min-w-0 flex-1" : "max-w-3xl"}>
          <p
            className={`font-semibold uppercase tracking-[0.18em] text-white/65 ${
              compact ? "text-[9px] tracking-[0.14em]" : "text-[11px] tracking-[0.22em]"
            }`}
          >
            {courseTitle} | Guided practice
          </p>
          <h1
            className={`font-bold leading-tight ${
              compact ? "mt-1 text-lg sm:text-xl" : "mt-3 text-[34px]"
            }`}
          >
            {lesson.title}
          </h1>
          {!compact ? (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78">
              {lesson.description}
            </p>
          ) : null}
          <div className={`flex flex-wrap gap-2 ${compact ? "mt-2" : "mt-5 gap-3"}`}>
            <StatusPill className="border border-white/15 bg-white/10 text-white/85">
              {lesson.gameKey.replaceAll("_", " ")}
            </StatusPill>
            <StatusPill className="border border-white/15 bg-white/10 text-white/85">
              {statusLabels[lesson.userStatus] ||
                lesson.userStatus.replaceAll("_", " ")}
            </StatusPill>
          </div>
        </div>

        <MainButton
          variant="outline"
          onClick={onBack}
          className={`shrink-0 border-white/30 bg-white/10 text-white hover:bg-white/15 hover:text-white ${
            compact ? "h-9 px-3 text-xs" : ""
          }`}
        >
          Back to learning
        </MainButton>
      </div>
    </motion.section>
  );
};

export default GameExperienceHero;

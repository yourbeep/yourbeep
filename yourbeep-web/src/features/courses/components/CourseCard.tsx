import { motion } from "framer-motion";
import { ArrowUpRight, Clock3, Gamepad2, Sparkles } from "lucide-react";
import MainButton from "@components/ui/MainButton";
import StatusPill from "@components/ui/StatusPill";
import type { CourseCardItem } from "../services/courseTypes";

type CourseCardProps = {
  course: CourseCardItem;
  onContinue: (courseId: string) => void;
  onBuy: (courseId: string) => void;
  onInfo: (courseId: string) => void;
};

export default function CourseCard({
  course,
  onContinue,
  onBuy,
  onInfo,
}: CourseCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="group overflow-hidden rounded-[30px] border border-[rgba(39,107,115,0.09)] bg-white shadow-[0_14px_34px_rgba(17,24,39,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(17,24,39,0.10)]"
    >
      <div className="relative h-[220px] overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(16,31,35,0.72)_0%,rgba(16,31,35,0.10)_45%,transparent_70%)]" />
        <div className="absolute left-4 top-4">
          {course.hasAccess ? (
            <StatusPill tone="success" dot>
              Enrolled
            </StatusPill>
          ) : (
            <StatusPill tone="primary">Featured Pathway</StatusPill>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/75">
              {course.subtitle}
            </p>
            <h3 className="text-[1.25rem] font-semibold leading-tight text-white">
              {course.title}
            </h3>
          </div>
          <div className="rounded-full bg-white/15 p-2.5 text-white backdrop-blur-md">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>
      <div className="p-5 md:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <StatusPill tone="muted" className="gap-1.5">
            <Clock3 className="h-3.5 w-3.5" />
            {course.durationMinutes > 0
              ? `${course.durationMinutes} min`
              : "Self-paced"}
          </StatusPill>
          <StatusPill tone="muted" className="gap-1.5">
            <Gamepad2 className="h-3.5 w-3.5" />
            {course.gamesCount} game{course.gamesCount === 1 ? "" : "s"}
          </StatusPill>
          <StatusPill tone="muted" className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Guided learning
          </StatusPill>
        </div>
        <p className="mb-5 text-[13px] leading-[1.8] text-[#5c7175]">
          {course.description}
        </p>

        {course.hasAccess ? (
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.12em] text-[#688084]">
                <span>Your progress</span>
                <span>{course.progressPercent}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-[#dbe5df]">
                <div
                  className="h-full rounded-full bg-[var(--primary)]"
                  style={{ width: `${course.progressPercent}%` }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <MainButton
                onClick={() => onContinue(course.id)}
                className="flex-1"
              >
                Continue Course
              </MainButton>
              <MainButton
                variant="outline"
                onClick={() => onInfo(course.id)}
                className="flex-1"
              >
                Show Course Info
              </MainButton>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <MainButton
              onClick={() => onBuy(course.id)}
              className="flex-1"
            >
              Buy Course
            </MainButton>
            <MainButton
              variant="outline"
              onClick={() => onInfo(course.id)}
              className="flex-1"
            >
              Show Course Info
            </MainButton>
          </div>
        )}
      </div>
    </motion.article>
  );
}

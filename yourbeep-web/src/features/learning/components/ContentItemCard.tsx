import { motion } from "framer-motion";
import { ArrowUpRight, Clock3, Gamepad2, PlayCircle, Sparkles } from "lucide-react";
import MainButton from "@components/ui/MainButton";
import StatusPill from "@components/ui/StatusPill";
import type { LearningContentItem } from "../services/learningTypes";

type ContentItemCardProps = {
  item: LearningContentItem;
  onOpenVideo: (item: LearningContentItem) => void;
  onOpenGame: (item: LearningContentItem) => void;
};

const statusLabels: Record<string, string> = {
  completed: "Completed",
  in_progress: "In progress",
  not_started: "Not started",
};

const statusToneMap: Record<string, "success" | "primary" | "muted"> = {
  completed: "success",
  in_progress: "primary",
  not_started: "muted",
};

const typeConfig = {
  video: {
    icon: <PlayCircle className="h-4 w-4" />,
    label: "Lesson",
  },
  game: {
    icon: <Gamepad2 className="h-4 w-4" />,
    label: "Practice",
  },
} as const;

const ContentItemCard = ({
  item,
  onOpenVideo,
  onOpenGame,
}: ContentItemCardProps) => {
  const isVideo = item.type === "video";
  const statusLabel = statusLabels[item.userStatus] || item.userStatus.replaceAll("_", " ");
  const statusTone = statusToneMap[item.userStatus] || "muted";
  const typeMeta = typeConfig[item.type];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="group rounded-[24px] border border-[rgba(39,107,115,0.10)] bg-white px-4 py-4 shadow-[0_10px_28px_rgba(17,24,39,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(17,24,39,0.08)] md:px-5"
    >
      <div className="grid gap-4 lg:grid-cols-[72px_minmax(0,1fr)_auto] lg:items-center">
        <div className="flex h-[68px] w-[68px] items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#eef6f1_0%,#f8fbfa_100%)] text-[var(--primary)] shadow-[inset_0_0_0_1px_rgba(39,107,115,0.08)]">
          {isVideo ? (
            <PlayCircle className="h-7 w-7" />
          ) : (
            <Sparkles className="h-7 w-7" />
          )}
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <StatusPill tone="muted" className="gap-1.5">
              {typeMeta.icon}
              {String(item.order).padStart(2, "0")} {typeMeta.label}
            </StatusPill>
            <StatusPill tone={statusTone} dot>
              {statusLabel}
            </StatusPill>
            {item.durationMinutes ? (
              <StatusPill tone="muted" className="gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                {item.durationMinutes} min
              </StatusPill>
            ) : null}
            {item.interactiveCueCount > 0 ? (
              <StatusPill tone="primary">
                {item.interactiveCueCount} cue
                {item.interactiveCueCount === 1 ? "" : "s"}
              </StatusPill>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <h3 className="truncate text-[17px] font-semibold tracking-[-0.02em] text-[#1a2e38] md:text-[18px]">
                {item.title}
              </h3>
              <p className="mt-1 line-clamp-2 max-w-[780px] text-[13px] leading-6 text-[#607476]">
                {item.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 lg:min-w-[220px]">
          <MainButton
            variant="outline"
            size="sm"
            onClick={() => (isVideo ? onOpenVideo(item) : onOpenGame(item))}
          >
            Preview
          </MainButton>
          <MainButton
            size="sm"
            onClick={() => (isVideo ? onOpenVideo(item) : onOpenGame(item))}
            disabled={isVideo && !item.videoId}
            tailIcon={<ArrowUpRight className="h-3.5 w-3.5" />}
          >
            {isVideo ? "Start" : "Open"}
          </MainButton>
        </div>
      </div>
    </motion.article>
  );
};

export default ContentItemCard;

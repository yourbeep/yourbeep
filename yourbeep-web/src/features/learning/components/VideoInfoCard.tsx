import type { LearningContentItem, VideoStreamData } from "../services/learningTypes";

type VideoInfoCardProps = {
  stream: VideoStreamData | null;
  item: LearningContentItem | null;
};

const formatMinutesRemaining = (durationSeconds?: number) => {
  if (!durationSeconds) return null;
  return `${Math.ceil(durationSeconds / 60)} Minutes`;
};

const VideoInfoCard = ({ stream, item }: VideoInfoCardProps) => {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex-1">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a9a9a]">
            {item ? `Lesson ${String(item.order).padStart(2, "0")}` : "Video lesson"}
          </p>
          <h1 className="mb-4 text-[32px] font-bold text-[#1a2e38]">
            {stream?.title || item?.title || "Course lesson"}
          </h1>
          <p className="text-[13px] leading-relaxed text-[#5a6a6a]">
            {item?.description ||
              "Take your time here. Watch the lesson, pause when needed, and use the guided cues to move from insight into practice."}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <span
          className="inline-block rounded-full px-4 py-2 text-[11px] font-semibold"
          style={{ backgroundColor: "#f0c8b8", color: "#8a4030" }}
        >
          Guided Lesson
        </span>
        {formatMinutesRemaining(stream?.durationSeconds) ? (
          <span
            className="inline-block rounded-full px-4 py-2 text-[11px] font-semibold"
            style={{ backgroundColor: "#d8e8e0", color: "#4a7a6a" }}
          >
            {formatMinutesRemaining(stream?.durationSeconds)}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default VideoInfoCard;

import { motion } from "framer-motion";
import MainButton from "@components/ui/MainButton";
import MainInput from "@components/ui/MainInput";
import StatusPill from "@components/ui/StatusPill";
import type { SomaticActivityDetail } from "../../services/gameExperienceTypes";

type SomaticActivityStatus = "pending" | "completed" | "skipped";

type SomaticActivityCardProps = {
  activity: SomaticActivityDetail;
  index: number;
  durationSeconds: number;
  status: SomaticActivityStatus;
  onOpenActivity: () => void;
  onDurationChange: (next: number) => void;
  onStatusChange: (status: SomaticActivityStatus) => void;
};

const toneByType: Record<
  SomaticActivityDetail["type"],
  "primary" | "warning" | "success"
> = {
  awareness_test: "warning",
  movement_exercise: "success",
  timed_exercise: "primary",
};

const statusTone: Record<
  SomaticActivityStatus,
  "muted" | "success" | "warning"
> = {
  pending: "muted",
  completed: "success",
  skipped: "warning",
};

const statusLabel: Record<SomaticActivityStatus, string> = {
  pending: "Pending",
  completed: "Practiced",
  skipped: "Skipped",
};

export function SomaticActivityCard({
  activity,
  index,
  durationSeconds,
  status,
  onOpenActivity,
  onDurationChange,
  onStatusChange,
}: SomaticActivityCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[0_16px_42px_rgba(36,72,66,0.06)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-[540px]">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone={toneByType[activity.type]} dot>
              {activity.subtitle}
            </StatusPill>
            <StatusPill tone={statusTone[status]}>
              {statusLabel[status]}
            </StatusPill>
          </div>
          <h4 className="mt-3 text-lg font-semibold text-[var(--text)]">
            {String(index + 1).padStart(2, "0")}. {activity.title}
          </h4>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
            {activity.instruction}
          </p>
        </div>

        <div className="min-w-[180px]">
          <MainInput
            label="Duration"
            type="number"
            min={30}
            step={15}
            value={durationSeconds}
            onChange={(event) =>
              onDurationChange(Number(event.target.value || 0))
            }
            hint="Seconds to spend on this practice"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <MainButton variant="primary" size="sm" onClick={onOpenActivity}>
          Open activity
        </MainButton>
        <MainButton
          variant={status === "completed" ? "soft" : "outline"}
          size="sm"
          onClick={() => onStatusChange("completed")}
        >
          Mark practiced
        </MainButton>
        <MainButton
          variant={status === "skipped" ? "outline" : "ghost"}
          size="sm"
          onClick={() => onStatusChange("skipped")}
        >
          Skip for now
        </MainButton>
        <MainButton
          variant={status === "pending" ? "outline" : "ghost"}
          size="sm"
          onClick={() => onStatusChange("pending")}
        >
          Keep pending
        </MainButton>
      </div>
    </motion.article>
  );
}

export default SomaticActivityCard;

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MainButton from "@components/ui/MainButton";
import StatusPill from "@components/ui/StatusPill";
import { appRoutes } from "@constants/routes";
import type {
  SomaticActivityRuntimeState,
  SomaticActivityStatus,
} from "../services/somaticDraftStorage";
import { getSomaticScreenDefinition } from "../services/somaticScreenRegistry";
import { humanizeKey } from "../services/somaticConfig";
import HeartSomaticAssessment from "./HeartSomaticAssessment";

type HeartSomaticFlowProps = {
  courseId: string;
  gameId: string;
  contentItemId?: string | null;
  returnVideoId?: string | null;
  sensation: string;
  onSelectSensation: (value: string) => void;
  activityKeys: string[];
  activityState: Record<string, SomaticActivityRuntimeState>;
  submitting: boolean;
  onSubmit: () => Promise<void> | void;
};

const toneForStatus = (status: SomaticActivityStatus) => {
  if (status === "completed") return "success";
  if (status === "skipped") return "warning";
  return "muted";
};

export default function HeartSomaticFlow({
  courseId,
  gameId,
  contentItemId,
  returnVideoId,
  sensation,
  onSelectSensation,
  activityKeys,
  activityState,
  submitting,
  onSubmit,
}: HeartSomaticFlowProps) {
  const navigate = useNavigate();
  const [activeActivityKey, setActiveActivityKey] = useState<string | null>(activityKeys[0] ?? null);

  useEffect(() => {
    setActiveActivityKey(activityKeys[0] ?? null);
  }, [sensation, activityKeys]);

  const completion = useMemo(() => {
    const statuses = activityKeys.map(
      (activityKey) => activityState[activityKey]?.status ?? "pending",
    );

    return {
      completed: statuses.filter((status) => status === "completed").length,
      skipped: statuses.filter((status) => status === "skipped").length,
      unresolved: statuses.filter((status) => status === "pending").length,
    };
  }, [activityKeys, activityState]);

  return (
    <div className="space-y-4">
      <HeartSomaticAssessment selected={sensation} onSelect={onSelectSensation} />

      {!!activityKeys.length && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24 }}
          className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[0_18px_44px_rgba(36,72,66,0.06)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Heart pathway
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[var(--text)]">
                Stay on this screen and move through the heart sequence
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                The body selection stays in place. Each heart activity opens as a focused screen
                based on the sensation you chose.
              </p>
            </div>
            <StatusPill tone={completion.unresolved ? "primary" : "success"} dot>
              {completion.unresolved
                ? `${completion.completed}/${activityKeys.length} practiced`
                : "Ready to submit"}
            </StatusPill>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
            <div className="space-y-3">
              {activityKeys.map((activityKey, index) => {
                const status = activityState[activityKey]?.status ?? "pending";
                const screen = getSomaticScreenDefinition(activityKey);
                return (
                  <button
                    key={activityKey}
                    type="button"
                    onClick={() => setActiveActivityKey(activityKey)}
                    className={`w-full rounded-[22px] border px-4 py-4 text-left transition ${
                      activeActivityKey === activityKey
                        ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                        : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] hover:bg-[#f4faf7]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                          Activity {String(index + 1).padStart(2, "0")}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[var(--text)]">
                          {screen?.title ?? humanizeKey(activityKey)}
                        </p>
                      </div>
                      <StatusPill tone={toneForStatus(status)}>
                        {status === "completed"
                          ? "Done"
                          : status === "skipped"
                            ? "Skipped"
                            : "Pending"}
                      </StatusPill>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Activity launch
              </p>
              <h4 className="mt-2 text-xl font-semibold text-[var(--text)]">
                Open each heart practice on its own full page
              </h4>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
                Once you choose a heart sensation, every recommended activity now opens as a
                dedicated full-screen practice. Finish or skip it there, then return here for the
                next one.
              </p>

              {activeActivityKey ? (
                <div className="mt-5 rounded-[22px] border border-[var(--border)] bg-white p-4">
                  <p className="text-sm font-semibold text-[var(--text)]">
                    {getSomaticScreenDefinition(activeActivityKey)?.title ?? humanizeKey(activeActivityKey)}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {getSomaticScreenDefinition(activeActivityKey)?.intro ??
                      "Open the selected practice to continue this heart pathway."}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <MainButton
                      onClick={() =>
                        navigate(
                          appRoutes.courseGameActivity(courseId, gameId, activeActivityKey, {
                            contentItemId: contentItemId || undefined,
                            videoId: returnVideoId || undefined,
                            region: "heart",
                            sensation,
                          }),
                        )
                      }
                    >
                      Open activity page
                    </MainButton>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-5">
            <p className="text-sm text-[var(--muted)]">
              {completion.skipped
                ? `${completion.skipped} skipped • ${completion.completed} practiced`
                : `${completion.completed} practiced`}
            </p>
            <MainButton
              onClick={() => void onSubmit()}
              isLoading={submitting}
              disabled={submitting || !activityKeys.length || completion.unresolved > 0}
            >
              {submitting ? "Saving..." : "Complete somatic practice"}
            </MainButton>
          </div>
        </motion.div>
      )}
    </div>
  );
}

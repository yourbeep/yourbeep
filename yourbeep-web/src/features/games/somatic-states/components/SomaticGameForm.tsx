import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MainButton from "@components/ui/MainButton";
import StatusPill from "@components/ui/StatusPill";
import ShimmerBlock from "@components/ui/ShimmerBlock";
import { appRoutes } from "@constants/routes";
import showToast from "@utils/showToast";
import {
  readSomaticDraft,
  writeSomaticDraft,
} from "../services/somaticDraftStorage";
import {
  somaticRegionMeta,
  somaticRegionOptions,
  type SomaticRegionKey,
} from "../services/somaticConfig";

const SomaticBodyModel = lazy(() => import("./SomaticBodyModel"));

type SomaticGameFormProps = {
  courseId: string;
  gameId: string;
  submitting: boolean;
  contentItemId?: string | null;
  returnVideoId?: string | null;
  onSubmit: () => Promise<unknown>;
};

export function SomaticGameForm({
  courseId,
  gameId,
  contentItemId,
  returnVideoId,
}: SomaticGameFormProps) {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<SomaticRegionKey | null>(
    null,
  );

  useEffect(() => {
    const draft = readSomaticDraft(courseId, gameId);
    if (!draft?.region) return;
    setSelectedRegion(draft.region);
  }, [courseId, gameId]);

  const selectedMeta = useMemo(
    () => (selectedRegion ? somaticRegionMeta[selectedRegion] : null),
    [selectedRegion],
  );

  const selectRegion = (region: SomaticRegionKey) => {
    setSelectedRegion(region);

    const draft = readSomaticDraft(courseId, gameId);
    writeSomaticDraft(courseId, gameId, {
      region,
      sensation: draft?.region === region ? draft.sensation : "",
      activityState: draft?.region === region ? draft.activityState : {},
    });

    showToast({
      type: "info",
      message: `${somaticRegionMeta[region].label} selected`,
      options: {
        description:
          "Open the region page to choose the sensation and begin the guided pathway.",
        duration: 1800,
      },
    });
  };

  const openRegionPage = () => {
    if (!selectedRegion) {
      showToast({
        type: "warning",
        message: "Select a body region first",
        options: {
          description:
            "Choose the body area that feels most alive right now to continue.",
        },
      });
      return;
    }

    navigate(
      appRoutes.courseGameRegion(courseId, gameId, selectedRegion, {
        contentItemId: contentItemId || undefined,
        videoId: returnVideoId || undefined,
      }),
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <Suspense
          fallback={
            <ShimmerBlock className="h-[520px] w-full rounded-[32px]" />
          }
        >
          <SomaticBodyModel
            selectedRegion={selectedRegion}
            onSelectRegion={selectRegion}
          />
        </Suspense>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[0_18px_44px_rgba(36,72,66,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  Selected body area
                </p>
                <h3 className="mt-2 text-xl font-semibold text-[var(--text)]">
                  {selectedMeta ? selectedMeta.label : "Choose a body region"}
                </h3>
              </div>
              <StatusPill tone={selectedMeta ? "primary" : "muted"} dot>
                {selectedMeta ? "Selected" : "Awaiting"}
              </StatusPill>
            </div>

            {selectedMeta ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                        {selectedMeta.eyebrow}
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--text)]">
                        The {selectedMeta.label}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                        {selectedMeta.description}
                      </p>
                    </div>
                    <div
                      className="mt-1 h-4 w-4 shrink-0 rounded-full"
                      style={{ backgroundColor: selectedMeta.color }}
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {somaticRegionOptions.map((option, index) => {
                    const meta = somaticRegionMeta[option.value];
                    const isActive = selectedRegion === option.value;

                    return (
                      <motion.button
                        key={option.value}
                        type="button"
                        onClick={() => selectRegion(option.value)}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className={`rounded-[20px] border px-3 py-3 text-left transition ${
                          isActive
                            ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                            : "border-[var(--border)] bg-white hover:border-[var(--primary)] hover:bg-[#f6fbf8]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-[var(--text)]">
                            {meta.label}
                          </p>
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: meta.color }}
                          />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="rounded-[20px] border border-dashed border-[var(--border)] bg-white px-4 py-4">
                  <p className="text-sm leading-6 text-[var(--muted)]">
                    Open the dedicated {selectedMeta.label.toLowerCase()} page
                    to choose the exact sensation and start the full activity
                    flow.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <p className="text-sm leading-6 text-[var(--muted)]">
                  Choose a body region from the 3D model or the compact cards
                  below.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {somaticRegionOptions.map((option, index) => {
                    const meta = somaticRegionMeta[option.value];

                    return (
                      <motion.button
                        key={option.value}
                        type="button"
                        onClick={() => selectRegion(option.value)}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className="rounded-[20px] border border-[var(--border)] bg-white px-3 py-3 text-left transition hover:border-[var(--primary)] hover:bg-[#f6fbf8]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-[var(--text)]">
                            {meta.label}
                          </p>
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: meta.color }}
                          />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <MainButton onClick={openRegionPage} disabled={!selectedRegion}>
                {selectedMeta
                  ? `Go to ${selectedMeta.label}`
                  : "Select region first"}
              </MainButton>
              {selectedMeta ? (
                <MainButton
                  variant="soft"
                  onClick={() => setSelectedRegion(null)}
                >
                  Clear selection
                </MainButton>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SomaticGameForm;

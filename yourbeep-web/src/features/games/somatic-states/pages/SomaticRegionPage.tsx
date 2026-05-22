import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import MainButton from "@components/ui/MainButton";
import ShimmerBlock from "@components/ui/ShimmerBlock";
import StatusPill from "@components/ui/StatusPill";
import MainPageShell from "@features/main/components/MainPageShell";
import { appRoutes } from "@constants/routes";
import showToast from "@utils/showToast";
import { useCourseGameExperience } from "../../hooks/useCourseGameExperience";
import HeadSomaticAssessment from "../head/HeadSomaticAssessment";
import HeartSomaticAssessment from "../heart/HeartSomaticAssessment";
import HandsLegsSomaticAssessment from "../hands-legs/HandsLegsSomaticAssessment";
import somaticMapHandsLegs from "../../../../assets/games/hands-legs/somatic-map-hands-legs.png";
import { buildSomaticSubmissionPayload } from "../services/buildSomaticSubmissionPayload";
import {
  getSomaticSensationOptions,
  somaticRegionMeta,
  somaticSequences,
  type SomaticRegionKey,
} from "../services/somaticConfig";
import {
  readSomaticDraft,
  writeSomaticDraft,
} from "../services/somaticDraftStorage";
import { getSomaticScreenDefinition } from "../services/somaticScreenRegistry";

const toneForStatus = (status: "pending" | "completed" | "skipped") => {
  if (status === "completed") return "success";
  if (status === "skipped") return "warning";
  return "muted";
};

const SomaticRegionPage = () => {
  const navigate = useNavigate();
  const { courseId, gameId, region } = useParams();
  const [searchParams] = useSearchParams();
  const contentItemId = searchParams.get("contentItemId");
  const returnVideoId = searchParams.get("videoId");

  const {
    content,
    lesson,
    loading,
    submitting,
    error,
    submit,
  } = useCourseGameExperience(courseId, gameId, contentItemId);

  const regionKey = (region as SomaticRegionKey | undefined) ?? null;
  const regionMeta = regionKey ? somaticRegionMeta[regionKey] : null;
  const sensations = useMemo(
    () => (regionKey ? getSomaticSensationOptions(regionKey) : []),
    [regionKey],
  );

  const [selectedSensation, setSelectedSensation] = useState("");
  const [activityState, setActivityState] = useState<Record<string, { durationSeconds: number; status: "pending" | "completed" | "skipped" }>>({});

  useEffect(() => {
    if (!courseId || !gameId) return;
    const draft = readSomaticDraft(courseId, gameId);
    if (!draft) return;

    if (draft.region === regionKey) {
      setSelectedSensation(draft.sensation);
      setActivityState(draft.activityState);
    } else {
      setSelectedSensation("");
      setActivityState({});
    }
  }, [courseId, gameId, regionKey]);

  const activityKeys = useMemo(() => {
    if (!regionKey || !selectedSensation) return [];

    return (
      somaticSequences[regionKey][
        selectedSensation as keyof (typeof somaticSequences)[typeof regionKey]
      ] ?? []
    );
  }, [regionKey, selectedSensation]);

  useEffect(() => {
    if (!courseId || !gameId || !regionKey) return;
    writeSomaticDraft(courseId, gameId, {
      region: regionKey,
      sensation: selectedSensation,
      activityState,
    });
  }, [activityState, courseId, gameId, regionKey, selectedSensation]);

  useEffect(() => {
    if (!activityKeys.length) return;

    setActivityState((current) => {
      const next = { ...current };
      for (const activityKey of activityKeys) {
        next[activityKey] = current[activityKey] ?? {
          durationSeconds: 60,
          status: "pending",
        };
      }
      return next;
    });
  }, [activityKeys]);

  const nextActivityKey = useMemo(() => {
    const pending = activityKeys.find((activityKey) => {
      const status = activityState[activityKey]?.status ?? "pending";
      return status === "pending";
    });

    return pending ?? activityKeys[0] ?? null;
  }, [activityKeys, activityState]);

  const completion = useMemo(() => {
    const statuses = activityKeys.map((activityKey) => activityState[activityKey]?.status ?? "pending");
    return {
      completed: statuses.filter((status) => status === "completed").length,
      skipped: statuses.filter((status) => status === "skipped").length,
      unresolved: statuses.filter((status) => status === "pending").length,
    };
  }, [activityKeys, activityState]);

  const openPathway = () => {
    if (!courseId || !gameId || !regionKey || !selectedSensation || !nextActivityKey) {
      showToast({
        type: "warning",
        message: "Choose a sensation first",
        options: {
          description: "Select the sensation that best matches what you are noticing before starting the activity.",
        },
      });
      return;
    }

    navigate(
      appRoutes.courseGameActivity(courseId, gameId, nextActivityKey, {
        contentItemId: contentItemId || undefined,
        videoId: returnVideoId || undefined,
        region: regionKey,
        sensation: selectedSensation,
      }),
    );
  };

  const completeRegionPractice = async () => {
    if (!courseId || !regionKey || !selectedSensation || !activityKeys.length) return;
    if (completion.unresolved) {
      showToast({
        type: "warning",
        message: "Finish the remaining activities first",
        options: {
          description: "Each activity should be completed or intentionally skipped before you submit this region.",
        },
      });
      return;
    }

    await submit(
      buildSomaticSubmissionPayload({
        courseId,
        region: regionKey,
        sensation: selectedSensation,
        activityKeys,
        activityState,
      }),
    );
  };

  if (loading) {
    return (
      <MainPageShell activeItem="Games">
        <div className="space-y-6">
          <ShimmerBlock className="h-36 w-full rounded-[32px]" />
          <ShimmerBlock className="h-[420px] w-full rounded-[32px]" />
        </div>
      </MainPageShell>
    );
  }

  if (!courseId || !gameId || !regionKey || !regionMeta || error || !lesson) {
    return (
      <MainPageShell activeItem="Games">
        <div className="rounded-[32px] bg-white px-8 py-16 text-center shadow-sm">
          <p className="text-lg font-semibold text-[#1a2e38]">We couldn&apos;t open this body section.</p>
          <p className="mt-2 text-sm text-[#6c7a7a]">{error || "Region not found."}</p>
          <MainButton className="mt-6" onClick={() => navigate(contentItemId || returnVideoId ? appRoutes.courseGame(courseId, gameId, {
            contentItemId: contentItemId || undefined,
            videoId: returnVideoId || undefined,
          }) : appRoutes.games)}>
            Back to body map
          </MainButton>
        </div>
      </MainPageShell>
    );
  }

  const isHead = regionKey === "head";
  const isHeart = regionKey === "heart";
  const isHandsLegs = regionKey === "hands_legs";
  const richRegionLayout = isHead || isHeart || isHandsLegs;
  const regionPracticeLabel = isHeart ? "heart" : isHandsLegs ? "hands & legs" : "head";

  return (
    <MainPageShell activeItem="Games">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="rounded-[32px] border border-[rgba(39,107,115,0.12)] bg-[linear-gradient(135deg,#edf1e8_0%,#f6f7f1_100%)] px-8 py-7 shadow-[0_22px_52px_rgba(17,45,52,0.06)]"
        >
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                Somatic assessment
              </p>
              <h1 className="mt-3 text-[34px] font-bold leading-tight text-[var(--text)]">
                The {regionMeta.label}
              </h1>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                {regionMeta.description}
              </p>
            </div>

            <MainButton
              variant="outline"
              onClick={() =>
                navigate(
                  appRoutes.courseGame(courseId, gameId, {
                    contentItemId: contentItemId || undefined,
                    videoId: returnVideoId || undefined,
                  }),
                )
              }
            >
              Back to body map
            </MainButton>
          </div>
        </motion.section>

        {richRegionLayout ? (
          <div className="grid items-start gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <motion.section
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28 }}
              className="space-y-5"
            >
              {isHead ? (
                <div className="rounded-[30px] bg-[linear-gradient(135deg,#d9e09d_0%,#81927b_100%)] p-[1px] shadow-[0_30px_55px_rgba(171,180,111,0.24)]">
                  <div className="rounded-[29px] bg-[radial-gradient(circle_at_top_left,#f3f1ca_0%,#6b7b67_72%)] p-8">
                    <div className="flex h-[390px] items-end justify-center rounded-[26px] bg-[linear-gradient(135deg,rgba(241,247,184,0.9)_0%,rgba(118,137,115,0.82)_100%)]">
                      <div className="relative mb-4 h-[290px] w-[210px] rounded-t-[120px] rounded-b-[90px] bg-[linear-gradient(180deg,#4a5c51_0%,#a3b089_100%)] shadow-[0_30px_60px_rgba(48,58,46,0.28)]">
                        <div className="absolute left-8 top-8 h-20 w-20 rounded-full bg-[rgba(245,248,220,0.88)]" />
                        <div className="absolute left-[84px] top-[108px] h-16 w-16 rounded-full bg-[rgba(245,248,220,0.88)]" />
                        <div className="absolute left-[109px] top-[126px] flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(149,171,118,0.9)] text-white shadow-lg">
                          <span className="text-lg">◔</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : isHeart ? (
                <div className="rounded-[30px] bg-[linear-gradient(135deg,#f5d1d8_0%,#e08ea0_100%)] p-[1px] shadow-[0_30px_55px_rgba(192,84,108,0.18)]">
                  <div className="rounded-[29px] bg-[radial-gradient(circle_at_top_left,#fde7eb_0%,#21262b_82%)] p-8">
                    <div className="flex h-[390px] items-center justify-center rounded-[26px] bg-[#1f242a]">
                      <div className="relative flex h-[280px] w-[260px] items-center justify-center">
                        <div className="absolute inset-0 rounded-[120px] bg-[radial-gradient(circle_at_30%_20%,rgba(255,150,170,0.18)_0%,rgba(31,36,42,0)_70%)]" />
                        <div className="relative h-[240px] w-[210px] rounded-[120px] bg-[linear-gradient(180deg,#e25a6d_0%,#b13042_100%)] shadow-[0_30px_60px_rgba(141,33,52,0.4)]">
                          <div className="absolute left-7 top-4 h-16 w-16 rounded-full bg-[#74b6c2] shadow-inner" />
                          <div className="absolute right-7 top-4 h-14 w-14 rounded-full bg-[#9ed1d9] shadow-inner" />
                          <div className="absolute left-1/2 top-2 h-12 w-1.5 -translate-x-1/2 rounded-full bg-[#7ec0c9]" />
                          <div className="absolute left-12 top-24 h-10 w-10 rounded-full bg-[#f5a8b6] opacity-70 blur-[2px]" />
                          <div className="absolute right-10 top-28 h-8 w-8 rounded-full bg-[#f5a8b6] opacity-60 blur-[2px]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-[30px] border border-[var(--border)] bg-[#f9f8f3] p-6 shadow-[0_18px_44px_rgba(36,72,66,0.06)]">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eceae4] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5a6b6f]">
                    <span aria-hidden>⏱</span>
                    Somatic assessment
                  </span>
                  <h2 className="mt-4 text-[2rem] font-bold leading-tight text-[#1a3c4a] md:text-[2.15rem]">
                    Hands &amp; Legs
                  </h2>
                  <div className="mt-3 h-[2px] w-14 rounded-full bg-[#8b5e3c]" />
                  <p className="mt-4 text-sm leading-7 text-[#5a6b6f]">
                    Tune into the sensations currently active in your hands and legs. Notice the
                    quality of the energy without judgement.
                  </p>
                  <div className="mt-6 overflow-hidden rounded-[1.15rem] bg-white p-2 shadow-[inset_0_0_0_1px_rgba(36,72,66,0.04)]">
                    <img
                      src={somaticMapHandsLegs}
                      alt="Hands and legs anatomical reference"
                      className="block h-auto w-full object-contain"
                    />
                  </div>
                </div>
              )}
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28 }}
              className="space-y-6"
            >
              <div className="rounded-[30px] bg-transparent">
                {isHead ? (
                  <HeadSomaticAssessment
                    selected={selectedSensation}
                    onSelect={(value) => {
                      setSelectedSensation(value);
                      showToast({
                        type: "info",
                        message: "Head sensation selected",
                        options: {
                          description: "You can now open the matching head activity flow.",
                          duration: 1500,
                        },
                      });
                    }}
                  />
                ) : isHeart ? (
                  <HeartSomaticAssessment
                    selected={selectedSensation}
                    onSelect={(value) => {
                      setSelectedSensation(value);
                      showToast({
                        type: "info",
                        message: "Heart sensation selected",
                        options: {
                          description: "You can now open the matching heart activity flow.",
                          duration: 1500,
                        },
                      });
                    }}
                  />
                ) : (
                  <HandsLegsSomaticAssessment
                    selected={selectedSensation}
                    onSelect={(value) => {
                      setSelectedSensation(value);
                      showToast({
                        type: "info",
                        message: "Hands & legs sensation selected",
                        options: {
                          description: "You can now open the matching limb activity flow.",
                          duration: 1500,
                        },
                      });
                    }}
                  />
                )}
              </div>

              <div className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[0_18px_44px_rgba(36,72,66,0.06)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                      Activity path
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-[var(--text)]">
                      Open the {regionPracticeLabel} practice sequence
                    </h3>
                  </div>
                  <StatusPill tone={completion.unresolved ? "primary" : "success"} dot>
                    {completion.unresolved
                      ? `${completion.completed}/${activityKeys.length || 0} practiced`
                      : activityKeys.length
                        ? "Ready to submit"
                        : "Choose a sensation"}
                  </StatusPill>
                </div>

                {activityKeys.length ? (
                  <div className="mt-4 space-y-3">
                    {activityKeys.map((activityKey, index) => {
                      const status = activityState[activityKey]?.status ?? "pending";
                      return (
                        <div
                          key={activityKey}
                          className="flex items-center justify-between rounded-[20px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                        >
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                              Activity {String(index + 1).padStart(2, "0")}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[var(--text)]">
                              {getSomaticScreenDefinition(activityKey)?.title ?? activityKey}
                            </p>
                          </div>
                          <StatusPill tone={toneForStatus(status)}>
                            {status === "completed" ? "Done" : status === "skipped" ? "Skipped" : "Pending"}
                          </StatusPill>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-3">
                  <MainButton onClick={openPathway} disabled={!selectedSensation || !nextActivityKey}>
                    {completion.completed || completion.skipped ? "Continue activities" : "Start activities"}
                  </MainButton>
                  <MainButton
                    variant="outline"
                    onClick={() => void completeRegionPractice()}
                    disabled={!activityKeys.length || completion.unresolved > 0 || submitting}
                    isLoading={submitting}
                  >
                    {submitting ? "Saving..." : "Complete region practice"}
                  </MainButton>
                </div>
              </div>
            </motion.section>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.section
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28 }}
              className="rounded-[32px] border border-[var(--border)] bg-white p-6 shadow-[0_18px_44px_rgba(36,72,66,0.06)]"
            >
              <div className="rounded-[28px] p-[1px]" style={{ background: `linear-gradient(135deg, ${regionMeta.color}22 0%, rgba(255,255,255,0.9) 100%)` }}>
                <div className="rounded-[27px] bg-[var(--surface)] p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                    {regionMeta.eyebrow}
                  </p>
                  <h2 className="mt-2 text-[32px] font-bold text-[var(--text)]">
                    The {regionMeta.label}
                  </h2>
                  <div className="mt-4 h-[2px] w-16 rounded-full bg-[var(--primary)]" />
                  <p className="mt-5 text-sm leading-7 text-[var(--muted)]">{regionMeta.description}</p>
                  <div
                    className="mt-8 flex h-[280px] items-center justify-center rounded-[26px]"
                    style={{
                      background: `radial-gradient(circle at center, ${regionMeta.glow} 0%, rgba(255,255,255,0.9) 52%, rgba(245,247,241,1) 100%)`,
                    }}
                  >
                    <div
                      className="flex h-32 w-32 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${regionMeta.color}22`, color: regionMeta.color }}
                    >
                      <span className="text-5xl">◎</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28 }}
              className="space-y-6"
            >
              <div className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[0_18px_44px_rgba(36,72,66,0.06)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  Sensation selection
                </p>
                <h3 className="mt-2 text-xl font-semibold text-[var(--text)]">
                  What are you noticing in the {regionMeta.label.toLowerCase()}?
                </h3>
                <div className="mt-4 space-y-3">
                  {sensations.map((item, index) => {
                    const isActive = selectedSensation === item.value;
                    return (
                      <motion.button
                        key={item.value}
                        type="button"
                        onClick={() => setSelectedSensation(item.value)}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`w-full rounded-[22px] border px-4 py-4 text-left transition ${
                          isActive
                            ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                            : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] hover:bg-[#f6fbf8]"
                        }`}
                      >
                        <p className="text-sm font-semibold text-[var(--text)]">{item.label}</p>
                        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[0_18px_44px_rgba(36,72,66,0.06)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                      Region path
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-[var(--text)]">
                      Start the {regionMeta.label.toLowerCase()} activities
                    </h3>
                  </div>
                  <StatusPill tone={completion.unresolved ? "primary" : "success"} dot>
                    {completion.unresolved
                      ? `${completion.completed}/${activityKeys.length || 0} practiced`
                      : activityKeys.length
                        ? "Ready to submit"
                        : "Choose a sensation"}
                  </StatusPill>
                </div>

                {activityKeys.length ? (
                  <div className="mt-4 space-y-3">
                    {activityKeys.map((activityKey, index) => {
                      const status = activityState[activityKey]?.status ?? "pending";
                      return (
                        <div
                          key={activityKey}
                          className="flex items-center justify-between rounded-[20px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                        >
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                              Activity {String(index + 1).padStart(2, "0")}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[var(--text)]">
                              {getSomaticScreenDefinition(activityKey)?.title ?? activityKey}
                            </p>
                          </div>
                          <StatusPill tone={toneForStatus(status)}>
                            {status === "completed" ? "Done" : status === "skipped" ? "Skipped" : "Pending"}
                          </StatusPill>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-3">
                  <MainButton onClick={openPathway} disabled={!selectedSensation || !nextActivityKey}>
                    {completion.completed || completion.skipped ? "Continue activities" : "Start activities"}
                  </MainButton>
                  <MainButton
                    variant="outline"
                    onClick={() => void completeRegionPractice()}
                    disabled={!activityKeys.length || completion.unresolved > 0 || submitting}
                    isLoading={submitting}
                  >
                    {submitting ? "Saving..." : "Complete region practice"}
                  </MainButton>
                </div>
              </div>
            </motion.section>
          </div>
        )}
      </div>
    </MainPageShell>
  );
};

export default SomaticRegionPage;
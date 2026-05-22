import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import MainPageShell from "@features/main/components/MainPageShell";
import MainButton from "@components/ui/MainButton";
import ShimmerBlock from "@components/ui/ShimmerBlock";
import StatusPill from "@components/ui/StatusPill";
import { appRoutes } from "@constants/routes";
import showToast from "@utils/showToast";
import { gameExperienceApi } from "../../services/gameExperienceApi";
import type { SomaticActivityDetail } from "../../services/gameExperienceTypes";
import SomaticActivityVisual from "../components/SomaticActivityVisual";
import HeadAwarenessTest from "../head/HeadAwarenessTest";
import HeadCO2Rebalancing from "../head/HeadCO2Rebalancing";
import HeadCognitiveReactivation from "../head/HeadCognitiveReactivation";
import HeadFlexibilityCheck from "../head/HeadFlexibilityCheck";
import HeadFogVsFatigue from "../head/HeadFogVsFatigue";
import HeadSensoryAnchoring from "../head/HeadSensoryAnchoring";
import HeartActivationDifferentiation from "../heart/HeartActivationDifferentiation";
import HeartBaselinePulse from "../heart/HeartBaselinePulse";
import HeartCoherenceBreathing from "../heart/HeartCoherenceBreathing";
import HeartExpansionAllowance from "../heart/HeartExpansionAllowance";
import HeartShoulderNeckStretch from "../heart/HeartShoulderNeckStretch";
import HeartSternumPecStretch from "../heart/HeartSternumPecStretch";
import HandsLegsFistClenchRelease from "../hands-legs/HandsLegsFistClenchRelease";
import HandsLegsFreezeCheck from "../hands-legs/HandsLegsFreezeCheck";
import HandsLegsGroundingDrill from "../hands-legs/HandsLegsGroundingDrill";
import HandsLegsProprioceptionGrounding from "../hands-legs/HandsLegsProprioceptionGrounding";
import HandsLegsRhythmicGrounding from "../hands-legs/HandsLegsRhythmicGrounding";
import HandsLegsShoulderDrop from "../hands-legs/HandsLegsShoulderDrop";
import { getSomaticScreenDefinition } from "../services/somaticScreenRegistry";
import {
  somaticSequences,
  somaticRegionMeta,
  getSomaticSensationOptions,
  type SomaticRegionKey,
} from "../services/somaticConfig";
import {
  readSomaticDraft,
  updateSomaticDraftActivity,
} from "../services/somaticDraftStorage";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
};

const renderHeadActivity = (activityKey: string) => {
  switch (activityKey) {
    case "60_second_cognitive_check":
      return <HeadAwarenessTest />;
    case "expand_the_window":
      return <HeadCognitiveReactivation mode="reactivation" />;
    case "co2_indicator":
      return <HeadCO2Rebalancing mode="indicator" />;
    case "co2_rebalancing":
      return <HeadCO2Rebalancing mode="rebalancing" />;
    case "sensory_anchoring":
      return <HeadSensoryAnchoring />;
    case "flexibility_check":
      return <HeadFlexibilityCheck />;
    case "cognitive_diffusion_drill":
      return <HeadCognitiveReactivation mode="diffusion" />;
    case "fatigue_check":
      return <HeadFogVsFatigue />;
    default:
      return null;
  }
};

const renderHeartActivity = (activityKey: string) => {
  switch (activityKey) {
    case "baseline_pulse_awareness":
      return <HeartBaselinePulse />;
    case "activation_differentiation_test":
      return <HeartActivationDifferentiation />;
    case "coherence_breathing":
      return <HeartCoherenceBreathing />;
    case "expansion_allowance":
      return <HeartExpansionAllowance />;
    case "sternum_pec_stretch":
      return <HeartSternumPecStretch />;
    case "shoulder_neck_stretch":
      return <HeartShoulderNeckStretch />;
    default:
      return null;
  }
};

const renderHandsLegsActivity = (activityKey: string) => {
  switch (activityKey) {
    case "grounding_drill":
      return <HandsLegsGroundingDrill />;
    case "freeze_check":
      return <HandsLegsFreezeCheck />;
    case "rhythmic_grounding":
      return <HandsLegsRhythmicGrounding />;
    case "fist_clench_release":
      return <HandsLegsFistClenchRelease />;
    case "shoulder_drop":
      return <HandsLegsShoulderDrop />;
    case "proprioception_grounding":
      return <HandsLegsProprioceptionGrounding />;
    default:
      return null;
  }
};

const SomaticActivityPage = () => {
  const navigate = useNavigate();
  const { courseId, gameId, activityKey } = useParams();
  const [searchParams] = useSearchParams();
  const contentItemId = searchParams.get("contentItemId");
  const returnVideoId = searchParams.get("videoId");
  const region = searchParams.get("region") as SomaticRegionKey | null;
  const sensation = searchParams.get("sensation") || "";

  const [activity, setActivity] = useState<SomaticActivityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const pathwayKeys = useMemo(() => {
    if (!region || !sensation) return [];
    return (
      somaticSequences[region][
        sensation as keyof (typeof somaticSequences)[typeof region]
      ] ?? []
    );
  }, [region, sensation]);

  const backHref =
    courseId && gameId
      ? region
        ? appRoutes.courseGameRegion(courseId, gameId, region, {
            contentItemId: contentItemId || undefined,
            videoId: returnVideoId || undefined,
          })
        : appRoutes.courseGame(courseId, gameId, {
            contentItemId: contentItemId || undefined,
            videoId: returnVideoId || undefined,
          })
      : appRoutes.games;

  useEffect(() => {
    if (!gameId || !activityKey) {
      setLoading(false);
      setError("This activity could not be found.");
      return;
    }

    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const detail = await gameExperienceApi.getActivityDetail(
          gameId,
          activityKey,
        );

        if (!active) return;

        if (!detail) {
          setError("This activity could not be found.");
          return;
        }

        setActivity(detail);
        const draft =
          courseId && gameId ? readSomaticDraft(courseId, gameId) : null;
        const draftEntry = draft?.activityState[activityKey];
        setElapsedSeconds(
          Math.min(
            draftEntry?.durationSeconds ?? 0,
            detail.durationSeconds ?? 0,
          ),
        );
      } catch {
        if (!active) return;
        setError("We couldn't load this somatic activity right now.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [activityKey, courseId, gameId]);

  useEffect(() => {
    if (!isPlaying || !activity?.durationSeconds) return;

    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => {
        if (current >= activity.durationSeconds!) {
          window.clearInterval(timer);
          setIsPlaying(false);
          showToast({
            type: "success",
            message: "Activity timer complete",
            options: {
              description:
                "You can now mark this somatic practice as completed and return to the pathway.",
            },
          });
          return activity.durationSeconds!;
        }

        return current + 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activity?.durationSeconds, isPlaying]);

  const remainingSeconds = useMemo(() => {
    if (!activity?.durationSeconds) return 0;
    return Math.max(activity.durationSeconds - elapsedSeconds, 0);
  }, [activity?.durationSeconds, elapsedSeconds]);

  const sensationLabel =
    region && sensation
      ? getSomaticSensationOptions(region).find(
          (item) => item.value === sensation,
        )?.label
      : null;

  const screenDefinition = activityKey
    ? getSomaticScreenDefinition(activityKey)
    : null;
  const headActivityContent =
    region === "head" && activityKey ? renderHeadActivity(activityKey) : null;
  const heartActivityContent =
    region === "heart" && activityKey ? renderHeartActivity(activityKey) : null;
  const handsLegsActivityContent =
    region === "hands_legs" && activityKey ? renderHandsLegsActivity(activityKey) : null;
  const customActivityContent =
    headActivityContent ?? heartActivityContent ?? handsLegsActivityContent;
  const useSingleColumnLayout = Boolean(customActivityContent);

  const currentPathIndex = activityKey ? pathwayKeys.indexOf(activityKey) : -1;
  const nextActivityKey =
    currentPathIndex >= 0 ? (pathwayKeys[currentPathIndex + 1] ?? null) : null;
  const nextHref =
    courseId && gameId && nextActivityKey
      ? appRoutes.courseGameActivity(courseId, gameId, nextActivityKey, {
          contentItemId: contentItemId || undefined,
          videoId: returnVideoId || undefined,
          region: region || undefined,
          sensation: sensation || undefined,
        })
      : backHref;

  const completeAndReturn = (status: "completed" | "skipped") => {
    if (!courseId || !gameId || !activityKey || !activity) return;

    updateSomaticDraftActivity(courseId, gameId, activityKey, {
      durationSeconds: elapsedSeconds || activity.durationSeconds || 60,
      status,
    });

    showToast({
      type: status === "completed" ? "success" : "info",
      message:
        status === "completed"
          ? "Practice marked complete"
          : "Practice skipped for now",
      options: {
        description:
          status === "completed"
            ? nextActivityKey
              ? "Moving you into the next somatic activity."
              : "Returning to the somatic pathway."
            : "You can revisit this activity again from the somatic pathway.",
      },
    });

    navigate(status === "completed" && nextActivityKey ? nextHref : backHref);
  };

  if (loading) {
    return (
      <MainPageShell activeItem="Games">
        <div className="space-y-6">
          <ShimmerBlock className="h-40 w-full rounded-[32px]" />
          <ShimmerBlock className="h-[360px] w-full rounded-[32px]" />
          <ShimmerBlock className="h-40 w-full rounded-[32px]" />
        </div>
      </MainPageShell>
    );
  }

  if (error || !courseId || !gameId || !activityKey || !activity) {
    return (
      <MainPageShell activeItem="Games">
        <div className="rounded-[32px] bg-white px-8 py-16 text-center shadow-sm">
          <p className="text-lg font-semibold text-[#1a2e38]">
            We couldn&apos;t open this somatic activity.
          </p>
          <p className="mt-2 text-sm text-[#6c7a7a]">
            {error || "Activity not found."}
          </p>
          <MainButton className="mt-6" onClick={() => navigate(backHref)}>
            Back to somatic flow
          </MainButton>
        </div>
      </MainPageShell>
    );
  }

  return (
    <MainPageShell activeItem="Games">
      <div className="mx-auto max-w-6xl space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="rounded-[32px] border border-[rgba(39,107,115,0.12)] bg-[linear-gradient(135deg,#143845_0%,#255b67_52%,#347785_100%)] px-8 py-8 text-white shadow-[0_22px_52px_rgba(17,45,52,0.16)]"
        >
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/68">
                {screenDefinition?.eyebrow || "Somatic activity screen"}
              </p>
              <h1 className="mt-3 text-[34px] font-bold leading-tight">
                {screenDefinition?.title || activity.title}
              </h1>
              <p className="mt-4 text-sm leading-7 text-white/78">
                {screenDefinition?.intro || activity.instruction}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <StatusPill className="border border-white/15 bg-white/10 text-white/85">
                  {activity.subtitle}
                </StatusPill>
                {region ? (
                  <StatusPill className="border border-white/15 bg-white/10 text-white/85">
                    {somaticRegionMeta[region].label}
                  </StatusPill>
                ) : null}
                {sensationLabel ? (
                  <StatusPill className="border border-white/15 bg-white/10 text-white/85">
                    {sensationLabel}
                  </StatusPill>
                ) : null}
              </div>
            </div>

            <MainButton
              variant="outline"
              onClick={() => navigate(backHref)}
              className="border-white/30 bg-white/10 text-white hover:bg-white/15 hover:text-white"
            >
              Back to somatic flow
            </MainButton>
          </div>
        </motion.section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_320px] 2xl:grid-cols-[minmax(0,1.7fr)_340px]">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.04 }}
            className="space-y-5"
          >
            {customActivityContent ?? (
              <SomaticActivityVisual
                activity={activity}
                elapsedSeconds={elapsedSeconds}
                isPlaying={isPlaying}
              />
            )}
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 }}
            className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[0_18px_42px_rgba(36,72,66,0.08)] xl:sticky xl:top-28 xl:self-start"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Practice guide
            </p>
            <h3 className="mt-2 text-xl font-semibold text-[var(--text)]">
              How to use this screen
            </h3>

            <div className="mt-5 space-y-3 text-sm leading-6 text-[var(--muted)]">
              {(
                screenDefinition?.steps ?? [
                  "Start the timer and use the visual as a soft anchor.",
                  "Stay with sensation more than analysis.",
                  "Complete or skip the practice to return to the pathway.",
                ]
              ).map((step, index) => (
                <div
                  key={index}
                  className="rounded-[20px] bg-[var(--surface)] px-4 py-3"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                    Step {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-1 font-semibold text-[var(--text)]">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <MainButton
                className="w-full"
                variant="soft"
                onClick={() => completeAndReturn("skipped")}
              >
                Skip this activity
              </MainButton>
              <MainButton
                className="w-full"
                variant="ghost"
                onClick={() => navigate(nextActivityKey ? nextHref : backHref)}
              >
                {nextActivityKey ? "Go to next activity" : "Return to pathway"}
              </MainButton>
            </div>
          </motion.aside>
        </div>
      </div>
    </MainPageShell>
  );
};

export default SomaticActivityPage;

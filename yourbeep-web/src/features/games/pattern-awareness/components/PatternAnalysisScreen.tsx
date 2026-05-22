import { useMemo } from "react";
import MainButton from "@components/ui/MainButton";
import {
  patternAwarenessExercises,
  patternInsightCards,
} from "../services/patternAwarenessConfig";
import { buildExerciseResultViewFromBackend } from "../services/exerciseResultPresentation";
import type { PatternAwarenessExerciseKey, PatternAwarenessSessionState } from "@store/slices/games";
import type { PatternBackendExerciseResult, PatternResultData, SketchStroke } from "../types";

type PatternAnalysisScreenProps = {
  session: PatternAwarenessSessionState;
  signatureStrokes: SketchStroke[];
  backendResult?: PatternResultData | null;
  backendResultsByExercise?: Partial<
    Record<PatternAwarenessExerciseKey, PatternBackendExerciseResult>
  >;
  onBack: () => void;
  onDone: () => void;
  submitting: boolean;
};

const metricToneClasses = [
  "bg-[#daf1e7] text-[#2e8e5f]",
  "bg-[#eef2ff] text-[#7180b5]",
  "bg-[#f4f2ff] text-[#9686bb]",
  "bg-[#fff0d7] text-[#b57b1a]",
  "bg-[#ecf0f4] text-[#8693a2]",
];

const scoreToPercent = (score: number) =>
  Math.max(0, Math.min(100, Math.round((score / 3) * 100)));

const scoreToLabel = (score: number) => {
  if (score >= 2.5) return "High";
  if (score >= 1.75) return "Medium";
  return "Low";
};

const formatLabel = (value: unknown, fallback = "—") => {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }

  return value;
};

const getSignaturePath = (strokes: SketchStroke[]) =>
  strokes
    .filter((stroke) => stroke.points.length > 1)
    .map(
      (stroke) =>
        `M ${stroke.points
          .map((point) => `${(point.x / 1000) * 180} ${(point.y / 700) * 180}`)
          .join(" L ")}`,
    )
    .join(" ");

const PatternAnalysisScreen = ({
  signatureStrokes,
  backendResult = null,
  backendResultsByExercise = {},
  onBack,
  onDone,
  submitting,
}: PatternAnalysisScreenProps) => {
  const signaturePath = getSignaturePath(signatureStrokes);
  const labels = backendResult?.labels ?? {};
  const presenceScore = Number(backendResult?.presenceScore ?? 0);
  const actionScore = Number(backendResult?.actionScore ?? 0);
  const patternScore = Number(backendResult?.patternScore ?? 0);
  const overallScore = Number(backendResult?.overallScore ?? backendResult?.progressScore ?? 0);
  const overallPercent = scoreToPercent(overallScore || patternScore || presenceScore);

  const exerciseSummaries = useMemo(
    () =>
      patternAwarenessExercises.map((definition) => {
        const fromResult = backendResult?.exercises?.find(
          (item) => item.exerciseKey === definition.key,
        );
        const exercise =
          backendResultsByExercise[definition.key] ?? fromResult ?? null;
        const view = exercise
          ? buildExerciseResultViewFromBackend(definition.key, exercise)
          : null;

        return {
          ...definition,
          exercise,
          view,
        };
      }),
    [backendResult?.exercises, backendResultsByExercise],
  );

  const exercises = backendResult?.exercises ?? [];
  const breathExercise = exercises.find((item) => item.exerciseKey === "draw_your_breath");
  const circleExercise = exercises.find((item) => item.exerciseKey === "awareness_circles");
  const scribbleExercise = exercises.find((item) => item.exerciseKey === "scribble_drawing");

  const breathDiagnostics = breathExercise?.scores?.diagnostics ?? breathExercise?.metrics ?? {};
  const circleDiagnostics = circleExercise?.scores?.diagnostics ?? circleExercise?.metrics ?? {};

  const cardValues = [
    formatLabel(labels.presenceAttention, `${scoreToPercent(presenceScore)}%`),
    formatLabel(labels.action, `${scoreToPercent(actionScore)}%`),
    formatLabel(labels.pattern, `${scoreToPercent(patternScore)}%`),
    `${Math.round(Number(breathDiagnostics.coverage ?? breathDiagnostics.spatialCoverage ?? 0) * 100)}%`,
    formatLabel(circleDiagnostics.circlePattern, "Defined Spatial"),
  ];

  const cardProgress = [
    scoreToPercent(presenceScore),
    scoreToPercent(actionScore),
    scoreToPercent(patternScore),
    scoreToPercent(Number(scribbleExercise?.scores?.patternScore ?? actionScore)),
    scoreToPercent(overallScore || patternScore),
  ];

  return (
    <section className="w-full min-w-0 overflow-x-hidden rounded-[20px] bg-[#f8f5ea] px-3 py-4 sm:rounded-[28px] sm:px-4 sm:py-5 md:px-6 md:py-6">
      <div className="mx-auto w-full min-w-0 max-w-none">
        <div className="text-center">
          <h2 className="text-xl font-bold leading-tight text-[#0d475d] sm:text-2xl">
            Pattern Analysis
          </h2>
          <p className="mx-auto mt-2 max-w-xl px-1 text-xs leading-snug text-[#596d72] sm:text-[13px]">
            Your session scores are calculated from all three drawing exercises
            using the backend presence, action, and pattern criteria.
          </p>
        </div>

        <div className="mx-auto mt-4 flex w-full max-w-[13rem] justify-center rounded-[16px] bg-white p-3 shadow-[0_10px_28px_rgba(25,48,54,0.07)] sm:mt-5 sm:max-w-[14rem] sm:rounded-[18px] sm:p-3.5">
          <div className="relative aspect-square w-full max-w-[9.5rem] overflow-hidden rounded-[14px] bg-[radial-gradient(circle_at_center,#5db7d0_0%,#163646_54%,#0b1721_100%)] sm:max-w-[10.25rem] sm:rounded-[16px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_60%)]" />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 180 180" preserveAspectRatio="xMidYMid meet">
              {signaturePath ? (
                <path
                  d={signaturePath}
                  fill="none"
                  stroke="rgba(133,220,255,0.42)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              ) : null}
            </svg>
            <div className="absolute bottom-1.5 left-1.5 right-1.5 rounded-full bg-black/55 px-2 py-1 text-center text-[9px] text-white sm:bottom-2 sm:left-2 sm:right-auto sm:text-[10px]">
              <div className="font-medium leading-tight">Alpha Signature</div>
              <div className="text-[9px] tabular-nums leading-tight text-white/70">
                {overallPercent}/100
              </div>
            </div>
          </div>
        </div>

        {backendResult ? (
          <div className="mx-auto mt-4 grid max-w-xl grid-cols-3 gap-2 rounded-[16px] bg-white p-3 shadow-[0_8px_20px_rgba(20,42,48,0.05)] sm:mt-5 sm:gap-3 sm:p-4">
            {[
              {
                label: "Presence",
                value: formatLabel(
                  labels.presenceAttention,
                  scoreToLabel(presenceScore),
                ),
              },
              {
                label: "Action",
                value: formatLabel(labels.action, scoreToLabel(actionScore)),
              },
              {
                label: "Pattern",
                value: formatLabel(labels.pattern, scoreToLabel(patternScore)),
              },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a888d]">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#11475c]">{item.value}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-5 sm:mt-6">
          <h3 className="text-center text-sm font-semibold text-[#11475c] sm:text-base">
            Exercise Summaries
          </h3>
          <p className="mx-auto mt-1.5 max-w-xl text-center text-xs leading-snug text-[#6c7b7d] sm:text-[13px]">
            Individual results from each drawing exercise in your session.
          </p>
          <div className="mt-3 grid gap-3 sm:mt-4 lg:grid-cols-3">
            {exerciseSummaries.map(({ key, title, accent, view }) => (
              <div
                key={key}
                className="min-w-0 rounded-[16px] bg-white p-4 shadow-[0_10px_26px_rgba(20,42,48,0.06)] sm:rounded-[18px] sm:p-[1.125rem]"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: accent }}
                    aria-hidden
                  />
                  <h4 className="text-base font-semibold leading-snug text-[#11475c]">
                    {title}
                  </h4>
                </div>

                {view ? (
                  <>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[4px] border-[#55785c] text-center">
                        <span className="text-sm font-semibold leading-none text-[#1d3035]">
                          {view.primaryValue}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a888d]">
                          {view.primaryLabel}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-[13px] leading-relaxed text-[#6c7b7d] sm:text-sm">
                      {view.insight}
                    </p>

                    <div className="mt-3 space-y-2">
                      {view.metrics.slice(0, 3).map((metric) => (
                        <div
                          key={metric.label}
                          className="flex items-center justify-between gap-2 rounded-[12px] bg-[#f7f7f2] px-3 py-2"
                        >
                          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7889ad]">
                            {metric.label}
                          </span>
                          <span className="text-sm font-semibold text-[#1d3035]">
                            {metric.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="mt-4 text-sm leading-relaxed text-[#8a9690]">
                    Complete and save this exercise to see its summary here.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid w-full gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-3">
          {patternInsightCards.map((card, index) => (
            <div
              key={card.title}
              className="min-w-0 rounded-[16px] bg-white p-4 shadow-[0_10px_26px_rgba(20,42,48,0.06)] sm:rounded-[18px] sm:p-[1.125rem]"
            >
              <div className="flex flex-wrap items-start justify-between gap-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7a888d] sm:text-xs">
                    Metric
                  </p>
                  <h3 className="mt-1 text-base font-semibold leading-snug text-[#11475c] sm:text-lg">
                    {card.title}
                  </h3>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] sm:text-[10px] sm:tracking-[0.12em] ${metricToneClasses[index % metricToneClasses.length]}`}
                >
                  {cardValues[index]}
                </span>
              </div>

              <p className="mt-3 text-[13px] leading-relaxed text-[#6c7b7d] sm:text-sm">
                {card.subtitle}
              </p>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eceff0]">
                <div
                  className="h-full rounded-full bg-[#0a8b86] transition-all duration-500"
                  style={{ width: `${cardProgress[index]}%` }}
                />
              </div>

              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs font-semibold text-[#5d7076] sm:text-[13px]">
                <span className="min-w-0 break-words">{cardValues[index]}</span>
                <span className="shrink-0 tabular-nums">{cardProgress[index]}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col items-stretch justify-between gap-3 sm:mt-6 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onBack}
            className="order-2 py-2 text-center text-xs font-semibold text-[#143f56] transition hover:opacity-70 sm:order-1 sm:py-0 sm:text-left sm:text-sm"
          >
            Back
          </button>
          <MainButton
            onClick={onDone}
            isLoading={submitting}
            className="order-1 w-full min-w-0 bg-[#0f4d65] text-sm text-white sm:order-2 sm:w-auto sm:min-w-[130px] sm:self-end"
          >
            Done
          </MainButton>
        </div>
      </div>
    </section>
  );
};

export default PatternAnalysisScreen;

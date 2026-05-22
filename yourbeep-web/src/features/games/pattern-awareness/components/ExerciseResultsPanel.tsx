import { motion, AnimatePresence } from "framer-motion";
import type { PatternAwarenessExerciseKey } from "@store/slices/games";
import { buildExerciseResultViewFromBackend } from "../services/exerciseResultPresentation";
import { PATTERN_DRAWING_MIN_H } from "./patternLayoutTokens";
import type { PatternBackendExerciseResult } from "../types";

type ExerciseResultsPanelProps = {
  exerciseKey: PatternAwarenessExerciseKey;
  visible: boolean;
  loading?: boolean;
  error?: string | null;
  backendExercise: PatternBackendExerciseResult | null;
};

const ExerciseResultsPanel = ({
  exerciseKey,
  visible,
  loading = false,
  error = null,
  backendExercise,
}: ExerciseResultsPanelProps) => {
  const view =
    visible && backendExercise
      ? buildExerciseResultViewFromBackend(exerciseKey, backendExercise)
      : null;

  return (
    <aside
      className={`flex min-h-0 min-w-0 flex-col rounded-[14px] bg-white px-2.5 py-2.5 shadow-[0_12px_24px_rgba(25,48,54,0.07)] sm:rounded-[18px] sm:px-3 sm:py-3 md:h-full ${PATTERN_DRAWING_MIN_H}`}
    >
      <div className="shrink-0 border-b border-[#eef1f0] pb-2">
        <h3 className="text-[13px] font-semibold leading-snug text-[#1d3035] sm:text-sm">
          Session Analytics
        </h3>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-3 flex min-h-[7rem] flex-col items-center justify-center rounded-[12px] bg-[#fafaf7] px-3 py-5 text-center"
            >
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#55785c] border-t-transparent" />
              <p className="mt-2.5 text-[11px] text-[#5d6f75]">Analyzing your pattern…</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-3 rounded-[12px] border border-[#f0d8d3] bg-[#fff7f5] px-3 py-3 text-center"
            >
              <p className="text-[11px] font-medium text-[#9a4a3d]">Could not load results</p>
              <p className="mt-1.5 text-[10px] leading-relaxed text-[#b06a5d]">{error}</p>
            </motion.div>
          ) : !view ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="mt-3 flex min-h-[7rem] flex-col items-center justify-center rounded-[12px] border border-dashed border-[#dfe5e3] bg-[#fafaf7] px-3 py-5 text-center"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef3f0] text-[#6f8b73]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M4 18 L8 12 L12 15 L16 8 L20 11"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="mt-2.5 text-[11px] font-medium text-[#4f6166]">Draw on the canvas</p>
              <p className="mt-1 max-w-[12rem] text-[10px] leading-relaxed text-[#7a898d]">
                Results appear after you finish a stroke and lift your pen.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2.5 pb-1"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex aspect-square w-full max-w-[5.25rem] items-center justify-center rounded-full border-[4px] border-[#55785c] p-1.5 text-center sm:max-w-[5.75rem]">
                  <div className="min-w-0 px-0.5">
                    <div className="text-base font-semibold leading-none text-[#1d3035] sm:text-lg">
                      {view.primaryValue}
                    </div>
                    <div className="mt-0.5 break-words text-[8px] font-semibold uppercase leading-tight tracking-[0.08em] text-[#5d6f75]">
                      {view.primaryLabel}
                    </div>
                  </div>
                </div>
                <p className="text-center text-[10px] leading-snug text-[#66777b] sm:text-[11px]">
                  {view.insight}
                </p>
              </div>

              <div className="mt-2.5 space-y-1.5">
                {view.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-center justify-between gap-1.5 rounded-[10px] bg-[#f7f7f2] px-2 py-1.5"
                  >
                    <span className="min-w-0 text-[8px] font-semibold uppercase tracking-[0.1em] text-[#7889ad]">
                      {metric.label}
                    </span>
                    <span className="shrink-0 text-[11px] font-semibold text-[#1d3035]">
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>

              {view.rhythmBars ? (
                <div className="mt-2.5">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#7889ad]">
                    Rhythm Profile
                  </p>
                  <div className="mt-1.5 rounded-[12px] bg-[#f7f7f2] p-2">
                    <div className="flex items-end justify-center gap-4">
                      {(["Start", "End"] as const).map((label, index) => (
                        <div key={label} className="flex h-14 flex-col items-center">
                          <div className="flex min-h-0 w-8 flex-1 items-end">
                            <div
                              className="w-full rounded-t-sm bg-[#6f8b73] transition-all duration-500"
                              style={{
                                height: `${view.rhythmBars![index]}%`,
                                minHeight: "0.35rem",
                              }}
                            />
                          </div>
                          <span className="mt-1 text-[8px] font-medium uppercase tracking-[0.1em] text-[#60715d]">
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-2.5">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#7889ad]">
                    Consistency Profile
                  </p>
                  <div className="mt-1.5 rounded-[12px] bg-[#f7f7f2] p-2">
                    <div className="flex h-14 items-center justify-center">
                      <div
                        className="rounded-full border-2 border-[#6f8b73] transition-all duration-500"
                        style={{
                          width: `${Math.min(view.profileScale * 3.5, 5.5)}rem`,
                          height: `${Math.min(view.profileScale * 3.5, 5.5)}rem`,
                        }}
                      />
                    </div>
                    <p className="mt-1 text-center text-[9px] text-[#60715d]">Core Path</p>
                  </div>
                </div>
              )}

              <div className="mt-2.5">
                <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#7889ad]">
                  Trace Distribution
                </p>
                <div className="mt-1.5 rounded-[12px] bg-[#f7f7f2] p-2">
                  <div className="relative h-14">
                    <div className="absolute left-1/2 top-1.5 bottom-1.5 w-px bg-[#c5cac4]" />
                    <div className="absolute top-1/2 left-1.5 right-1.5 h-px bg-[#c5cac4]" />
                    {view.scatterPoints.length ? (
                      view.scatterPoints.map((point, index) => (
                        <span
                          key={`${point.x}-${point.y}-${index}`}
                          className="absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#708d73]"
                          style={{
                            left: `${Math.max(6, Math.min(94, point.x))}%`,
                            top: `${Math.max(6, Math.min(94, point.y))}%`,
                          }}
                        />
                      ))
                    ) : (
                      <p className="absolute inset-0 flex items-center justify-center text-[9px] text-[#8a9690]">
                        No trace stored
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};

export default ExerciseResultsPanel;

import { ArrowRight, Check, Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import MainButton from "@components/ui/MainButton";
import { exerciseIconMap, patternAwarenessExercises } from "../services/patternAwarenessConfig";
import type { PatternAwarenessExerciseKey, PatternAwarenessSessionState } from "@store/slices/games";

type PatternAwarenessHubProps = {
  session: PatternAwarenessSessionState;
  onSelectExercise: (exerciseKey: PatternAwarenessExerciseKey) => void;
  onContinue: () => void;
};

const getProgressLabel = (status: PatternAwarenessSessionState["exercises"][PatternAwarenessExerciseKey]["status"], score: number) => {
  if (status === "completed") {
    return `${Math.max(100, score)}% Complete`;
  }

  if (status === "in_progress") {
    return `${Math.max(25, score || 42)}% Progress`;
  }

  return "Not started";
};

const getProgressWidth = (status: PatternAwarenessSessionState["exercises"][PatternAwarenessExerciseKey]["status"], score: number) => {
  if (status === "completed") return "100%";
  if (status === "in_progress") return `${Math.max(32, score || 42)}%`;
  return "0%";
};

const getButtonLabel = (status: PatternAwarenessSessionState["exercises"][PatternAwarenessExerciseKey]["status"]) => {
  if (status === "completed") return "Replay";
  if (status === "in_progress") return "Resume";
  return "Start";
};

const PatternAwarenessHub = ({
  session,
  onSelectExercise,
  onContinue,
}: PatternAwarenessHubProps) => {
  const completedCount = Object.values(session.exercises).filter(
    (exercise) => exercise.status === "completed",
  ).length;

  return (
    <section className="w-full rounded-[24px] bg-white px-4 py-6 shadow-[0_28px_80px_rgba(21,49,56,0.09)] sm:rounded-[28px] sm:px-6 sm:py-7 md:px-8 md:py-8 lg:px-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.22 }}
        className="flex flex-col"
      >
        <div className="rounded-[18px] border border-dashed border-[#80bdf8] px-4 py-5 text-center sm:rounded-[22px] sm:px-6 sm:py-6 md:py-7">
          <h1 className="mx-auto w-full max-w-none text-balance text-xl font-bold leading-snug tracking-tight text-[#0d4d63] sm:text-2xl md:text-3xl">
            How would you like to map your breathe
          </h1>
        </div>

        <div className="mt-6 md:mt-7">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="text-base font-bold text-[#202b2f] sm:text-lg">
              Exercises
            </h2>
            <p className="text-xs font-medium tabular-nums text-[#54717a] sm:text-sm">
              {completedCount}/3 completed
            </p>
          </div>

          <div className="mt-4 space-y-3 md:mt-5 md:space-y-3.5">
            {patternAwarenessExercises.map((exercise, index) => {
              const Icon = exerciseIconMap[exercise.key];
              const itemState = session.exercises[exercise.key];

              return (
                <motion.button
                  key={exercise.key}
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                  onClick={() => onSelectExercise(exercise.key)}
                  className="flex w-full flex-col gap-3 rounded-[20px] border border-[#f2f2f2] bg-[#fcfcfb] px-4 py-4 text-left shadow-[0_8px_20px_rgba(28,40,45,0.04)] transition-shadow hover:shadow-[0_10px_24px_rgba(28,40,45,0.07)] md:flex-row md:items-center md:justify-between md:gap-6 md:px-5 md:py-4"
                >
                  <div className="flex min-w-0 items-center gap-3 md:gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:h-14 sm:w-14"
                      style={{ backgroundColor: `${exercise.accent}18`, color: exercise.accent }}
                    >
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="min-w-0 break-words text-base font-semibold leading-snug text-[#20272d] sm:text-[1.0625rem]">
                          {exercise.title}
                        </h3>
                        {itemState.status === "completed" ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#d8efe0] text-[#2b7b53]">
                            <Check size={14} />
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#6f8386] sm:text-sm">
                        <Clock3 size={14} className="shrink-0" />
                        <span>{exercise.durationLabel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-2.5 md:max-w-[min(100%,20rem)] md:items-end md:shrink-0 lg:max-w-[min(100%,22rem)]">
                    <div className="flex w-full items-center justify-between text-xs font-medium text-[#5e747a] sm:text-sm">
                      <span>{getProgressLabel(itemState.status, itemState.score)}</span>
                      <span>{getButtonLabel(itemState.status)}</span>
                    </div>
                    <div className="flex w-full items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#edf0ef]">
                        <div
                          className="h-full rounded-full bg-[#0f4d65]"
                          style={{ width: getProgressWidth(itemState.status, itemState.score) }}
                        />
                      </div>
                      <div
                        className={`min-w-[5.5rem] rounded-full px-4 py-1.5 text-center text-xs font-semibold sm:min-w-[6rem] sm:px-4 sm:py-2 sm:text-sm ${
                          itemState.status === "completed"
                            ? "border border-[#cfd8dc] bg-white text-[#22475b]"
                            : itemState.status === "in_progress"
                              ? "bg-[#d4e2e7] text-[#22475b]"
                              : "bg-[#5a5c60] text-white"
                        }`}
                      >
                        {getButtonLabel(itemState.status)}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex justify-center px-2 md:mt-9">
          <MainButton
            onClick={onContinue}
            className="w-full max-w-sm bg-[#0f4d65] text-white sm:w-auto sm:min-w-[160px]"
            tailIcon={<ArrowRight size={18} />}
          >
            Continue
          </MainButton>
        </div>
      </motion.div>
    </section>
  );
};

export default PatternAwarenessHub;

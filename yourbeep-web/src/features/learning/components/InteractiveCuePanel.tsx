import { useNavigate } from "react-router-dom";
import PrimaryButton from "@components/common/PrimaryButton";
import { appRoutes } from "@constants/routes";
import type { InteractiveCue } from "../services/learningTypes";

type InteractiveCuePanelProps = {
  courseId: string;
  videoId: string;
  contentItemId?: string;
  cues: InteractiveCue[];
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
};

const InteractiveCuePanel = ({
  courseId,
  videoId,
  contentItemId,
  cues,
}: InteractiveCuePanelProps) => {
  const navigate = useNavigate();

  if (!cues.length) {
    return null;
  }

  return (
    <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7d9192]">
          Interactive cues
        </p>
        <h2 className="mt-2 text-[26px] font-bold text-[#1a2e38]">
          Practice moments inside this lesson
        </h2>
        <p className="mt-2 text-sm leading-7 text-[#607172]">
          When you&apos;re ready, open the exact activity linked to each cue and return to the lesson afterwards.
        </p>
      </div>

      <div className="grid gap-4">
        {cues.map((cue) => (
          <div key={`${cue.gameId}-${cue.triggerAtSeconds}`} className="rounded-2xl bg-[#f6f8f7] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#587173]">
                  {formatTime(cue.triggerAtSeconds)} · {cue.gameKey.replaceAll("_", " ")}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[#1d3840]">
                  {cue.title || cue.gameTitle}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#607172]">
                  {cue.description || "Open the linked practice and continue your learning with the exact guided activity."}
                </p>
              </div>

              <PrimaryButton
                onClick={() =>
                  navigate(
                    appRoutes.courseGame(courseId, cue.gameId, {
                      contentItemId,
                      videoId,
                      cueAt: cue.triggerAtSeconds,
                    }),
                  )
                }
                className="rounded-full px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em]"
              >
                {cue.ctaLabel || "Start activity"}
              </PrimaryButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveCuePanel;

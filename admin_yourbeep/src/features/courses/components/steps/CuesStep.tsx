import { AnimatePresence, motion } from "framer-motion";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
  type SyntheticEvent,
} from "react";
import {
  FiClock,
  FiPauseCircle,
  FiPlayCircle,
  FiTrash2,
  FiVideo,
  FiZap,
} from "react-icons/fi";
import { AnimatedDropdown } from "../../../../components/ui/AnimatedDropdown";
import { ConfirmDialog } from "../../../../components/ui/ConfirmDialog";
import { InputField } from "../../../../components/ui/InputField";
import { MainButton } from "../../../../components/ui/MainButton";
import { ShimmerBlock } from "../../../../components/ui/ShimmerBlock";
import { VideoPreviewPlayer } from "../../../../components/ui/VideoPreviewPlayer";
import { IconButton } from "../../../../components/ui/IconButton";
import {
  getGameSubActivityLabel,
  getGameSubActivityOptions,
} from "../../services/gameSubActivities";

type ContentVideoItem = {
  _id?: string;
  refId: string;
  videoId?: string;
  title: string;
  description?: string;
  order: number;
  thumbnailUrl?: string | null;
  videoStatus?: string | null;
};

type GameItem = {
  _id: string;
  key?: string | null;
  title: string;
};

type CueFormState = {
  gameId: string;
  subActivityKey: string;
  triggerAtSeconds: string;
  title: string;
  description: string;
  ctaLabel: string;
  pauseVideo: boolean;
  isSkippable: boolean;
};

type VideoCueItem = {
  _id: string;
  gameId: string;
  subActivityKey?: string | null;
  gameTitle?: string | null;
  triggerAtSeconds: number;
  title?: string | null;
  description?: string | null;
  ctaLabel?: string | null;
  pauseVideo: boolean;
  isSkippable: boolean;
};

type CuesStepProps = {
  videoItems: ContentVideoItem[];
  selectedVideoId: string;
  setSelectedVideoId: Dispatch<SetStateAction<string>>;
  cueForm: CueFormState;
  setCueForm: Dispatch<SetStateAction<CueFormState>>;
  gameItems: GameItem[];
  videoCues: VideoCueItem[];
  cuePreviewLoading: boolean;
  cuePreviewStreamUrl: string | null;
  cuePreviewThumbnailUrl: string | null;
  cuePreviewStatus: string | null;
  onAddCue: () => Promise<void> | void;
  onRemoveCue: (cueId: string) => Promise<void> | void;
  onBack: () => void;
  onNext: () => void;
  loading: boolean;
};

const formatSeconds = (value: number | string) => {
  const seconds = Math.max(0, Number(value || 0));
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
};

const clampPercent = (value: number) => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
};

function CueToggle({
  active,
  label,
  description,
  onClick,
}: {
  active: boolean;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-left transition ${
        active
          ? "border-[#0d6e6e] bg-[#eef7f5] shadow-[0_10px_30px_rgba(13,110,110,0.08)]"
          : "border-[#dfe8d6] bg-white hover:bg-[#f8fbf6]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-[#203321]">{label}</span>
        <span
          className={`h-5 w-9 rounded-full p-0.5 transition ${
            active ? "bg-[#0d6e6e]" : "bg-[#d9e2d0]"
          }`}
        >
          <span
            className={`block h-4 w-4 rounded-full bg-white transition ${
              active ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </span>
      </div>
    </motion.button>
  );
}

export default function CuesStep({
  videoItems,
  selectedVideoId,
  setSelectedVideoId,
  cueForm,
  setCueForm,
  gameItems,
  videoCues,
  cuePreviewLoading,
  cuePreviewStreamUrl,
  cuePreviewThumbnailUrl,
  cuePreviewStatus,
  onAddCue,
  onRemoveCue,
  onBack,
  onNext,
  loading,
}: CuesStepProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedCueId, setSelectedCueId] = useState<string | null>(null);
  const [pendingDeleteCue, setPendingDeleteCue] = useState<VideoCueItem | null>(
    null,
  );

  const sortedCues = useMemo(
    () =>
      [...videoCues].sort(
        (left, right) => left.triggerAtSeconds - right.triggerAtSeconds,
      ),
    [videoCues],
  );

  const selectedVideo = useMemo(
    () => videoItems.find((item) => item.refId === selectedVideoId) ?? null,
    [selectedVideoId, videoItems],
  );

  const selectedCue = useMemo(
    () =>
      sortedCues.find((cue) => cue._id === selectedCueId) ??
      sortedCues[0] ??
      null,
    [selectedCueId, sortedCues],
  );

  useEffect(() => {
    setSelectedCueId(sortedCues[0]?._id ?? null);
  }, [selectedVideoId, sortedCues]);

  const jumpToCue = (cue: VideoCueItem) => {
    setSelectedCueId(cue._id);

    const element = videoRef.current;
    if (!element) {
      return;
    }

    element.currentTime = cue.triggerAtSeconds;
    void element.play().catch(() => {
      element.pause();
    });
  };

  const handleMetadata = (event: SyntheticEvent<HTMLVideoElement>) => {
    const nextDuration = Number(event.currentTarget.duration || 0);
    setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
  };

  const handleTimeUpdate = (event: SyntheticEvent<HTMLVideoElement>) => {
    setCurrentTime(Number(event.currentTarget.currentTime || 0));
  };

  const videoOptions = videoItems.map((video) => ({
    label: `${video.title} · order ${video.order}`,
    value: video.refId,
  }));

  const gameOptions = gameItems.map((game) => ({
    label: game.title,
    value: game._id,
  }));
  const selectedGame = gameItems.find((game) => game._id === cueForm.gameId) ?? null;
  const subActivityOptions = getGameSubActivityOptions(selectedGame?.key).map((item) => ({
    label: item.label,
    value: item.value,
  }));

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-2 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#203321]">
              In-video cue points
            </h2>
            <p className="mt-1 text-sm text-[#74816f]">
              Choose the lesson, place cue markers on the timeline, and let the
              admin preview the interaction before publishing.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-[#e7eadf] bg-[#f7faf2] px-3 py-2 text-xs font-medium text-[#61705d]">
            <FiZap className="text-[#0d6e6e]" />
            {sortedCues.length} cue{sortedCues.length === 1 ? "" : "s"} mapped
            to this lesson
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_420px]">
          <div className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#314330]">Video</p>
                <AnimatedDropdown
                  name="selectedVideoId"
                  value={selectedVideoId}
                  placeholder="Select a course video"
                  options={videoOptions}
                  onChange={setSelectedVideoId}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#314330]">Game</p>
                <AnimatedDropdown
                  name="cueGameId"
                  value={cueForm.gameId}
                  placeholder="Select a course game"
                  options={gameOptions}
                  onChange={(value) =>
                    setCueForm((current) => ({
                      ...current,
                      gameId: value,
                      subActivityKey: "",
                    }))
                  }
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#314330]">Sub activity</p>
                <AnimatedDropdown
                  name="cueSubActivityKey"
                  value={cueForm.subActivityKey}
                  placeholder={
                    selectedGame?.key ? "Select a game checkpoint" : "Select a game first"
                  }
                  options={subActivityOptions}
                  onChange={(value) =>
                    setCueForm((current) => ({ ...current, subActivityKey: value }))
                  }
                  className="w-full"
                />
              </div>

              <InputField
                label="Trigger time in seconds"
                type="number"
                value={cueForm.triggerAtSeconds}
                placeholder="38"
                onChange={(event) =>
                  setCueForm((current) => ({
                    ...current,
                    triggerAtSeconds: event.target.value,
                  }))
                }
                helpText="Use a precise second so the game prompt opens exactly where you expect."
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="CTA label"
                value={cueForm.ctaLabel}
                placeholder="Start Activity"
                onChange={(event) =>
                  setCueForm((current) => ({
                    ...current,
                    ctaLabel: event.target.value,
                  }))
                }
                helpText="This is the button label learners will see inside the lesson popup."
              />

              <div>
                <InputField
                  label="Cue title"
                  value={cueForm.title}
                  placeholder="Pause for grounding"
                  onChange={(event) =>
                    setCueForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                />

                <div className="flex flex-col gap-3 mt-5">
                  <CueToggle
                    active={cueForm.pauseVideo}
                    label="Pause the video"
                    description="The lesson player will stop automatically when the cue is reached."
                    onClick={() =>
                      setCueForm((current) => ({
                        ...current,
                        pauseVideo: !current.pauseVideo,
                      }))
                    }
                  />
                  <CueToggle
                    active={cueForm.isSkippable}
                    label="Allow skip"
                    description="Learners can skip the activity and continue the lesson when needed."
                    onClick={() =>
                      setCueForm((current) => ({
                        ...current,
                        isSkippable: !current.isSkippable,
                      }))
                    }
                  />
                </div>
              </div>

              <InputField
                label="Cue description"
                element="textarea"
                rows={4}
                value={cueForm.description}
                placeholder="Give the learner context before they move into the interactive activity."
                onChange={(event) =>
                  setCueForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                inputClassName="min-h-[132px]"
              />
            </div>

            <div className="flex justify-end">
              <MainButton
                text={loading ? "Saving cue..." : "Add cue to timeline"}
                isLoading={loading}
                onClick={() => void onAddCue()}
                size="lg"
              />
            </div>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="rounded-[28px] border border-[#e7eadf] bg-[#f9fbf7] p-5"
          >
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-sm font-semibold text-[#203321]">
                  Current cues
                </p>
                <p className="mt-1 text-xs leading-5 text-[#74816f]">
                  Keep the list on the side, then use the video preview below
                  the editor to verify timing visually.
                </p>
              </div>

              <div className="rounded-2xl border border-[#dfe8d6] bg-white px-3 py-2 text-xs font-semibold text-[#566451]">
                {selectedVideo
                  ? `Lesson: ${selectedVideo.title}`
                  : "Select a video"}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {cuePreviewLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <ShimmerBlock
                    key={`cue-skeleton-${index}`}
                    className="h-[88px] w-full rounded-[22px]"
                  />
                ))
              ) : sortedCues.length ? (
                sortedCues.map((cue, index) => {
                  const isActive = cue._id === selectedCue?._id;

                  return (
                    <motion.div
                      key={cue._id}
                      layout
                      whileHover={{ y: -1 }}
                      className={`w-full rounded-[24px] border p-4 text-left transition ${
                        isActive
                          ? "border-[#0d6e6e] bg-[#eef7f5] shadow-[0_18px_38px_rgba(13,110,110,0.08)]"
                          : "border-[#edf1e7] bg-[#fbfcf8] hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => jumpToCue(cue)}
                          className="flex flex-1 items-start gap-4 text-left"
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-bold text-[#203321] shadow-sm">
                            {index + 1}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#203321]">
                              {cue.title || cue.gameTitle || cue.gameId}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-[#74816f]">
                              {formatSeconds(cue.triggerAtSeconds)} ·{" "}
                              {cue.pauseVideo ? "Pause video" : "Keep playing"}{" "}
                              · {cue.isSkippable ? "Skippable" : "Required"}
                            </p>

                            {cue.subActivityKey ? (
                              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4c746a]">
                                {getGameSubActivityLabel(
                                  gameItems.find((game) => game._id === cue.gameId)?.key,
                                  cue.subActivityKey,
                                ) || cue.subActivityKey}
                              </p>
                            ) : null}

                            {cue.description ? (
                              <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#62705f]">
                                {cue.description}
                              </p>
                            ) : null}
                          </div>
                        </button>

                        <div className="flex shrink-0 items-center gap-2">
                          <IconButton
                            ariaLabel="Preview cue"
                            icon={<FiPlayCircle />}
                            variant="soft"
                            size="sm"
                            onClick={() => jumpToCue(cue)}
                          />

                          <IconButton
                            ariaLabel="Delete cue"
                            icon={<FiTrash2 />}
                            variant="danger"
                            size="sm"
                            onClick={() => setPendingDeleteCue(cue)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="rounded-[24px] border border-dashed border-[#dfe8d6] bg-[#fbfcf8] px-5 py-10 text-center">
                  <p className="text-sm font-semibold text-[#314330]">
                    No cues added for this video yet
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#74816f]">
                    Add the first cue above, then use the preview below to test
                    the experience.
                  </p>
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      </motion.section>{" "}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-2 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#203321]">
              Interactive preview
            </h3>
            <p className="mt-1 text-sm text-[#74816f]">
              Click any cue dot to jump the playback head and inspect the exact
              pause point.
            </p>
          </div>
          <div className="rounded-2xl border border-[#e7eadf] bg-[#f7faf2] px-3 py-2 text-xs font-medium text-[#61705d]">
            {formatSeconds(currentTime)} / {formatSeconds(duration)}
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-[24px] border border-[#dfe8d6] bg-[#101611]">
          {cuePreviewLoading ? (
            <div className="space-y-4 p-4">
              <ShimmerBlock className="h-[220px] w-full rounded-[20px]" />
              <ShimmerBlock className="h-3 w-36 rounded-full" />
              <ShimmerBlock className="h-4 w-full rounded-full" />
            </div>
          ) : cuePreviewStreamUrl ? (
            <div className="space-y-4 p-4">
              <div className="overflow-hidden rounded-[20px] border border-white/10 bg-black">
                <VideoPreviewPlayer
                  ref={videoRef}
                  src={cuePreviewStreamUrl}
                  poster={cuePreviewThumbnailUrl}
                  className="aspect-video w-full bg-black object-contain"
                  onLoadedMetadata={handleMetadata}
                  onTimeUpdate={handleTimeUpdate}
                />
              </div>

              <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {selectedVideo?.title || "Selected lesson"}
                    </p>
                    <p className="mt-1 text-xs text-white/60">
                      Large cue markers help the admin scrub and verify the
                      learner interruption points quickly.
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-white/75">
                    order {selectedVideo?.order ?? "—"}
                  </div>
                </div>

                <div className="relative pt-24">
                  <div className="relative h-4 rounded-full bg-white/10">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#42d6c6] to-[#80e8db]"
                      animate={{
                        width: `${clampPercent(
                          duration ? (currentTime / duration) * 100 : 0,
                        )}%`,
                      }}
                    />

                    {duration > 0
                      ? sortedCues.map((cue) => {
                          const position = clampPercent(
                            (cue.triggerAtSeconds / duration) * 100,
                          );

                          const isActive = cue._id === selectedCue?._id;

                          return (
                            <button
                              key={cue._id}
                              type="button"
                              onClick={() => jumpToCue(cue)}
                              className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                              style={{ left: `${position}%` }}
                            >
                              <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                animate={
                                  isActive
                                    ? { opacity: 1, y: 0, scale: 1 }
                                    : { opacity: 0, y: 8, scale: 0.96 }
                                }
                                className="pointer-events-none absolute bottom-9 left-1/2 z-20 w-[230px] -translate-x-1/2 rounded-2xl border border-[#dfe8d6] bg-white p-3 text-left opacity-0 shadow-xl transition group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
                              >
                                <p className="truncate text-sm font-semibold text-[#203321]">
                                  {cue.title ||
                                    cue.gameTitle ||
                                    "Interactive cue"}
                                </p>

                                <p className="mt-1 text-xs font-medium text-[#72806e]">
                                  Trigger at{" "}
                                  {formatSeconds(cue.triggerAtSeconds)}
                                </p>

                                {cue.description ? (
                                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#5f6d5b]">
                                    {cue.description}
                                  </p>
                                ) : null}

                                <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-[#dfe8d6] bg-white" />
                              </motion.div>

                              <motion.span
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.96 }}
                                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 shadow-lg transition ${
                                  isActive
                                    ? "border-white bg-[#ffd66b]"
                                    : "border-[#d6fff8] bg-[#0d6e6e]"
                                }`}
                              >
                                <span className="h-2.5 w-2.5 rounded-full bg-white" />
                              </motion.span>
                            </button>
                          );
                        })
                      : null}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs text-white/70">
                  <div className="flex items-center gap-2">
                    <FiVideo className="text-[#80e8db]" />
                    {selectedVideo?.videoStatus || "preview"}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="text-[#80e8db]" />
                    {sortedCues.length} marker
                    {sortedCues.length === 1 ? "" : "s"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-10 text-center">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <FiPlayCircle className="text-3xl text-white/80" />
              </div>
              <p className="mt-4 text-sm font-semibold text-white">
                Preview not ready yet
              </p>
              <p className="mt-2 max-w-[290px] text-sm leading-6 text-white/60">
                {cuePreviewStatus ||
                  "Select a processed lesson video to preview cue placement."}
              </p>
            </div>
          )}
        </div>
      </motion.section>
      <div className="flex justify-between">
        <MainButton text="Back" variant="outline" size="lg" onClick={onBack} />
        <MainButton text="Continue to Publish" size="lg" onClick={onNext} />
      </div>

      <ConfirmDialog
        open={Boolean(pendingDeleteCue)}
        title="Delete cue marker?"
        description={`This will remove "${pendingDeleteCue?.title || pendingDeleteCue?.gameTitle || "this cue"}" from the lesson timeline.`}
        confirmText="Delete cue"
        onCancel={() => setPendingDeleteCue(null)}
        onConfirm={() => {
          if (!pendingDeleteCue) {
            return;
          }
          void onRemoveCue(pendingDeleteCue._id);
          setPendingDeleteCue(null);
        }}
      />
    </div>
  );
}

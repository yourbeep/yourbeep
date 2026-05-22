import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
  type SyntheticEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import Hls from "hls.js";
import { CheckCircle2, Clock3, PauseCircle, Play, PlayCircle, X, Zap } from "lucide-react";
import MainButton from "@components/ui/MainButton";
import StatusPill from "@components/ui/StatusPill";
import type { InteractiveCue, VideoStreamData } from "../services/learningTypes";

type VideoPlayerCardProps = {
  stream: VideoStreamData | null;
  videoRef: RefObject<HTMLVideoElement | null>;
  onOpenCueActivity?: (cue: InteractiveCue) => void;
};

type QualityOption = {
  label: string;
  value: number;
};

const cueBadgeColors: Record<string, string> = {
  awareness_states: "bg-[#f2d6cb] text-[#8d4636]",
  somatic_states: "bg-[#d7eadf] text-[#326650]",
  pattern_awareness: "bg-[#dae8f3] text-[#365b7d]",
  reflect_act: "bg-[#ede0f1] text-[#6b4181]",
};

const cueKeyFor = (cue: InteractiveCue) => `${cue.gameId}-${cue.triggerAtSeconds}`;

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainder = total % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
};

const timelinePercent = (time: number, duration: number) =>
  duration > 0 ? Math.max(0, Math.min((time / duration) * 100, 100)) : 0;

const cueWindowThresholdSeconds = 0.35;

const VideoPlayerCard = ({
  stream,
  videoRef,
  onOpenCueActivity,
}: VideoPlayerCardProps) => {
  const hlsRef = useRef<Hls | null>(null);
  const handledCueKeysRef = useRef<Set<string>>(new Set());
  const lastTimeRef = useRef(0);
  const [selectedCueKey, setSelectedCueKey] = useState<string | null>(null);
  const [isCueModalVisible, setIsCueModalVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [qualityLabel, setQualityLabel] = useState("Auto");
  const [qualityOptions, setQualityOptions] = useState<QualityOption[]>([]);

  const sortedCues = useMemo(
    () =>
      [...(stream?.interactiveCues ?? [])].sort(
        (left, right) => left.triggerAtSeconds - right.triggerAtSeconds,
      ),
    [stream?.interactiveCues],
  );

  const selectedCue =
    sortedCues.find((cue) => cueKeyFor(cue) === selectedCueKey) ?? null;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream?.streamUrl) return;

    let destroyed = false;
    let hls: Hls | null = null;

    const setup = () => {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream.streamUrl;
        video.load();
        setQualityLabel("Auto");
        setQualityOptions([]);
        return;
      }

      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          capLevelToPlayerSize: false,
        });
        hlsRef.current = hls;
        hls.loadSource(stream.streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (destroyed) return;

          const levels = hls?.levels
            .map((level) => level.height)
            .filter((height): height is number => Boolean(height));
          const uniqueLevels = [...new Set(levels)].sort((a, b) => b - a);

          setQualityOptions(
            uniqueLevels.map((level) => ({ label: `${level}p`, value: level })),
          );
          setQualityLabel("Auto");
        });

        hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
          const level = hls?.levels?.[data.level];
          setQualityLabel(level?.height ? `${level.height}p` : "Auto");
        });

        return;
      }

      video.src = stream.streamUrl;
      video.load();
      setQualityLabel("Auto");
      setQualityOptions([]);
    };

    setup();

    return () => {
      destroyed = true;
      if (hls) {
        hls.destroy();
      }
      hlsRef.current = null;
      video.removeAttribute("src");
      video.load();
    };
  }, [stream?.streamUrl, videoRef]);

  useEffect(() => {
    handledCueKeysRef.current.clear();
    lastTimeRef.current = 0;
    setSelectedCueKey(null);
    setIsCueModalVisible(false);
    setCurrentTime(0);
    setDuration(0);
  }, [stream?.streamUrl]);

  useEffect(() => {
    if (!sortedCues.length) return;

    const previousTime = lastTimeRef.current;
    lastTimeRef.current = currentTime;

    const justReachedCue = sortedCues.find((cue) => {
      const key = cueKeyFor(cue);
      if (handledCueKeysRef.current.has(key)) {
        return false;
      }

      const crossedCue =
        previousTime < cue.triggerAtSeconds &&
        currentTime >= cue.triggerAtSeconds;
      const landedNearCue =
        currentTime >= cue.triggerAtSeconds &&
        Math.abs(currentTime - cue.triggerAtSeconds) <= cueWindowThresholdSeconds;

      return crossedCue || landedNearCue;
    });

    if (!justReachedCue) return;

    const cueKey = cueKeyFor(justReachedCue);
    handledCueKeysRef.current.add(cueKey);
    setSelectedCueKey(cueKey);
    setIsCueModalVisible(true);

    const video = videoRef.current;
    if (video) {
      video.pause();
      if (Math.abs(video.currentTime - justReachedCue.triggerAtSeconds) > 0.25) {
        video.currentTime = justReachedCue.triggerAtSeconds;
      }
    }
  }, [currentTime, sortedCues, videoRef]);

  const handleMetadata = (event: SyntheticEvent<HTMLVideoElement>) => {
    const nextDuration = Number(event.currentTarget.duration || 0);
    setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
  };

  const handleTimeUpdate = (event: SyntheticEvent<HTMLVideoElement>) => {
    setCurrentTime(Number(event.currentTarget.currentTime || 0));
  };

  const jumpToCue = (cue: InteractiveCue, openPrompt = false) => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = cue.triggerAtSeconds;
    setCurrentTime(cue.triggerAtSeconds);
    setSelectedCueKey(cueKeyFor(cue));
    if (openPrompt) {
      setIsCueModalVisible(true);
    }
  };

  const dismissCuePrompt = async (resume = true) => {
    setIsCueModalVisible(false);
    if (resume) {
      await videoRef.current?.play().catch(() => null);
    }
  };

  const continueToActivity = () => {
    if (!selectedCue || !onOpenCueActivity) return;
    setIsCueModalVisible(false);
    onOpenCueActivity(selectedCue);
  };

  const changeQuality = (value: string) => {
    const hls = hlsRef.current;
    if (!hls) return;

    if (value === "auto") {
      hls.currentLevel = -1;
      setQualityLabel("Auto");
      return;
    }

    const numeric = Number(value);
    const levelIndex = hls.levels.findIndex((level) => level.height === numeric);
    hls.currentLevel = levelIndex;
    setQualityLabel(`${numeric}p`);
  };

  return (
    <div className="relative mb-8 overflow-hidden rounded-[32px] border border-[rgba(39,107,115,0.08)] bg-white shadow-[0_18px_54px_rgba(17,24,39,0.08)]">
      <div className="relative bg-[#071319]">
        <div className="absolute left-5 top-5 z-20 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/78 backdrop-blur-md">
            Guided lesson
          </span>
          <span className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/78 backdrop-blur-md">
            Quality: {qualityLabel}
          </span>
          {isWaiting ? (
            <span className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 backdrop-blur-md">
              Buffering...
            </span>
          ) : null}
        </div>

        {qualityOptions.length ? (
          <div className="absolute right-5 top-5 z-20">
            <select
              value={qualityLabel === "Auto" ? "auto" : qualityLabel.replace("p", "")}
              onChange={(event) => changeQuality(event.target.value)}
              className="rounded-full border border-white/12 bg-black/45 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white outline-none backdrop-blur-md"
            >
              <option value="auto">Auto</option>
              {qualityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {stream?.streamUrl ? (
          <video
            ref={videoRef}
            controls
            preload="metadata"
            poster={stream.thumbnailUrl || undefined}
            playsInline
            className="aspect-video w-full bg-black object-contain"
            onLoadedMetadata={handleMetadata}
            onTimeUpdate={handleTimeUpdate}
            onWaiting={() => setIsWaiting(true)}
            onCanPlay={() => setIsWaiting(false)}
            onPlaying={() => setIsWaiting(false)}
          />
        ) : (
          <div className="flex h-[500px] items-center justify-center text-sm text-white/70">
            Preparing your stream...
          </div>
        )}
      </div>

      <div className="border-t border-[#e5ece8] bg-[#fbfcfb] p-5">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <StatusPill tone="primary" className="mb-2 gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              Lesson cues
            </StatusPill>
            <h3 className="text-[1.2rem] font-semibold tracking-[-0.03em] text-[#1a2e38]">
              Interactive timeline preview
            </h3>
            <p className="mt-1 text-sm leading-6 text-[#617273]">
              Cue points sit below the player so you can scan, jump, and review each
              guided practice without covering the lesson itself.
            </p>
          </div>
          <div className="rounded-full border border-[#dfe8d6] bg-white px-4 py-2 text-xs font-medium text-[#61705d]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {sortedCues.length ? (
          <div className="rounded-[24px] border border-[#e5ece8] bg-white p-4 shadow-[0_10px_26px_rgba(17,24,39,0.04)]">
            <div className="relative pb-3 pt-10">
              <div className="relative h-4 rounded-full bg-[#e8efeb]">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#42d6c6] to-[#80e8db]"
                  animate={{ width: `${timelinePercent(currentTime, duration)}%` }}
                />

                {duration > 0
                  ? sortedCues.map((cue, index) => {
                      const position = timelinePercent(cue.triggerAtSeconds, duration);
                      const isActive = cueKeyFor(cue) === selectedCueKey;

                      return (
                        <button
                          key={cueKeyFor(cue)}
                          type="button"
                          onClick={() => jumpToCue(cue)}
                          className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${position}%` }}
                        >
                          <div
                            className={`pointer-events-none absolute bottom-9 left-1/2 z-20 w-[240px] -translate-x-1/2 rounded-2xl border border-[#dfe8d6] bg-white p-3 text-left shadow-xl transition duration-200 ${
                              isActive
                                ? "translate-y-0 opacity-100"
                                : "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                            }`}
                          >
                            <p className="truncate text-sm font-semibold text-[#203321]">
                              {cue.title || cue.gameTitle || "Interactive cue"}
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-[11px] font-medium text-[#72806e]">
                              <span className="inline-flex items-center gap-1">
                                <Clock3 className="h-3.5 w-3.5" />
                                {formatTime(cue.triggerAtSeconds)}
                              </span>
                              <span className="rounded-full bg-[#eef7f5] px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#0d6e6e]">
                                {cue.gameKey.replaceAll("_", " ")}
                              </span>
                            </div>
                            {cue.description ? (
                              <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#5f6d5b]">
                                {cue.description}
                              </p>
                            ) : null}
                            <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-[#dfe8d6] bg-white" />
                          </div>

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

                          <span className="absolute left-1/2 top-8 -translate-x-1/2 text-[10px] font-semibold text-[#698083]">
                            {index + 1}
                          </span>
                        </button>
                      );
                    })
                  : null}
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {sortedCues.map((cue, index) => {
                const isActive = cueKeyFor(cue) === selectedCueKey;

                return (
                  <button
                    key={cueKeyFor(cue)}
                    type="button"
                    onClick={() => jumpToCue(cue)}
                    className={`w-full rounded-[22px] border p-4 text-left transition ${
                      isActive
                        ? "border-[#0d6e6e] bg-[#eef7f5] shadow-[0_14px_30px_rgba(13,110,110,0.08)]"
                        : "border-[#edf1e7] bg-[#fbfcf8] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white text-sm font-bold text-[#203321] shadow-sm">
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-semibold text-[#203321]">
                              {cue.title || cue.gameTitle || "Interactive cue"}
                            </p>
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                                cueBadgeColors[cue.gameKey] || "bg-[#eef7f5] text-[#0d6e6e]"
                              }`}
                            >
                              {cue.gameKey.replaceAll("_", " ")}
                            </span>
                          </div>
                          <p className="mt-1 text-xs font-medium text-[#72806e]">
                            {formatTime(cue.triggerAtSeconds)} | Auto-pauses lesson |{" "}
                            {cue.isSkippable ? "Skippable" : "Required"}
                          </p>
                          {cue.description ? (
                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#5f6d5b]">
                              {cue.description}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="shrink-0">
                        <MainButton
                          size="sm"
                          variant="outline"
                          onClick={(event) => {
                            event.stopPropagation();
                            jumpToCue(cue, true);
                          }}
                        >
                          Open cue
                        </MainButton>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-[#dfe8d6] bg-white px-5 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef7f5] text-[var(--primary)]">
              <PlayCircle className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-semibold text-[#314330]">
              No interactive cues in this lesson yet
            </p>
            <p className="mt-2 text-sm leading-6 text-[#74816f]">
              This video plays straight through without guided activity interruptions.
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCue && isCueModalVisible ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end justify-center bg-[rgba(4,12,15,0.34)] p-5 sm:items-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#0b1d24]/98 p-5 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8fb2b8]">
                    Cue at {formatTime(selectedCue.triggerAtSeconds)}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {selectedCue.title || selectedCue.gameTitle}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => void dismissCuePrompt(true)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/72 transition hover:bg-white/10"
                  aria-label="Close cue prompt"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                    cueBadgeColors[selectedCue.gameKey] || "bg-white/10 text-white/80"
                  }`}
                >
                  {selectedCue.gameKey.replaceAll("_", " ")}
                </span>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/72">
                  {selectedCue.isSkippable ? "Skippable" : "Required"}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-white/72">
                {selectedCue.description ||
                  "The lesson has paused at a guided practice moment. Continue into the linked activity or skip it for now and keep learning."}
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void dismissCuePrompt(true)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/6 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/78 transition hover:bg-white/10"
                >
                  <Play size={13} />
                  Skip for now
                </button>
                <button
                  type="button"
                  onClick={continueToActivity}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#163842] transition hover:bg-[#e8f4ef]"
                >
                  <CheckCircle2 size={13} />
                  {selectedCue.ctaLabel || "Continue to activity"}
                </button>
              </div>

              <div className="mt-4 rounded-[18px] border border-white/8 bg-white/5 px-4 py-3 text-xs leading-6 text-white/62">
                <span className="inline-flex items-center gap-2 font-semibold uppercase tracking-[0.14em] text-white/78">
                  <PauseCircle className="h-3.5 w-3.5" />
                  Lesson paused automatically
                </span>
                <p className="mt-1">
                  Resume the video anytime if you want to keep going before starting the
                  activity.
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default VideoPlayerCard;

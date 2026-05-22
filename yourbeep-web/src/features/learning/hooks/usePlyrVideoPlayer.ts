import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import Hls from "hls.js";
import Plyr from "plyr";
import type { InteractiveCue, VideoStreamData } from "../services/learningTypes";

type QualityOption = {
  label: string;
  value: number;
};

type UsePlyrVideoPlayerArgs = {
  stream: VideoStreamData | null;
  videoRef: RefObject<HTMLVideoElement | null>;
  fullscreenContainerRef?: RefObject<HTMLElement | null>;
};

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

export const usePlyrVideoPlayer = ({
  stream,
  videoRef,
  fullscreenContainerRef,
}: UsePlyrVideoPlayerArgs) => {
  const playerRef = useRef<Plyr | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [qualityOptions, setQualityOptions] = useState<QualityOption[]>([]);
  const [qualityLabel, setQualityLabel] = useState("Auto");

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream?.streamUrl) return;

    let destroyed = false;

    const buildPlayer = (quality?: {
      options: number[];
      defaultValue: number;
      onChange: (value: number) => void;
    }) => {
      const player = new Plyr(video, {
        autoplay: true,
        muted: false,
        clickToPlay: true,
        invertTime: false,
        hideControls: false,
        fullscreen: {
          enabled: true,
          fallback: true,
          iosNative: false,
          container: fullscreenContainerRef?.current ?? null,
        },
        controls: [
          "play-large",
          "rewind",
          "play",
          "fast-forward",
          "progress",
          "current-time",
          "duration",
          "mute",
          "volume",
          "settings",
          "pip",
          "airplay",
          "fullscreen",
        ],
        settings: quality ? ["quality", "speed"] : ["speed"],
        speed: {
          selected: 1,
          options: [0.75, 1, 1.25, 1.5, 2],
        },
        quality: quality
          ? {
              default: quality.defaultValue,
              options: quality.options,
              forced: true,
              onChange: quality.onChange,
            }
          : undefined,
      });

      playerRef.current = player;

      const sync = () => {
        const media = player.media;
        setCurrentTime(media.currentTime || 0);
        setDuration(Number.isFinite(media.duration) ? media.duration : 0);

        const ranges = media.buffered;
        if (ranges.length && media.duration) {
          const bufferedEnd = ranges.end(ranges.length - 1);
          setBufferedPercent(Math.min((bufferedEnd / media.duration) * 100, 100));
        } else {
          setBufferedPercent(0);
        }
      };

      const onWaiting = () => setIsWaiting(true);
      const onReady = () => setIsWaiting(false);

      video.addEventListener("timeupdate", sync);
      video.addEventListener("progress", sync);
      video.addEventListener("loadedmetadata", sync);
      video.addEventListener("durationchange", sync);
      video.addEventListener("waiting", onWaiting);
      video.addEventListener("canplay", onReady);
      video.addEventListener("playing", onReady);

      sync();

      return () => {
        video.removeEventListener("timeupdate", sync);
        video.removeEventListener("progress", sync);
        video.removeEventListener("loadedmetadata", sync);
        video.removeEventListener("durationchange", sync);
        video.removeEventListener("waiting", onWaiting);
        video.removeEventListener("canplay", onReady);
        video.removeEventListener("playing", onReady);
        player.destroy();
        if (playerRef.current === player) {
          playerRef.current = null;
        }
      };
    };

    let cleanupPlayer = () => {};

    const initialize = async () => {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          capLevelToPlayerSize: false,
        });
        hlsRef.current = hls;
        hls.loadSource(stream.streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (destroyed) return;

          const levels = hls.levels
            .map((level) => level.height)
            .filter((height): height is number => Boolean(height));
          const uniqueLevels = [...new Set(levels)].sort((left, right) => right - left);

          setQualityOptions(uniqueLevels.map((level) => ({ label: `${level}p`, value: level })));
          setQualityLabel("Auto");

          cleanupPlayer = buildPlayer({
            options: uniqueLevels,
            defaultValue: uniqueLevels[0] ?? 0,
            onChange: (newQuality) => {
              if (newQuality === 0) {
                hls.currentLevel = -1;
                setQualityLabel("Auto");
                return;
              }

              const nextLevelIndex = hls.levels.findIndex((level) => level.height === newQuality);
              hls.currentLevel = nextLevelIndex;
              setQualityLabel(`${newQuality}p`);
            },
          });
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream.streamUrl;
        setQualityOptions([]);
        setQualityLabel("Auto");
        cleanupPlayer = buildPlayer();
      } else {
        video.src = stream.streamUrl;
        setQualityOptions([]);
        setQualityLabel("Auto");
        cleanupPlayer = buildPlayer();
      }
    };

    void initialize();

    return () => {
      destroyed = true;
      cleanupPlayer();
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.removeAttribute("src");
      video.load();
    };
  }, [fullscreenContainerRef, stream?.streamUrl, videoRef]);

  const percentComplete = duration ? (currentTime / duration) * 100 : 0;

  const activeCue = useMemo(() => {
    if (!stream?.interactiveCues?.length) return null;
    return (
      [...stream.interactiveCues]
        .sort((left, right) => left.triggerAtSeconds - right.triggerAtSeconds)
        .find((cue) => Math.abs(cue.triggerAtSeconds - currentTime) <= 4) ?? null
    );
  }, [currentTime, stream?.interactiveCues]);

  const jumpToCue = (cue: InteractiveCue) => {
    if (!playerRef.current) return;
    playerRef.current.currentTime = cue.triggerAtSeconds;
    setCurrentTime(cue.triggerAtSeconds);
  };

  const pause = () => {
    playerRef.current?.pause();
  };

  const play = async () => {
    await playerRef.current?.play().catch(() => null);
  };

  return {
    activeCue,
    bufferedPercent,
    currentTime,
    duration,
    formatTime,
    isWaiting,
    jumpToCue,
    percentComplete,
    qualityLabel,
    qualityOptions,
    playerRef,
    pause,
    play,
  };
};

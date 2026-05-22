import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type SyntheticEvent,
} from "react";

type VideoPreviewPlayerProps = {
  src: string;
  poster?: string | null;
  className?: string;
  controls?: boolean;
  preload?: "none" | "metadata" | "auto";
  onTimeUpdate?: (event: SyntheticEvent<HTMLVideoElement>) => void;
  onLoadedMetadata?: (event: SyntheticEvent<HTMLVideoElement>) => void;
  onSeeking?: (event: SyntheticEvent<HTMLVideoElement>) => void;
  onPause?: (event: SyntheticEvent<HTMLVideoElement>) => void;
  onPlay?: (event: SyntheticEvent<HTMLVideoElement>) => void;
};

export const VideoPreviewPlayer = forwardRef<
  HTMLVideoElement,
  VideoPreviewPlayerProps
>(function VideoPreviewPlayer(
  {
    src,
    poster,
    className = "h-full w-full object-cover",
    controls = true,
    preload = "metadata",
    onTimeUpdate,
    onLoadedMetadata,
    onSeeking,
    onPause,
    onPlay,
  },
  forwardedRef,
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useImperativeHandle(forwardedRef, () => videoRef.current as HTMLVideoElement, []);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement || !src) {
      return;
    }

    let disposed = false;
    let hlsInstance: { destroy: () => void } | null = null;

    const setupPlayer = async () => {
      if (!src.includes(".m3u8")) {
        videoElement.src = src;
        videoElement.load();
        return;
      }

      if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
        videoElement.src = src;
        videoElement.load();
        return;
      }

      const { default: Hls } = await import("hls.js");

      if (disposed || !videoRef.current) {
        return;
      }

      if (Hls.isSupported()) {
        const instance = new Hls();
        hlsInstance = instance;
        instance.loadSource(src);
        instance.attachMedia(videoRef.current);
      } else {
        videoElement.src = src;
        videoElement.load();
      }
    };

    void setupPlayer();

    return () => {
      disposed = true;
      if (hlsInstance) {
        hlsInstance.destroy();
      }
      videoElement.removeAttribute("src");
      videoElement.load();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls={controls}
      preload={preload}
      poster={poster || undefined}
      className={className}
      onTimeUpdate={onTimeUpdate}
      onLoadedMetadata={onLoadedMetadata}
      onSeeking={onSeeking}
      onPause={onPause}
      onPlay={onPlay}
    />
  );
});

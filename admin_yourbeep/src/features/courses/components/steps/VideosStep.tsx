import { useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clapperboard,
  Eye,
  EyeOff,
  ListVideo,
  LoaderCircle,
  PencilLine,
  PlayCircle,
  PlusCircle,
  Trash2,
  X,
} from "lucide-react";
import { AnimatedDropdown } from "../../../../components/ui/AnimatedDropdown";
import { InputField } from "../../../../components/ui/InputField";
import { ImagePickerField } from "../../../../components/ui/ImagePickerField";
import { MainButton } from "../../../../components/ui/MainButton";
import { ShimmerBlock } from "../../../../components/ui/ShimmerBlock";
import { VideoPreviewPlayer } from "../../../../components/ui/VideoPreviewPlayer";
import { ConfirmDialog } from "../../../../components/ui/ConfirmDialog";
import { uploadCloudinaryImage } from "../../../../services/media/cloudinaryUpload";
import { showToast } from "../../../../utils/showToast";
import { getAdminCourseVideoStream } from "../../services/courseAdminApi";
import { IconButton } from "../../../../components/ui/IconButton";

type VideoFormState = {
  title: string;
  description: string;
  sectionKey: string;
  order: number | string;
  file: File | null;
  thumbnailUrl: string;
};

type CourseSectionItem = {
  key: string;
  title: string;
  description?: string | null;
  order: number;
};

type VideoItem = {
  _id: string;
  refId: string;
  videoId?: string | null;
  title: string;
  description?: string | null;
  order: number;
  thumbnailUrl?: string | null;
  durationSeconds?: number | null;
  videoStatus?: "ready" | "processing" | null;
  sectionKey?: string | null;
};

type VideosStepProps = {
  videoForm: VideoFormState;
  setVideoForm: Dispatch<SetStateAction<VideoFormState>>;
  courseSections: CourseSectionItem[];
  videoItems: VideoItem[];
  editingVideoId: string;
  deletingVideoId: string | null;
  uploadStatus: string | null;
  onUpload: () => void;
  onSaveVideoDetails: () => void;
  onEditVideo: (video: VideoItem) => void;
  onDeleteVideo: (videoId: string) => void;
  onAddNewVideo: () => void;
  onBack: () => void;
  onNext: () => void;
  loading: boolean;
};

const cardClassName =
  "rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-[0_18px_50px_rgba(34,52,28,0.06)]";

const sectionMotion = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

function formatDuration(durationSeconds?: number | null) {
  if (!durationSeconds) {
    return "Duration pending";
  }

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

export default function VideosStep({
  videoForm,
  setVideoForm,
  courseSections,
  videoItems,
  editingVideoId,
  deletingVideoId,
  uploadStatus,
  onUpload,
  onSaveVideoDetails,
  onEditVideo,
  onDeleteVideo,
  onAddNewVideo,
  onBack,
  onNext,
  loading,
}: VideosStepProps) {
  const [selectedPreviewId, setSelectedPreviewId] = useState<string>("");
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [streamPoster, setStreamPoster] = useState<string | null>(null);
  const [previewStatus, setPreviewStatus] = useState<string>("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string>("");
  const [pendingDeleteVideo, setPendingDeleteVideo] = useState<VideoItem | null>(
    null,
  );

  const isEditing = Boolean(editingVideoId);
  const selectedPreviewVideo = useMemo(
    () =>
      videoItems.find(
        (item) => (item.videoId || item.refId) === selectedPreviewId,
      ) ?? null,
    [selectedPreviewId, videoItems],
  );
  const sectionOptions = useMemo(
    () => [
      { label: "Select a section", value: "" },
      ...courseSections
        .slice()
        .sort((left, right) => left.order - right.order)
        .map((section) => ({
          label: `${section.order}. ${section.title}`,
          value: section.key,
        })),
    ],
    [courseSections],
  );
  const sectionTitleByKey = useMemo(
    () =>
      new Map(courseSections.map((section) => [section.key, section.title])),
    [courseSections],
  );

  useEffect(() => {
    if (!videoForm.file) {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
        setLocalPreviewUrl("");
      }
      return;
    }

    const url = URL.createObjectURL(videoForm.file);
    setLocalPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return url;
    });

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [videoForm.file]);

  useEffect(() => {
    if (!selectedPreviewId) {
      setStreamUrl(null);
      setStreamPoster(null);
      setPreviewStatus("");
      return;
    }

    const item = videoItems.find(
      (entry) => (entry.videoId || entry.refId) === selectedPreviewId,
    );
    if (!item) {
      return;
    }

    if (item.videoStatus !== "ready") {
      setStreamUrl(null);
      setStreamPoster(item.thumbnailUrl || null);
      setPreviewStatus(
        "This lesson is still processing in Bunny. Preview will unlock once the webhook marks it ready.",
      );
      return;
    }

    let cancelled = false;

    const loadPreview = async () => {
      setPreviewLoading(true);
      try {
        const data = await getAdminCourseVideoStream(
          item.videoId || item.refId,
        );
        if (cancelled) {
          return;
        }
        setStreamUrl(data?.streamUrl ?? null);
        setStreamPoster(data?.thumbnailUrl ?? item.thumbnailUrl ?? null);
        setPreviewStatus("Saved lesson preview is streaming from Bunny.");
      } catch (error) {
        if (cancelled) {
          return;
        }
        const message =
          error instanceof Error
            ? error.message
            : "Unable to preview this video.";
        setStreamUrl(null);
        setStreamPoster(item.thumbnailUrl || null);
        setPreviewStatus(message);
        showToast({
          type: "error",
          message: "Unable to preview lesson video.",
          options: { description: message, duration: 4500 },
        });
      } finally {
        if (!cancelled) {
          setPreviewLoading(false);
        }
      }
    };

    void loadPreview();

    return () => {
      cancelled = true;
    };
  }, [selectedPreviewId, videoItems]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.08 },
        },
      }}
      className="space-y-6"
    >
      <motion.section variants={sectionMotion} className={cardClassName}>
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#dbe7d3] bg-[#f4f8ef] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5f6f5d]">
                  <Clapperboard className="h-3.5 w-3.5" />
                  Lesson Videos
                </div>
                <h3 className="mt-3 text-[24px] font-bold tracking-[-0.02em] text-[#203321]">
                  {isEditing
                    ? "Edit saved lesson video"
                    : "Add a new lesson video"}
                </h3>
                <p className="mt-2 max-w-[640px] text-sm leading-6 text-[#72806e]">
                  Upload new Bunny lessons here, or click a saved row below to
                  edit its metadata in this same section.
                </p>
              </div>
              <MainButton
                text="Add New Video"
                variant="soft"
                size="sm"
                headIcon={<PlusCircle className="h-4 w-4" />}
                onClick={onAddNewVideo}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Video title"
                name="video-title"
                value={videoForm.title}
                placeholder="Learn to have fun"
                onChange={(event) =>
                  setVideoForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
              />
              <InputField
                label="Course order slot"
                name="video-order"
                type="number"
                value={String(videoForm.order)}
                placeholder="1"
                onChange={(event) =>
                  setVideoForm((current) => ({
                    ...current,
                    order: event.target.value,
                  }))
                }
              />
            </div>

            <InputField
              label="Video description"
              name="video-description"
              element="textarea"
              rows={4}
              value={videoForm.description}
              placeholder="Describe the focus of this lesson."
              onChange={(event) =>
                setVideoForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
            />

            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#203321]">Section</p>
              <AnimatedDropdown
                name="video-section"
                value={videoForm.sectionKey}
                options={sectionOptions}
                placeholder="Select a section"
                onChange={(value) =>
                  setVideoForm((current) => ({
                    ...current,
                    sectionKey: value,
                    order:
                      videoItems.filter((item) => item.sectionKey === value).length + 1,
                  }))
                }
              />
            </div>

            {!isEditing ? (
              <div className="rounded-[24px] border border-[#e7eadf] bg-[#fbfcf8] p-4">
                <p className="text-sm font-semibold text-[#203321]">
                  Lesson video file
                </p>
                <p className="mt-1 text-xs leading-5 text-[#72806e]">
                  Select the lesson file that should be uploaded directly to
                  Bunny Stream.
                </p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(event) =>
                    setVideoForm((current) => ({
                      ...current,
                      file: event.target.files?.[0] ?? null,
                    }))
                  }
                  className="mt-4 block w-full rounded-2xl border border-[#dfe8d6] bg-white px-4 py-3 text-sm text-[#314330] file:mr-4 file:rounded-xl file:border-0 file:bg-[#eef5e7] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[var(--primary)]"
                />
              </div>
            ) : null}

            <ImagePickerField
              label="Video thumbnail"
              value={videoForm.thumbnailUrl}
              previewAlt={videoForm.title || "Video thumbnail"}
              aspectHint="Optional custom thumbnail. If you skip this, Bunny will generate one when the video is ready."
              helpText="The thumbnail is stored on the video record and shown in the lesson list."
              showUrlInput={false}
              onChange={(value) =>
                setVideoForm((current) => ({
                  ...current,
                  thumbnailUrl: value,
                }))
              }
              onUpload={(file) =>
                uploadCloudinaryImage(file, {
                  folder: "yourbeep/admin/courses/videos",
                  tags: ["courses", "video-thumbnail"],
                }).then((result) => result.secureUrl)
              }
            />

            {uploadStatus ? (
              <div className="rounded-2xl border border-[#dbe9d3] bg-[#f5fbf1] px-4 py-3 text-sm text-[#40603d]">
                {uploadStatus}
              </div>
            ) : null}
          </div>

          <div className="rounded-[28px] border border-[#e6ebdf] bg-[#f9fbf6] p-5">
            <div className="overflow-hidden rounded-[24px] border border-[#dfe8d6] bg-white shadow-sm">
              <div className="aspect-video overflow-hidden bg-black">
                {localPreviewUrl ? (
                  <VideoPreviewPlayer
                    src={localPreviewUrl}
                    className="h-full w-full object-cover"
                  />
                ) : videoForm.thumbnailUrl ? (
                  <img
                    src={videoForm.thumbnailUrl}
                    alt={videoForm.title || "Video thumbnail"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#eef6e8] via-[#f7fbf3] to-[#ddebd0]">
                    <div className="text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-white/80 text-[#5c7757] shadow-sm">
                        <Clapperboard className="h-6 w-6" />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-[#314330]">
                        {isEditing ? "Edit preview" : "Upload preview"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-5 py-4">
                <p className="text-sm font-semibold text-[#203321]">
                  {videoForm.title || "Lesson preview"}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#72806e]">
                  {isEditing
                    ? "You are editing a saved lesson. Update metadata or thumbnail, then save."
                    : videoForm.file
                    ? `Ready to upload ${videoForm.file.name}`
                      : "Choose a new lesson file, add metadata, and upload it to Bunny."}
                </p>
                {videoForm.sectionKey ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#edf6ea] px-3 py-1 text-[11px] font-semibold text-[#55724d]">
                      {sectionTitleByKey.get(videoForm.sectionKey) || videoForm.sectionKey}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {isEditing ? (
                <MainButton
                  text={loading ? "Saving..." : "Save Video Changes"}
                  size="lg"
                  onClick={onSaveVideoDetails}
                  isLoading={loading}
                />
              ) : (
                <MainButton
                  text={
                    loading
                      ? "Starting upload..."
                      : "Create Upload URL & Upload"
                  }
                  size="lg"
                  onClick={onUpload}
                  isLoading={loading}
                />
              )}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={sectionMotion} className={cardClassName}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#203321]">
              Current course videos
            </h3>
            <p className="mt-1 text-sm text-[#74816f]">
              A compact lesson list for quick review. Use Edit to load a row
              back into the main section above.
            </p>
          </div>
        </div>

        {loading && !videoItems.length ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="grid gap-4 rounded-[24px] border border-[#edf1e7] bg-[#fbfcf8] px-4 py-4 md:grid-cols-[110px_1.2fr_80px_180px_120px_260px]"
              >
                <ShimmerBlock className="aspect-video w-full rounded-[18px]" />
                <ShimmerBlock className="h-4 w-36" />
                <ShimmerBlock className="h-4 w-12" />
                <ShimmerBlock className="h-4 w-40" />
                <ShimmerBlock className="h-7 w-20 rounded-full" />
                <div className="flex gap-2">
                  <ShimmerBlock className="h-10 flex-1 rounded-xl" />
                  <ShimmerBlock className="h-10 flex-1 rounded-xl" />
                  <ShimmerBlock className="h-10 flex-1 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : videoItems.length ? (
          <div className="overflow-hidden rounded-[24px] border border-[#edf1e7]">
            <div className="hidden grid-cols-[120px_minmax(220px,1fr)_80px_180px_110px_150px] gap-4 bg-[#f8faf5] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#74816f] lg:grid">
              <p>Thumb</p>
              <p>Title</p>
              <p>Order</p>
              <p>Video ID</p>
              <p>Status</p>
              <p className="text-right">Actions</p>
            </div>

            <div className="divide-y divide-[#edf1e7]">
              {videoItems.map((item, index) => {
                const videoKey = item.videoId || item.refId;
                const isSelected = editingVideoId === videoKey;
                const isPreviewSelected = selectedPreviewId === videoKey;

                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className={`grid gap-4 px-5 py-5 lg:grid-cols-[120px_minmax(220px,1fr)_80px_180px_110px_150px] lg:items-center ${
                      isSelected ? "bg-[#f7fbf3]" : "bg-white"
                    }`}
                  >
                    <div className="h-[72px] w-[120px] overflow-hidden rounded-[18px] border border-[#dfe8d6] bg-[#e9f1e2]">
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#5f6f5d]">
                          <Clapperboard className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-bold leading-5 text-[#203321]">
                        {item.title}
                      </p>

                      {item.sectionKey ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#edf6ea] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#55724d]">
                            {sectionTitleByKey.get(item.sectionKey) || item.sectionKey}
                          </span>
                        </div>
                      ) : null}

                      <p className="mt-1 text-xs font-medium text-[#74816f]">
                        {formatDuration(item.durationSeconds)}
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-[#314330]">
                      {item.order}
                    </p>

                    <p className="truncate text-xs font-medium text-[#74816f]">
                      {videoKey}
                    </p>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-[11px] font-bold ${
                        item.videoStatus === "ready"
                          ? "bg-[#e6f6ed] text-[#1d8f57]"
                          : "bg-[#fff4e6] text-[#b5701f]"
                      }`}
                    >
                      {item.videoStatus === "ready" ? "Ready" : "Processing"}
                    </span>

                    <div className="flex items-center justify-end gap-2">
                      <IconButton
                        ariaLabel={
                          isPreviewSelected ? "Hide preview" : "Preview video"
                        }
                        icon={
                          previewLoading && isPreviewSelected ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : isPreviewSelected ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )
                        }
                        variant={isPreviewSelected ? "soft" : "outline"}
                        size="sm"
                        onClick={() =>
                          setSelectedPreviewId(
                            isPreviewSelected ? null : videoKey,
                          )
                        }
                      />

                      <IconButton
                        ariaLabel="Edit video"
                        icon={<PencilLine className="h-4 w-4" />}
                        variant="outline"
                        size="sm"
                        onClick={() => onEditVideo(item)}
                      />

                      <IconButton
                        ariaLabel="Delete video"
                        icon={<Trash2 className="h-4 w-4" />}
                        variant="danger"
                        size="sm"
                        isLoading={deletingVideoId === videoKey}
                        disabled={Boolean(deletingVideoId)}
                        onClick={() => setPendingDeleteVideo(item)}
                      />
                    </div>

                    {isPreviewSelected ? (
                      <div className="lg:col-span-6">
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="overflow-hidden rounded-[26px] border border-[#dfe8d6] bg-[#101611]"
                        >
                          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {item.title}
                              </p>

                              <p className="mt-1 text-xs text-white/60">
                                {previewStatus ||
                                  "Lesson preview ready for playback"}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/70">
                                {formatDuration(item.durationSeconds)}
                              </span>

                              <IconButton
                                ariaLabel="Close preview"
                                icon={<X className="h-4 w-4" />}
                                variant="ghost"
                                size="sm"
                                className="text-white hover:bg-white/10"
                                onClick={() => setSelectedPreviewId(null)}
                              />
                            </div>
                          </div>

                          <div className="aspect-video overflow-hidden bg-black">
                            {streamUrl ? (
                              <VideoPreviewPlayer
                                src={streamUrl}
                                poster={streamPoster}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center px-6 text-center">
                                <div>
                                  <PlayCircle className="mx-auto h-10 w-10 text-white/70" />

                                  <p className="mt-3 text-sm font-semibold text-white">
                                    {previewLoading
                                      ? "Loading preview..."
                                      : "Preview unavailable"}
                                  </p>

                                  <p className="mt-1 text-xs leading-5 text-white/65">
                                    {previewStatus ||
                                      "This lesson will become previewable once processing finishes."}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    ) : null}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-[#d8e3d2] bg-[#fbfcf8] px-5 py-8 text-sm text-[#74816f]">
            No uploaded lesson videos yet. Use the add new video editor above to
            create the first Bunny lesson for this course.
          </div>
        )}
      </motion.section>

      <motion.div
        variants={sectionMotion}
        className="sticky bottom-4 z-10 flex flex-wrap justify-between gap-3 rounded-[24px] border border-[#e7eadf] bg-white/92 px-4 py-4 shadow-[0_20px_50px_rgba(32,51,33,0.08)] backdrop-blur"
      >
        <MainButton
          text="Back"
          variant="outline"
          size="lg"
          headIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={onBack}
        />
        <MainButton
          text="Continue to Content"
          size="lg"
          headIcon={<ListVideo className="h-4 w-4" />}
          onClick={onNext}
        />
      </motion.div>

      <ConfirmDialog
        open={Boolean(pendingDeleteVideo)}
        title="Delete lesson video?"
        description={`This will remove "${pendingDeleteVideo?.title || "this lesson"}" from the course and also remove its linked content row.`}
        confirmText="Delete video"
        loading={Boolean(
          pendingDeleteVideo &&
            deletingVideoId === (pendingDeleteVideo.videoId || pendingDeleteVideo.refId),
        )}
        onCancel={() => setPendingDeleteVideo(null)}
        onConfirm={() => {
          if (!pendingDeleteVideo) {
            return;
          }
          void onDeleteVideo(pendingDeleteVideo.videoId || pendingDeleteVideo.refId);
          setPendingDeleteVideo(null);
        }}
      />
    </motion.div>
  );
}

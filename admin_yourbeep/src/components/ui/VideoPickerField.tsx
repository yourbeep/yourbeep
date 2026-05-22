import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clapperboard, Film, Trash2, UploadCloud } from "lucide-react";
import { MainButton } from "./MainButton";
import { VideoPreviewPlayer } from "./VideoPreviewPlayer";
import { showToast } from "../../utils/showToast";

type VideoPickerFieldProps = {
  label: string;
  streamUrl?: string | null;
  posterUrl?: string | null;
  status?: string | null;
  onUpload: (file: File) => Promise<void>;
  helpText?: string;
  disabled?: boolean;
};

export function VideoPickerField({
  label,
  streamUrl,
  posterUrl,
  status,
  onUpload,
  helpText,
  disabled = false,
}: VideoPickerFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadError, setUploadError] = useState("");

  const activeStreamUrl = previewUrl || streamUrl || "";
  const hasPreview = Boolean(activeStreamUrl);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const statusTone = useMemo(() => {
    if (uploadError) {
      return "border-[#f0d5ca] bg-[#fff6f2] text-[#b5574e]";
    }
    if (!status) {
      return "border-[#dfe8d6] bg-white text-[#5f6f5d]";
    }
    return "border-[#d7e5ff] bg-[#eef4ff] text-[#0b57d0]";
  }, [status, uploadError]);

  const handleSelectFile = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl("");
    setSelectedFileName("");
    setUploadError("");
    showToast({
      type: "info",
      message: "Trailer preview cleared.",
      options: {
        description: "The local preview was removed. The saved trailer ID is unchanged.",
      },
    });
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(nextPreviewUrl);
    setSelectedFileName(file.name);
    setUploadError("");
    setIsUploading(true);

    try {
      await onUpload(file);
      showToast({
        type: "success",
        message: "Trailer upload started.",
        options: {
          description: "Bunny is now processing the trailer in the background.",
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Trailer upload failed.";
      setUploadError(message);
      showToast({
        type: "error",
        message: "Trailer upload failed.",
        options: {
          description: message,
          duration: 4500,
        },
      });
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-[#e7eadf] bg-[#fbfcf8] p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#203321]">{label}</p>
            <p className="mt-1 text-xs text-[#72806e]">
              Upload an MP4 trailer to Bunny and preview the selected file before learners see it.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#dfe8d6] bg-white px-3 py-1 text-[11px] font-semibold text-[#5f6f5d]">
            <Film className="h-3.5 w-3.5" />
            Bunny Stream
          </span>
        </div>

        <AnimatePresence mode="wait">
          {hasPreview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-[22px] border border-[#dfe8d6] bg-[#162314]"
            >
              <div className="aspect-video overflow-hidden bg-black">
                <VideoPreviewPlayer
                  src={activeStreamUrl}
                  poster={posterUrl}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {selectedFileName || "Saved trailer preview"}
                  </p>
                  <p className="mt-1 text-xs text-white/65">
                    {previewUrl
                      ? "Local preview ready. The uploaded trailer is linked to the course once Bunny accepts the file."
                      : "Saved trailer preview is streaming from Bunny for review."}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex aspect-video items-center justify-center rounded-[22px] border border-dashed border-[#d7e4d2] bg-white px-6 text-center"
            >
              <div className="max-w-[260px]">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef5e7] text-[#4d6b49]">
                  <Clapperboard className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-[#203321]">
                  No trailer selected
                </p>
                <p className="mt-1 text-sm text-[#72806e]">
                  Pick an MP4 file to upload it directly to Bunny and keep the course overview polished.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex flex-wrap gap-3">
          <MainButton
            text={isUploading ? "Uploading..." : "Upload Trailer"}
            size="sm"
            isLoading={isUploading}
            headIcon={<UploadCloud className="h-4 w-4" />}
            onClick={handleSelectFile}
            disabled={disabled}
          />
          <MainButton
            text="Clear Preview"
            size="sm"
            variant="outline"
            headIcon={<Trash2 className="h-4 w-4" />}
            onClick={handleClear}
            disabled={disabled || !previewUrl}
          />
        </div>

        <input
          id={inputId}
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />

        <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${statusTone}`}>
          {uploadError || status || "Trailer uploads stay tied to the course draft and do not create lesson content items."}
        </div>

        {helpText ? (
          <p className="mt-3 text-xs leading-5 text-[#72806e]">{helpText}</p>
        ) : null}
      </div>
    </div>
  );
}

import { useId, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, Link2, Trash2, UploadCloud } from "lucide-react";
import { MainButton } from "./MainButton";
import { InputField } from "./InputField";
import { showToast } from "../../utils/showToast";

type ImagePickerFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<string>;
  placeholder?: string;
  helpText?: string;
  disabled?: boolean;
  previewAlt?: string;
  aspectHint?: string;
  showUrlInput?: boolean;
};

export function ImagePickerField({
  label,
  value,
  onChange,
  onUpload,
  placeholder = "https://res.cloudinary.com/...",
  helpText,
  disabled = false,
  previewAlt,
  aspectHint,
  showUrlInput = true,
}: ImagePickerFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleSelectFile = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadError("");
    setIsUploading(true);

    try {
      const uploadedUrl = await onUpload(file);
      onChange(uploadedUrl);
      showToast({
        type: "success",
        message: "Image uploaded successfully.",
        options: {
          description: "The Cloudinary asset is ready to use in the banner.",
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Image upload failed.";
      setUploadError(message);
      showToast({
        type: "error",
        message: "Image upload failed.",
        options: { description: message, duration: 4500 },
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
            {aspectHint ? (
              <p className="mt-1 text-xs text-[#72806e]">{aspectHint}</p>
            ) : null}
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#dfe8d6] bg-white px-3 py-1 text-[11px] font-semibold text-[#5f6f5d]">
            <Link2 className="h-3.5 w-3.5" />
            Cloudinary
          </span>
        </div>

        <AnimatePresence mode="wait">
          {value ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-[22px] border border-[#dfe8d6] bg-white"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#eef4e7]">
                <img
                  src={value}
                  alt={previewAlt || label}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#162314]/70 via-[#162314]/20 to-transparent px-4 py-4">
                  <p className="text-xs font-medium text-white/80">
                    Preview ready
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
              className="flex aspect-[16/10] items-center justify-center rounded-[22px] border border-dashed border-[#d7e4d2] bg-white px-6 text-center"
            >
              <div className="max-w-[260px]">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef5e7] text-[#4d6b49]">
                  <ImagePlus className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-[#203321]">
                  No image selected
                </p>
                <p className="mt-1 text-sm text-[#72806e]">
                  {showUrlInput
                    ? "Upload an image or paste a direct Cloudinary URL."
                    : "Upload an image and we'll store the Cloudinary URL for you automatically."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex flex-wrap gap-3">
          <MainButton
            text={isUploading ? "Uploading..." : "Upload Image"}
            size="sm"
            isLoading={isUploading}
            headIcon={<UploadCloud className="h-4 w-4" />}
            onClick={handleSelectFile}
            disabled={disabled}
          />
          <MainButton
            text="Clear"
            size="sm"
            variant="outline"
            headIcon={<Trash2 className="h-4 w-4" />}
            onClick={() => {
              onChange("");
              showToast({
                type: "info",
                message: "Image cleared.",
                options: {
                  description: "The current image URL was removed from this field.",
                },
              });
            }}
            disabled={disabled || !value}
          />
        </div>

        <input
          id={inputId}
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />

        {uploadError ? (
          <p className="mt-3 text-sm text-[#b5574e]">{uploadError}</p>
        ) : null}
      </div>

      {showUrlInput ? (
        <InputField
          label={`${label} URL`}
          name={`${inputId}-url`}
          value={value}
          placeholder={placeholder}
          helpText={helpText}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : helpText ? (
        <p className="text-xs leading-5 text-[#72806e]">{helpText}</p>
      ) : null}
    </div>
  );
}

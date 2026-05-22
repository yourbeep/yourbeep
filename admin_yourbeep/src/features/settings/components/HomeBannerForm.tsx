import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedDropdown } from "../../../components/ui/AnimatedDropdown";
import {
  BadgeCheck,
  ImageIcon,
  LayoutTemplate,
  Megaphone,
  Monitor,
  Save,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { InputField } from "../../../components/ui/InputField";
import { ImagePickerField } from "../../../components/ui/ImagePickerField";
import { MainButton } from "../../../components/ui/MainButton";
import { uploadCloudinaryImage } from "../../../services/media/cloudinaryUpload";
import SettingsSectionCard from "./SettingsSectionCard";

type BannerForm = {
  eyebrow: string;
  title: string;
  subtitle: string;
  announcementText: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
  backgroundVariant: string;
  trustBadgeText: string;
};

type HomeBannerFormProps = {
  form: BannerForm;
  setForm: Dispatch<SetStateAction<BannerForm>>;
  onSave: () => void;
  loading: boolean;
};

const backgroundOptions = [
  { label: "Light", value: "light" },
  { label: "Warm", value: "warm" },
  { label: "Earth", value: "earth" },
  { label: "Contrast", value: "contrast" },
];

const previewVariants: Record<string, string> = {
  light: "from-[#f2f7eb] via-[#ffffff] to-[#e8f0df]",
  warm: "from-[#f5efe1] via-[#fff8ee] to-[#e4d6ba]",
  earth: "from-[#dce6d5] via-[#f4f7ef] to-[#becfb0]",
  contrast: "from-[#173f3f] via-[#1d5959] to-[#0d6e6e]",
};

export default function HomeBannerForm({
  form,
  setForm,
  onSave,
  loading,
}: HomeBannerFormProps) {
  const setField =
    (key: keyof BannerForm) =>
    (
      event:
        | ChangeEvent<HTMLInputElement>
        | ChangeEvent<HTMLTextAreaElement>
        | ChangeEvent<HTMLSelectElement>,
    ) => {
      const nextValue = event.target.value;
      setForm((current) => ({ ...current, [key]: nextValue }));
    };

  const setImageField =
    (key: "desktopImageUrl" | "mobileImageUrl") => (value: string) => {
      setForm((current) => ({ ...current, [key]: value }));
    };

  const uploadBannerImage = async (file: File) => {
    const uploaded = await uploadCloudinaryImage(file, {
      folder: "yourbeep/platform/banner",
      tags: ["admin", "home-banner"],
    });

    return uploaded.secureUrl;
  };

  return (
    <SettingsSectionCard
      title="Home Banner"
      subtitle="This maps directly to the public homepage banner payload, including both image variants and CTA content."
      actions={
        <MainButton
          type="button"
          text={loading ? "Saving..." : "Save Banner"}
          isLoading={loading}
          headIcon={<Save className="h-4 w-4" />}
          onClick={onSave}
        />
      }
    >
      <div className="space-y-6">
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Eyebrow"
                name="eyebrow"
                value={form.eyebrow}
                placeholder="A calmer way to understand patterns"
                onChange={setField("eyebrow")}
              />

              <InputField
                label="Trust Badge Text"
                name="trustBadgeText"
                value={form.trustBadgeText}
                placeholder="Trusted by practitioners globally"
                onChange={setField("trustBadgeText")}
              />
            </div>

            <InputField
              label="Title"
              name="title"
              value={form.title}
              placeholder="The learning experience starts with clarity."
              onChange={setField("title")}
            />

            <InputField
              element="textarea"
              label="Subtitle"
              name="subtitle"
              value={form.subtitle}
              rows={4}
              placeholder="Use this area for the core home-banner message and emotional payoff."
              onChange={setField("subtitle")}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Announcement Text"
                name="announcementText"
                value={form.announcementText}
                placeholder="New cohort starts this month"
                onChange={setField("announcementText")}
              />

              <div className="space-y-2">
                <AnimatedDropdown
                  label="Background Variant"
                  name="backgroundVariant"
                  value={form.backgroundVariant}
                  options={backgroundOptions}
                  headIcon={<Sparkles className="h-4 w-4" />}
                  className="w-full"
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      backgroundVariant: value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Primary CTA Label"
                name="primaryCtaLabel"
                value={form.primaryCtaLabel}
                placeholder="Begin your journey"
                onChange={setField("primaryCtaLabel")}
              />

              <InputField
                label="Primary CTA URL"
                name="primaryCtaUrl"
                value={form.primaryCtaUrl}
                placeholder="/auth?tab=register"
                onChange={setField("primaryCtaUrl")}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Secondary CTA Label"
                name="secondaryCtaLabel"
                value={form.secondaryCtaLabel}
                placeholder="Explore courses"
                onChange={setField("secondaryCtaLabel")}
              />

              <InputField
                label="Secondary CTA URL"
                name="secondaryCtaUrl"
                value={form.secondaryCtaUrl}
                placeholder="/courses"
                onChange={setField("secondaryCtaUrl")}
              />
            </div>
          </div>

          <div className="space-y-5">
            <motion.div
              layout
              className={`overflow-hidden rounded-[28px] border border-[#e7eadf] bg-gradient-to-br ${previewVariants[form.backgroundVariant] || previewVariants.warm} p-5 shadow-sm`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0d6e6e]">
                    Banner Preview
                  </p>
                  <p className="mt-1 text-sm text-[#5f6f5d]">
                    Live content snapshot for the public landing hero.
                  </p>
                </div>
                <span className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[11px] font-semibold text-[#355136]">
                  {form.backgroundVariant || "warm"}
                </span>
              </div>

              <div className="mt-5 rounded-[24px] border border-white/70 bg-white/75 p-5 backdrop-blur">
                <div className="flex flex-wrap gap-2">
                  {form.eyebrow ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#eef5e7] px-3 py-1 text-[11px] font-semibold text-[#40603d]">
                      <Sparkles className="h-3.5 w-3.5" />
                      {form.eyebrow}
                    </span>
                  ) : null}
                  {form.trustBadgeText ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#355136]">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      {form.trustBadgeText}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-4 text-2xl font-bold leading-tight text-[#203321]">
                  {form.title || "Your banner title will appear here"}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#5f6f5d]">
                  {form.subtitle ||
                    "Use the banner subtitle to explain the hero value clearly and set the tone for the first screen."}
                </p>

                {form.announcementText ? (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#d7e4d2] bg-white px-3 py-1.5 text-xs font-medium text-[#4d6b49]">
                    <Megaphone className="h-3.5 w-3.5" />
                    {form.announcementText}
                  </div>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-3">
                  <MainButton
                    text={form.primaryCtaLabel || "Primary CTA"}
                    size="sm"
                    className="pointer-events-none"
                  />
                  <MainButton
                    text={form.secondaryCtaLabel || "Secondary CTA"}
                    size="sm"
                    variant="outline"
                    className="pointer-events-none bg-white"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {form.desktopImageUrl || form.mobileImageUrl ? (
                  <motion.div
                    key={`${form.desktopImageUrl}-${form.mobileImageUrl}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22 }}
                    className="mt-5 grid gap-4 md:grid-cols-2"
                  >
                    <div className="rounded-[22px] border border-white/70 bg-white/75 p-3">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#203321]">
                        <Monitor className="h-4 w-4 text-[#0d6e6e]" />
                        Desktop art
                      </div>
                      <div className="overflow-hidden rounded-[18px] bg-[#eef4e7]">
                        {form.desktopImageUrl ? (
                          <img
                            src={form.desktopImageUrl}
                            alt="Desktop banner preview"
                            className="aspect-[16/10] w-full object-cover"
                          />
                        ) : (
                          <div className="flex aspect-[16/10] items-center justify-center text-[#7b8b76]">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-white/70 bg-white/75 p-3">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#203321]">
                        <Smartphone className="h-4 w-4 text-[#0d6e6e]" />
                        Mobile art
                      </div>
                      <div className="overflow-hidden rounded-[18px] bg-[#eef4e7]">
                        {form.mobileImageUrl ? (
                          <img
                            src={form.mobileImageUrl}
                            alt="Mobile banner preview"
                            className="aspect-[4/5] w-full object-cover"
                          />
                        ) : (
                          <div className="flex aspect-[4/5] items-center justify-center text-[#7b8b76]">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-art"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22 }}
                    className="mt-5 rounded-[22px] border border-dashed border-white/70 bg-white/50 px-5 py-8 text-center text-sm text-[#5f6f5d]"
                  >
                    Upload desktop and mobile banner art to see the preview
                    cards here.
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <div className="rounded-[24px] border border-[#e7eadf] bg-white p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#203321]">
              <LayoutTemplate className="h-4 w-4 text-[#0d6e6e]" />
              Desktop Banner Image
            </div>
            <ImagePickerField
              label="Desktop Banner"
              value={form.desktopImageUrl}
              onChange={setImageField("desktopImageUrl")}
              onUpload={uploadBannerImage}
              previewAlt="Desktop banner"
              aspectHint="Recommended wide format for hero desktop layouts."
              helpText="Upload directly to Cloudinary or paste a hosted image URL."
            />
          </div>

          <div className="rounded-[24px] border border-[#e7eadf] bg-white p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#203321]">
              <Smartphone className="h-4 w-4 text-[#0d6e6e]" />
              Mobile Banner Image
            </div>
            <ImagePickerField
              label="Mobile Banner"
              value={form.mobileImageUrl}
              onChange={setImageField("mobileImageUrl")}
              onUpload={uploadBannerImage}
              previewAlt="Mobile banner"
              aspectHint="Recommended portrait crop for mobile-first hero views."
              helpText="Use a mobile-optimized crop so the hero stays focused on smaller screens."
            />
          </div>
        </div>
      </div>
    </SettingsSectionCard>
  );
}

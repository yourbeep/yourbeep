import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Globe,
  Link2,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { InputField } from "../../../components/ui/InputField";
import { MainButton } from "../../../components/ui/MainButton";
import { StatusPill } from "../../../components/ui/StatusPill";
import { showToast } from "../../../utils/showToast";
import SettingsSectionCard from "./SettingsSectionCard";

type FooterLink = {
  label: string;
  url: string;
};

type FooterForm = {
  tagline: string;
  copyrightText: string;
  links: FooterLink[];
};

type SeoForm = {
  defaultTitle: string;
  defaultDescription: string;
};

type FooterSeoFormProps = {
  footerForm: FooterForm;
  setFooterForm: Dispatch<SetStateAction<FooterForm>>;
  seoForm: SeoForm;
  setSeoForm: Dispatch<SetStateAction<SeoForm>>;
  onSave: () => void;
  loading: boolean;
};

export default function FooterSeoForm({
  footerForm,
  setFooterForm,
  seoForm,
  setSeoForm,
  onSave,
  loading,
}: FooterSeoFormProps) {
  const setFooterField =
    (key: keyof Omit<FooterForm, "links">) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;
      setFooterForm((current) => ({ ...current, [key]: nextValue }));
    };

  const setSeoField =
    (key: keyof SeoForm) =>
    (
      event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    ) => {
      const nextValue = event.target.value;
      setSeoForm((current) => ({ ...current, [key]: nextValue }));
    };

  const updateLinkField =
    (index: number, key: keyof FooterLink) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;
      setFooterForm((current) => ({
        ...current,
        links: current.links.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [key]: nextValue } : item,
        ),
      }));
    };

  const addLink = () => {
    setFooterForm((current) => ({
      ...current,
      links: [...current.links, { label: "", url: "" }],
    }));

    showToast({
      type: "info",
      message: "Footer link row added.",
      options: {
        description: "Fill in the label and URL to include it in the footer.",
      },
    });
  };

  const removeLink = (index: number) => {
    setFooterForm((current) => ({
      ...current,
      links: current.links.filter((_, itemIndex) => itemIndex !== index),
    }));

    showToast({
      type: "warning",
      message: "Footer link removed.",
      options: {
        description: "The link row was removed from the current footer draft.",
      },
    });
  };

  const activeLinks = footerForm.links.filter(
    (link) => link.label.trim() && link.url.trim(),
  );

  return (
    <SettingsSectionCard
      title="Footer & SEO"
      subtitle="Footer links, footer messaging, and default SEO metadata for the public platform."
      actions={
        <MainButton
          type="button"
          text={loading ? "Saving..." : "Save Footer & SEO"}
          isLoading={loading}
          headIcon={<Save className="h-4 w-4" />}
          onClick={onSave}
        />
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Footer Tagline"
              name="tagline"
              value={footerForm.tagline}
              placeholder="Reflective learning for modern practitioners."
              onChange={setFooterField("tagline")}
            />
            <InputField
              label="Copyright Text"
              name="copyrightText"
              value={footerForm.copyrightText}
              placeholder="© 2026 YourBeep. All rights reserved."
              onChange={setFooterField("copyrightText")}
            />
          </div>

          <div className="rounded-[24px] border border-[#e7eadf] bg-[#fbfcf8] p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#203321]">
                  Footer Links
                </p>
                <p className="mt-1 text-sm text-[#72806e]">
                  Manage the public footer navigation and support links.
                </p>
              </div>
              <MainButton
                text="Add Link"
                size="sm"
                variant="outline"
                headIcon={<Plus className="h-4 w-4" />}
                onClick={addLink}
              />
            </div>

            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {footerForm.links.map((link, index) => (
                  <motion.div
                    key={`${index}-${link.label}-${link.url}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-[22px] border border-[#dfe8d6] bg-white p-4"
                  >
                    <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                      <InputField
                        label={`Link Label ${index + 1}`}
                        name={`footer-link-label-${index}`}
                        value={link.label}
                        placeholder="About"
                        onChange={updateLinkField(index, "label")}
                      />
                      <InputField
                        label={`Link URL ${index + 1}`}
                        name={`footer-link-url-${index}`}
                        value={link.url}
                        placeholder="/about"
                        onChange={updateLinkField(index, "url")}
                      />
                      <div className="flex items-end">
                        <MainButton
                          text="Remove"
                          size="md"
                          variant="danger"
                          headIcon={<Trash2 className="h-4 w-4" />}
                          onClick={() => removeLink(index)}
                          className="w-full md:w-auto"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Default SEO Title"
              name="defaultTitle"
              value={seoForm.defaultTitle}
              placeholder="YourBeep | Reflective learning"
              onChange={setSeoField("defaultTitle")}
            />
            <InputField
              element="textarea"
              label="Default SEO Description"
              name="defaultDescription"
              value={seoForm.defaultDescription}
              rows={4}
              placeholder="Write the default description used when a page does not override metadata."
              onChange={setSeoField("defaultDescription")}
            />
          </div>
        </div>

        <div className="space-y-5">
          <motion.div
            layout
            className="overflow-hidden rounded-[28px] border border-[#e7eadf] bg-gradient-to-br from-[#f3f8ef] via-white to-[#e7f0df] p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0d6e6e]">
                  Footer Preview
                </p>
                <p className="mt-1 text-sm text-[#5f6f5d]">
                  A cleaner look at the current footer navigation draft.
                </p>
              </div>
              <StatusPill variant="success" dot>
                {activeLinks.length} active
              </StatusPill>
            </div>

            <div className="mt-5 rounded-[24px] border border-white/70 bg-white/85 p-5 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#203321]">
                <Sparkles className="h-4 w-4 text-[#0d6e6e]" />
                Footer snapshot
              </div>

              <p className="mt-3 text-sm leading-6 text-[#5f6f5d]">
                {footerForm.tagline ||
                  "Your footer tagline will appear here once you add it."}
              </p>

              <div className="mt-5 space-y-3">
                {activeLinks.length ? (
                  activeLinks.map((link, index) => (
                    <motion.div
                      key={`${link.label}-${link.url}-${index}`}
                      layout
                      className="flex items-center justify-between rounded-2xl border border-[#e7eadf] bg-[#fbfcf8] px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#203321]">
                          {link.label}
                        </p>
                        <p className="truncate text-xs text-[#72806e]">
                          {link.url}
                        </p>
                      </div>
                      <Link2 className="h-4 w-4 shrink-0 text-[#7b8b76]" />
                    </motion.div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#d7e4d2] bg-white px-5 py-8 text-center">
                    <Globe className="mx-auto h-5 w-5 text-[#7b8b76]" />
                    <p className="mt-3 text-sm font-semibold text-[#203321]">
                      No footer links ready
                    </p>
                    <p className="mt-1 text-sm text-[#72806e]">
                      Add label and URL pairs to make the footer list populate
                      here.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-5 rounded-2xl border border-[#eef3ea] bg-[#fcfdfb] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#72806e]">
                  Copyright
                </p>
                <p className="mt-2 text-sm text-[#5f6f5d]">
                  {footerForm.copyrightText ||
                    "Copyright text preview appears here."}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            layout
            className="rounded-[28px] border border-[#e7eadf] bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-[#203321]">
              <Search className="h-4 w-4 text-[#0d6e6e]" />
              SEO Snapshot
            </div>
            <div className="mt-4 rounded-[22px] border border-[#e7eadf] bg-[#fbfcf8] p-4">
              <p className="text-base font-semibold text-[#203321]">
                {seoForm.defaultTitle || "Default SEO title"}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#5f6f5d]">
                {seoForm.defaultDescription ||
                  "The default SEO description preview appears here once content is added."}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </SettingsSectionCard>
  );
}

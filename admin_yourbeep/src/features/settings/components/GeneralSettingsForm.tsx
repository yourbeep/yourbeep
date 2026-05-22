import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { Apple, Globe, Mail, MapPin, Monitor, Phone, Save } from "lucide-react";
import {
  FaAndroid,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { InputField } from "../../../components/ui/InputField";
import { MainButton } from "../../../components/ui/MainButton";
import SettingsSectionCard from "./SettingsSectionCard";

type GeneralForm = {
  platformName: string;
  supportEmail: string;
  supportPhone: string;
  supportWhatsapp: string;
  contactAddress: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  x: string;
  iosAppUrl: string;
  androidAppUrl: string;
  webAppUrl: string;
};

type GeneralSettingsFormProps = {
  form: GeneralForm;
  setForm: Dispatch<SetStateAction<GeneralForm>>;
  onSave: () => void;
  loading: boolean;
};

type SectionHeaderProps = {
  title: string;
  caption: string;
};

function SectionHeader({ title, caption }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="rounded-full border border-[#d7e4d2] bg-[#eef5e7] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#0d6e6e]">
        {title}
      </span>
      <p className="text-sm text-[#72806e]">{caption}</p>
    </div>
  );
}

export default function GeneralSettingsForm({
  form,
  setForm,
  onSave,
  loading,
}: GeneralSettingsFormProps) {
  const setField =
    (key: keyof GeneralForm) => (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;
      setForm((current) => ({ ...current, [key]: nextValue }));
    };

  return (
    <SettingsSectionCard
      title="General & Support"
      subtitle="Core platform identity, support channels, social links, and app destinations."
      actions={
        <MainButton
          type="button"
          text={loading ? "Saving..." : "Save Settings"}
          isLoading={loading}
          headIcon={<Save className="h-4 w-4" />}
          onClick={onSave}
        />
      }
    >
      <div className="space-y-7">
        <motion.div layout className="space-y-4">
          <SectionHeader
            title="Identity"
            caption="Brand-level naming and location details used throughout the platform."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Platform Name"
              name="platformName"
              value={form.platformName}
              placeholder="YourBeep Admin"
              onChange={setField("platformName")}
              helpText="Shown in internal surfaces and admin-facing summaries."
            />
            <InputField
              label="Contact Address"
              name="contactAddress"
              value={form.contactAddress}
              placeholder="123 Green St, City"
              onChange={setField("contactAddress")}
              helpText="Useful for trust, legal pages, and public contact sections."
            />
          </div>
        </motion.div>

        <motion.div layout className="space-y-4">
          <SectionHeader
            title="Support"
            caption="Primary contact channels for users needing support or onboarding help."
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <InputField
              label="Support Email"
              name="supportEmail"
              type="email"
              value={form.supportEmail}
              placeholder="support@example.com"
              onChange={setField("supportEmail")}
            />
            <InputField
              label="Support Phone"
              name="supportPhone"
              value={form.supportPhone}
              placeholder="+1 000 000 0000"
              onChange={setField("supportPhone")}
            />
            <InputField
              label="WhatsApp"
              name="supportWhatsapp"
              value={form.supportWhatsapp}
              placeholder="+1 000 000 0000"
              onChange={setField("supportWhatsapp")}
            />
          </div>
        </motion.div>

        <motion.div layout className="space-y-4">
          <SectionHeader
            title="Social Links"
            caption="Public social handles surfaced across marketing, footer, and trust areas."
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InputField
              label="Instagram"
              name="instagram"
              value={form.instagram}
              placeholder="instagram.com/handle"
              onChange={setField("instagram")}
            />
            <InputField
              label="YouTube"
              name="youtube"
              value={form.youtube}
              placeholder="youtube.com/@channel"
              onChange={setField("youtube")}
            />
            <InputField
              label="LinkedIn"
              name="linkedin"
              value={form.linkedin}
              placeholder="linkedin.com/company/yourbeep"
              onChange={setField("linkedin")}
            />
            <InputField
              label="X / Twitter"
              name="x"
              value={form.x}
              placeholder="x.com/handle"
              onChange={setField("x")}
            />
          </div>
        </motion.div>

        <motion.div layout className="space-y-4">
          <SectionHeader
            title="App Destinations"
            caption="Store links and web destinations used in CTA areas and device prompts."
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <InputField
              label="iOS App URL"
              name="iosAppUrl"
              type="url"
              value={form.iosAppUrl}
              placeholder="apps.apple.com/yourbeep"
              onChange={setField("iosAppUrl")}
            />
            <InputField
              label="Android App URL"
              name="androidAppUrl"
              type="url"
              value={form.androidAppUrl}
              placeholder="play.google.com/store/apps/details?id=..."
              onChange={setField("androidAppUrl")}
            />
            <InputField
              label="Web App URL"
              name="webAppUrl"
              type="url"
              value={form.webAppUrl}
              placeholder="https://app.yourbeep.com"
              onChange={setField("webAppUrl")}
            />
          </div>
        </motion.div>

        <motion.div
          layout
          className="rounded-[24px] border border-[#e7eadf] bg-[#fbfcf8] p-5"
        >
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#203321]">
            <Monitor className="h-4 w-4 text-[#0d6e6e]" />
            Quick overview
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-[#dfe8d6] bg-white px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#72806e]">
                <Mail className="h-3.5 w-3.5" />
                Support
              </div>
              <p className="mt-2 text-sm font-semibold text-[#203321]">
                {form.supportEmail || "No support email yet"}
              </p>
            </div>
            <div className="rounded-2xl border border-[#dfe8d6] bg-white px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#72806e]">
                <Phone className="h-3.5 w-3.5" />
                Phone
              </div>
              <p className="mt-2 text-sm font-semibold text-[#203321]">
                {form.supportPhone || "No support phone yet"}
              </p>
            </div>
            <div className="rounded-2xl border border-[#dfe8d6] bg-white px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#72806e]">
                <MapPin className="h-3.5 w-3.5" />
                Address
              </div>
              <p className="mt-2 text-sm font-semibold text-[#203321]">
                {form.contactAddress || "No address yet"}
              </p>
            </div>
            <div className="rounded-2xl border border-[#dfe8d6] bg-white px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#72806e]">
                <Globe className="h-3.5 w-3.5" />
                Web App
              </div>
              <p className="mt-2 truncate text-sm font-semibold text-[#203321]">
                {form.webAppUrl || "No web app URL yet"}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="flex items-center gap-2 rounded-2xl border border-[#dfe8d6] bg-white px-4 py-3 text-sm text-[#5f6f5d]">
              <FaWhatsapp className="h-4 w-4 text-[#0d6e6e]" />
              <span className="truncate">
                {form.supportWhatsapp || "WhatsApp not set"}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-[#dfe8d6] bg-white px-4 py-3 text-sm text-[#5f6f5d]">
              <FaInstagram className="h-4 w-4 text-[#0d6e6e]" />
              <span className="truncate">
                {form.instagram || "Instagram not set"}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-[#dfe8d6] bg-white px-4 py-3 text-sm text-[#5f6f5d]">
              <FaYoutube className="h-4 w-4 text-[#0d6e6e]" />
              <span className="truncate">
                {form.youtube || "YouTube not set"}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-[#dfe8d6] bg-white px-4 py-3 text-sm text-[#5f6f5d]">
              <Apple className="h-4 w-4 text-[#0d6e6e]" />
              <span className="truncate">
                {form.iosAppUrl || "iOS URL not set"}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-[#dfe8d6] bg-white px-4 py-3 text-sm text-[#5f6f5d]">
              <FaAndroid className="h-4 w-4 text-[#0d6e6e]" />
              <span className="truncate">
                {form.androidAppUrl || "Android URL not set"}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-[#dfe8d6] bg-white px-4 py-3 text-sm text-[#5f6f5d]">
              <FaLinkedinIn className="h-4 w-4 text-[#0d6e6e]" />
              <span className="truncate">
                {form.linkedin || "LinkedIn not set"}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-[#dfe8d6] bg-white px-4 py-3 text-sm text-[#5f6f5d]">
              <FaXTwitter className="h-4 w-4 text-[#0d6e6e]" />
              <span className="truncate">
                {form.x || "X / Twitter not set"}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-[#dfe8d6] bg-white px-4 py-3 text-sm text-[#5f6f5d]">
              <Monitor className="h-4 w-4 text-[#0d6e6e]" />
              <span className="truncate">
                {form.platformName || "Platform name not set"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </SettingsSectionCard>
  );
}

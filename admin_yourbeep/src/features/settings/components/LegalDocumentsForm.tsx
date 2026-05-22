import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import {
  Scale,
  ShieldCheck,
  Undo2,
  Cookie,
  ScrollText,
  Save,
} from "lucide-react";
import { MainButton } from "../../../components/ui/MainButton";
import { InputField } from "../../../components/ui/InputField";
import SettingsSectionCard from "./SettingsSectionCard";

type LegalForm = {
  termsOfService: string;
  privacyPolicy: string;
  refundPolicy: string;
  cookiePolicy: string;
  communityGuidelines: string;
};

type LegalDocumentsFormProps = {
  form: LegalForm;
  setForm: Dispatch<SetStateAction<LegalForm>>;
  onSave: () => void;
  loading: boolean;
};

const legalFields: Array<{
  key: keyof LegalForm;
  label: string;
  icon: typeof Scale;
  placeholder: string;
  helpText: string;
  fullWidth?: boolean;
}> = [
  {
    key: "termsOfService",
    label: "Terms & Conditions",
    icon: Scale,
    placeholder:
      "Outline the service terms, account responsibilities, and usage rules.",
    helpText:
      "Shown to users when they review platform terms and acceptance rules.",
  },
  {
    key: "privacyPolicy",
    label: "Privacy Policy",
    icon: ShieldCheck,
    placeholder:
      "Explain how user data is collected, processed, stored, and protected.",
    helpText:
      "Use this for consent, processing, retention, and user rights language.",
  },
  {
    key: "refundPolicy",
    label: "Refund Policy",
    icon: Undo2,
    placeholder:
      "Clarify eligibility, timelines, exclusions, and escalation paths for refunds.",
    helpText: "Best used for payment reversal rules and support expectations.",
  },
  {
    key: "cookiePolicy",
    label: "Cookie Policy",
    icon: Cookie,
    placeholder:
      "Describe cookie usage, analytics, personalization, and opt-out options.",
    helpText: "Useful for analytics disclosures and browser consent behavior.",
  },
  {
    key: "communityGuidelines",
    label: "Community Guidelines",
    icon: ScrollText,
    placeholder:
      "Document respectful behavior, moderation boundaries, and content expectations.",
    helpText:
      "Set tone for community participation, safety, and moderation enforcement.",
    fullWidth: true,
  },
];

export default function LegalDocumentsForm({
  form,
  setForm,
  onSave,
  loading,
}: LegalDocumentsFormProps) {
  const updateField =
    (key: keyof LegalForm) => (event: ChangeEvent<HTMLTextAreaElement>) => {
      const nextValue = event.target.value;
      setForm((current) => ({ ...current, [key]: nextValue }));
    };

  return (
    <SettingsSectionCard
      title="Legal Documents"
      subtitle="These fields map to the backend legal document payload and let the team keep public legal copy in sync."
      actions={
        <MainButton
          type="button"
          text={loading ? "Saving..." : "Save Legal Content"}
          isLoading={loading}
          headIcon={<Save className="h-4 w-4" />}
          onClick={onSave}
        />
      }
    >
      <div className="grid gap-5 md:grid-cols-2">
        {legalFields.map((field) => {
          const Icon = field.icon;

          return (
            <div
              key={field.key}
              className={field.fullWidth ? "md:col-span-2" : ""}
            >
              <div className="mb-2 flex items-center gap-2 text-[#0d6e6e]">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#dce8d4] bg-[#f6faf3]">
                  <Icon className="h-4 w-4" />
                </span>
              </div>

              <InputField
                element="textarea"
                label={field.label}
                name={field.key}
                value={form[field.key]}
                placeholder={field.placeholder}
                helpText={field.helpText}
                rows={field.fullWidth ? 8 : 7}
                onChange={updateField(field.key)}
              />
            </div>
          );
        })}
      </div>
    </SettingsSectionCard>
  );
}

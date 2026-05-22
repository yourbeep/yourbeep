import type { Dispatch, SetStateAction } from "react";
import { InputField } from "../../../components/ui/InputField";
import { ImagePickerField } from "../../../components/ui/ImagePickerField";
import { MainButton } from "../../../components/ui/MainButton";
import { uploadCloudinaryImage } from "../../../services/media/cloudinaryUpload";
import type { ProfileFormValues } from "../hooks/useProfileForm";
import ProfileSectionCard from "./ProfileSectionCard";

type ProfileFormCardProps = {
  form: ProfileFormValues;
  setForm: Dispatch<SetStateAction<ProfileFormValues>>;
  onSave: () => void;
  saving: boolean;
};

export default function ProfileFormCard({
  form,
  setForm,
  onSave,
  saving,
}: ProfileFormCardProps) {
  return (
    <ProfileSectionCard
      title="Personal Information"
      subtitle="Update the editable account fields that are stored in the platform backend."
      actions={
        <MainButton
          text={saving ? "Saving..." : "Save Changes"}
          onClick={onSave}
          isLoading={saving}
        />
      }
    >
      <div className="space-y-5">
        <ImagePickerField
          label="Avatar"
          value={form.avatar}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              avatar: value,
            }))
          }
          onUpload={(file) =>
            uploadCloudinaryImage(file, {
              folder: "yourbeep/admin/profile",
              tags: ["admin-profile"],
            }).then((result) => result.secureUrl)
          }
          previewAlt={form.name || "Admin avatar"}
          aspectHint="Upload a square avatar for the cleanest admin profile preview."
          helpText="Upload directly to Cloudinary. The secure URL will be saved automatically."
          showUrlInput={false}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <InputField
              label="Full Name"
              name="name"
              value={form.name}
              placeholder="Admin name"
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
            />
          </div>

          <InputField
            label="Timezone"
            name="timezone"
            value={form.timezone}
            placeholder="Asia/Calcutta"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                timezone: event.target.value,
              }))
            }
          />

          <InputField
            label="Phone Country Code"
            name="phoneCountryCode"
            value={form.phoneCountryCode}
            placeholder="+91"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                phoneCountryCode: event.target.value,
              }))
            }
          />
        </div>
      </div>
    </ProfileSectionCard>
  );
}

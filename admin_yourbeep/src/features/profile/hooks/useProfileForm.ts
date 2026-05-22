import { useEffect, useState } from "react";
import type { AdminProfile } from "../../../store/slices/profile";

export type ProfileFormValues = {
  name: string;
  avatar: string;
  timezone: string;
  phoneCountryCode: string;
};

const defaultFormValues: ProfileFormValues = {
  name: "",
  avatar: "",
  timezone: "",
  phoneCountryCode: "",
};

export function useProfileForm(profile: AdminProfile | null) {
  const [form, setForm] = useState<ProfileFormValues>(defaultFormValues);

  useEffect(() => {
    setForm({
      name: profile?.name || "",
      avatar: profile?.avatar || "",
      timezone: profile?.timezone || "",
      phoneCountryCode: profile?.phoneCountryCode || "",
    });
  }, [profile]);

  return { form, setForm };
}

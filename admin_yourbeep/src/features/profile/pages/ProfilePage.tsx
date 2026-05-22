import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../../store";
import { loadUser } from "../../../store/slices/auth";
import {
  clearProfileError,
  fetchAdminProfile,
  updateAdminProfile,
} from "../../../store/slices/profile";
import { showToast } from "../../../utils/showToast";
import { useProfileForm } from "../hooks/useProfileForm";
import ProfileAccessActivityCard from "../components/ProfileAccessActivityCard";
import ProfileFormCard from "../components/ProfileFormCard";
import ProfileHero from "../components/ProfileHero";
import ProfilePageSkeleton from "../components/ProfilePageSkeleton";
import ProfileSnapshotCard from "../components/ProfileSnapshotCard";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { data, loading, saving, error } = useAppSelector((state) => state.profile);
  const { form, setForm } = useProfileForm(data);

  useEffect(() => {
    if (!data && !loading) {
      dispatch(fetchAdminProfile());
    }
  }, [data, dispatch, loading]);

  useEffect(() => {
    if (error) {
      showToast({
        type: "error",
        message: "Profile issue",
        options: {
          description: error,
        },
      });
    }
  }, [error]);

  const handleSave = async () => {
    dispatch(clearProfileError());

    const saveToastId = "profile-save";
    showToast({
      type: "loading",
      message: "Saving profile",
      options: {
        description: "Updating your admin profile details.",
        id: saveToastId,
      },
    });

    try {
      await dispatch(
        updateAdminProfile({
          name: form.name.trim() || undefined,
          avatar: form.avatar.trim() || undefined,
          timezone: form.timezone.trim() || undefined,
          phoneCountryCode: form.phoneCountryCode.trim() || undefined,
        }),
      ).unwrap();

      await dispatch(loadUser()).unwrap();

      showToast({
        type: "success",
        message: "Profile updated",
        options: {
          description: "Your admin identity details were saved successfully.",
          id: saveToastId,
        },
      });
    } catch (saveError) {
      showToast({
        type: "error",
        message: "Unable to save profile",
        options: {
          description:
            typeof saveError === "string"
              ? saveError
              : "Please try again in a moment.",
          id: saveToastId,
        },
      });
    }
  };

  if (loading && !data) {
    return <ProfilePageSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      className="space-y-6"
    >
      <ProfileHero profile={data} previewAvatar={form.avatar} />

      {error ? (
        <div className="rounded-2xl border border-[#f3e2b4] bg-[#fff9ea] px-4 py-3 text-sm text-[#9a7a19]">
          Profile data could not be fully refreshed: {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="space-y-6">
          <ProfileFormCard
            form={form}
            setForm={setForm}
            saving={saving}
            onSave={() => {
              void handleSave();
            }}
          />
          <ProfileAccessActivityCard profile={data} />
        </div>

        <ProfileSnapshotCard profile={data} />
      </div>
    </motion.div>
  );
}

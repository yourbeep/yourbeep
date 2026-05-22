import { motion } from "framer-motion";
import type { AdminProfile } from "../../../store/slices/profile";
import { formatDateOnly } from "../services/profileFormatters";

type ProfileHeroProps = {
  profile: AdminProfile | null;
  previewAvatar?: string;
};

export default function ProfileHero({
  profile,
  previewAvatar,
}: ProfileHeroProps) {
  const avatarSrc = previewAvatar || profile?.avatar || "";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="overflow-hidden rounded-[28px] border border-[#e8eadf] bg-white shadow-sm"
    >
      <div className="bg-[radial-gradient(circle_at_top_left,rgba(84,145,96,0.18),transparent_38%),linear-gradient(135deg,#f7fbf5_0%,#edf6e8_45%,#e6f2df_100%)] p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[24px] bg-[#edf3e6] text-2xl font-bold text-[#335c38] ring-4 ring-white/80">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={profile?.name || "Admin"}
                  className="h-full w-full object-cover"
                />
              ) : (
                (profile?.name || "A").charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-[28px] font-bold tracking-tight text-gray-900">
                {profile?.name || "Admin Profile"}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {profile?.email || "Admin account"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#edf7ef] px-3 py-1 text-xs font-semibold text-[#2f6e3e]">
                  {profile?.role === "admin" ? "System Admin" : "User"}
                </span>
                <span className="rounded-full bg-[#f4f5ef] px-3 py-1 text-xs font-semibold text-[#5d6d57]">
                  Joined {formatDateOnly(profile?.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl bg-white/80 p-4 backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                Region
              </p>
              <p className="mt-2 text-lg font-bold text-[#203321]">
                {profile?.region || "Not set"}
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                Timezone
              </p>
              <p className="mt-2 text-lg font-bold text-[#203321]">
                {profile?.timezone || "Not set"}
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                Active Sessions
              </p>
              <p className="mt-2 text-2xl font-bold text-[#203321]">
                {profile?.sessionSummary?.totalDevices ?? profile?.fcmTokens?.length ?? 0}
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                Last Access
              </p>
              <p className="mt-2 text-sm font-bold text-[#203321]">
                {formatDateOnly(
                  profile?.sessionSummary?.lastLoginAt || profile?.lastActiveAt,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

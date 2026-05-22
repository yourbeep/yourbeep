import { motion } from "framer-motion";
import type { AdminProfile } from "../../../store/slices/profile";
import { StatusPill } from "../../../components/ui/StatusPill";
import { formatDateTime } from "../services/profileFormatters";
import ProfileSectionCard from "./ProfileSectionCard";

type ProfileAccessActivityCardProps = {
  profile: AdminProfile | null;
};

function getAccessLabel(type: string) {
  switch (type) {
    case "video_watch":
      return "Video watched";
    case "course_progress":
      return "Course progress";
    case "game_submission":
      return "Game completed";
    default:
      return type.replace(/_/g, " ");
  }
}

function getPlatformLabel(platform: "web" | "ios" | "android") {
  if (platform === "ios") return "iOS";
  if (platform === "android") return "Android";
  return "Web";
}

export default function ProfileAccessActivityCard({
  profile,
}: ProfileAccessActivityCardProps) {
  const sessions = profile?.recentSessions ?? [];
  const activity = profile?.recentAccessActivity ?? [];

  return (
    <ProfileSectionCard
      title="Access & Session Activity"
      subtitle="Latest admin account access sessions with device, IP, and location context."
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-[#203321]">
              Last 5 Access Sessions
            </h3>
            <StatusPill variant="info" size="sm">
              {sessions.length} tracked
            </StatusPill>
          </div>

          {sessions.length ? (
            <div className="overflow-hidden rounded-[24px] border border-[#e5eadf] bg-white shadow-sm">
              <div className="grid grid-cols-[1fr_160px_150px_170px_160px] gap-3 border-b border-[#eef2e9] bg-[#f8faf6] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#7a8976]">
                <span>Access</span>
                <span>Platform</span>
                <span>IP</span>
                <span>Location</span>
                <span>Last seen</span>
              </div>

              <div className="divide-y divide-[#eef2e9]">
                {sessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="grid grid-cols-[1fr_160px_150px_170px_160px] gap-3 px-4 py-4 text-sm text-[#304233]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#203321]">
                        {session.deviceName || session.userAgent || "Unknown device"}
                      </p>
                      <p className="mt-1 text-xs text-[#72806e]">
                        First seen {formatDateTime(session.firstSeenAt)}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <StatusPill
                        variant={session.notificationsEnabled ? "success" : "neutral"}
                        size="sm"
                      >
                        {getPlatformLabel(session.platform)}
                      </StatusPill>
                    </div>

                    <div className="flex items-center text-[#4e6050]">
                      {session.ipAddress || "Unavailable"}
                    </div>

                    <div className="flex items-center text-[#4e6050]">
                      {session.locationLabel || session.countryCode || "Unknown"}
                    </div>

                    <div className="flex items-center text-[#4e6050]">
                      {formatDateTime(session.lastSeenAt)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-[22px] border border-dashed border-[#dfe8d6] bg-[#fbfcf8] px-5 py-10 text-center text-sm text-[#72806e]">
              No access sessions recorded for this admin account yet.
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-[#203321]">
            Recent Access Activity
          </h3>
          <div className="space-y-3">
            {activity.length ? (
              activity.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-[22px] border border-[#e7eadf] bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#203321]">
                        {getAccessLabel(entry.type)}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#7f8a7a]">
                        {entry.gameKey || entry.courseId || "admin access"}
                      </p>
                    </div>
                    <StatusPill variant="info" size="sm">
                      {formatDateTime(entry.completedAt)}
                    </StatusPill>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-[#dfe8d6] bg-[#fbfcf8] px-5 py-10 text-center text-sm text-[#72806e]">
                No recent access activity was recorded for this account.
              </div>
            )}
          </div>
        </div>
      </div>
    </ProfileSectionCard>
  );
}

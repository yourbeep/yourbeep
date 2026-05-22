import type { AdminProfile } from "../../../store/slices/profile";
import { formatDateOnly, formatDateTime } from "../services/profileFormatters";
import ProfileSectionCard from "./ProfileSectionCard";

type SnapshotItemProps = {
  label: string;
  value: string;
};

function SnapshotItem({ label, value }: SnapshotItemProps) {
  return (
    <div className="rounded-2xl bg-[#f7f8f3] p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-semibold text-[#203321]">
        {value || "N/A"}
      </p>
    </div>
  );
}

type ProfileSnapshotCardProps = {
  profile: AdminProfile | null;
};

export default function ProfileSnapshotCard({
  profile,
}: ProfileSnapshotCardProps) {
  const latestSession = profile?.recentSessions?.[0] ?? null;

  return (
    <ProfileSectionCard
      title="Account Snapshot"
      subtitle="Read-only backend fields for this admin identity and its recent platform activity."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        <SnapshotItem label="Email" value={profile?.email || "N/A"} />
        <SnapshotItem label="Region" value={profile?.region || "Not set"} />
        <SnapshotItem
          label="Role"
          value={profile?.role === "admin" ? "System Admin" : "User"}
        />
        <SnapshotItem label="Firebase UID" value={profile?.firebaseUid || "N/A"} />
        <SnapshotItem label="Joined" value={formatDateOnly(profile?.createdAt)} />
        <SnapshotItem
          label="Last Active"
          value={formatDateTime(profile?.lastActiveAt)}
        />
        <SnapshotItem label="Updated" value={formatDateTime(profile?.updatedAt)} />
        <SnapshotItem
          label="Account Status"
          value={profile?.isActive ? "Active" : "Inactive"}
        />
        <SnapshotItem
          label="Web Sessions"
          value={String(profile?.sessionSummary?.activeWebSessions ?? 0)}
        />
        <SnapshotItem
          label="Mobile Sessions"
          value={String(profile?.sessionSummary?.activeMobileSessions ?? 0)}
        />
        <SnapshotItem
          label="Last Access Location"
          value={
            latestSession?.locationLabel ||
            latestSession?.countryCode ||
            profile?.region ||
            "Unknown"
          }
        />
        <SnapshotItem
          label="Last Access IP"
          value={latestSession?.ipAddress || "Unavailable"}
        />
      </div>
    </ProfileSectionCard>
  );
}

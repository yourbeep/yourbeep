import type {
  NotificationAudienceType,
  NotificationCampaignStatus,
  NotificationCampaignType,
} from "../../../store/slices/notifications";
import type { StatusPillVariant } from "../../../components/ui/StatusPill";

export const audienceLabel = (value: string) =>
  String(value || "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const formatDateTime = (value?: string | null) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const campaignStatusVariant: Record<
  NotificationCampaignStatus,
  StatusPillVariant
> = {
  draft: "warning",
  sent: "success",
  cancelled: "danger",
};

export const notificationAudienceOptions: Array<{
  label: string;
  value: NotificationAudienceType;
}> = [
  "all_users",
  "premium_users",
  "course_purchasers",
  "specific_users",
  "region_users",
].map((value) => ({
  label: audienceLabel(value),
  value,
}));

export const notificationStatusOptions: Array<{
  label: string;
  value: NotificationCampaignStatus;
}> = ["draft", "sent", "cancelled"].map((value) => ({
  label: audienceLabel(value),
  value,
}));

export const notificationTypeOptions: Array<{
  label: string;
  value: NotificationCampaignType;
}> = [
  "course_ready",
  "game_added",
  "game_reminder",
  "purchase_confirmed",
  "subscription_expiring",
  "subscription_expired",
  "admin_broadcast",
].map((value) => ({
  label: audienceLabel(value),
  value,
}));

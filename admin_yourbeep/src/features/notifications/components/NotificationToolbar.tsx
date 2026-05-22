import { Filter, Plus, RefreshCcw, Search } from "lucide-react";
import { AnimatedDropdown } from "../../../components/ui/AnimatedDropdown";
import { InputField } from "../../../components/ui/InputField";
import { MainButton } from "../../../components/ui/MainButton";
import type {
  NotificationAudienceType,
  NotificationCampaignStatus,
} from "../../../store/slices/notifications";
import {
  notificationAudienceOptions,
  notificationStatusOptions,
} from "../services/notificationFormatters";

type NotificationToolbarProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  status: NotificationCampaignStatus | "";
  setStatus: (value: NotificationCampaignStatus | "") => void;
  audienceType: NotificationAudienceType | "";
  setAudienceType: (value: NotificationAudienceType | "") => void;
  onApply: () => void;
  onRefresh: () => void;
  onCreate: () => void;
  loading: boolean;
};

export default function NotificationToolbar({
  searchQuery,
  setSearchQuery,
  status,
  setStatus,
  audienceType,
  setAudienceType,
  onApply,
  onRefresh,
  onCreate,
  loading,
}: NotificationToolbarProps) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <InputField
          label="Search campaigns"
          value={searchQuery}
          placeholder="Search by title or body..."
          onChange={(event) => setSearchQuery(event.target.value)}
          inputClassName="bg-white"
          helpText="Filter the campaign library by title or message content."
        />

        <AnimatedDropdown
          name="notification-status"
          label="Status"
          value={status}
          placeholder="All statuses"
          headIcon={<Filter className="h-4 w-4" />}
          options={[
            { label: "All statuses", value: "" },
            ...notificationStatusOptions,
          ]}
          onChange={(value) =>
            setStatus((value || "") as NotificationCampaignStatus | "")
          }
        />

        <AnimatedDropdown
          name="notification-audience"
          label="Audience"
          value={audienceType}
          placeholder="All audiences"
          headIcon={<Search className="h-4 w-4" />}
          options={[
            { label: "All audiences", value: "" },
            ...notificationAudienceOptions,
          ]}
          onChange={(value) =>
            setAudienceType((value || "") as NotificationAudienceType | "")
          }
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <MainButton
          text="Apply Filters"
          variant="primary"
          headIcon={<Filter className="h-4 w-4" />}
          onClick={onApply}
        />
        <MainButton
          text="Refresh"
          variant="outline"
          isLoading={loading}
          headIcon={<RefreshCcw className="h-4 w-4" />}
          onClick={onRefresh}
        />
        <MainButton
          text="New Campaign"
          variant="soft"
          headIcon={<Plus className="h-4 w-4" />}
          onClick={onCreate}
        />
      </div>
    </div>
  );
}

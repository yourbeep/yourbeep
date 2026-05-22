import { Filter, RefreshCw } from "lucide-react";
import { AnimatedDropdown } from "../../../components/ui/AnimatedDropdown";
import { InputField } from "../../../components/ui/InputField";
import { MainButton } from "../../../components/ui/MainButton";
import type { ContactRequestStatus, ContactRequestTopic } from "../../../store/slices/support";
import {
  contactStatusOptions,
  contactTopicOptions,
  ticketTypeLabel,
} from "../services/supportFormatters";

type ContactRequestsToolbarProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  topic: ContactRequestTopic | "";
  setTopic: (value: ContactRequestTopic | "") => void;
  status: ContactRequestStatus | "";
  setStatus: (value: ContactRequestStatus | "") => void;
  onApply: () => void;
  onRefresh: () => void;
  loading: boolean;
};

export default function ContactRequestsToolbar({
  searchQuery,
  setSearchQuery,
  topic,
  setTopic,
  status,
  setStatus,
  onApply,
  onRefresh,
  loading,
}: ContactRequestsToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#203321]">
            Get in touch filters
          </p>
          <p className="mt-1 text-sm text-[#72806e]">
            Separate partnerships, feedback, and general enquiries from the support queue.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <MainButton
            text="Apply Filters"
            size="sm"
            headIcon={<Filter className="h-4 w-4" />}
            onClick={onApply}
          />
          <MainButton
            text="Refresh"
            size="sm"
            variant="outline"
            headIcon={<RefreshCw className="h-4 w-4" />}
            onClick={onRefresh}
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <InputField
          label="Search"
          name="support-contact-search"
          value={searchQuery}
          placeholder="Search name, email, subject..."
          onChange={(event) => setSearchQuery(event.target.value)}
        />

        <AnimatedDropdown
          label="Topic"
          name="support-contact-topic"
          value={topic}
          options={[
            { label: "All topics", value: "" },
            ...contactTopicOptions.map((item) => ({
              label: ticketTypeLabel(item),
              value: item,
            })),
          ]}
          className="w-full"
          onChange={(value) => setTopic(value as ContactRequestTopic | "")}
        />

        <AnimatedDropdown
          label="Status"
          name="support-contact-status"
          value={status}
          options={[
            { label: "All statuses", value: "" },
            ...contactStatusOptions.map((item) => ({
              label: ticketTypeLabel(item),
              value: item,
            })),
          ]}
          className="w-full"
          onChange={(value) => setStatus(value as ContactRequestStatus | "")}
        />
      </div>
    </div>
  );
}

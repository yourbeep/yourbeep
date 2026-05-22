import { Filter, RefreshCw } from "lucide-react";
import { AnimatedDropdown } from "../../../components/ui/AnimatedDropdown";
import { InputField } from "../../../components/ui/InputField";
import { MainButton } from "../../../components/ui/MainButton";
import type {
  SupportTicketPriority,
  SupportTicketStatus,
  SupportTicketType,
} from "../../../store/slices/support";
import {
  supportTicketPriorityOptions,
  supportTicketStatusOptions,
  supportTicketTypeOptions,
  ticketTypeLabel,
} from "../services/supportFormatters";

type TicketsToolbarProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  type: SupportTicketType | "";
  setType: (value: SupportTicketType | "") => void;
  status: SupportTicketStatus | "";
  setStatus: (value: SupportTicketStatus | "") => void;
  priority: SupportTicketPriority | "";
  setPriority: (value: SupportTicketPriority | "") => void;
  onApply: () => void;
  onRefresh: () => void;
  loading: boolean;
};

export default function TicketsToolbar({
  searchQuery,
  setSearchQuery,
  type,
  setType,
  status,
  setStatus,
  priority,
  setPriority,
  onApply,
  onRefresh,
  loading,
}: TicketsToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#203321]">
            Ticket queue filters
          </p>
          <p className="mt-1 text-sm text-[#72806e]">
            Focus the queue by ticket type, urgency, or workflow status.
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

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <InputField
          label="Search"
          name="support-ticket-search"
          value={searchQuery}
          placeholder="Search ticket number, subject, or user..."
          onChange={(event) => setSearchQuery(event.target.value)}
        />

        <AnimatedDropdown
          label="Type"
          name="support-ticket-type"
          value={type}
          options={[
            { label: "All ticket types", value: "" },
            ...supportTicketTypeOptions.map((item) => ({
              label: ticketTypeLabel(item),
              value: item,
            })),
          ]}
          className="w-full"
          onChange={(value) => setType(value as SupportTicketType | "")}
        />

        <AnimatedDropdown
          label="Status"
          name="support-ticket-status"
          value={status}
          options={[
            { label: "All statuses", value: "" },
            ...supportTicketStatusOptions.map((item) => ({
              label: ticketTypeLabel(item),
              value: item,
            })),
          ]}
          className="w-full"
          onChange={(value) => setStatus(value as SupportTicketStatus | "")}
        />

        <AnimatedDropdown
          label="Priority"
          name="support-ticket-priority"
          value={priority}
          options={[
            { label: "All priorities", value: "" },
            ...supportTicketPriorityOptions.map((item) => ({
              label: ticketTypeLabel(item),
              value: item,
            })),
          ]}
          className="w-full"
          onChange={(value) => setPriority(value as SupportTicketPriority | "")}
        />
      </div>
    </div>
  );
}

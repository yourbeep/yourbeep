import { MainButton } from "../../../components/ui/MainButton";
import type { SupportTicketItem } from "../../../store/slices/support";
import {
  formatDateTime,
  formatRelativeTime,
  ticketStatusLabel,
  ticketTypeLabel,
} from "../services/supportFormatters";

type TicketsTableProps = {
  items: SupportTicketItem[];
  onOpen: (ticketId: string) => void;
};

const priorityTone: Record<SupportTicketItem["priority"], string> = {
  urgent: "bg-[#fff0ee] text-[#c44536]",
  high: "bg-[#fff6e5] text-[#b7791f]",
  medium: "bg-[#edf7f0] text-[#2f6e3e]",
  low: "bg-[#f4f5ef] text-[#687465]",
};

const statusTone: Record<SupportTicketItem["status"], string> = {
  open: "bg-[#eef7ee] text-[#2f6e3e]",
  in_progress: "bg-[#eef6fb] text-[#286f8f]",
  waiting_on_user: "bg-[#fff8ea] text-[#9a7a19]",
  resolved: "bg-[#f2f4eb] text-[#5d6d57]",
  closed: "bg-[#f3f4ef] text-[#72806e]",
};

export default function TicketsTable({ items, onOpen }: TicketsTableProps) {
  if (!items.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-[#d8e3d2] bg-[#fbfcf8] px-6 py-14 text-center">
        <p className="text-lg font-semibold text-[#203321]">No support tickets yet</p>
        <p className="mt-2 text-sm text-[#74816f]">
          Ticket activity will appear here once learners start raising issues.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#e7eadf] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#edf0e7]">
          <thead className="bg-[#f7f8f3]">
            <tr>
              {[
                "Ticket",
                "User",
                "Type",
                "Priority",
                "Status",
                "Last Reply",
                "Created",
                "Action",
              ].map((label) => (
                <th
                  key={label}
                  className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf0e7]">
            {items.map((ticket) => (
              <tr key={ticket._id} className="transition hover:bg-[#fbfcf8]">
                <td className="px-4 py-4">
                  <p className="text-sm font-semibold text-[#203321]">{ticket.ticketNumber}</p>
                  <p className="mt-1 max-w-[240px] truncate text-sm text-[#5d6d57]">
                    {ticket.subject}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-semibold text-[#203321]">
                    {ticket.user?.name || "Unknown user"}
                  </p>
                  <p className="mt-1 text-sm text-[#74816f]">
                    {ticket.user?.email || ticket.userId}
                  </p>
                </td>
                <td className="px-4 py-4 text-sm text-[#304132]">
                  {ticketTypeLabel(ticket.type)}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityTone[ticket.priority]}`}
                  >
                    {ticketTypeLabel(ticket.priority)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone[ticket.status]}`}
                  >
                    {ticketStatusLabel(ticket.status)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-[#203321]">
                    {formatRelativeTime(ticket.lastReplyAt)}
                  </p>
                  <p className="mt-1 text-xs text-[#83907e]">
                    {ticket.lastReplyBy === "admin" ? "Admin replied" : "Awaiting admin"}
                  </p>
                </td>
                <td className="px-4 py-4 text-sm text-[#74816f]">
                  {formatDateTime(ticket.createdAt)}
                </td>
                <td className="px-4 py-4">
                  <MainButton
                    text="Open"
                    size="sm"
                    variant="outline"
                    onClick={() => onOpen(ticket._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

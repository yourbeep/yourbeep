import { MainButton } from "../../../components/ui/MainButton";
import type { ContactRequestItem } from "../../../store/slices/support";
import { formatDateTime, ticketTypeLabel } from "../services/supportFormatters";

type ContactRequestsTableProps = {
  items: ContactRequestItem[];
  onOpen: (requestId: string) => void;
};

const statusTone: Record<ContactRequestItem["status"], string> = {
  new: "bg-[#eef7ee] text-[#2f6e3e]",
  reviewed: "bg-[#eef6fb] text-[#286f8f]",
  replied: "bg-[#fff8ea] text-[#9a7a19]",
  closed: "bg-[#f3f4ef] text-[#72806e]",
};

export default function ContactRequestsTable({
  items,
  onOpen,
}: ContactRequestsTableProps) {
  if (!items.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-[#d8e3d2] bg-[#fbfcf8] px-6 py-14 text-center">
        <p className="text-lg font-semibold text-[#203321]">No contact requests yet</p>
        <p className="mt-2 text-sm text-[#74816f]">
          Public get in touch submissions will appear here for triage.
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
              {["Sender", "Topic", "Subject", "Status", "Created", "Action"].map(
                (label) => (
                  <th
                    key={label}
                    className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]"
                  >
                    {label}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf0e7]">
            {items.map((request) => (
              <tr key={request._id} className="transition hover:bg-[#fbfcf8]">
                <td className="px-4 py-4">
                  <p className="text-sm font-semibold text-[#203321]">{request.name}</p>
                  <p className="mt-1 text-sm text-[#74816f]">{request.email}</p>
                </td>
                <td className="px-4 py-4 text-sm text-[#304132]">
                  {ticketTypeLabel(request.topic)}
                </td>
                <td className="px-4 py-4">
                  <p className="max-w-[320px] truncate text-sm font-medium text-[#203321]">
                    {request.subject}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone[request.status]}`}
                  >
                    {ticketTypeLabel(request.status)}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-[#74816f]">
                  {formatDateTime(request.createdAt)}
                </td>
                <td className="px-4 py-4">
                  <MainButton
                    text="Open"
                    size="sm"
                    variant="outline"
                    onClick={() => onOpen(request._id)}
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

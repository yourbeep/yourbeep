import { useEffect, useState } from "react";
import { formatDateTime, ticketTypeLabel } from "../services/supportFormatters";

const ContactRequestDetailPanel = ({
  request,
  loading,
  mutating,
  onClose,
  onSave,
}) => {
  const [status, setStatus] = useState("new");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setStatus(request?.status || "new");
    setNotes(request?.notes || "");
  }, [request]);

  if (!request && !loading) return null;

  return (
    <div className="rounded-[24px] border border-[#e7eadf] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
            Contact Request
          </p>
          <h3 className="mt-2 text-xl font-bold text-[#203321]">
            {request?.subject || "Loading request..."}
          </h3>
          <p className="mt-1 text-sm text-[#74816f]">{request?.name}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-[#d8e3d2] bg-[#f7f8f3] px-3 py-2 text-sm font-semibold text-[#304132]"
        >
          Close
        </button>
      </div>

      {loading || !request ? (
        <div className="rounded-2xl border border-[#edf0e7] bg-[#fbfcf8] px-4 py-8 text-sm text-[#74816f]">
          Loading request...
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-[#f7f8f3] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">Name</p>
              <p className="mt-2 text-sm font-semibold text-[#203321]">{request.name}</p>
            </div>
            <div className="rounded-2xl bg-[#f7f8f3] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">Email</p>
              <p className="mt-2 text-sm font-semibold text-[#203321]">{request.email}</p>
            </div>
            <div className="rounded-2xl bg-[#f7f8f3] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">Topic</p>
              <p className="mt-2 text-sm font-semibold text-[#203321]">{ticketTypeLabel(request.topic)}</p>
            </div>
            <div className="rounded-2xl bg-[#f7f8f3] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">Created</p>
              <p className="mt-2 text-sm font-semibold text-[#203321]">{formatDateTime(request.createdAt)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#edf0e7] bg-[#fbfcf8] p-4">
            <p className="text-sm font-semibold text-[#203321]">Message</p>
            <p className="mt-2 text-sm leading-6 text-[#445342]">{request.message}</p>
          </div>

          <div className="rounded-2xl border border-[#edf0e7] p-4">
            <h4 className="text-base font-bold text-[#203321]">Admin notes</h4>
            <div className="mt-3 grid gap-3">
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="rounded-xl border border-[#d8e3d2] px-3 py-2.5 text-sm text-[#304132] outline-none focus:border-[#7ca36f]"
              >
                {["new", "reviewed", "replied", "closed"].map((option) => (
                  <option key={option} value={option}>
                    {ticketTypeLabel(option)}
                  </option>
                ))}
              </select>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={6}
                placeholder="Add internal notes for this request..."
                className="rounded-2xl border border-[#d8e3d2] px-4 py-3 text-sm text-[#304132] outline-none focus:border-[#7ca36f]"
              />
            </div>
            <button
              type="button"
              disabled={mutating}
              onClick={() => onSave({ status, notes: notes.trim() || undefined })}
              className="mt-3 rounded-xl bg-[#335c38] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#294c2d] disabled:opacity-60"
            >
              Save Request Notes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactRequestDetailPanel;

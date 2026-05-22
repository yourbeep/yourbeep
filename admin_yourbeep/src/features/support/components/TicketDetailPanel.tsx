import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowLeft,
  FiClock,
  FiHash,
  FiMessageSquare,
  FiTag,
  FiUser,
} from "react-icons/fi";
import { AnimatedDropdown } from "../../../components/ui/AnimatedDropdown";
import { FieldLabel } from "../../../components/ui/FieldLabel";
import { InputField } from "../../../components/ui/InputField";
import { MainButton } from "../../../components/ui/MainButton";
import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";
import { StatusPill, type StatusPillVariant } from "../../../components/ui/StatusPill";
import type {
  SupportTicketItem,
  SupportTicketPriority,
  SupportTicketStatus,
} from "../../../store/slices/support";
import {
  formatDateTime,
  formatRelativeTime,
  supportTicketPriorityOptions,
  supportTicketStatusOptions,
  ticketStatusLabel,
  ticketTypeLabel,
} from "../services/supportFormatters";

type TicketUpdatePayload = {
  status?: string;
  priority?: string;
  tags?: string[];
};

type TicketDetailPanelProps = {
  ticket: SupportTicketItem | null;
  loading: boolean;
  mutating: boolean;
  onClose: () => void;
  onReply: (body: string) => void | Promise<unknown>;
  onUpdate: (payload: TicketUpdatePayload) => void | Promise<unknown>;
};

const statusVariantMap: Record<SupportTicketStatus, StatusPillVariant> = {
  open: "success",
  in_progress: "info",
  waiting_on_user: "warning",
  resolved: "neutral",
  closed: "muted",
};

const priorityVariantMap: Record<SupportTicketPriority, StatusPillVariant> = {
  urgent: "danger",
  high: "warning",
  medium: "success",
  low: "neutral",
};

function TicketDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <ShimmerBlock className="h-3 w-24" />
          <ShimmerBlock className="h-8 w-48" />
          <ShimmerBlock className="h-4 w-64" />
        </div>
        <ShimmerBlock className="h-11 w-32 rounded-xl" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[22px] border border-[#edf0e7] bg-[#fbfcf8] p-4"
          >
            <ShimmerBlock className="h-3 w-16" />
            <ShimmerBlock className="mt-4 h-5 w-28" />
            <ShimmerBlock className="mt-2 h-4 w-20" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[24px] border border-[#edf0e7] bg-[#fbfcf8] p-5">
            <ShimmerBlock className="h-5 w-40" />
            <ShimmerBlock className="mt-4 h-4 w-full" />
            <ShimmerBlock className="mt-2 h-4 w-[92%]" />
            <ShimmerBlock className="mt-2 h-4 w-[78%]" />
          </div>

          <div className="rounded-[24px] border border-[#edf0e7] bg-white p-5">
            <ShimmerBlock className="h-5 w-36" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[20px] border border-[#edf0e7] bg-[#fbfcf8] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <ShimmerBlock className="h-4 w-24" />
                    <ShimmerBlock className="h-3 w-20" />
                  </div>
                  <ShimmerBlock className="mt-3 h-4 w-full" />
                  <ShimmerBlock className="mt-2 h-4 w-[88%]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[24px] border border-[#edf0e7] bg-white p-5">
            <ShimmerBlock className="h-5 w-28" />
            <ShimmerBlock className="mt-4 h-40 w-full rounded-[20px]" />
            <ShimmerBlock className="mt-4 h-11 w-32 rounded-xl" />
          </div>
          <div className="rounded-[24px] border border-[#edf0e7] bg-white p-5">
            <ShimmerBlock className="h-5 w-32" />
            <ShimmerBlock className="mt-4 h-11 w-full rounded-xl" />
            <ShimmerBlock className="mt-3 h-11 w-full rounded-xl" />
            <ShimmerBlock className="mt-3 h-11 w-full rounded-xl" />
            <ShimmerBlock className="mt-4 h-11 w-40 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailStatCard({
  label,
  value,
  helper,
  icon,
  badge,
}: {
  label: string;
  value: string;
  helper?: string | null;
  icon: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-[#edf0e7] bg-[#fbfcf8] p-4">
      <div className="flex items-center justify-between gap-3">
        <FieldLabel>{label}</FieldLabel>
        <span className="text-[#7b8975]">{icon}</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <p className="text-sm font-semibold text-[#203321]">{value}</p>
        {badge}
      </div>
      {helper ? <p className="mt-2 text-xs text-[#72806e]">{helper}</p> : null}
    </div>
  );
}

export default function TicketDetailPanel({
  ticket,
  loading,
  mutating,
  onClose,
  onReply,
  onUpdate,
}: TicketDetailPanelProps) {
  const [replyBody, setReplyBody] = useState("");
  const [status, setStatus] = useState<SupportTicketStatus>("open");
  const [priority, setPriority] = useState<SupportTicketPriority>("medium");
  const [tags, setTags] = useState("");

  useEffect(() => {
    setStatus(ticket?.status ?? "open");
    setPriority(ticket?.priority ?? "medium");
    setTags(ticket?.tags?.join(", ") ?? "");
    setReplyBody("");
  }, [ticket]);

  const statusOptions = useMemo(
    () =>
      supportTicketStatusOptions.map((option) => ({
        label: ticketStatusLabel(option),
        value: option,
      })),
    [],
  );

  const priorityOptions = useMemo(
    () =>
      supportTicketPriorityOptions.map((option) => ({
        label: ticketTypeLabel(option),
        value: option,
      })),
    [],
  );

  const parsedTags = useMemo(
    () =>
      tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tags],
  );

  if (!ticket && !loading) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-sm"
    >
      {loading || !ticket ? (
        <TicketDetailSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                Ticket Detail
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-[28px] font-bold tracking-tight text-[#203321]">
                  {ticket.ticketNumber}
                </h3>
                <StatusPill
                  variant={statusVariantMap[ticket.status]}
                  size="md"
                  dot
                  pulse={ticket.status === "open"}
                >
                  {ticketStatusLabel(ticket.status)}
                </StatusPill>
                <StatusPill variant={priorityVariantMap[ticket.priority]} size="md">
                  {ticketTypeLabel(ticket.priority)}
                </StatusPill>
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-[#203321]">
                  {ticket.subject}
                </p>
                <p className="text-sm text-[#72806e]">
                  Opened {formatDateTime(ticket.createdAt)} and last touched{" "}
                  {formatRelativeTime(ticket.updatedAt)}.
                </p>
              </div>
            </div>

            <MainButton
              text="Back to support"
              variant="outline"
              headIcon={<FiArrowLeft size={16} />}
              onClick={onClose}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DetailStatCard
              label="User"
              icon={<FiUser size={16} />}
              value={ticket.user?.name || "Unknown user"}
              helper={ticket.user?.email || ticket.userId}
            />
            <DetailStatCard
              label="Category"
              icon={<FiHash size={16} />}
              value={ticketTypeLabel(ticket.type)}
              helper={ticket.courseId ? `Course ${ticket.courseId}` : "No linked course"}
            />
            <DetailStatCard
              label="Last Reply"
              icon={<FiClock size={16} />}
              value={formatRelativeTime(ticket.lastReplyAt)}
              helper={formatDateTime(ticket.lastReplyAt)}
            />
            <DetailStatCard
              label="Conversation"
              icon={<FiMessageSquare size={16} />}
              value={`${ticket.messages.length} message${ticket.messages.length === 1 ? "" : "s"}`}
              helper={ticket.lastReplyBy ? `Last reply by ${ticketTypeLabel(ticket.lastReplyBy)}` : "No replies yet"}
              badge={
                parsedTags.length ? (
                  <StatusPill variant="muted">{parsedTags.length} tags</StatusPill>
                ) : null
              }
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-[24px] border border-[#edf0e7] bg-[#fbfcf8] p-5">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-base font-bold text-[#203321]">
                    Issue description
                  </h4>
                  <StatusPill variant="neutral">
                    {ticketTypeLabel(ticket.type)}
                  </StatusPill>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#445342]">
                  {ticket.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {ticket.purchaseId ? (
                    <StatusPill variant="info">Purchase {ticket.purchaseId}</StatusPill>
                  ) : null}
                  {ticket.videoId ? (
                    <StatusPill variant="primary">Video {ticket.videoId}</StatusPill>
                  ) : null}
                  {ticket.gameId ? (
                    <StatusPill variant="warning">Game {ticket.gameId}</StatusPill>
                  ) : null}
                  {parsedTags.map((tag) => (
                    <StatusPill key={tag} variant="muted">
                      #{tag}
                    </StatusPill>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-[#edf0e7] bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold text-[#203321]">
                      Conversation
                    </h4>
                    <p className="mt-1 text-sm text-[#72806e]">
                      Review the full thread before responding.
                    </p>
                  </div>
                  <StatusPill variant="neutral">
                    {ticket.messages.length} entries
                  </StatusPill>
                </div>

                <div className="mt-4 max-h-[480px] space-y-3 overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {ticket.messages.map((message, index) => {
                      const isAdmin = message.senderType === "admin";
                      const isSystem = message.senderType === "system";

                      return (
                        <motion.article
                          key={`${message.createdAt}-${index}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.18, delay: index * 0.02 }}
                          className={`rounded-[20px] border px-4 py-4 ${
                            isAdmin
                              ? "border-[#d9e7d2] bg-[#f5faef]"
                              : isSystem
                                ? "border-[#e5ebf4] bg-[#f6f8fc]"
                                : "border-[#edf0e7] bg-white"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-[#203321]">
                                {isAdmin
                                  ? "Admin reply"
                                  : isSystem
                                    ? "System note"
                                    : "Student reply"}
                              </p>
                              <StatusPill
                                variant={
                                  isAdmin
                                    ? "success"
                                    : isSystem
                                      ? "info"
                                      : "neutral"
                                }
                              >
                                {ticketTypeLabel(message.senderType)}
                              </StatusPill>
                            </div>
                            <span className="text-xs text-[#83907e]">
                              {formatDateTime(message.createdAt)}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-7 text-[#445342]">
                            {message.body}
                          </p>
                        </motion.article>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[24px] border border-[#edf0e7] bg-white p-5">
                <div className="flex items-center gap-2">
                  <FiMessageSquare className="text-[#65745f]" size={16} />
                  <h4 className="text-base font-bold text-[#203321]">
                    Reply to ticket
                  </h4>
                </div>

                <div className="mt-4">
                  <InputField
                    label="Reply message"
                    element="textarea"
                    value={replyBody}
                    rows={7}
                    placeholder="Write a helpful, concise response for the learner..."
                    onChange={(event) => setReplyBody(event.target.value)}
                    helpText="This will be added to the support conversation immediately."
                    inputClassName="min-h-[210px] bg-white"
                  />
                </div>

                <div className="mt-4 flex justify-end">
                  <MainButton
                    text="Send reply"
                    isLoading={mutating}
                    disabled={!replyBody.trim()}
                    onClick={() => {
                      const nextReply = replyBody.trim();
                      if (!nextReply) return;
                      void onReply(nextReply);
                      setReplyBody("");
                    }}
                  />
                </div>
              </div>

              <div className="rounded-[24px] border border-[#edf0e7] bg-white p-5">
                <div className="flex items-center gap-2">
                  <FiTag className="text-[#65745f]" size={16} />
                  <h4 className="text-base font-bold text-[#203321]">
                    Ticket controls
                  </h4>
                </div>
                <p className="mt-1 text-sm text-[#72806e]">
                  Update the workflow state, urgency, and internal tags.
                </p>

                <div className="mt-4 grid gap-4">
                  <AnimatedDropdown
                    name="ticket-status"
                    label="Status"
                    value={status}
                    options={statusOptions}
                    onChange={(value) => setStatus(value as SupportTicketStatus)}
                  />

                  <AnimatedDropdown
                    name="ticket-priority"
                    label="Priority"
                    value={priority}
                    options={priorityOptions}
                    onChange={(value) => setPriority(value as SupportTicketPriority)}
                  />

                  <InputField
                    label="Tags"
                    value={tags}
                    placeholder="billing, first-response, follow-up"
                    onChange={(event) => setTags(event.target.value)}
                    helpText="Separate multiple tags with commas."
                    inputClassName="bg-white"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {parsedTags.map((tag) => (
                    <StatusPill key={tag} variant="muted">
                      #{tag}
                    </StatusPill>
                  ))}
                </div>

                <div className="mt-5 flex justify-end">
                  <MainButton
                    text="Save ticket changes"
                    variant="soft"
                    isLoading={mutating}
                    onClick={() =>
                      void onUpdate({
                        status,
                        priority,
                        tags: parsedTags,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}

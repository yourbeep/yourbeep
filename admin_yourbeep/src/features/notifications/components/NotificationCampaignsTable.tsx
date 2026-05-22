import { motion } from "framer-motion";
import { CalendarClock, PencilLine, Send, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { MainButton } from "../../../components/ui/MainButton";
import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";
import { StatusPill } from "../../../components/ui/StatusPill";
import type { NotificationCampaign } from "../../../store/slices/notifications";
import {
  audienceLabel,
  campaignStatusVariant,
  formatDateTime,
} from "../services/notificationFormatters";

type NotificationCampaignsTableProps = {
  items: NotificationCampaign[];
  loading?: boolean;
  onOpen: (campaignId: string) => void;
  onEdit: (campaign: NotificationCampaign) => void;
  onSend: (campaignId: string) => void;
  onCancel: (campaignId: string) => void;
};

function CampaignRowSkeleton() {
  return (
    <tr className="border-b border-[#edf0e7]">
      {Array.from({ length: 6 }).map((_, index) => (
        <td key={index} className="px-4 py-4">
          <ShimmerBlock className="h-4 w-full max-w-[180px]" />
          {index === 0 ? <ShimmerBlock className="mt-2 h-4 w-full max-w-[240px]" /> : null}
        </td>
      ))}
    </tr>
  );
}

export default function NotificationCampaignsTable({
  items,
  loading = false,
  onOpen,
  onEdit,
  onSend,
  onCancel,
}: NotificationCampaignsTableProps) {
  if (loading && !items.length) {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#e7eadf] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#edf0e7]">
            <thead className="bg-[#f7f8f3]">
              <tr>
                {["Campaign", "Audience", "Status", "Delivery", "Created", "Actions"].map((label) => (
                  <th
                    key={label}
                    className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <CampaignRowSkeleton key={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-[#d8e3d2] bg-[#fbfcf8] px-6 py-14 text-center">
        <p className="text-lg font-semibold text-[#203321]">
          No notification campaigns yet
        </p>
        <p className="mt-2 text-sm text-[#74816f]">
          Create your first campaign to start using the admin notification center.
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
              {["Campaign", "Audience", "Status", "Delivery", "Created", "Actions"].map((label) => (
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
            {items.map((campaign, index) => (
              <motion.tr
                key={campaign._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: index * 0.02 }}
                className="transition hover:bg-[#fbfcf8]"
              >
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => onOpen(campaign._id)}
                    className="text-left"
                  >
                    <p className="text-sm font-semibold text-[#203321]">
                      {campaign.title}
                    </p>
                    <p className="mt-1 max-w-[340px] truncate text-sm text-[#74816f]">
                      {campaign.body}
                    </p>
                  </button>
                </td>
                <td className="px-4 py-4 text-sm text-[#304132]">
                  <div className="space-y-1">
                    <p className="font-medium text-[#203321]">
                      {audienceLabel(campaign.audience.type)}
                    </p>
                    {campaign.audience.courseId ? (
                      <p className="text-xs text-[#83907e]">
                        Course {campaign.audience.courseId}
                      </p>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <StatusPill variant={campaignStatusVariant[campaign.status]} dot>
                    {audienceLabel(campaign.status)}
                  </StatusPill>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-semibold text-[#203321]">
                    {campaign.successCount.toLocaleString()} sent
                  </p>
                  <p className="mt-1 text-xs text-[#83907e]">
                    {campaign.targetedUsersCount.toLocaleString()} users ·{" "}
                    {campaign.requestedTokens.toLocaleString()} tokens
                  </p>
                </td>
                <td className="px-4 py-4 text-sm text-[#74816f]">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-[#8a9583]" />
                    <span>{formatDateTime(campaign.sentAt || campaign.createdAt)}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    {campaign.status === "draft" ? (
                      <>
                        <MainButton
                          text="Edit"
                          size="sm"
                          variant="outline"
                          headIcon={<PencilLine className="h-4 w-4" />}
                          onClick={() => onEdit(campaign)}
                        />
                        <MainButton
                          text="Send"
                          size="sm"
                          variant="primary"
                          headIcon={<Send className="h-4 w-4" />}
                          onClick={() => onSend(campaign._id)}
                        />
                        <MainButton
                          text="Cancel"
                          size="sm"
                          variant="danger"
                          headIcon={<Trash2 className="h-4 w-4" />}
                          onClick={() => onCancel(campaign._id)}
                        />
                      </>
                    ) : (
                      <MainButton
                        text="View"
                        size="sm"
                        variant="outline"
                        headIcon={<SquareArrowOutUpRight className="h-4 w-4" />}
                        onClick={() => onOpen(campaign._id)}
                      />
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

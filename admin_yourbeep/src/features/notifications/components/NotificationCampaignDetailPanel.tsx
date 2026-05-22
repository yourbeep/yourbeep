import { motion } from "framer-motion";
import { ArrowLeft, BellRing, ImageIcon, Send, Users } from "lucide-react";
import { MainButton } from "../../../components/ui/MainButton";
import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";
import { StatusPill } from "../../../components/ui/StatusPill";
import type { NotificationCampaign } from "../../../store/slices/notifications";
import {
  audienceLabel,
  campaignStatusVariant,
  formatDateTime,
} from "../services/notificationFormatters";

type NotificationCampaignDetailPanelProps = {
  campaign: NotificationCampaign | null;
  loading: boolean;
  onClose: () => void;
};

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <ShimmerBlock className="h-3 w-32" />
          <ShimmerBlock className="h-8 w-56" />
          <ShimmerBlock className="h-4 w-80 max-w-full" />
        </div>
        <ShimmerBlock className="h-11 w-32" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-[22px] border border-[#edf0e7] bg-[#fbfcf8] p-4">
            <ShimmerBlock className="h-3 w-20" />
            <ShimmerBlock className="mt-4 h-5 w-28" />
            <ShimmerBlock className="mt-2 h-4 w-24" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <ShimmerBlock className="h-[440px] w-full rounded-[28px]" />
        <div className="space-y-6">
          <ShimmerBlock className="h-44 w-full rounded-[28px]" />
          <ShimmerBlock className="h-44 w-full rounded-[28px]" />
        </div>
      </div>
    </div>
  );
}

export default function NotificationCampaignDetailPanel({
  campaign,
  loading,
  onClose,
}: NotificationCampaignDetailPanelProps) {
  if (!campaign && !loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="rounded-[24px] border border-[#e7eadf] bg-white p-6 shadow-sm"
    >
      {loading || !campaign ? (
        <DetailSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                Campaign Detail
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <h3 className="text-[28px] font-bold tracking-tight text-[#203321]">
                  {campaign.title}
                </h3>
                <StatusPill variant={campaignStatusVariant[campaign.status]} size="md" dot>
                  {audienceLabel(campaign.status)}
                </StatusPill>
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#74816f]">
                {campaign.body}
              </p>
            </div>
            <MainButton
              text="Back to campaigns"
              variant="outline"
              headIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={onClose}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[22px] border border-[#edf0e7] bg-[#fbfcf8] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                Audience
              </p>
              <p className="mt-3 text-sm font-semibold text-[#203321]">
                {audienceLabel(campaign.audience.type)}
              </p>
            </div>
            <div className="rounded-[22px] border border-[#edf0e7] bg-[#fbfcf8] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                Delivered
              </p>
              <p className="mt-3 text-sm font-semibold text-[#203321]">
                {campaign.successCount.toLocaleString()}
              </p>
            </div>
            <div className="rounded-[22px] border border-[#edf0e7] bg-[#fbfcf8] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                Failures
              </p>
              <p className="mt-3 text-sm font-semibold text-[#203321]">
                {campaign.failureCount.toLocaleString()}
              </p>
            </div>
            <div className="rounded-[22px] border border-[#edf0e7] bg-[#fbfcf8] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                Invalid Tokens
              </p>
              <p className="mt-3 text-sm font-semibold text-[#203321]">
                {campaign.invalidTokenCount.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <section className="overflow-hidden rounded-[28px] border border-[#e7eadf] bg-gradient-to-br from-[#eef7ff] via-white to-[#edf6ef] p-5">
              <div className="flex items-center gap-2 text-[#0d6e6e]">
                <BellRing className="h-4 w-4" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                  Notification Preview
                </p>
              </div>

              <div className="mt-5 rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-sm backdrop-blur">
                {campaign.imageUrl ? (
                  <div className="overflow-hidden rounded-[22px] border border-[#dfe8d6]">
                    <img
                      src={campaign.imageUrl}
                      alt={campaign.title}
                      className="h-56 w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-56 items-center justify-center rounded-[22px] border border-dashed border-[#dfe8d6] bg-[#fbfcf8] text-[#7c8a77]">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-6 w-6" />
                      <p className="mt-2 text-sm">No campaign image attached</p>
                    </div>
                  </div>
                )}

                <div className="mt-5 flex items-start gap-3">
                  <span className="rounded-2xl bg-[#eef5ea] p-3 text-[#3e6f47]">
                    <Send className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#203321]">
                      {campaign.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#445342]">
                      {campaign.body}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="space-y-6">
              <section className="rounded-[28px] border border-[#e7eadf] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-[#203321]">
                  <Users className="h-4 w-4 text-[#65745f]" />
                  <h4 className="text-base font-bold">Audience and delivery</h4>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <p className="text-sm text-[#445342]">
                    Type: <span className="font-semibold">{audienceLabel(campaign.audience.type)}</span>
                  </p>
                  <p className="text-sm text-[#445342]">
                    Created: <span className="font-semibold">{formatDateTime(campaign.createdAt)}</span>
                  </p>
                  <p className="text-sm text-[#445342]">
                    Sent: <span className="font-semibold">{formatDateTime(campaign.sentAt)}</span>
                  </p>
                  <p className="text-sm text-[#445342]">
                    Updated: <span className="font-semibold">{formatDateTime(campaign.updatedAt)}</span>
                  </p>
                  <p className="text-sm text-[#445342]">
                    Targeted users: <span className="font-semibold">{campaign.targetedUsersCount.toLocaleString()}</span>
                  </p>
                  <p className="text-sm text-[#445342]">
                    Requested tokens: <span className="font-semibold">{campaign.requestedTokens.toLocaleString()}</span>
                  </p>
                </div>
              </section>

              <section className="rounded-[28px] border border-[#e7eadf] bg-white p-5 shadow-sm">
                <p className="text-base font-bold text-[#203321]">Audience payload</p>
                <pre className="mt-4 overflow-x-auto rounded-[22px] bg-[#f7f8f3] p-4 text-xs text-[#304132]">
                  {JSON.stringify(campaign.audience, null, 2)}
                </pre>
              </section>

              <section className="rounded-[28px] border border-[#e7eadf] bg-white p-5 shadow-sm">
                <p className="text-base font-bold text-[#203321]">Data payload</p>
                <pre className="mt-4 overflow-x-auto rounded-[22px] bg-[#f7f8f3] p-4 text-xs text-[#304132]">
                  {JSON.stringify(campaign.data || {}, null, 2)}
                </pre>
              </section>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

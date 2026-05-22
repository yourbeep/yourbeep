import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { BellRing, Crown, Megaphone, Send, ShieldAlert, SquarePen } from "lucide-react";
import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";
import type { NotificationSummary } from "../../../store/slices/notifications";

const cards: Array<{
  key: keyof NotificationSummary;
  label: string;
  icon: ReactNode;
}> = [
  { key: "totalCampaigns", label: "Total Campaigns", icon: <BellRing className="h-4 w-4" /> },
  { key: "draftCampaigns", label: "Drafts", icon: <SquarePen className="h-4 w-4" /> },
  { key: "sentCampaigns", label: "Sent", icon: <Send className="h-4 w-4" /> },
  { key: "cancelledCampaigns", label: "Cancelled", icon: <ShieldAlert className="h-4 w-4" /> },
  { key: "premiumAudienceCampaigns", label: "Premium Audience", icon: <Crown className="h-4 w-4" /> },
  { key: "totalDelivered", label: "Delivered", icon: <Megaphone className="h-4 w-4" /> },
];

type NotificationSummaryCardsProps = {
  summary: NotificationSummary | null;
  loading?: boolean;
};

export default function NotificationSummaryCards({
  summary,
  loading = false,
}: NotificationSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.03 }}
          className="rounded-[24px] border border-[#e7eadf] bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
              {card.label}
            </p>
            <span className="rounded-xl bg-[#f3f6ef] p-2 text-[#65745f]">
              {card.icon}
            </span>
          </div>
          {loading ? (
            <ShimmerBlock className="mt-4 h-9 w-24" />
          ) : (
            <p className="mt-4 text-3xl font-bold tracking-tight text-[#203321]">
              {Number(summary?.[card.key] || 0).toLocaleString()}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}

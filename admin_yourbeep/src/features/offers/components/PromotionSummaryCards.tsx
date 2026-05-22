import { motion } from "framer-motion";
import { BadgePercent, CalendarClock, Sparkles, TicketPercent } from "lucide-react";
import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";
import type { PromotionSummary } from "../../../store/slices/offers";

type PromotionSummaryCardsProps = {
  summary: PromotionSummary | null;
  loading?: boolean;
};

export default function PromotionSummaryCards({
  summary,
  loading = false,
}: PromotionSummaryCardsProps) {
  const cards = [
    {
      title: "Active Promotions",
      value: summary?.active ?? 0,
      note: `${summary?.scheduled ?? 0} scheduled next`,
      icon: <TicketPercent className="h-4 w-4" />,
    },
    {
      title: "Total Redemptions",
      value: summary?.totalRedemptions ?? 0,
      note: `${summary?.currentMonthRedemptions ?? 0} this month`,
      icon: <BadgePercent className="h-4 w-4" />,
    },
    {
      title: "Discount Given",
      value: `₹${Number(summary?.currentMonthDiscountGiven ?? 0).toLocaleString()}`,
      note: "Current month total",
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      title: "Auto Apply Offers",
      value: summary?.autoApply ?? 0,
      note: `${summary?.archived ?? 0} archived`,
      icon: <CalendarClock className="h-4 w-4" />,
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <motion.article
          key={card.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.03 }}
          className="rounded-[24px] border border-[#e7eadf] bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
                {card.title}
              </p>
              {loading ? (
                <ShimmerBlock className="mt-3 h-9 w-24" />
              ) : (
                <p className="mt-3 text-[30px] font-bold tracking-tight text-gray-900">
                  {card.value}
                </p>
              )}
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]">
              {card.icon}
            </div>
          </div>
          <p className="text-sm text-gray-500">{card.note}</p>
        </motion.article>
      ))}
    </section>
  );
}

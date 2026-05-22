import { motion } from "framer-motion";
import { BadgeDollarSign, Receipt, RotateCcw, TrendingUp } from "lucide-react";
import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";
import type { RevenueSummary } from "../../../store/slices/orders/ordersTypes";
import { formatCurrency } from "../services/orderFormatters";

type OrdersSummaryCardsProps = {
  summary: RevenueSummary | null;
  loading?: boolean;
};

export default function OrdersSummaryCards({
  summary,
  loading = false,
}: OrdersSummaryCardsProps) {
  const refundRate =
    summary?.activeCount || summary?.refundedCount
      ? ((Number(summary?.refundedCount || 0) /
          Math.max(
            1,
            Number(summary?.activeCount || 0) +
              Number(summary?.refundedCount || 0),
          )) *
          100)
      : 0;

  const cards = [
    {
      label: "Gross Revenue",
      value: formatCurrency(summary?.grossRevenue || 0),
      icon: <BadgeDollarSign className="h-4 w-4" />,
    },
    {
      label: "Active Purchases",
      value: Number(summary?.activeCount || 0).toLocaleString(),
      icon: <Receipt className="h-4 w-4" />,
    },
    {
      label: "Refunded Purchases",
      value: Number(summary?.refundedCount || 0).toLocaleString(),
      icon: <RotateCcw className="h-4 w-4" />,
    },
    {
      label: "Refund Rate",
      value: `${refundRate.toFixed(1)}%`,
      icon: <TrendingUp className="h-4 w-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
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
              {card.value}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}

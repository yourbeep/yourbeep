import { motion } from "framer-motion";
import { Blocks, FolderArchive, Sparkles } from "lucide-react";
import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";
import type { AdminGame } from "../../../store/slices/games";

type GamesSummaryCardsProps = {
  items: AdminGame[];
  loading?: boolean;
};

export default function GamesSummaryCards({
  items,
  loading = false,
}: GamesSummaryCardsProps) {
  const active = items.filter((item) => item.isActive).length;
  const inactive = items.length - active;

  const cards = [
    { label: "Total Games", value: items.length, icon: <Blocks className="h-4 w-4" /> },
    { label: "Active", value: active, icon: <Sparkles className="h-4 w-4" /> },
    { label: "Archived", value: inactive, icon: <FolderArchive className="h-4 w-4" /> },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
            <ShimmerBlock className="mt-4 h-9 w-16" />
          ) : (
            <p className="mt-4 text-3xl font-bold tracking-tight text-[#203321]">
              {Number(card.value || 0).toLocaleString()}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}

import { motion } from "framer-motion";
import { Archive, PencilLine, RotateCcw, SquareArrowOutUpRight } from "lucide-react";
import { MainButton } from "../../../components/ui/MainButton";
import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";
import { StatusPill } from "../../../components/ui/StatusPill";
import type { PromotionItem } from "../../../store/slices/offers";
import { formatPromotionDiscount } from "../services/promotionAdminApi";

const statusVariant = {
  active: "success",
  scheduled: "info",
  expired: "warning",
  inactive: "neutral",
  archived: "danger",
} as const;

type PromotionsTableProps = {
  items: PromotionItem[];
  coursesById: Record<string, string>;
  loading?: boolean;
  onEdit: (promotion: PromotionItem) => void;
  onArchive: (promotionId: string) => void;
  onRestore: (promotionId: string) => void;
};

function PromotionRowSkeleton() {
  return (
    <tr className="border-t border-gray-100 align-top">
      {Array.from({ length: 7 }).map((_, index) => (
        <td key={index} className="px-6 py-4">
          <ShimmerBlock className="h-4 w-full max-w-[140px]" />
          {index === 0 ? <ShimmerBlock className="mt-2 h-3 w-24" /> : null}
        </td>
      ))}
    </tr>
  );
}

export default function PromotionsTable({
  items,
  coursesById,
  loading = false,
  onEdit,
  onArchive,
  onRestore,
}: PromotionsTableProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[#e7eadf] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[#f9faf7] text-left">
              {[
                "Promotion",
                "Applies To",
                "Discount",
                "Plans & Region",
                "Usage",
                "Status",
                "Actions",
              ].map((head) => (
                <th
                  key={head}
                  className="px-6 py-4 text-[11px] font-bold uppercase tracking-wide text-gray-500"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && !items.length ? (
              Array.from({ length: 6 }).map((_, index) => (
                <PromotionRowSkeleton key={index} />
              ))
            ) : items.length ? (
              items.map((promotion, index) => (
                <motion.tr
                  key={promotion._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: index * 0.02 }}
                  className="border-t border-gray-100 align-top transition hover:bg-[#fcfcf7]"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {promotion.name}
                      </p>
                      <p className="mt-1 text-xs font-semibold tracking-wide text-[var(--primary)]">
                        {promotion.code}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {promotion.description || "No description"}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {promotion.courseId
                      ? coursesById[promotion.courseId] || promotion.courseId
                      : "Global"}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {formatPromotionDiscount(promotion)}
                    <p className="mt-1 text-xs font-normal text-gray-500">
                      {promotion.autoApply ? "Auto apply" : "Code based"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <p>{promotion.planTypes.join(", ")}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {promotion.regions.length
                        ? promotion.regions.join(", ")
                        : "All regions"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <p>
                      {promotion.redemptionCount}
                      {promotion.maxRedemptions
                        ? ` / ${promotion.maxRedemptions}`
                        : ""}{" "}
                      redeemed
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Per user: {promotion.perUserLimit}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill
                      variant={statusVariant[promotion.status]}
                      className="capitalize"
                      dot
                    >
                      {promotion.status}
                    </StatusPill>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <MainButton
                        text="Edit"
                        size="sm"
                        variant="outline"
                        headIcon={<PencilLine className="h-4 w-4" />}
                        onClick={() => onEdit(promotion)}
                      />
                      {promotion.isArchived ? (
                        <MainButton
                          text="Restore"
                          size="sm"
                          variant="soft"
                          headIcon={<RotateCcw className="h-4 w-4" />}
                          onClick={() => onRestore(promotion._id)}
                        />
                      ) : (
                        <MainButton
                          text="Archive"
                          size="sm"
                          variant="danger"
                          headIcon={<Archive className="h-4 w-4" />}
                          onClick={() => onArchive(promotion._id)}
                        />
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <p className="text-base font-semibold text-[#203321]">
                    No promotions found
                  </p>
                  <p className="mt-2 text-sm text-[#72806e]">
                    Try a different filter or create a new promotion.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

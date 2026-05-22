import { motion } from "framer-motion";
import { CalendarClock, Receipt, SquareArrowOutUpRight } from "lucide-react";
import { MainButton } from "../../../components/ui/MainButton";
import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";
import { StatusPill } from "../../../components/ui/StatusPill";
import type { OrderItem } from "../../../store/slices/orders/ordersTypes";
import {
  formatCurrency,
  formatDateTime,
  orderStatusLabel,
  orderStatusVariant,
  planLabel,
} from "../services/orderFormatters";

type OrdersTableProps = {
  items: OrderItem[];
  coursesById: Record<string, string>;
  loading?: boolean;
  onOpen: (purchaseId: string) => void;
};

function OrderRowSkeleton() {
  return (
    <tr className="border-b border-[#edf0e7]">
      {Array.from({ length: 8 }).map((_, index) => (
        <td key={index} className="px-4 py-4">
          <ShimmerBlock className="h-4 w-full max-w-[140px]" />
          {index === 0 ? <ShimmerBlock className="mt-2 h-3 w-24" /> : null}
        </td>
      ))}
    </tr>
  );
}

export default function OrdersTable({
  items,
  coursesById,
  loading = false,
  onOpen,
}: OrdersTableProps) {
  if (loading && !items.length) {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#e7eadf] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#edf0e7]">
            <thead className="bg-[#f7f8f3]">
              <tr>
                {[
                  "Purchase",
                  "Course",
                  "Amount",
                  "Plan",
                  "Status",
                  "Region",
                  "Purchased",
                  "Actions",
                ].map((label) => (
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
              {Array.from({ length: 6 }).map((_, index) => (
                <OrderRowSkeleton key={index} />
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
        <p className="text-lg font-semibold text-[#203321]">No purchases found</p>
        <p className="mt-2 text-sm text-[#74816f]">
          Matching purchases will appear here once transactions start flowing
          through Commerce.
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
              {[
                "Purchase",
                "Course",
                "Amount",
                "Plan",
                "Status",
                "Region",
                "Purchased",
                "Actions",
              ].map((label) => (
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
            {items.map((order, index) => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: index * 0.02 }}
                className="transition hover:bg-[#fbfcf8]"
              >
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-semibold text-[#203321]">
                      {order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="mt-1 text-xs text-[#74816f]">
                      {order.currency} · {order.userId.slice(-8)}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="max-w-[260px] truncate text-sm font-medium text-[#203321]">
                    {coursesById[order.courseId] || order.courseId}
                  </p>
                </td>
                <td className="px-4 py-4 text-sm font-semibold text-[#203321]">
                  {formatCurrency(order.amountPaid, order.currency)}
                </td>
                <td className="px-4 py-4 text-sm text-[#304132]">
                  {planLabel(order.planType)}
                </td>
                <td className="px-4 py-4">
                  <StatusPill variant={orderStatusVariant[order.status]} dot>
                    {orderStatusLabel(order.status)}
                  </StatusPill>
                </td>
                <td className="px-4 py-4 text-sm text-[#304132]">
                  {order.region}
                </td>
                <td className="px-4 py-4 text-sm text-[#74816f]">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-[#8a9583]" />
                    <span>{formatDateTime(order.purchasedAt || order.createdAt)}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <MainButton
                    text="Open"
                    size="sm"
                    variant="outline"
                    headIcon={<SquareArrowOutUpRight className="h-4 w-4" />}
                    onClick={() => onOpen(order._id)}
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

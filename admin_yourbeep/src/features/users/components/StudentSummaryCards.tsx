import { motion } from "framer-motion";
import {
  MdAttachMoney,
  MdPersonAdd,
  MdTrendingUp,
  MdVerifiedUser,
} from "react-icons/md";
import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";
import type { UserListPayload } from "../../../store/slices/users/usersTypes";

type StudentSummaryCardsProps = {
  data: UserListPayload | null;
  loading?: boolean;
};

const cards = [
  {
    key: "totalUsers",
    title: "Total Students",
    icon: MdVerifiedUser,
    formatter: (data: UserListPayload) => data.stats.totalUsers.value.toLocaleString(),
    delta: (data: UserListPayload) => data.stats.totalUsers.changePercent,
  },
  {
    key: "activeUsers",
    title: "Active Students",
    icon: MdTrendingUp,
    formatter: (data: UserListPayload) => data.stats.activeUsers.value.toLocaleString(),
    delta: (data: UserListPayload) => data.stats.activeUsers.changePercent,
  },
  {
    key: "newSignups",
    title: "New Signups",
    icon: MdPersonAdd,
    formatter: (data: UserListPayload) => data.stats.newSignups.value.toLocaleString(),
    delta: (data: UserListPayload) => data.stats.newSignups.changePercent,
  },
  {
    key: "monthlyRevenue",
    title: "Revenue This Month",
    icon: MdAttachMoney,
    formatter: (data: UserListPayload) =>
      `$${Number(data.overview.monthlyRevenue.current || 0).toLocaleString()}`,
    delta: (data: UserListPayload) => data.overview.monthlyRevenue.percentChange,
  },
] as const;

export default function StudentSummaryCards({
  data,
  loading = false,
}: StudentSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, title, icon: Icon, formatter, delta }, index) => {
        const change = data ? Number(delta(data) || 0) : 0;
        const isPositive = change >= 0;

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-[24px] border border-[#dfe8d6] bg-white p-5 shadow-sm"
          >
            {loading && !data ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <ShimmerBlock className="h-3 w-24 rounded-full" />
                    <ShimmerBlock className="h-8 w-20 rounded-full" />
                  </div>
                  <ShimmerBlock className="h-11 w-11 rounded-2xl" />
                </div>
                <div className="flex items-center gap-2">
                  <ShimmerBlock className="h-6 w-14 rounded-full" />
                  <ShimmerBlock className="h-3 w-24 rounded-full" />
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6a7765]">
                      {title}
                    </p>
                    <p className="mt-3 text-[28px] font-bold text-[#203321]">
                      {data ? formatter(data) : "0"}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eff6e8] text-[#0d6e6e]">
                    <Icon className="text-[22px]" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      isPositive
                        ? "bg-[#e6f6ed] text-[#1d8f57]"
                        : "bg-[#fff1f1] text-[#c85b58]"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {change}%
                  </span>
                  <span className="text-xs text-[#73806e]">vs last month</span>
                </div>
              </>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

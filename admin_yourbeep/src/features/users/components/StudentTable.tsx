import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { MainButton } from "../../../components/ui/MainButton";
import { StatusPill } from "../../../components/ui/StatusPill";
import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";
import type { UserListItem } from "../../../store/slices/users/usersTypes";

type StudentTableProps = {
  items: UserListItem[];
  loading?: boolean;
};

const formatDate = (value: string | null) => {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatRelativeDate = (value: string | null) => {
  if (!value) {
    return "No recent activity";
  }

  const diff = Date.now() - new Date(value).getTime();
  const days = Math.max(0, Math.floor(diff / 86_400_000));

  if (days === 0) {
    return "Today";
  }

  if (days === 1) {
    return "1 day ago";
  }

  if (days < 30) {
    return `${days} days ago`;
  }

  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
};

const getInitials = (name: string) =>
  String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export default function StudentTable({
  items,
  loading = false,
}: StudentTableProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1220px]">
        <div className="grid grid-cols-[280px_220px_170px_180px_140px_140px_160px_130px] gap-4 border-b border-[#edf1e7] bg-[#f8faf5] px-5 py-3">
          {[
            "Student",
            "Location & Timezone",
            "Plans",
            "Purchases",
            "Total Spent",
            "Joined",
            "Last Activity",
            "Details",
          ].map((label) => (
            <div
              key={label}
              className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#72806e]"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="divide-y divide-[#edf1e7]">
          {loading && !items.length ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`student-row-skeleton-${index}`}
                className="grid grid-cols-[280px_220px_170px_180px_140px_140px_160px_130px] gap-4 px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <ShimmerBlock className="h-11 w-11 rounded-2xl" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <ShimmerBlock className="h-4 w-28 rounded-full" />
                    <ShimmerBlock className="h-3 w-40 rounded-full" />
                    <ShimmerBlock className="h-3 w-24 rounded-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <ShimmerBlock className="h-4 w-24 rounded-full" />
                  <ShimmerBlock className="h-3 w-32 rounded-full" />
                </div>
                <div className="space-y-2">
                  <ShimmerBlock className="h-6 w-20 rounded-full" />
                  <ShimmerBlock className="h-6 w-24 rounded-full" />
                </div>
                <div className="space-y-2">
                  <ShimmerBlock className="h-4 w-24 rounded-full" />
                  <ShimmerBlock className="h-3 w-28 rounded-full" />
                  <ShimmerBlock className="h-3 w-24 rounded-full" />
                </div>
                <ShimmerBlock className="h-4 w-20 rounded-full" />
                <div className="space-y-2">
                  <ShimmerBlock className="h-4 w-20 rounded-full" />
                  <ShimmerBlock className="h-3 w-24 rounded-full" />
                </div>
                <div className="space-y-2">
                  <ShimmerBlock className="h-4 w-24 rounded-full" />
                  <ShimmerBlock className="h-3 w-24 rounded-full" />
                </div>
                <ShimmerBlock className="h-10 w-24 rounded-xl" />
              </div>
            ))
          ) : items.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-base font-semibold text-[#203321]">
                No students found
              </p>
              <p className="mt-2 text-sm text-[#72806e]">
                Try changing the search term, status, or page size.
              </p>
            </div>
          ) : (
            items.map((student, index) => (
              <motion.div
                key={student._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="grid grid-cols-[280px_220px_170px_180px_140px_140px_160px_130px] gap-4 px-5 py-4 transition-colors hover:bg-[#fbfcf8]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    {student.avatar ? (
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="h-11 w-11 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0d6e6e] text-sm font-bold text-white">
                        {getInitials(student.name)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#203321]">
                        {student.name}
                      </p>
                      <p className="truncate text-xs text-[#6f7d6b]">
                        {student.email}
                      </p>
                      <p className="mt-1 truncate text-[11px] text-[#8b9587]">
                        ID: {student._id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-[#314330]">
                  <p className="font-medium">
                    {student.region || "Region not set"}
                  </p>
                  <p className="mt-1 text-xs text-[#72806e]">
                    {student.timezone || "Timezone not set"}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5">
                    {student.planTypes.length ? (
                      student.planTypes.map((plan) => (
                        <span
                          key={`${student._id}-${plan}`}
                          className="rounded-full bg-[#eef5e7] px-2.5 py-1 text-[11px] font-semibold capitalize text-[#40603d]"
                        >
                          {plan.replace(/_/g, " ")}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#8b9587]">No paid plans</span>
                    )}
                  </div>
                  <div className="mt-2">
                    <StatusPill
                      variant={student.isActive ? "success" : "warning"}
                      size="sm"
                      dot
                    >
                      {student.isActive ? "Active" : "Inactive"}
                    </StatusPill>
                  </div>
                </div>

                <div className="space-y-1.5 text-sm text-[#314330]">
                  <p className="font-semibold">
                    {student.totalPurchases} total orders
                  </p>
                  <p className="text-xs text-[#72806e]">
                    {student.activePurchases} active purchases
                  </p>
                  <p className="text-xs text-[#72806e]">
                    {student.activeCoursesCount} active courses
                  </p>
                </div>

                <div className="text-sm font-semibold text-[#203321]">
                  ${Number(student.totalSpent || 0).toLocaleString()}
                </div>

                <div className="text-sm text-[#314330]">
                  <p className="font-medium">{formatDate(student.joinedAt)}</p>
                  <p className="mt-1 text-xs text-[#72806e]">Account created</p>
                </div>

                <div className="text-sm text-[#314330]">
                  <p className="font-medium">
                    {formatRelativeDate(student.lastActiveAt)}
                  </p>
                  <p className="mt-1 text-xs text-[#72806e]">
                    Last purchase: {formatDate(student.lastPurchaseAt)}
                  </p>
                </div>

                <div className="flex items-start justify-end">
                  <Link to={`/users/${student._id}`}>
                    <MainButton
                      text="Open"
                      size="sm"
                      variant="outline"
                      tailIcon={<FiArrowRight className="h-4 w-4" />}
                    />
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

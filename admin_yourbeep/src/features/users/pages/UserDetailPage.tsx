import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiBook, FiClock, FiCreditCard, FiTrendingUp } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { MainButton } from "../../../components/ui/MainButton";
import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";
import { StatusPill } from "../../../components/ui/StatusPill";
import { showToast } from "../../../utils/showToast";
import type { AdminUserDetail } from "../../../store/slices/users";
import { getAdminUserDetail } from "../services/usersApi";

const cardClassName =
  "rounded-[28px] border border-[#dfe8d6] bg-white p-6 shadow-sm";

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function UserDetailSkeleton() {
  return (
    <div className="min-h-screen space-y-6 bg-bg-cream p-6">
      <div className={cardClassName}>
        <ShimmerBlock className="h-10 w-28 rounded-xl" />
        <div className="mt-6 flex items-start gap-4">
          <ShimmerBlock className="h-20 w-20 rounded-[28px]" />
          <div className="flex-1 space-y-3">
            <ShimmerBlock className="h-8 w-56 rounded-full" />
            <ShimmerBlock className="h-4 w-60 rounded-full" />
            <ShimmerBlock className="h-4 w-40 rounded-full" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={cardClassName}>
            <ShimmerBlock className="h-10 w-10 rounded-2xl" />
            <ShimmerBlock className="mt-4 h-3 w-24 rounded-full" />
            <ShimmerBlock className="mt-3 h-7 w-20 rounded-full" />
            <ShimmerBlock className="mt-3 h-4 w-full rounded-full" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className={cardClassName}>
          <ShimmerBlock className="h-6 w-40 rounded-full" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <ShimmerBlock key={index} className="h-[86px] w-full rounded-[22px]" />
            ))}
          </div>
        </div>
        <div className={cardClassName}>
          <ShimmerBlock className="h-6 w-36 rounded-full" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <ShimmerBlock key={index} className="h-[68px] w-full rounded-[20px]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserDetailPage() {
  const { userId = "" } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const detail = await getAdminUserDetail(userId);
        if (!cancelled) {
          setUser(detail);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load student details.";
        if (!cancelled) {
          setError(message);
          showToast({
            type: "error",
            message: "Unable to load student details.",
            options: { description: message, duration: 4200 },
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) {
    return <UserDetailSkeleton />;
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-bg-cream p-6">
        <div className={cardClassName}>
          <h2 className="text-lg font-bold text-[#203321]">
            Student details unavailable
          </h2>
          <p className="mt-2 text-sm text-[#72806e]">{error || "User not found."}</p>
          <div className="mt-5">
            <MainButton
              text="Back to Students"
              variant="outline"
              headIcon={<FiArrowLeft className="h-4 w-4" />}
              onClick={() => navigate("/users")}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-bg-cream p-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className={cardClassName}
      >
        <MainButton
          text="Back to Students"
          variant="outline"
          headIcon={<FiArrowLeft className="h-4 w-4" />}
          onClick={() => navigate("/users")}
        />

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-20 w-20 rounded-[28px] object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#0d6e6e] text-2xl font-bold text-white">
                {user.name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase())
                  .join("")}
              </div>
            )}
            <div>
              <h1 className="text-[30px] font-bold tracking-tight text-[#203321]">
                {user.name}
              </h1>
              <p className="mt-1 text-sm text-[#72806e]">{user.email}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusPill
                  variant={user.isActive ? "success" : "warning"}
                  dot
                  size="sm"
                >
                  {user.isActive ? "Active" : "Inactive"}
                </StatusPill>
                <StatusPill variant="info" size="sm">
                  {user.region || "No Region"}
                </StatusPill>
                <StatusPill variant="neutral" size="sm">
                  {user.timezone || "No Timezone"}
                </StatusPill>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#e7eadf] bg-[#f8faf6] px-4 py-4 text-sm text-[#314330]">
            <p>
              <span className="font-semibold text-[#203321]">Joined:</span>{" "}
              {formatDate(user.createdAt)}
            </p>
            <p className="mt-2">
              <span className="font-semibold text-[#203321]">Last login:</span>{" "}
              {formatDate(user.lastLoginAt)}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Total Orders",
            value: user.stats.totalOrders,
            helper: "Purchases completed by this learner",
            icon: <FiCreditCard className="h-5 w-5" />,
          },
          {
            title: "Total Spent",
            value: `$${Number(user.stats.totalMoneySpent || 0).toLocaleString()}`,
            helper: "Lifetime revenue generated",
            icon: <FiTrendingUp className="h-5 w-5" />,
          },
          {
            title: "Enrolled Courses",
            value: user.stats.enrolledCourses,
            helper: "Courses attached to this learner",
            icon: <FiBook className="h-5 w-5" />,
          },
          {
            title: "Completion Rate",
            value: `${user.stats.courseCompletionRate}%`,
            helper: "Average completion across course progress",
            icon: <FiClock className="h-5 w-5" />,
          },
        ].map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cardClassName}
          >
            <div className="rounded-2xl bg-[#eef7f5] p-3 text-[#0d6e6e] w-fit">
              {card.icon}
            </div>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#72806e]">
              {card.title}
            </p>
            <p className="mt-2 text-[28px] font-bold text-[#203321]">{card.value}</p>
            <p className="mt-2 text-sm leading-6 text-[#72806e]">{card.helper}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className={cardClassName}
        >
          <h2 className="text-xl font-bold text-[#203321]">Enrolled Courses</h2>
          <div className="mt-5 space-y-3">
            {user.enrolledCourses.length ? (
              user.enrolledCourses.map((course) => (
                <div
                  key={course.courseId}
                  className="rounded-[22px] border border-[#e7eadf] bg-[#fbfcf8] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#203321]">
                        {course.title}
                      </p>
                      <p className="mt-1 text-sm text-[#72806e]">
                        {course.subtitle || "No subtitle"}
                      </p>
                    </div>
                    <StatusPill
                      variant={course.completed ? "success" : "info"}
                      size="sm"
                    >
                      {course.completed ? "Completed" : `${course.progressPercent}%`}
                    </StatusPill>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#72806e]">
                    <span>Plan: {course.planType || "—"}</span>
                    <span>Region: {course.region || "—"}</span>
                    <span>Expiry: {formatDate(course.expiryDate)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-[#dfe8d6] bg-[#fbfcf8] px-5 py-10 text-center text-sm text-[#72806e]">
                No enrolled course data found for this learner.
              </div>
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className={cardClassName}
        >
          <h2 className="text-xl font-bold text-[#203321]">Recent Activity</h2>
          <div className="mt-5 space-y-3">
            {user.recentActivity.length ? (
              user.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-[20px] border border-[#e7eadf] bg-[#fbfcf8] p-4"
                >
                  <p className="text-sm font-semibold text-[#203321]">
                    {activity.title}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#72806e]">
                    {activity.type.replace(/_/g, " ")}
                  </p>
                  <p className="mt-2 text-sm text-[#72806e]">
                    {formatDate(activity.createdAt)}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-[#dfe8d6] bg-[#fbfcf8] px-5 py-10 text-center text-sm text-[#72806e]">
                No recent activity yet.
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

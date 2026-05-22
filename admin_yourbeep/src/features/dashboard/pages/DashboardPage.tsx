import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiClock,
  FiFilter,
  FiInfo,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { AppPagination } from "../../../components/ui/AppPagination";
import { AppTooltip } from "../../../components/ui/AppTooltip";
import { AnimatedDropdown } from "../../../components/ui/AnimatedDropdown";
import { DatePicker } from "../../../components/ui/DatePicker";
import { InputField } from "../../../components/ui/InputField";
import { MainButton } from "../../../components/ui/MainButton";
import { StatusPill } from "../../../components/ui/StatusPill";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchAdminDashboard } from "../../../store/slices/dashboard";
import type {
  CourseEngagementItem,
  DashboardPeriodPreset,
  DashboardPayload,
  GameEngagementItem,
  RecentActivityItem,
  SessionActivityPoint,
  WeeklyActivityPoint,
} from "../../../store/slices/dashboard";
import { showToast } from "../../../utils/showToast";
import DashboardPageSkeleton from "../components/DashboardPageSkeleton";

const STUDENTS_PER_PAGE = 7;
const ACTIVITY_PER_PAGE = 5;

type DashboardFilterForm = {
  q: string;
  region: string;
  planType: "" | "six_month" | "annual";
  period: DashboardPeriodPreset;
  from: string;
  to: string;
};

const containerMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.32, ease: "easeOut" as const },
};

function toYmd(value?: string) {
  if (!value) return "";
  return value.slice(0, 10);
}

function toIsoRange(value: string, mode: "start" | "end") {
  if (!value) return "";
  return mode === "start"
    ? `${value}T00:00:00.000Z`
    : `${value}T23:59:59.999Z`;
}

function formatRelativeTime(value: string) {
  const target = new Date(value).getTime();
  const minutes = Math.max(1, Math.round((Date.now() - target) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function maxNumber(values: number[]) {
  return Math.max(...values, 1);
}

function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[28px] border border-[#dfe8da] bg-white p-6 shadow-sm"
    >
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[22px] font-bold tracking-[-0.03em] text-[#111827]">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-[#72806e]">{subtitle}</p>
          ) : null}
        </div>
        {action ? <div className="flex items-center gap-3">{action}</div> : null}
      </div>
      {children}
    </motion.section>
  );
}

function MetricCard({
  title,
  value,
  delta,
  tooltip,
  icon,
}: {
  title: string;
  value: string;
  delta: number;
  tooltip: string;
  icon: ReactNode;
}) {
  const positive = delta >= 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[26px] border border-[#dfe8da] bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-2xl bg-[#eef7f5] p-3 text-[var(--primary)]">
          {icon}
        </div>
        <AppTooltip content={tooltip}>
          <button
            type="button"
            className="rounded-full p-1 text-[#94a3b8] transition hover:bg-[#f5f7f2] hover:text-[#203321]"
          >
            <FiInfo className="h-4 w-4" />
          </button>
        </AppTooltip>
      </div>
      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#72806e]">
        {title}
      </p>
      <p className="mt-2 text-[30px] font-bold tracking-[-0.03em] text-[#111827]">
        {value}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <StatusPill variant={positive ? "success" : "warning"} size="sm">
          {positive ? "+" : "-"}
          {Math.abs(delta)}%
        </StatusPill>
        <span className="text-xs text-[#72806e]">vs previous period</span>
      </div>
    </motion.article>
  );
}

function LineActivityChart({
  title,
  points,
  color,
  valueKey,
}: {
  title: string;
  points: Array<WeeklyActivityPoint | SessionActivityPoint>;
  color: string;
  valueKey: "users" | "sessions";
}) {
  const values = points.map((point) =>
    Number(valueKey === "users" ? (point as WeeklyActivityPoint).users : (point as SessionActivityPoint).sessions),
  );
  const max = maxNumber(values);
  const width = Math.max(360, points.length * 72);
  const step = points.length > 1 ? width / (points.length - 1) : width;
  const polyline = points
    .map((point, index) => {
      const value =
        valueKey === "users"
          ? (point as WeeklyActivityPoint).users
          : (point as SessionActivityPoint).sessions;
      return `${index * step},${180 - (Number(value) / max) * 140}`;
    })
    .join(" ");
  const area = `M 0 180 ${points
    .map((point, index) => {
      const value =
        valueKey === "users"
          ? (point as WeeklyActivityPoint).users
          : (point as SessionActivityPoint).sessions;
      return `L ${index * step} ${180 - (Number(value) / max) * 140}`;
    })
    .join(" ")} L ${width} 180 Z`;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#203321]">{title}</h3>
        <span className="text-xs text-[#72806e]">{points.length} points</span>
      </div>
      <div className="overflow-x-auto rounded-[22px] bg-[#f7faf7] px-3 py-4">
        <svg className="h-56 min-w-full" viewBox={`0 0 ${width} 180`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={`gradient-${valueKey}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#gradient-${valueKey})`} />
          <polyline
            points={polyline}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((point, index) => {
            const value =
              valueKey === "users"
                ? (point as WeeklyActivityPoint).users
                : (point as SessionActivityPoint).sessions;
            return (
              <circle
                key={`${point.day ?? point.label}-${index}`}
                cx={index * step}
                cy={180 - (Number(value) / max) * 140}
                r="5"
                fill={color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>
      <div className="mt-3 flex justify-between gap-2 overflow-x-auto px-1">
        {points.map((point, index) => (
          <span key={`${point.day ?? point.label}-${index}`} className="min-w-fit text-xs font-medium text-[#72806e]">
            {"day" in point ? point.day : point.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function EngagementTable({
  title,
  rows,
  emptyText,
  type,
}: {
  title: string;
  rows: CourseEngagementItem[] | GameEngagementItem[];
  emptyText: string;
  type: "courses" | "games";
}) {
  return (
    <SectionCard title={title}>
      {rows.length ? (
        <div className="overflow-hidden rounded-[22px] border border-[#e7eadf]">
          <table className="min-w-full divide-y divide-[#e7eadf] text-sm">
            <thead className="bg-[#f8faf6] text-left text-[11px] uppercase tracking-[0.16em] text-[#72806e]">
              <tr>
                <th className="px-4 py-3">{type === "courses" ? "Course" : "Game"}</th>
                <th className="px-4 py-3">Users</th>
                <th className="px-4 py-3">Events</th>
                <th className="px-4 py-3">{type === "courses" ? "Progress" : "Submissions"}</th>
                <th className="px-4 py-3">{type === "courses" ? "Media Split" : "Last Played"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef2ea] bg-white">
              {rows.map((row) => (
                <tr key={type === "courses" ? row.courseId : row.gameKey} className="align-top">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#203321]">
                      {type === "courses" ? (row as CourseEngagementItem).title : (row as GameEngagementItem).gameKey}
                    </p>
                    <p className="mt-1 text-xs text-[#72806e]">
                      {type === "courses"
                        ? (row as CourseEngagementItem).courseId
                        : (row as GameEngagementItem).gameKey}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[#203321]">{row.uniqueUsers}</td>
                  <td className="px-4 py-3 text-[#203321]">{row.totalEvents}</td>
                  <td className="px-4 py-3 text-[#203321]">
                    {type === "courses"
                      ? `${(row as CourseEngagementItem).completionRate}%`
                      : (row as GameEngagementItem).submissions}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#72806e]">
                    {type === "courses" ? (
                      <>
                        {(row as CourseEngagementItem).videoViews} video views ·{" "}
                        {(row as CourseEngagementItem).gameSubmissions} game submits
                      </>
                    ) : (
                      ((row as GameEngagementItem).lastPlayedAt &&
                        new Date((row as GameEngagementItem).lastPlayedAt as string).toLocaleString()) ||
                      "No plays"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-[22px] border border-dashed border-[#dfe8d6] bg-[#fbfcf8] px-5 py-10 text-center text-sm text-[#72806e]">
          {emptyText}
        </div>
      )}
    </SectionCard>
  );
}

function RecentActivityFeed({
  items,
  currentPage,
  onPageChange,
}: {
  items: RecentActivityItem[];
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(items.length / ACTIVITY_PER_PAGE));
  const currentItems = items.slice(
    (currentPage - 1) * ACTIVITY_PER_PAGE,
    currentPage * ACTIVITY_PER_PAGE,
  );

  return (
    <SectionCard
      title="Recent Operations Activity"
      subtitle="Fresh cross-platform events from signups, purchases, support, and outbound campaigns."
      action={
        <StatusPill variant="neutral" size="sm">
          {items.length} events
        </StatusPill>
      }
    >
      <div className="space-y-3">
        {currentItems.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="flex items-start gap-3 rounded-[20px] border border-[#edf2ea] bg-[#fbfcfa] p-3"
          >
            <div className="rounded-2xl bg-[#eef7f5] p-3 text-[var(--primary)]">
              <FiActivity className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#111827]">{activity.message}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-[#72806e]">
                <span className="uppercase tracking-[0.16em]">
                  {activity.type.replace(/_/g, " ")}
                </span>
                <span>•</span>
                <span>{formatRelativeTime(activity.createdAt)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {totalPages > 1 ? (
        <AppPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      ) : null}
    </SectionCard>
  );
}

function CompactStudentList({
  data,
}: {
  data: DashboardPayload;
}) {
  return (
    <SectionCard
      title="Recent Students"
      subtitle="The 7 most recently joined learners on the platform."
      action={
        <StatusPill variant="info" size="sm">
          {data.recentStudents.length} shown
        </StatusPill>
      }
    >
      <div className="space-y-3">
        {data.recentStudents.map((student) => (
          <div
            key={student._id}
            className="flex items-center justify-between gap-3 rounded-[18px] border border-[#edf2ea] bg-[#fbfcfa] px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#111827]">{student.name}</p>
              <p className="truncate text-xs text-[#72806e]">{student.email}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-[#203321]">
                {student.activeCoursesCount} live courses
              </p>
              <p className="text-[11px] text-[#72806e]">
                {student.region || "No region"} · {student.planTypes[0] || "No plan"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { data, loading, error, filters } = useAppSelector((state) => state.dashboard);
  const [activityPage, setActivityPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<DashboardFilterForm>({
    q: "",
    region: "",
    planType: "",
    period: "30d",
    from: "",
    to: "",
  });
  const lastErrorRef = useRef<string | null>(null);
  const periodLabel = data?.period?.label ?? "Current period";
  const recentStudents = data?.recentStudents ?? [];
  const weeklyActivity = data?.weeklyActivity ?? [];
  const sessionActivity = data?.sessionActivity ?? [];
  const courseEngagement = data?.engagement?.courses ?? [];
  const gameEngagement = data?.engagement?.games ?? [];
  const recentActivity = data?.recentActivity ?? [];

  useEffect(() => {
    if (!data && !loading) {
      dispatch(fetchAdminDashboard({ page: 1, limit: STUDENTS_PER_PAGE, period: "30d" }));
    }
  }, [data, dispatch, loading]);

  useEffect(() => {
    setForm({
      q: filters.q ?? "",
      region: filters.region ?? "",
      planType: filters.planType ?? "",
      period: filters.period ?? "30d",
      from: toYmd(filters.from),
      to: toYmd(filters.to),
    });
  }, [filters]);

  useEffect(() => {
    if (error && error !== lastErrorRef.current) {
      showToast({
        type: "error",
        message: "Dashboard sync failed",
        options: { description: error, duration: 4200 },
      });
      lastErrorRef.current = error;
    }
  }, [error]);

  useEffect(() => {
    setActivityPage(1);
  }, [data?.recentActivity]);

  const regionOptions = useMemo(() => {
    const values = new Set<string>();
    (data?.students?.items ?? []).forEach((item) => {
      if (item.region) values.add(item.region);
    });
    return [
      { label: "All regions", value: "" },
      ...[...values].sort().map((value) => ({ label: value, value })),
    ];
  }, [data?.students.items]);

  const handleApplyFilters = async () => {
    if (form.period === "custom" && (!form.from || !form.to)) {
      showToast({
        type: "warning",
        message: "Select both custom dates",
        options: {
          description: "Choose a start and end date before applying a custom dashboard period.",
        },
      });
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(
        fetchAdminDashboard({
          page: 1,
          limit: STUDENTS_PER_PAGE,
          q: form.q.trim() || undefined,
          region: form.region || undefined,
          planType: form.planType || undefined,
          period: form.period,
          from: form.period === "custom" ? toIsoRange(form.from, "start") : undefined,
          to: form.period === "custom" ? toIsoRange(form.to, "end") : undefined,
        }),
      ).unwrap();

      showToast({
        type: "success",
        message: "Dashboard updated",
        options: {
          description: "The analytics view now reflects your latest filters.",
        },
      });
    } catch (filterError) {
      showToast({
        type: "error",
        message: "Unable to apply filters",
        options: {
          description:
            typeof filterError === "string"
              ? filterError
              : "Please try again in a moment.",
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetFilters = async () => {
    const resetForm: DashboardFilterForm = {
      q: "",
      region: "",
      planType: "",
      period: "30d",
      from: "",
      to: "",
    };
    setForm(resetForm);
    setSubmitting(true);
    try {
      await dispatch(fetchAdminDashboard({ page: 1, limit: STUDENTS_PER_PAGE, period: "30d" })).unwrap();
      showToast({
        type: "info",
        message: "Dashboard filters cleared",
        options: { description: "You are back to the default 30 day dashboard view." },
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !data) {
    return <DashboardPageSkeleton />;
  }

  if (!data) {
    return (
      <div className="rounded-[28px] border border-red-100 bg-red-50 p-6 text-red-600 shadow-sm">
        <h2 className="text-lg font-bold">Dashboard failed to load</h2>
        <p className="mt-2 text-sm">{error || "No dashboard data available."}</p>
      </div>
    );
  }

  return (
    <motion.div {...containerMotion} className="min-h-screen space-y-6 bg-bg-cream p-6">
      {error ? (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Showing the last successful dashboard snapshot. Latest sync issue: {error}
        </div>
      ) : null}

      <SectionCard
        title="Platform Command Center"
        subtitle="Track learner engagement by course and game, compare session patterns, and inspect the current operating window."
        action={
          <StatusPill variant="success" size="sm">
            {periodLabel}
          </StatusPill>
        }
      >
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <InputField
              label="Search activity"
              value={form.q}
              placeholder="Learner name or email"
              onChange={(event) =>
                setForm((current) => ({ ...current, q: event.target.value }))
              }
            />
            <AnimatedDropdown
              name="dashboard-region"
              label="Region"
              value={form.region}
              options={regionOptions}
              placeholder="All regions"
              onChange={(value) =>
                setForm((current) => ({ ...current, region: value }))
              }
            />
            <AnimatedDropdown
              name="dashboard-plan"
              label="Plan"
              value={form.planType}
              options={[
                { label: "All plans", value: "" },
                { label: "6 Month", value: "six_month" },
                { label: "Annual", value: "annual" },
              ]}
              placeholder="All plans"
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  planType: value as DashboardFilterForm["planType"],
                }))
              }
            />
          </div>

          <div className="space-y-4 rounded-[24px] border border-[#e7eadf] bg-[#f8faf6] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#203321]">
              <FiFilter className="h-4 w-4 text-[var(--primary)]" />
              Engagement Window
            </div>
            <AnimatedDropdown
              name="dashboard-period"
              label="Period"
              value={form.period}
              options={[
                { label: "Last 7 days", value: "7d" },
                { label: "Last 30 days", value: "30d" },
                { label: "Last 90 days", value: "90d" },
                { label: "Custom range", value: "custom" },
              ]}
              placeholder="Select period"
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  period: value as DashboardPeriodPreset,
                }))
              }
            />

            {form.period === "custom" ? (
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#72806e]">
                    Start date
                  </p>
                  <DatePicker
                    value={form.from}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, from: value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#72806e]">
                    End date
                  </p>
                  <DatePicker
                    value={form.to}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, to: value }))
                    }
                  />
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <MainButton
                text={submitting ? "Applying..." : "Apply Filters"}
                isLoading={submitting}
                onClick={() => {
                  void handleApplyFilters();
                }}
              />
              <MainButton
                text="Reset"
                variant="outline"
                onClick={() => {
                  void handleResetFilters();
                }}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <MetricCard
          title="Total Learners"
          value={data.stats.totalUsers.value.toLocaleString()}
          delta={data.stats.totalUsers.changePercent}
          tooltip="All active student accounts currently recognized by the identity service."
          icon={<FiUsers className="h-5 w-5" />}
        />
        <MetricCard
          title="Active Learners"
          value={data.stats.activeUsers.value.toLocaleString()}
          delta={data.stats.activeUsers.changePercent}
          tooltip="Learners with recorded activity inside the currently selected dashboard period."
          icon={<FiActivity className="h-5 w-5" />}
        />
        <MetricCard
          title="Revenue"
          value={`$${Number(data.stats.revenue.value).toLocaleString()}`}
          delta={data.stats.revenue.changePercent}
          tooltip="Commerce revenue for the current dashboard comparison window."
          icon={<FiTrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="Orders"
          value={data.stats.orders.value.toLocaleString()}
          delta={data.stats.orders.changePercent}
          tooltip="Completed and renewed commerce purchases during the current month baseline."
          icon={<FiClock className="h-5 w-5" />}
        />
        <MetricCard
          title="New Signups"
          value={data.stats.newSignups.value.toLocaleString()}
          delta={data.stats.newSignups.changePercent}
          tooltip="Fresh learner accounts created during the current comparison window."
          icon={<FiUsers className="h-5 w-5" />}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${data.stats.conversionRate.value}%`}
          delta={data.stats.conversionRate.changePercent}
          tooltip="Orders divided by signups for the same comparison window."
          icon={<FiTrendingUp className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <SectionCard
          title="Learner Activity Trend"
          subtitle="Unique active learners over the selected dashboard period."
        >
          <LineActivityChart
            title="Learners per day"
            points={weeklyActivity}
            color="#0d6e6e"
            valueKey="users"
          />
        </SectionCard>

        <SectionCard
          title="Session Activity"
          subtitle="Access activity volume, useful for spotting spikes in usage or drops in retention."
        >
          <LineActivityChart
            title="Sessions per day"
            points={sessionActivity}
            color="#65a30d"
            valueKey="sessions"
          />
        </SectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <EngagementTable
          title="Top Course Engagement"
          rows={courseEngagement}
          emptyText="No course activity was recorded for this window."
          type="courses"
        />
        <EngagementTable
          title="Top Game Engagement"
          rows={gameEngagement}
          emptyText="No game activity was recorded for this window."
          type="games"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <RecentActivityFeed
          items={recentActivity}
          currentPage={activityPage}
          onPageChange={setActivityPage}
        />
        <CompactStudentList
          data={{ ...data, recentStudents }}
        />
      </div>
    </motion.div>
  );
}

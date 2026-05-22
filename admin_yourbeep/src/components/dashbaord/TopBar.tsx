import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdKeyboardArrowRight,
  MdMenu,
  MdNotifications,
  MdRefresh,
  MdSearch,
} from "react-icons/md";
import { getRouteMeta } from "../../constants/navigation";
import { useAppDispatch, useAppSelector } from "../../store";
import { logoutAdmin } from "../../store/slices/auth";
import { fetchNotificationSummary } from "../../store/slices/notifications";
import {
  audienceLabel,
  formatDateTime,
} from "../../features/notifications/services/notificationFormatters";

interface TopBarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export default function TopBar({
  isSidebarOpen,
  setIsSidebarOpen,
}: TopBarProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const routeMeta = getRouteMeta(location.pathname);
  const user = useAppSelector((state) => state.auth.user);
  const { summary, loadingSummary } = useAppSelector(
    (state) => state.notifications,
  );

  const displayName = user?.fullName || "Admin Manager";
  const email = user?.email || "admin@yourbeep.com";
  const initials = useMemo(
    () =>
      displayName
        .split(" ")
        .slice(0, 2)
        .map((part: string) => part[0]?.toUpperCase())
        .join(""),
    [displayName],
  );

  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const isNestedRoute = pathSegments.length > 1;
  const parentPath =
    location.pathname.startsWith("/support/tickets/")
      ? "/support"
      : location.pathname.startsWith("/notifications/campaigns/")
        ? "/notifications"
      : pathSegments.length > 1
        ? `/${pathSegments.slice(0, -1).join("/")}`
        : "/";

  const unreadCount = Number(summary?.draftCampaigns || 0);
  const recentCampaigns = summary?.recentCampaigns ?? [];

  useEffect(() => {
    if (!summary && !loadingSummary) {
      dispatch(fetchNotificationSummary());
    }
  }, [dispatch, loadingSummary, summary]);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutAdmin());
    navigate("/login", { replace: true });
  };

  const refreshNotificationSummary = () => {
    dispatch(fetchNotificationSummary());
  };

  return (
    <header className="border-gray-200 bg-white  flex items-center justify-between  px-2 py-2 shadow-sm  md:px-6">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 bg-gray-50 text-gray-600 transition hover:bg-gray-100 md:hidden"
          >
            <MdMenu className="text-[20px]" />
          </button>
          {isNestedRoute && (
            <button
              type="button"
              onClick={() => navigate(parentPath)}
              className="hidden items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 md:inline-flex"
            >
              <MdArrowBack className="text-[18px]" />
              Back
            </button>
          )}
          <span className="truncate text-lg font-semibold text-gray-900">
            {routeMeta.title}
          </span>
        </div>

        <div className="pl-0 text-[12px] text-gray-500 md:pl-0">
          {dateLabel}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden max-w-md flex-1 md:block">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary)]/15"
            />
          </div>
        </div>

        <div ref={notificationRef} className="relative">
          <button
            type="button"
            aria-expanded={isNotificationsOpen}
            aria-label="Notifications"
            onClick={() => setIsNotificationsOpen((open) => !open)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-lg text-gray-600 transition-all hover:bg-gray-100"
          >
            <MdNotifications />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
            )}
          </button>

          {isNotificationsOpen && (
            <section className="absolute right-0 top-12 z-50 w-[380px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] max-sm:right-[-5rem] max-sm:w-[calc(100vw-2rem)]">
              <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-3">
                <div>
                  <p className="text-[13px] font-bold text-gray-900">
                    Notifications
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    {unreadCount
                      ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                      : "You're all caught up"}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Refresh notifications"
                  onClick={refreshNotificationSummary}
                  disabled={loadingSummary}
                  className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  <MdRefresh
                    className={`text-[18px] ${loadingSummary ? "animate-spin" : ""}`}
                  />
                </button>
              </div>

              <div className="max-h-[420px] overflow-y-auto">
                {recentCampaigns.length ? (
                  <div className="divide-y divide-gray-100">
                    {recentCampaigns.map((campaign) => (
                      <button
                        key={campaign._id}
                        type="button"
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          navigate(`/notifications/campaigns/${campaign._id}`);
                        }}
                        className={`flex w-full gap-3 px-4 py-3 text-left transition hover:bg-gray-50 ${
                          campaign.status === "draft"
                            ? "bg-[var(--primary-light)]/50"
                            : "bg-white"
                        }`}
                      >
                        <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)] ring-1 ring-[var(--primary)]/10">
                          <MdNotifications className="text-[15px]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <p className="line-clamp-1 text-[12px] font-semibold text-gray-900">
                              {campaign.title}
                            </p>
                            <span className="shrink-0 text-[10px] font-medium text-gray-400">
                              {formatDateTime(campaign.sentAt || campaign.createdAt)}
                            </span>
                          </div>

                          <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-gray-500">
                            {campaign.body}
                          </p>

                          <div className="mt-2 flex items-center gap-2">
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gray-500">
                              {audienceLabel(campaign.type)}
                            </span>

                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gray-500">
                              {audienceLabel(campaign.audience.type)}
                            </span>

                            {campaign.status === "draft" && (
                              <span className="rounded-full bg-[var(--primary-light)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--primary)]">
                                Draft
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-gray-50 text-gray-400">
                      <MdNotifications className="text-[18px]" />
                    </div>
                    <p className="mt-3 text-[13px] font-semibold text-gray-800">
                      No notifications yet
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-gray-500">
                      Recent admin campaigns will appear here once they exist.
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        <div
          ref={profileRef}
          onMouseEnter={() => setIsProfileMenuOpen(true)}
          onMouseLeave={() => setIsProfileMenuOpen(false)}
          className="relative"
        >
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-1 py-1 transition hover:border-gray-300"
          >
            <div className="hidden flex-col text-right sm:flex">
              <strong className="text-[11px] font-semibold text-gray-900">
                {displayName}
              </strong>
              <span className="text-[10px] text-gray-500">System Admin</span>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-xs font-bold text-white shadow-sm">
              {initials || "A"}
            </div>
          </button>

          {isProfileMenuOpen && (
            <section className="absolute right-0 top-11 z-50 w-[320px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] max-sm:w-[calc(100vw-1rem)]">
              <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-sm font-bold text-white">
                  {initials || "A"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-gray-500">System Admin</p>
                  <p className="mt-1 truncate text-[11px] text-gray-500">
                    {email}
                  </p>
                </div>
              </div>

              <div className="px-4 py-4">
                <p className="text-[13px] font-semibold text-gray-900">
                  Account
                </p>

                <div className="mt-3 flex flex-col gap-2">
                  <Link
                    to="/profile"
                    className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-medium text-gray-700 transition hover:bg-gray-100 no-underline"
                  >
                    Profile settings
                    <MdKeyboardArrowRight className="text-[18px] text-gray-400" />
                  </Link>
                </div>
              </div>

              <div className="border-t border-gray-100 px-4 py-3">
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="w-full rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
                >
                  Logout
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </header>
  );
}

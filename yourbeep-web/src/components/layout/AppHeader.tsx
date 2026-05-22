import { Bell, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { appRoutes } from "@constants/routes";
import { useAppDispatch, useAppSelector } from "../../store/index";
import { logoutUser } from "@store/slices/auth";
import MainButton from "@components/ui/MainButton";
import IconButton from "@components/ui/IconButton";
import StatusPill from "@components/ui/StatusPill";

type AppHeaderProps = {
  activeItem?: "Dashboard" | "Courses" | "Games";
};

const navItems = [
  { label: "Dashboard" as const, path: appRoutes.dashboard },
  { label: "Courses" as const, path: appRoutes.courses },
  { label: "Games" as const, path: appRoutes.games },
];

export default function AppHeader({
  activeItem = "Dashboard",
}: AppHeaderProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const unreadCount = useAppSelector(
    (state) => state.main.dashboard?.header.notifications.unreadCount ?? 0,
  );
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "YB";
  const latestSession = user?.recentSessions?.[0] ?? null;
  const lastAccessLabel =
    latestSession?.locationLabel || latestSession?.countryCode || user?.region || "Unknown";
  const lastDeviceLabel =
    latestSession?.deviceName ||
    (latestSession?.platform === "ios"
      ? "iPhone / iPad"
      : latestSession?.platform === "android"
        ? "Android"
        : "Web session");

  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    if (path.startsWith("/#")) {
      navigate(path.replace("/#", "/"));
      return;
    }
    navigate(path);
  };

  const currentItem =
    activeItem ||
    navItems.find((item) => location.pathname.startsWith(item.path))?.label ||
    "Dashboard";

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md">
      <motion.nav
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="mx-auto border border-white/55 p-3 shadow-[0_18px_40px_rgba(24,52,58,0.08)]"
        style={{ backgroundColor: "rgba(200, 216, 208, 0.88)" }}
      >
        <div className="relative flex w-full items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-2 border-none bg-transparent p-0 transition-opacity duration-200 hover:opacity-85"
            onClick={() => handleNavigation(appRoutes.dashboard)}
            aria-label="Go to dashboard"
          >
            <img
              src="/media/app_logo/app_logo.png"
              alt="yourbeep"
              className="h-14 w-[150px] object-contain object-left"
            />
          </button>

          <div className="ml-auto hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavigation(item.path)}
                className={`cursor-pointer border-none bg-transparent text-xs transition-colors duration-200 ${
                  currentItem === item.label
                    ? "font-semibold text-[#1a3a40]"
                    : "text-[#4a6a70] hover:text-[#1a3a40]"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="relative">
              <IconButton
                type="button"
                icon={<Bell size={16} />}
                variant="outline"
                size="md"
                className="border-[#1a3a40]/12 bg-white/70 text-[#1a3a40] hover:bg-white"
              />
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-[#1a4a58] px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : null}
            </div>
            <div
              className="relative"
              onMouseEnter={() => setIsProfileMenuOpen(true)}
              onMouseLeave={() => setIsProfileMenuOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-3 rounded-full border border-[#1a3a40]/12 bg-white/70 px-2 py-2 transition hover:bg-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a4a58] text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                  {initials}
                </span>
                <span className="pr-2 text-left">
                  <span className="block text-[11px] font-semibold text-[#1a3a40]">
                    {user?.fullName || "YourBeep User"}
                  </span>
                  <span className="block text-[10px] uppercase tracking-[0.14em] text-[#6b7d7e]">
                    Profile
                  </span>
                </span>
              </button>

              {isProfileMenuOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 top-full z-50 mt-3 min-w-[220px] overflow-hidden rounded-[22px] border border-[#d9e5df] bg-white shadow-[0_22px_48px_rgba(21,45,52,0.14)]"
                >
                  <div className="border-b border-[#edf2ef] px-4 py-4">
                    <p className="text-sm font-semibold text-[#1a3a40]">
                      {user?.fullName || "YourBeep User"}
                    </p>
                    <p className="mt-1 text-xs text-[#6b7d7e]">
                      {user?.email || "Signed in"}
                    </p>
                    <div className="mt-3 rounded-2xl bg-[#f7faf7] px-3 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#73867d]">
                        Latest access
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[#1a3a40]">
                        {lastDeviceLabel}
                      </p>
                      <p className="mt-1 text-[11px] text-[#5f7272]">
                        {lastAccessLabel}
                        {latestSession?.ipAddress ? ` • ${latestSession.ipAddress}` : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 bg-transparent px-4 py-3 text-left text-sm font-medium text-[#8a2f2f] transition-colors duration-200 hover:bg-[#fff4f4]"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      void dispatch(logoutUser());
                    }}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              ) : null}
            </div>
          </div>

          <div className="relative ml-auto block md:hidden" ref={menuRef}>
            <button
              type="button"
              className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full border-none bg-[#1a3a40] text-white transition-colors duration-200 hover:bg-[#0f2830]"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label="Open menu"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {isMenuOpen ? (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-full z-50 mt-2 min-w-[170px] overflow-hidden rounded-lg bg-white shadow-lg"
              >
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className="block w-full cursor-pointer bg-transparent px-4 py-3 text-left text-sm font-medium text-[#1a3a40] transition-colors duration-200 hover:bg-gray-100"
                    onClick={() => handleNavigation(item.path)}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="border-t border-gray-200 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a4a58] text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                      {initials}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#1a3a40]">
                        {user?.fullName || "YourBeep User"}
                      </p>
                      <StatusPill
                        tone="primary"
                        className="mt-1 normal-case tracking-normal"
                      >
                        Notifications: {unreadCount}
                      </StatusPill>
                    </div>
                  </div>
                </div>
                <div className="my-1 border-t border-gray-200" />
                <button
                  type="button"
                  className="block w-full cursor-pointer bg-transparent px-4 py-3 text-left text-sm font-medium text-[#1a3a40] transition-colors duration-200 hover:bg-gray-100"
                  onClick={() => {
                    setIsMenuOpen(false);
                    void dispatch(logoutUser());
                  }}
                >
                  Sign Out
                </button>
              </motion.div>
            ) : null}
          </div>
        </div>
      </motion.nav>
    </header>
  );
}

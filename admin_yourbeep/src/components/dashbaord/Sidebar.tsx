import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdChevronLeft, MdLogout, MdPerson } from "react-icons/md";
import { adminNavItems } from "../../constants/navigation";
import { useAppDispatch } from "../../store";
import { logoutAdmin } from "../../store/slices/auth";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);

  const activeId =
    adminNavItems.find((item) =>
      item.to === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(item.to),
    )?.id ?? "dashboard";

  const confirmLogout = async () => {
    await dispatch(logoutAdmin());
    setShowLogoutWarning(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <aside
        style={{ width: isOpen ? 240 : 72, minWidth: isOpen ? 240 : 72 }}
        className="hidden h-screen shrink-0 flex-col overflow-hidden  bg-[var(--sidebar-bg)] py-6 font-sans shadow-[8px_0_30px_rgba(13,110,110,0.06)] transition-all duration-300 ease-in-out md:flex"
      >
        <div className="mb-6 px-5 ">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
              <img
                src="/app_logo_without_text.png"
                alt="YourBeep"
                className="h-6 w-6 object-contain"
              />
            </div>
            <div
              className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                isOpen ? "max-w-[140px] opacity-100" : "max-w-0 opacity-0"
              }`}
            >
              <h2 className="text-base font-bold tracking-tight text-gray-900">
                YourBeep
              </h2>
              <p className=" text-[11px] font-medium text-gray-600">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        <nav
          className={`flex flex-1 flex-col gap-1 overflow-y-auto px-3 transition-all duration-300 ${
            isOpen ? "items-stretch" : "items-center px-0"
          }`}
        >
          {adminNavItems.map(({ id, label, icon: Icon, to }) => {
            const isActive = activeId === id;

            return (
              <Link
                key={id}
                to={to}
                title={!isOpen ? label : undefined}
                className={`group flex items-center rounded-lg no-underline transition-all duration-150 hover:translate-x-0.5 ${
                  isOpen
                    ? "w-full gap-3 px-3 py-2.5"
                    : "h-10 w-10 justify-center"
                } ${
                  isActive
                    ? "bg-white font-semibold text-[var(--primary)] shadow-sm"
                    : "font-medium text-gray-700 hover:bg-white/60 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`shrink-0 text-lg transition-colors ${
                    isActive
                      ? "text-[var(--primary)]"
                      : "text-gray-600 group-hover:text-gray-700"
                  }`}
                />
                <span
                  className={`overflow-hidden whitespace-nowrap text-[13px] leading-none transition-all duration-200 ${
                    isActive ? "text-[var(--primary)]" : "text-gray-700"
                  } ${isOpen ? "max-w-xs opacity-100" : "max-w-0 opacity-0"}`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div
          className={`mt-auto flex flex-col gap-1 border-t border-[#d7e8d2] pt-3 transition-all duration-300 ${
            isOpen ? "px-2" : "items-center px-0"
          }`}
        >
          <Link
            to="/profile"
            title={!isOpen ? "Profile" : undefined}
            className={`flex items-center rounded-lg text-gray-600 transition-all duration-150 hover:bg-white/60 hover:text-gray-900 ${
              isOpen ? "w-full gap-3 px-3 py-2.5" : "h-10 w-10 justify-center"
            }`}
          >
            <MdPerson className="shrink-0 text-lg" />
            <span
              className={`overflow-hidden whitespace-nowrap text-[13px] font-medium leading-none transition-all duration-200 ${
                isOpen ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
              }`}
            >
              Profile
            </span>
          </Link>

          <button
            onClick={() => setShowLogoutWarning(true)}
            title={!isOpen ? "Logout" : undefined}
            className={`flex items-center rounded-lg text-red-500 transition-all duration-150 hover:bg-red-50 hover:text-red-600 ${
              isOpen ? "w-full gap-3 px-3 py-2.5" : "h-10 w-10 justify-center"
            }`}
          >
            <MdLogout className="shrink-0 text-lg" />
            <span
              className={`overflow-hidden whitespace-nowrap text-[13px] font-medium leading-none transition-all duration-200 ${
                isOpen ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
              }`}
            >
              Logout
            </span>
          </button>

          <div
            className={`flex ${isOpen ? "justify-end px-1" : "justify-center"}`}
          >
            <button
              onClick={() => setIsOpen(!isOpen)}
              title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors duration-150 hover:bg-white/60 hover:text-gray-700"
            >
              <MdChevronLeft
                className={`text-base transition-transform duration-300 ${
                  isOpen ? "" : "rotate-180"
                }`}
              />
            </button>
          </div>
        </div>
      </aside>

      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity duration-300 md:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed bottom-0 left-0 top-0 z-40 flex w-[240px] flex-col border-r border-[#d7e8d2] bg-[var(--sidebar-bg)] transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
            <img
              src="/app_logo_without_text.png"
              alt="YourBeep"
              className="h-6 w-6 object-contain"
            />
          </div>
          <span className="text-[13px] font-bold uppercase leading-tight tracking-[0.1em] text-gray-800">
            YourBeep
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="ml-auto text-gray-400 transition-colors hover:text-gray-600"
          >
            <MdChevronLeft className="text-[18px]" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          {adminNavItems.map(({ id, label, icon: Icon, to }) => {
            const isActive = activeId === id;

            return (
              <Link
                key={id}
                to={to}
                onClick={() => setIsOpen(false)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium no-underline transition-colors duration-150 ${
                  isActive
                    ? "bg-white text-[var(--primary)] shadow-sm"
                    : "text-gray-700 hover:bg-white/60 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`shrink-0 text-lg ${
                    isActive ? "text-[var(--primary)]" : "text-gray-500"
                  }`}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-[#d7e8d2] px-2 pb-4 pt-3">
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-gray-600 no-underline transition-colors hover:bg-white/60 hover:text-gray-900"
          >
            <MdPerson className="shrink-0 text-lg" />
            Profile
          </Link>

          <button
            onClick={() => setShowLogoutWarning(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <MdLogout className="shrink-0 text-lg" />
            Logout
          </button>
        </div>
      </aside>

      {showLogoutWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
            <h3 className="text-sm font-semibold text-gray-900">Logout?</h3>
            <p className="mt-2 text-xs text-gray-600">
              You will be signed out of the admin dashboard.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutWarning(false)}
                className="h-8 rounded-md border border-gray-200 px-3 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void confirmLogout()}
                className="h-8 rounded-md bg-[var(--primary)] px-3 text-xs font-medium text-white hover:bg-[var(--primary-dark)]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

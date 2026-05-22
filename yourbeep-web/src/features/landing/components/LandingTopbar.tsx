import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import PrimaryButton from "@components/common/PrimaryButton";
import { landingNavItems } from "@constants/navigation";
import { appRoutes } from "@constants/routes";
import { useAppSelector } from "@store";

const authLinks = {
  register: `${appRoutes.auth}?tab=signin`,
};

type NavChild = {
  id: string;
  label: string;
  href: string;
};

type NavItem = {
  id: string;
  label: string;
  href: string;
  children?: NavChild[];
};

const NavDropdown = ({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const handleEnter = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  };

  const handleLeave = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-bold leading-tight text-[#1a3a40]/85 transition-colors duration-200 hover:text-[#0f2830] lg:text-xs xl:text-sm"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((current) => !current)}
      >
        {item.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-full z-50 mt-2 min-w-[13.5rem] overflow-hidden rounded-xl border border-[#eceae4] bg-white py-1.5 shadow-[0_12px_32px_rgba(26,58,68,0.12)]"
          >
            {item.children?.map((child) => (
              <a
                key={child.id}
                href={child.href}
                className="block px-4 py-2.5 text-left text-[13px] font-medium text-[#1a3a40] transition-colors duration-200 hover:bg-[#f5f7f7]"
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
              >
                {child.label}
              </a>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

const LandingTopbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { user, token } = useAppSelector((state) => state.auth);
  const isAuthenticated = Boolean(user && token);

  const closeMenu = () => setIsMenuOpen(false);

  const toggleGroup = (id: string) => {
    setExpandedGroups((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <motion.nav
      className="sticky top-0 z-50 w-full border-b border-[#eceae4] bg-white shadow-[0_1px_0_rgba(26,58,64,0.04)]"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
    >
      <div className="mx-auto flex min-h-[64px] w-full max-w-[1320px] items-center justify-between px-5 py-3 md:px-10">
        <div className="flex shrink-0 items-center gap-2.5">
          <a href="#top" aria-label="YourBeep home">
            <img
              src="/media/app_logo/app_logo.png"
              alt="yourbeep"
              className="h-10 w-[120px] object-contain object-left"
            />
          </a>
        </div>

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-2 px-3 md:flex lg:gap-3 xl:gap-4">
          <div className="flex min-w-0 flex-wrap items-center justify-end gap-x-3 gap-y-1 lg:gap-x-4 xl:gap-x-5">
            {(landingNavItems as NavItem[]).map((item, index) =>
              item.children?.length ? (
                <NavDropdown key={item.id} item={item} />
              ) : (
                <motion.a
                  key={item.id}
                  href={item.href}
                  className={`whitespace-nowrap text-[11px] font-bold leading-tight no-underline transition-colors duration-200 hover:text-[#0f2830] lg:text-xs xl:text-sm ${
                    index === 0
                      ? "text-[#1a3a40] underline decoration-[1.5px] underline-offset-2"
                      : "text-[#1a3a40]/85"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 + index * 0.04, duration: 0.6 }}
                >
                  {item.label}
                </motion.a>
              ),
            )}
          </div>

          {isAuthenticated ? (
            <motion.div
              className="shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              <PrimaryButton
                href={appRoutes.dashboard}
                className="rounded-full px-4 py-2.5 text-[11px] font-bold lg:px-[22px] lg:py-3 lg:text-xs"
              >
                Dashboard
              </PrimaryButton>
            </motion.div>
          ) : (
            <motion.div
              className="shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              <PrimaryButton
                href={authLinks.register}
                className="rounded-full px-4 py-2.5 text-[11px] font-bold lg:px-[22px] lg:py-3 lg:text-xs"
              >
                Begin my journey
              </PrimaryButton>
            </motion.div>
          )}
        </div>

        <div className="relative shrink-0 md:hidden" ref={menuRef}>
          <motion.button
            type="button"
            className="flex items-center justify-center rounded-full border border-[#1a3a40] bg-white p-2 text-sm font-medium text-[#1a3a40] transition-colors duration-200 hover:bg-[#1a3a40] hover:text-white"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </motion.button>

          {isMenuOpen ? (
            <motion.div
              className="absolute right-0 top-full z-50 mt-2 max-h-[70vh] min-w-[240px] overflow-y-auto rounded-lg border border-[#eceae4] bg-white shadow-lg"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {(landingNavItems as NavItem[]).map((item) =>
                item.children?.length ? (
                  <div key={item.id} className="border-b border-[#f0f0f0] last:border-b-0">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between bg-transparent px-4 py-3 text-left text-sm font-semibold text-[#1a3a40]"
                      onClick={() => toggleGroup(item.id)}
                    >
                      {item.label}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          expandedGroups.includes(item.id) ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedGroups.includes(item.id) ? (
                      <div className="pb-2">
                        {item.children.map((child) => (
                          <a
                            key={child.id}
                            href={child.href}
                            className="block w-full bg-transparent py-2 pl-7 pr-4 text-left text-sm font-medium text-[#3a5a60] transition-colors duration-200 hover:bg-[#f5f5f5]"
                            onClick={closeMenu}
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <a
                    key={item.id}
                    href={item.href}
                    className="block w-full border-b border-[#f0f0f0] bg-transparent px-4 py-3 text-left text-sm font-medium text-[#1a3a40] transition-colors duration-200 hover:bg-[#f5f5f5] last:border-b-0"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </a>
                ),
              )}

              {isAuthenticated ? (
                <Link
                  to={appRoutes.dashboard}
                  className="block w-full bg-transparent px-4 py-3 text-left text-sm font-medium text-[#1a3a40] transition-colors duration-200 hover:bg-[#f5f5f5]"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to={authLinks.register}
                  className="block w-full bg-transparent px-4 py-3 text-left text-sm font-medium text-[#1a3a40] transition-colors duration-200 hover:bg-[#f5f5f5]"
                  onClick={closeMenu}
                >
                  Begin my journey
                </Link>
              )}
            </motion.div>
          ) : null}
        </div>
      </div>
    </motion.nav>
  );
};

export default LandingTopbar;

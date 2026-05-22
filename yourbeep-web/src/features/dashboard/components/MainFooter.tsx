import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { appRoutes } from "@constants/routes";
import { useAppDispatch, useAppSelector } from "@store/index";
import { fetchPlatformSettings } from "@store/slices/settings";

const defaultFooterLinks = [
  { label: "Privacy Policy", url: appRoutes.privacy },
  { label: "Terms of Service", url: appRoutes.terms },
  { label: "Get in Touch", url: appRoutes.contact },
];

const MainFooter = () => {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.settings);

  useEffect(() => {
    if (!data && !loading) {
      void dispatch(fetchPlatformSettings());
    }
  }, [data, dispatch, loading]);

  const footerLinks = useMemo(() => {
    const configured = data?.footer.links ?? [];
    const merged = [...configured];

    defaultFooterLinks.forEach((requiredLink) => {
      if (!merged.some((item) => item.label.toLowerCase() === requiredLink.label.toLowerCase())) {
        merged.push(requiredLink);
      }
    });

    return merged;
  }, [data?.footer.links]);

  const resolveFooterLink = (url: string, label: string) => {
    if (url.startsWith("http")) return url;

    const normalized = `${label} ${url}`.toLowerCase();
    if (normalized.includes("privacy")) return appRoutes.privacy;
    if (normalized.includes("term")) return appRoutes.terms;
    if (normalized.includes("contact") || normalized.includes("touch")) return appRoutes.contact;

    return url || appRoutes.dashboard;
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay: 0.2 }}
      className="border-t border-[#e0dcd4] pb-4 pt-8 text-center"
    >
      <p className="mb-3 text-[11px] text-[#7c9192]">
        {data?.footer.copyrightText || "© 2026 YourBeep. Scientific Precision."}
      </p>
      <p className="mx-auto mb-4 max-w-2xl text-xs leading-6 text-[#95a6a6]">
        {data?.footer.tagline || "Clarity, presence, and sustainable inner work."}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-6">
        {footerLinks.map((link) => {
          const resolvedUrl = resolveFooterLink(link.url, link.label);
          const isExternal = resolvedUrl.startsWith("http");

          return isExternal ? (
            <a
              key={`${link.label}-${resolvedUrl}`}
              href={resolvedUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-[#7c9192] transition-colors hover:text-[#2a6878]"
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={`${link.label}-${resolvedUrl}`}
              to={resolvedUrl}
              className="text-[11px] text-[#7c9192] transition-colors hover:text-[#2a6878]"
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </motion.footer>
  );
};

export default MainFooter;

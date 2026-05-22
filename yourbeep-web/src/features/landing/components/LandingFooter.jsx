import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { fetchPlatformSettings } from "@store/slices/settings";
import { useAppDispatch, useAppSelector } from "@store";
import { appRoutes } from "@constants/routes";

const navLinks = [
  { label: "Home", href: appRoutes.home, internal: true },
  { label: "Courses", href: "#courses", internal: false },
  { label: "Contact", href: appRoutes.contact, internal: true },
];

const pageLinks = [
  { label: "Refund Policy", href: appRoutes.refund, internal: true },
  { label: "Privacy Policy", href: appRoutes.privacy, internal: true },
  { label: "Terms & Conditions", href: appRoutes.terms, internal: true },
];

const fallbackSocialLinks = [
  { name: "Twitter", icon: FaTwitter, url: "https://twitter.com" },
  { name: "LinkedIn", icon: FaLinkedinIn, url: "https://linkedin.com" },
  { name: "Instagram", icon: FaInstagram, url: "https://instagram.com" },
  { name: "YouTube", icon: FaYoutube, url: "https://youtube.com" },
];

const socialIconMap = {
  x: { name: "Twitter", icon: FaTwitter },
  twitter: { name: "Twitter", icon: FaTwitter },
  linkedin: { name: "LinkedIn", icon: FaLinkedinIn },
  instagram: { name: "Instagram", icon: FaInstagram },
  youtube: { name: "YouTube", icon: FaYoutube },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const FooterNavLink = ({ href, label, internal = false }) => {
  const className = "text-sm text-[#888] transition hover:text-[#1a1a1a]";

  if (internal) {
    return (
      <Link to={href} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {label}
    </a>
  );
};

const LandingFooter = () => {
  const dispatch = useAppDispatch();
  const platformName = useAppSelector(
    (state) => state.settings.data?.platformName?.trim() || "yourbeep",
  );
  const socialLinksFromSettings = useAppSelector(
    (state) => state.settings.data?.socialLinks,
  );

  useEffect(() => {
    dispatch(fetchPlatformSettings());
  }, [dispatch]);

  const socialLinks = useMemo(() => {
    if (!socialLinksFromSettings) return fallbackSocialLinks;

    const resolved = Object.entries(socialLinksFromSettings)
      .filter(([, url]) => Boolean(url))
      .map(([key, url]) => {
        const config = socialIconMap[key.toLowerCase()];
        if (!config || !url) return null;
        return { ...config, url };
      })
      .filter(Boolean);

    return resolved.length ? resolved : fallbackSocialLinks;
  }, [socialLinksFromSettings]);

  return (
    <footer className="border-t border-[#f0f0f0] bg-white">
      <motion.div
        className="w-full px-4 py-12 md:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="mx-auto w-full max-w-[1320px]">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.6fr]">
            <motion.div variants={itemVariants}>
              <img
                src="/media/app_logo/app_logo.png"
                alt={`${platformName} logo`}
                className="h-12 w-auto"
              />

              <p className="mt-4 max-w-[240px] text-sm leading-6 text-[#888]">
                Empowering learners worldwide with engaging courses and
                interactive games.
              </p>

              <div className="mt-4 flex items-center gap-2.5">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.93 }}
                      aria-label={social.name}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e8e8e8] bg-[#f7f7f7] text-[#555] transition-all duration-200 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white"
                    >
                      <Icon size={13} />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h4 className="text-sm font-semibold text-[#1a1a1a]">
                Navigation
              </h4>
              <ul className="mt-5 space-y-3">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <FooterNavLink
                      href={link.href}
                      label={link.label}
                      internal={link.internal}
                    />
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h4 className="text-sm font-semibold text-[#1a1a1a]">Policies</h4>
              <ul className="mt-5 space-y-3">
                {pageLinks.map((link) => (
                  <li key={link.label}>
                    <FooterNavLink
                      href={link.href}
                      label={link.label}
                      internal={link.internal}
                    />
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h4 className="text-sm font-semibold text-[#1a1a1a]">
                Get the App
              </h4>
              <p className="mt-2 text-sm leading-6 text-[#888]">
                Learn on the go, available on iOS and Android.
              </p>

              <div className="mt-5 flex flex-row gap-2.5">
                <a
                  href="#"
                  className="group inline-flex w-fit items-center gap-3 rounded-xl border border-[#e2e2e2] bg-[#fafafa] px-4 py-2.5 transition-all duration-200 hover:border-[#1a1a1a] hover:bg-[#1a1a1a]"
                >
                  <Play
                    size={16}
                    fill="currentColor"
                    className="text-[#1a1a1a] transition group-hover:text-white"
                  />
                  <div>
                    <p className="text-[9.5px] uppercase tracking-[0.12em] text-[#aaa] transition group-hover:text-[#888]">
                      Get it on
                    </p>
                    <p className="text-[13px] font-semibold leading-tight text-[#1a1a1a] transition group-hover:text-white">
                      Google Play
                    </p>
                  </div>
                </a>

                <a
                  href="#"
                  className="group inline-flex w-fit items-center gap-3 rounded-xl border border-[#e2e2e2] bg-[#fafafa] px-4 py-2.5 transition-all duration-200 hover:border-[#1a1a1a] hover:bg-[#1a1a1a]"
                >
                  <img
                    src="/media/landing/icons/apple-logo.png"
                    alt="Apple"
                    className="h-[17px] w-[17px] object-contain transition duration-200 group-hover:brightness-0 group-hover:invert"
                  />
                  <div>
                    <p className="text-[9.5px] uppercase tracking-[0.12em] text-[#aaa] transition group-hover:text-[#888]">
                      Download on the
                    </p>
                    <p className="text-[13px] font-semibold leading-tight text-[#1a1a1a] transition group-hover:text-white">
                      App Store
                    </p>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 flex flex-col gap-2 border-t border-[#f0f0f0] pt-6 text-xs text-[#bbb] sm:flex-row sm:items-center sm:justify-between"
            variants={itemVariants}
          >
            <p>
              © 2026{" "}
              <strong className="font-semibold text-[#7e8683]">
                {platformName.toLowerCase()}
              </strong>
              . All rights reserved.
            </p>
            <p className="flex items-center gap-1.5 text-[#9aa3a0]">
              <img
                src="/media/landing/icons/thunder.png"
                alt="Techonika thunder icon"
                className="h-3 w-3 object-contain"
              />
              <span>
                Powered by{" "}
                <a
                  href="https://techonika.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#60706d] transition hover:text-[#1a1a1a]"
                >
                  Techonika
                </a>
              </span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
};

export default LandingFooter;

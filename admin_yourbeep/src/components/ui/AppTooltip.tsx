import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";

type AppTooltipProps = {
  content: ReactNode;
  children: ReactNode;
  className?: string;
};

export function AppTooltip({
  content,
  children,
  className = "",
}: AppTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`relative inline-flex ${className}`.trim()}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-[calc(100%+10px)] z-30 min-w-[220px] -translate-x-1/2 rounded-2xl border border-[#d9e4d5] bg-white px-3 py-2 text-xs leading-5 text-[#475467] shadow-[0_18px_42px_rgba(17,24,39,0.12)]"
          >
            {content}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

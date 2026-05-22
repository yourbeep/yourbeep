import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type DropdownOption = {
  label: string;
  value: string;
};

type AnimatedDropdownProps = {
  name: string;
  options: DropdownOption[];
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  label?: string;
  /** Optional icon shown before the selected label inside the trigger (e.g. lucide icon). */
  headIcon?: ReactNode;
  className?: string;
  onChange?: (value: string) => void;
};

export function AnimatedDropdown({
  name,
  options,
  defaultValue,
  value,
  placeholder = "Select…",
  label,
  headIcon,
  className = "",
  onChange,
}: AnimatedDropdownProps) {
  const isControlled = value !== undefined;
  const [open, setOpen] = useState(false);
  const [uncontrolledSelected, setUncontrolledSelected] =
    useState<DropdownOption | null>(
      options.find((o) => o.value === defaultValue) ?? null,
    );
  const ref = useRef<HTMLDivElement>(null);

  const selected = isControlled
    ? (options.find((o) => o.value === value) ?? null)
    : uncontrolledSelected;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pick = (opt: DropdownOption) => {
    if (!isControlled) {
      setUncontrolledSelected(opt);
    }
    setOpen(false);
    onChange?.(opt.value);
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      {label && (
        <span className="mb-2 block text-[11px] font-semibold text-[#475467]">
          {label}
        </span>
      )}

      {/* Trigger */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((o) => !o)}
        className={`flex h-11 w-full items-center justify-between gap-2.5 rounded-xl border px-3.5 text-left text-sm outline-none transition-colors ${
          open
            ? "border-[#0d6e6e] bg-white ring-2 ring-[rgba(13,110,110,0.14)]"
            : "border-[#dfe8d6] bg-[#fbfcf8] hover:border-[#8fb4a0]"
        }`}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {headIcon ? (
            <span className="shrink-0 text-[#7b8a74] [&_svg]:block">
              {headIcon}
            </span>
          ) : null}
          <span
            className={`truncate ${
              selected ? "text-[#203321]" : "text-[#91a08d]"
            }`}
          >
            {selected ? selected.label : placeholder}
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="shrink-0 text-[#7b8a74]"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 4L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.9, y: -6 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0.93, y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{ transformOrigin: "top center" }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-[#dfe8d6] bg-white p-1.5 shadow-xl shadow-[#cfd8cc]/60"
          >
            {options.map((opt, i) => {
              const isSel = selected?.value === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  type="button"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.015, duration: 0.16 }}
                  onClick={() => pick(opt)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    isSel
                      ? "bg-[#edf7ef] font-medium text-[#2f6e3e]"
                      : "text-[#475467] hover:bg-[#f6faf5]"
                  }`}
                >
                  {opt.label}
                  {isSel && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 20,
                      }}
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                    >
                      <path
                        d="M2 6.5L5 9.5L11 3.5"
                        stroke="#2f6e3e"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <input
        type="hidden"
        name={name}
        value={(isControlled ? value : selected?.value) ?? ""}
      />
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as Label from "@radix-ui/react-label";

type TimePickerProps = {
  label?: string;
  name: string;
  defaultValue?: string;
  intervalMinutes?: number;
  className?: string;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

const buildTimeOptions = (interval: number) => {
  const items: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += interval) {
      items.push(`${pad2(h)}:${pad2(m)}`);
    }
  }
  return items;
};

const to12 = (val: string) => {
  const [h, m] = val.split(":").map(Number);
  const ap = h < 12 ? "AM" : "PM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return { display: `${pad2(h12)}:${pad2(m)}`, ap };
};

export function TimePicker({
  label,
  name,
  defaultValue = "09:00",
  intervalMinutes = 30,
  className = "",
}: TimePickerProps) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const options = useMemo(
    () => buildTimeOptions(intervalMinutes),
    [intervalMinutes],
  );
  const { display, ap } = to12(value);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Scroll selected into view when opening
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        listRef.current
          ?.querySelector("[data-selected=true]")
          ?.scrollIntoView({ block: "center" });
      }, 50);
    }
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={ref}>
      {label && (
        <Label.Root className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </Label.Root>
      )}

      {/* Trigger */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((o) => !o)}
        className={`flex h-11 w-full items-center justify-between rounded-xl border px-3 text-left text-[13px] font-medium outline-none transition-colors ${
          open
            ? "border-blue-400 bg-white ring-2 ring-blue-100"
            : "border-slate-200 bg-slate-50 hover:border-blue-300"
        } text-slate-800`}
      >
        <span className="font-mono">
          {display}
          <span className="ml-1.5 text-[10px] font-semibold tracking-wider text-slate-400">
            {ap}
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="text-slate-400"
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

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.9, y: -6 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0.92, y: -4 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            style={{ transformOrigin: "top center" }}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60"
          >
            <div ref={listRef} className="max-h-52 overflow-y-auto p-1.5">
              {options.map((opt, i) => {
                const { display: d, ap: a } = to12(opt);
                const selected = opt === value;
                return (
                  <motion.button
                    key={opt}
                    type="button"
                    data-selected={selected}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.012, duration: 0.18 }}
                    onClick={() => {
                      setValue(opt);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors ${
                      selected
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {selected && (
                      <motion.span
                        layoutId="time-dot"
                        className="h-1.5 w-1.5 rounded-full bg-blue-500"
                      />
                    )}
                    <span
                      className={`font-mono text-[12px] font-medium ${!selected ? "ml-3.5" : ""}`}
                    >
                      {d}
                    </span>
                    <span className="text-[10px] font-semibold tracking-wider text-slate-400">
                      {a}
                    </span>
                  </motion.button>
                );
              })}
            </div>
            <div className="border-t border-slate-100">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input type="hidden" name={name} value={value} />
    </div>
  );
}

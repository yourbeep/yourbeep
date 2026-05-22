import { motion } from "framer-motion";

type SegmentOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentToggleProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: SegmentOption<T>[];
  className?: string;
};

export function SegmentToggle<T extends string>({
  value,
  onChange,
  options,
  className = "",
}: SegmentToggleProps<T>) {
  return (
    <div
      className={`inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-soft)]/70 p-1 ${className}`.trim()}
    >
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className="relative min-w-[140px] rounded-full px-4 py-2.5 text-sm font-semibold transition"
          >
            {active ? (
              <motion.span
                layoutId="segment-toggle-pill"
                className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,var(--primary)_0%,var(--primary-strong)_100%)] shadow-[0_10px_22px_rgba(39,107,115,0.22)]"
                transition={{ type: "spring", stiffness: 360, damping: 28 }}
              />
            ) : null}
            <span
              className={`relative z-[1] ${active ? "text-white" : "text-[var(--muted)]"}`}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default SegmentToggle;

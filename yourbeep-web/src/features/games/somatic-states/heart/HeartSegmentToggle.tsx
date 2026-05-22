import { motion } from "framer-motion";

type SegmentOption<T extends string> = {
  value: T;
  label: string;
};

type HeartSegmentToggleProps<T extends string> = {
  value: T;
  options: ReadonlyArray<SegmentOption<T>>;
  onChange: (value: T) => void;
  layoutId: string;
  className?: string;
};

export default function HeartSegmentToggle<T extends string>({
  value,
  options,
  onChange,
  layoutId,
  className = "",
}: HeartSegmentToggleProps<T>) {
  return (
    <div
      className={`inline-flex rounded-full bg-[#eceae4] p-1 ${className}`}
      role="group"
    >
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`relative min-w-[4.5rem] rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
              active ? "text-white" : "text-[#7a8582] hover:text-[var(--text)]"
            }`}
          >
            {active ? (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-[#1a3c4a] shadow-[0_6px_16px_rgba(26,60,74,0.22)]"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            ) : null}
            <span className="relative z-[1]">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

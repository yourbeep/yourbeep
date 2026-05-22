import { motion } from "framer-motion";
import { useId, useState, type ReactNode } from "react";

type SegmentToggleItem<T extends string> = {
  label: ReactNode;
  value: T;
};

type SegmentToggleProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  items: Array<SegmentToggleItem<T>>;
  className?: string;
  /** Optional id fragment so multiple toggles on one page get distinct motion layout ids. */
  motionId?: string;
  size?: "sm" | "md";
};

export function SegmentToggle<T extends string>({
  value,
  onChange,
  items,
  className = "",
  motionId,
  size = "sm",
}: SegmentToggleProps<T>) {
  const reactId = useId();
  const layoutId = `segment-toggle-${motionId ?? reactId.replace(/:/g, "")}`;

  const sizeClasses =
    size === "sm"
      ? "min-h-7 px-3 text-[11px]"
      : "min-h-8 px-3.5 text-xs";

  return (
    <div
      className={`relative flex w-full rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm ${className}`}
      role="group"
    >
      {items.map((item) => {
        const pressed = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={pressed}
            className={`relative z-10 flex flex-1 items-center justify-center ${sizeClasses} font-semibold capitalize outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]/25 ${
              pressed ? "text-white" : "text-slate-500 hover:text-slate-800"
            }`}
            onClick={() => onChange(item.value)}
          >
            {pressed ? (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 -z-10 rounded-md bg-[var(--primary)] shadow-sm"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            ) : null}
            <span className="relative z-10 flex items-center justify-center gap-1">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export type FormSegmentItem = {
  label: string;
  value: string;
};

type FormSegmentToggleProps = {
  name: string;
  items: Array<FormSegmentItem>;
  active?: string;
};

function FormSegmentToggleInner({
  name,
  items,
  initial,
}: FormSegmentToggleProps & { initial: string }) {
  const [current, setCurrent] = useState(initial);

  return (
    <>
      <input type="hidden" name={name} value={current} />
      <SegmentToggle
        value={current}
        onChange={setCurrent}
        items={items.map((item) => ({
          label: item.label,
          value: item.value,
        }))}
        motionId={name}
      />
    </>
  );
}

/** Hidden input + {@link SegmentToggle} for HTML form POST. */
export function FormSegmentToggle({
  name,
  items,
  active,
}: FormSegmentToggleProps) {
  const initial = active ?? items[0]?.value ?? "";
  return (
    <FormSegmentToggleInner
      key={initial}
      name={name}
      items={items}
      initial={initial}
    />
  );
}

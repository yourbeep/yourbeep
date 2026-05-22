import { motion } from "framer-motion";
import StatusPill from "@components/ui/StatusPill";
import {
  getSomaticSensationOptions,
  somaticRegionMeta,
  type SomaticRegionKey,
} from "../services/somaticConfig";

type SomaticSensationPickerProps = {
  region: SomaticRegionKey | null;
  sensation: string;
  onSelectSensation: (value: string) => void;
};

export function SomaticSensationPicker({
  region,
  sensation,
  onSelectSensation,
}: SomaticSensationPickerProps) {
  if (!region) {
    return (
      <div className="rounded-[28px] border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-6">
        <p className="text-sm font-medium text-[var(--text)]">
          Start with the body.
        </p>
        <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
          Tap the 3D model to choose the part of the body that feels most active,
          then we&apos;ll suggest the matching sensations and practices.
        </p>
      </div>
    );
  }

  const meta = somaticRegionMeta[region];
  const sensations = getSomaticSensationOptions(region);

  return (
    <motion.div
      key={region}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[0_18px_44px_rgba(36,72,66,0.06)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-[480px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            {meta.eyebrow}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-[var(--text)]">
            {meta.label}
          </h3>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
            {meta.description}
          </p>
        </div>
        <StatusPill tone="primary" dot>
          {sensations.length} sensation pathways
        </StatusPill>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {sensations.map((option) => {
          const selected = option.value === sensation;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelectSensation(option.value)}
              className={`rounded-[22px] border px-4 py-4 text-left transition duration-200 ${
                selected
                  ? "border-[var(--primary)] bg-[var(--primary-soft)] shadow-[0_12px_28px_rgba(39,107,115,0.12)]"
                  : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] hover:bg-[#f1f7f4]"
              }`}
            >
              <p className="text-sm font-semibold text-[var(--text)]">
                {option.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default SomaticSensationPicker;

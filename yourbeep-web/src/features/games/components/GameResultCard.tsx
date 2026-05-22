import { motion } from "framer-motion";
import StatusPill from "@components/ui/StatusPill";

type GameResultCardProps = {
  result: Record<string, unknown> | null;
};

const renderEntries = (value: Record<string, unknown>) =>
  Object.entries(value)
    .slice(0, 8)
    .map(([key, entry]) => ({
      key,
      value:
        entry == null
          ? "Not available"
          : typeof entry === "object"
            ? JSON.stringify(entry, null, 2)
            : String(entry),
      complex: typeof entry === "object" && entry !== null,
    }));

const GameResultCard = ({ result }: GameResultCardProps) => {
  if (!result) {
    return (
      <div className="rounded-[28px] border border-dashed border-[#d7dfdc] bg-white/80 p-6 text-sm leading-7 text-[#647474] shadow-[0_12px_24px_rgba(17,24,39,0.04)]">
        Complete the activity to generate your latest reflective result here.
      </div>
    );
  }

  const entries = renderEntries(result);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="rounded-[28px] border border-[rgba(39,107,115,0.08)] bg-white p-6 shadow-[0_16px_36px_rgba(17,24,39,0.06)]"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7b8e8f]">
            Latest result snapshot
          </p>
          <h3 className="mt-2 text-[1.2rem] font-semibold text-[#20363b]">
            Your newest reflection, captured clearly
          </h3>
        </div>
        <StatusPill tone="primary">Saved</StatusPill>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <div
            key={entry.key}
            className="rounded-[22px] border border-[#eef2ef] bg-[#f8faf9] p-4"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#587073]">
              {entry.key.replaceAll("_", " ")}
            </p>
            {entry.complex ? (
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs leading-6 text-[#31484b]">
                {entry.value}
              </pre>
            ) : (
              <p className="mt-2 text-sm leading-7 text-[#31484b]">{entry.value}</p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default GameResultCard;

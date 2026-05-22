import { motion } from "framer-motion";
import StatusPill from "@components/ui/StatusPill";

type DeepMetricsPanelProps = {
  coherencePercent: number;
  restorationPercent: number;
};

const DeepMetricsPanel = ({
  coherencePercent,
  restorationPercent,
}: DeepMetricsPanelProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.1 }}
    >
      <div className="mb-5 flex items-center gap-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2a6878"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 9h6v6H9z" />
        </svg>
        <h3 className="text-[24px] font-bold text-[#1a2e38]">Deep Metrics</h3>
        <StatusPill tone="primary">Live</StatusPill>
      </div>

      <div
        className="mb-5 rounded-2xl bg-white p-7"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
      >
        <div className="mb-1 flex items-center justify-between">
          <div>
            <p className="mb-0.5 text-[9px] text-[#8a9a9a]">
              Biological Signal
            </p>
            <h4 className="text-[15px] font-semibold text-[#1a2e38]">
              Coherence Level
            </h4>
          </div>
          <span className="text-[18px] font-bold" style={{ color: "#2a8878" }}>
            {coherencePercent}%
          </span>
        </div>
        <div className="mt-5 flex h-28 items-end gap-2">
          {[30, 35, 40, 55, 85, 75, 60].map((height, index) => (
            <div
              key={index}
              className="flex-1 rounded-t"
              style={{
                height: `${height}%`,
                backgroundColor:
                  index === 4
                    ? "#2a8878"
                    : index === 3 || index === 5
                      ? "#5aaa98"
                      : "#d8e8e0",
              }}
            />
          ))}
        </div>
      </div>

      <div
        className="rounded-2xl bg-white p-7"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="mb-0.5 text-[9px] text-[#8a9a9a]">Pattern Recovery</p>
            <h4 className="text-[15px] font-semibold text-[#1a2e38]">
              Restoration Index
            </h4>
          </div>
          <span className="text-[18px] font-bold" style={{ color: "#2a8878" }}>
            {restorationPercent}%
          </span>
        </div>
        <svg width="100%" height="112" viewBox="0 0 300 80" fill="none">
          <path
            d="M0 50 Q40 40 70 45 T130 30 T190 20 T240 38 T300 28"
            stroke="#2a8878"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="300" cy="28" r="4" fill="#2a8878" />
        </svg>
      </div>
    </motion.section>
  );
};

export default DeepMetricsPanel;

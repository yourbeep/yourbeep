import { motion } from "framer-motion";
import StatusPill from "@components/ui/StatusPill";

type MorningStateCardProps = {
  name: string;
  userLevel: number;
  nextLevelXp: number;
  totalXp: number;
  progressPercent: number;
  observationMinutes: number;
  reflectionMinutes: number;
  observationTrend: number;
  reflectionTrend: number;
};

const trendLabel = (value: number) => {
  if (value > 0) return `Up ${Math.round(value)}%`;
  if (value < 0) return `Down ${Math.abs(Math.round(value))}%`;
  return "Baseline";
};

const MorningStateCard = ({
  name,
  userLevel,
  nextLevelXp,
  totalXp,
  progressPercent,
  observationMinutes,
  reflectionMinutes,
  observationTrend,
  reflectionTrend,
}: MorningStateCardProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.05 }}
    >
      <h3 className="mb-5 text-[24px] font-bold text-[#1a2e38]">
        Morning State
      </h3>

      <div className="mb-5 rounded-2xl border border-[#e7ece9] bg-white p-7 shadow-sm">
        <h4 className="mb-5 text-[14px] font-semibold text-[#1a2e38]">
          Current State
        </h4>

        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="mb-0.5 text-[10px] text-[#8a9a9a]">User Level</p>

            <p className="text-[34px] font-bold text-[#2a6878]">
              {String(userLevel).padStart(2, "0")}
            </p>
          </div>

          <div className="text-right">
            <p className="mb-0.5 text-[10px] text-[#8a9a9a]">Points Earned</p>

            <p className="text-[34px] font-bold text-[#2a6878]">{totalXp}</p>
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-[11px] text-[#5a7a7a]">
              Progress to {nextLevelXp > 0 ? `${nextLevelXp} XP` : "next level"}
            </p>

            <StatusPill tone="success">Growth</StatusPill>
          </div>

          <div className="h-2 w-full rounded-full bg-[#edf2ef]">
            <div
              className="h-full rounded-full bg-[#2a6878] transition-all duration-500"
              style={{
                width: `${Math.max(0, Math.min(progressPercent, 100))}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#e7ece9] bg-white p-5 shadow-sm">
          <p className="mb-1 text-[10px] text-[#8a9a9a]">Sensing Time</p>

          <p className="mb-2 text-[28px] font-bold text-[#1a2e38]">
            {observationMinutes}{" "}
            <span className="text-[13px] font-normal text-[#8a9a9a]">min</span>
          </p>

          <StatusPill tone={observationTrend >= 0 ? "success" : "warning"}>
            {trendLabel(observationTrend)}
          </StatusPill>
        </div>

        <div className="rounded-2xl border border-[#e7ece9] bg-white p-5 shadow-sm">
          <p className="mb-1 text-[10px] text-[#8a9a9a]">Reflection Time</p>

          <p className="mb-2 text-[28px] font-bold text-[#1a2e38]">
            {reflectionMinutes}{" "}
            <span className="text-[13px] font-normal text-[#8a9a9a]">min</span>
          </p>

          <StatusPill tone={reflectionTrend >= 0 ? "success" : "warning"}>
            {trendLabel(reflectionTrend)}
          </StatusPill>
        </div>
      </div>
    </motion.section>
  );
};

export default MorningStateCard;

import { motion } from "framer-motion";
import { Clock3 } from "lucide-react";

type HandsLegsTimerCardProps = {
  instruction: string;
  remaining: number;
  progress: number;
  className?: string;
};

export default function HandsLegsTimerCard({
  instruction,
  remaining,
  progress,
  className = "",
}: HandsLegsTimerCardProps) {
  return (
    <div
      className={`rounded-[1.35rem] border border-[#e8ecea] bg-white px-6 py-7 shadow-[0_14px_36px_rgba(36,72,66,0.08)] ${className}`}
    >
      <p className="text-center text-sm leading-7 text-[#5a6b6f]">{instruction}</p>
      <div className="mt-6 flex items-center justify-center gap-2">
        <Clock3 size={17} className="text-[#8a9491]" strokeWidth={2} />
        <span className="text-[1.35rem] font-bold tabular-nums tracking-tight text-[#1a3c4a]">
          {String(Math.floor(remaining / 60)).padStart(2, "0")}:
          {String(remaining % 60).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-5 h-1 overflow-hidden rounded-full bg-[#eceae4]">
        <motion.div
          className="h-full rounded-full bg-[#5cb1e5]"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.25 }}
        />
      </div>
    </div>
  );
}

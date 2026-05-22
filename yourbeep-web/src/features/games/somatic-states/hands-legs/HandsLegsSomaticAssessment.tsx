import { motion } from "framer-motion";
import {
  AlertTriangle,
  Anchor,
  Check,
  Droplets,
  Flame,
  Flower2,
  PartyPopper,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type HandsLegsSomaticAssessmentProps = {
  selected: string;
  onSelect: (value: string) => void;
};

type SensationCard = {
  value: string;
  title: string;
  icon: LucideIcon;
  iconColor: string;
  bg: string;
  titleColor?: string;
};

const sensations: readonly SensationCard[] = [
  { value: "calm", title: "Calm", icon: PartyPopper, iconColor: "#e879a9", bg: "#ffd6d6" },
  { value: "springy", title: "Springy", icon: AlertTriangle, iconColor: "#d97706", bg: "#ffebd6" },
  { value: "braced", title: "Braced", icon: Flame, iconColor: "#c2410c", bg: "#ffc7a8" },
  { value: "sluggish", title: "Sluggish", icon: Droplets, iconColor: "#78716c", bg: "#ffe9c7" },
  { value: "contracted", title: "Contracted", icon: Flower2, iconColor: "#4d7c0f", bg: "#e9f5d8" },
  {
    value: "fidgety",
    title: "Stuck & rigid",
    icon: Anchor,
    iconColor: "#e11d48",
    bg: "#ffd6e8",
    titleColor: "#e11d48",
  },
];

export default function HandsLegsSomaticAssessment({
  selected,
  onSelect,
}: HandsLegsSomaticAssessmentProps) {
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
      {sensations.map((item, index) => {
        const Icon = item.icon;
        const isActive = selected === item.value;

        return (
          <motion.button
            key={item.value}
            type="button"
            onClick={() => onSelect(item.value)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.22 }}
            whileHover={{ y: -2 }}
            className={`relative flex aspect-[1.05/1] min-h-[8.25rem] flex-col items-center justify-center rounded-[1.4rem] px-3 py-5 transition sm:min-h-[9rem] ${
              isActive
                ? "border-[3px] border-[#1a3c4a]"
                : "border-[3px] border-transparent hover:brightness-[0.99]"
            }`}
            style={{ backgroundColor: item.bg }}
          >
            {isActive ? (
              <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#1a3c4a] text-white">
                <Check size={13} strokeWidth={3} />
              </span>
            ) : null}

            <div
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/60"
              style={{ color: item.iconColor }}
            >
              <Icon size={24} strokeWidth={1.75} />
            </div>
            <p
              className="mt-3.5 text-sm font-bold sm:text-[0.95rem]"
              style={{ color: item.titleColor ?? "#1a2e35" }}
            >
              {item.title}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}

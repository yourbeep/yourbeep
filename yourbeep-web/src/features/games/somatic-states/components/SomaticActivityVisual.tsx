import { motion } from "framer-motion";
import type { SomaticActivityDetail } from "../../services/gameExperienceTypes";

type SomaticActivityVisualProps = {
  activity: SomaticActivityDetail;
  elapsedSeconds: number;
  isPlaying: boolean;
};

const BREATH_CYCLE = 8;

export function SomaticActivityVisual({
  activity,
  elapsedSeconds,
  isPlaying,
}: SomaticActivityVisualProps) {
  const progress = activity.durationSeconds
    ? Math.min(elapsedSeconds / activity.durationSeconds, 1)
    : 0;

  const breathPhase = (elapsedSeconds % BREATH_CYCLE) / BREATH_CYCLE;
  const normalizedBreath = breathPhase < 0.5 ? breathPhase * 2 : (1 - breathPhase) * 2;

  const sharedShell =
    "relative overflow-hidden rounded-[32px] border border-[rgba(39,107,115,0.12)] bg-[radial-gradient(circle_at_top,_rgba(224,237,232,0.95)_0%,_rgba(244,247,241,1)_68%)] shadow-[0_22px_48px_rgba(36,72,66,0.08)]";

  if (activity.ui.animationType === "breath_wave") {
    return (
      <div className={`${sharedShell} flex h-[360px] items-center justify-center`}>
        <motion.div
          animate={{
            scale: isPlaying ? 1 + normalizedBreath * 0.45 : 1,
            opacity: isPlaying ? 0.72 + normalizedBreath * 0.18 : 0.78,
          }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="absolute h-56 w-56 rounded-full bg-[radial-gradient(circle,_rgba(86,170,160,0.65)_0%,_rgba(86,170,160,0.12)_70%,_rgba(86,170,160,0)_100%)] blur-[2px]"
        />
        <motion.div
          animate={{
            scale: isPlaying ? 0.92 + normalizedBreath * 0.18 : 0.96,
          }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="relative h-40 w-40 rounded-full border border-white/80 bg-white/85 shadow-[0_22px_42px_rgba(36,72,66,0.12)]"
        >
          <div className="absolute inset-5 rounded-full border border-[rgba(39,107,115,0.1)]" />
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#547172]">
                {breathPhase < 0.5 ? "Inhale" : "Exhale"}
              </p>
              <p className="mt-2 text-2xl font-semibold text-[#1d3940]">
                {Math.round(progress * 100)}%
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (activity.ui.animationType === "focus_rings") {
    return (
      <div className={`${sharedShell} flex h-[360px] items-center justify-center`}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{
              scale: isPlaying ? [0.86, 1.18, 1.42] : 1,
              opacity: isPlaying ? [0.6, 0.26, 0.08] : 0.18,
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeOut",
              delay: index * 0.45,
            }}
            className="absolute rounded-full border border-[#67b9ac]/50"
            style={{
              width: `${140 + index * 56}px`,
              height: `${140 + index * 56}px`,
            }}
          />
        ))}
        <div className="relative rounded-full border border-white/80 bg-white/92 px-8 py-6 text-center shadow-[0_18px_42px_rgba(36,72,66,0.12)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#547172]">
            Orient
          </p>
          <p className="mt-2 text-lg font-semibold text-[#1d3940]">
            Notice 3 things you can see.
          </p>
        </div>
      </div>
    );
  }

  if (activity.ui.animationType === "pulse_dots") {
    return (
      <div className={`${sharedShell} flex h-[360px] items-center justify-center`}>
        <div className="grid grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, index) => (
            <motion.span
              key={index}
              animate={{
                scale: isPlaying ? [0.8, 1.18, 0.92] : 1,
                opacity: isPlaying ? [0.28, 1, 0.42] : 0.4,
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.08,
              }}
              className="h-6 w-6 rounded-full bg-[linear-gradient(135deg,#4aa59a_0%,#89d7c9_100%)] shadow-[0_0_22px_rgba(74,165,154,0.28)]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (activity.ui.animationType === "sway") {
    return (
      <div className={`${sharedShell} flex h-[360px] items-center justify-center`}>
        <motion.div
          animate={{
            rotate: isPlaying ? [-8, 8, -8] : 0,
            y: isPlaying ? [0, -4, 0] : 0,
          }}
          transition={{
            duration: 3.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative h-52 w-20 rounded-full bg-[linear-gradient(180deg,#7dc3b8_0%,#3f7b7f_100%)] shadow-[0_24px_40px_rgba(39,107,115,0.22)]"
        >
          <div className="absolute -left-16 top-16 h-3 w-20 rounded-full bg-[#8ab9b1]/60" />
          <div className="absolute right-[-64px] top-28 h-3 w-20 rounded-full bg-[#8ab9b1]/60" />
        </motion.div>
      </div>
    );
  }

  if (activity.ui.animationType === "bars") {
    return (
      <div className={`${sharedShell} flex h-[360px] items-end justify-center gap-4 px-8 pb-10`}>
        {[0.38, 0.64, 0.5, 0.76, 0.58].map((height, index) => (
          <motion.div
            key={index}
            animate={{
              height: isPlaying ? [`${height * 45}%`, `${height * 100}%`, `${height * 62}%`] : `${height * 72}%`,
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.12,
            }}
            className="w-10 rounded-t-[22px] bg-[linear-gradient(180deg,#7ecabc_0%,#3d767d_100%)] shadow-[0_10px_24px_rgba(36,72,66,0.12)]"
          />
        ))}
      </div>
    );
  }

  if (activity.ui.animationType === "toggle_scale") {
    return (
      <div className={`${sharedShell} flex h-[360px] items-center justify-center`}>
        <div className="relative w-[320px]">
          <div className="h-2 rounded-full bg-[#d5e4dd]" />
          <motion.div
            animate={{
              left: isPlaying ? ["8%", "68%", "42%"] : "42%",
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-[linear-gradient(135deg,#4aa59a_0%,#91d8cc_100%)] shadow-[0_12px_24px_rgba(39,107,115,0.24)]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`${sharedShell} flex h-[360px] items-center justify-center`}>
      <motion.div
        animate={{
          scale: isPlaying ? [0.98, 1.08, 0.98] : 1,
          opacity: isPlaying ? [0.7, 1, 0.7] : 0.9,
        }}
        transition={{ duration: 2.2, repeat: Infinity }}
        className="rounded-[28px] border border-white/75 bg-white/92 px-8 py-6 text-center shadow-[0_18px_42px_rgba(36,72,66,0.12)]"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#547172]">
          Guided practice
        </p>
        <p className="mt-2 text-lg font-semibold text-[#1d3940]">
          Follow the instruction and stay with the sensation.
        </p>
      </motion.div>
    </div>
  );
}

export default SomaticActivityVisual;

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const HERO_IMAGE = "/Copilot_20260507_190808.png";

const COLLAGE_TOTAL_COLUMNS = 4.1;
const COLLAGE_TOTAL_ROWS = 3;

const getSharedCollageSliceStyle = (x, y, width, height) => {
  const horizontalTravel = COLLAGE_TOTAL_COLUMNS - width;
  const verticalTravel = COLLAGE_TOTAL_ROWS - height;

  return {
    backgroundImage: `url('${HERO_IMAGE}')`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${(COLLAGE_TOTAL_COLUMNS / width) * 100}% ${
      (COLLAGE_TOTAL_ROWS / height) * 100
    }%`,
    backgroundPosition: `${
      horizontalTravel <= 0 ? 50 : (x / horizontalTravel) * 100
    }% ${verticalTravel <= 0 ? 50 : (y / verticalTravel) * 100}%`,
  };
};

const letterVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Word = ({
  text,
  startDelay = 0,
  size = "clamp(88px, 10.4vw, 150px)",
  scaleX = 0.94,
  backgroundStyle,
}) => {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden leading-none"
      style={{ scaleX, transformOrigin: "center center" }}
    >
      {text.split("").map((letter, index) => (
        <motion.span
          key={`${text}-${letter}-${index}`}
          custom={startDelay + index}
          variants={letterVariants}
          initial="hidden"
          animate="visible"
          className="inline-block bg-cover scale-y-[1.18] bg-center font-black leading-none tracking-[0.2em] text-transparent"
          style={{
            fontSize: size,
            lineHeight: 0.82,
            fontFamily: '"Bebas Neue", sans-serif',
            backgroundImage: backgroundStyle?.backgroundImage ?? `url('${HERO_IMAGE}')`,
            backgroundSize: backgroundStyle?.backgroundSize ?? "cover",
            backgroundPosition: backgroundStyle?.backgroundPosition ?? "center",
            backgroundRepeat: backgroundStyle?.backgroundRepeat ?? "no-repeat",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            WebkitTextStroke: "1px rgba(255, 255, 255, 0.18)",
            filter: "drop-shadow(0 8px 18px rgba(0, 0, 0, 0.35))",
          }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 28, scaleY: 0.94 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  }),
};

const HeroCollage = () => {
  const [timeElapsed, setTimeElapsed] = useState(407);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeElapsed((prev) => (prev + 1) % (60 * 60));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="relative grid gap-2.5"
      style={{
        gridTemplateColumns: "1.08fr 1.12fr 1.12fr 1.08fr",
        gridTemplateRows: "1fr 1.15fr 0.52fr",
        height: "700px",
      }}
    >
      <motion.div
        className="relative overflow-hidden"
        style={{ gridColumn: "1 / 2", gridRow: "1 / 3" }}
        custom={2.05}
        variants={gridItemVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className="absolute inset-0"
          style={getSharedCollageSliceStyle(0, 0, 1, 2)}
        />
        <div className="absolute inset-0 bg-[rgba(18,63,76,0.14)]" />

        <motion.div
          className="absolute bottom-10 left-0 right-0 z-[3] max-w-[230px] px-6 text-[18px] font-medium leading-[1.45] text-white/90"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.45)" }}
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 2.65, ease: [0.22, 1, 0.36, 1] }}
        >
          Turn everyday moments into gentle invitations to notice, reflect, and
          respond with intention.
        </motion.div>

        <motion.div
          className="pointer-events-none absolute left-[50%] top-[28%] z-[6] grid h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 place-items-center"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.86, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{
            duration: 0.85,
            delay: 2.25,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.div
            className="absolute inset-[8px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 52%, transparent 72%)",
              filter: "blur(8px)",
            }}
            animate={{ scale: [1, 1.03, 1], opacity: [0.7, 1, 0.7] }}
            transition={{
              scale: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
            }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/media/landing/extra/fluid_img.png')",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "drop-shadow(0 10px 24px rgba(255,255,255,0.18))",
            }}
            animate={{ rotate: 360, scale: [1, 1.02, 1] }}
            transition={{
              rotate: { duration: 16, repeat: Infinity, ease: "linear" },
              scale: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
            }}
          />
          <div
            className="relative z-[2] grid h-[76px] w-[76px] place-items-center rounded-full bg-white text-[16px] font-semibold text-[#30424a]"
            style={{ boxShadow: "0 12px 28px rgba(12, 30, 38, 0.18)" }}
          >
            {formatTime(timeElapsed)}
          </div>
        </motion.div>
      </motion.div>

      <div
        className="relative z-[4] overflow-hidden"
        style={{ gridColumn: "1 / 2", gridRow: "3 / 4" }}
      >
        <Word
          text="FLOW"
          startDelay={3.25}
          size="clamp(120px, 11vw, 190px)"
          scaleX={0.86}
          backgroundStyle={getSharedCollageSliceStyle(0, 2, 1, 0.52)}
        />
      </div>

      {/* second coloum */}
      <motion.div
        className="relative overflow-hidden"
        style={{ gridColumn: "2 / 3", gridRow: "1 / 4" }}
        custom={2.12}
        variants={gridItemVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className="absolute inset-0"
          style={getSharedCollageSliceStyle(1, 0, 1, 3)}
        />
        <div className="absolute inset-0 bg-[rgba(18,63,76,0.18)]" />
      </motion.div>

      {/* third COLUMN */}
      <motion.div
        className="relative overflow-hidden"
        style={{ gridColumn: "3 /4", gridRow: "1 / 4" }}
        custom={2.19}
        variants={gridItemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative z-[4] h-[37.45%] overflow-hidden">
          <Word
            text="RISE"
            startDelay={3.35}
            size="clamp(132px, 11.5vw, 200px)"
            scaleX={0.78}
            backgroundStyle={getSharedCollageSliceStyle(2, 0, 1.1, 1)}
          />
        </div>

        <div className="absolute bottom-0 left-[3.5%] right-[3.5%] top-[37.45%] overflow-hidden">
          <div
            className="absolute inset-0"
            style={getSharedCollageSliceStyle(2, 0, 1.1, 3)}
          />
          <div className="absolute inset-0 bg-[rgba(18,63,76,0.2)]" />

          <div
            className="absolute bottom-10 left-8 right-6 z-[5] max-w-[250px] text-[18px] font-medium leading-[1.38] text-white/90"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.45)" }}
          >
            Through guided learning, reflective prompts, and personalised
            insights, Yourbeep helps you build change from the inside out
          </div>
        </div>
      </motion.div>

      {/* fourth COLUMN */}
      <motion.div
        className="relative overflow-hidden"
        style={{ gridColumn: "4 / 5", gridRow: "1 / 4" }}
        custom={2.4}
        variants={gridItemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute left-[4%] right-[4%] top-0 h-[37.45%] overflow-hidden">
          <div
            className="absolute inset-0"
            style={getSharedCollageSliceStyle(3.1, 0, 1, 1)}
          />
          <div className="absolute inset-0 bg-[rgba(18,63,76,0.14)]" />
        </div>

        <div className="absolute left-[8%] right-[8%] top-[37.45%] h-[43.07%] overflow-hidden">
          <Word
            text="SYNC"
            startDelay={3.55}
            size="clamp(125px, 10.8vw, 190px)"
            scaleX={0.92}
            backgroundStyle={getSharedCollageSliceStyle(3.1, 1, 1, 1)}
          />
        </div>

        <div className="absolute bottom-0 left-[4%] right-[4%] h-[19.48%] overflow-hidden">
          <div
            className="absolute inset-0"
            style={getSharedCollageSliceStyle(3.1, 2, 1, 1)}
          />
          <div className="absolute inset-0 bg-[rgba(18,63,76,0.18)]" />
        </div>
      </motion.div>
    </div>
  );
};

export default HeroCollage;

import { motion } from "framer-motion";
import { appRoutes } from "@constants/routes";
import { useAppSelector } from "@store";
import HeroCollage, { HERO_IMAGE } from "./HeroCollage";
import WhyUsSection from "./Whyussection";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const HeroAndAboutSection = () => {
  const { user, token } = useAppSelector((state) => state.auth);
  const startJourneyHref = user && token ? appRoutes.dashboard : `${appRoutes.auth}?tab=signin`;

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, #0d2f38 0%, #1f5866 8%, #2a7080 50%, #d4e3e3 80%, #ffffff 100%)",
      }}
    >
      <section id="top" className="relative w-full overflow-hidden">
        <motion.div
          className="pointer-events-none fixed inset-0 z-[100]"
          aria-hidden="true"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
          style={{
            backgroundImage: `url('${HERO_IMAGE}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <motion.div
          className="relative w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="w-full overflow-hidden rounded-t-[24px] bg-transparent"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="px-4 py-8 pb-10 md:px-14 md:py-12 md:pb-14">
              <motion.h1
                className="mb-3 max-w-none font-bold leading-tight tracking-tight text-white lg:whitespace-nowrap"
                style={{ fontSize: "clamp(28px, 4vw, 58px)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span className="text-white/90">Gentle reflection.</span>{" "}
                <span>Deep beepin&apos; impact.</span>
              </motion.h1>
              <motion.p
                className="mb-3 max-w-[560px] text-sm leading-relaxed text-white/65"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 1.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                Real life changes, for people with real life responsibilities.
              </motion.p>
              <motion.p
                className="mb-10 max-w-[560px] text-sm leading-relaxed text-white/65"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 1.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                Most wellness tools tell you what to do. Yourbeep shows you who you are because{" "}
                <em className="italic text-white/80">you &amp; your</em> inner beep are one-of-a-kind.
              </motion.p>

              <HeroCollage startJourneyHref={startJourneyHref} />
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section id="about" className="relative w-full px-4 py-16 md:px-6 md:py-20">
        <motion.div
          className="mx-auto max-w-[1320px]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="rounded-[24px] bg-gradient-to-r from-[#1a3a44] via-[#2a6878] to-[#3a9898] px-6 py-4 shadow-lg"
            variants={itemVariants}
          >
            <span className="text-lg font-bold tracking-tight text-white md:text-[22px]">
              About us
            </span>
          </motion.div>

          <div className="mt-12 grid gap-12 md:grid-cols-2 md:items-start">
            <motion.div
              className="relative overflow-hidden rounded-[20px] shadow-lg"
              variants={itemVariants}
            >
              <div
                className="h-[240px] bg-cover bg-center sm:h-[300px] md:h-[350px]"
                style={{
                  backgroundImage: "url('/media/landing/about us/about_us.png')",
                  backgroundPosition: "center center",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(26,58,68,0.2)] to-[rgba(58,152,152,0.1)]" />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                  Our Origin Story
                </p>
                <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
                  What&apos;s the beepin&apos; fuss about?
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-white/90">
                Yourbeep is a wellbeing platform built for people with real lives, real
                responsibilities, and absolutely no time for abstract advice such as
                &quot;find your inner calm.&quot; Rooted in ancient wisdom and modern
                behavioural science, this platform turns timeless insight into everyday
                tools for conscious, wholesome living.
              </p>
              <p className="text-sm leading-relaxed text-white/80">
                It is built to adapt to you, personal transformation 10x despite the full
                calendar and the never-ending chores. Short educational videos. Simple
                playful activities. Personalised insights.
              </p>
              <p className="text-sm leading-relaxed text-white/80">
                No perfect morning routine required. No equipment. No meditation den. And
                most importantly, no disappearing from your life to work on yourself. Just
                small, intelligent moments that help you pause, notice, recalibrate, and
                return to yourself as life keeps moving.
              </p>
              <p className="text-sm leading-relaxed text-white/75">
                Think of Yourbeep as your behavioural GPS, recalculating patterns as life
                ebbs and flows.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <WhyUsSection />
    </div>
  );
};

export default HeroAndAboutSection;

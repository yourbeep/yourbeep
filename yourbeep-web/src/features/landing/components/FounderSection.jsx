import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const FounderVisionSection = () => {
  return (
    <section
      id="founder"
      className="relative w-full bg-white px-4 py-20 md:px-6 md:py-28"
    >
      <motion.div
        className="mx-auto max-w-[1320px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
        }}
      >
        <motion.div
          variants={cardVariants}
          className="overflow-hidden rounded-[28px] bg-white shadow-[0_2px_32px_rgba(13,42,52,0.08)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="min-h-[320px] overflow-hidden bg-[#f5f0ea]">
              <img
                src="/media/landing/founder/Founder.png"
                alt="Founder portrait"
                className="h-full w-full object-cover object-center"
              />
            </div>

            <div className="flex flex-col justify-center gap-6 px-8 py-12 md:px-14 md:py-16">
              <p
                className="text-xs font-semibold uppercase tracking-[0.22em]"
                style={{ color: "#8b5a2b" }}
              >
                The Founder's Vision
              </p>

              <h2
                className="text-4xl font-medium text-[#0d3a4a] md:text-5xl"
                style={{ letterSpacing: "-0.03em", fontStyle: "italic" }}
              >
                Alolika Savant
              </h2>

              <div
                className="h-[3px] w-10 rounded-full"
                style={{ backgroundColor: "#8b5a2b" }}
              />

              <div className="space-y-4 text-base leading-relaxed text-[#4a6070] md:text-lg">
                <p>
                  A corporate professional, a movement enthusiast, a
                  self-reflective individual on the path of self-awareness.
                </p>
                <p>
                  Yourbeep converges the path of the analytical intellectual,
                  who decodes how behaviour is structured, measured, changed;
                  the rhythmic athlete, who comprehends somatic intelligence
                  through her lived-experience; and the creative thinker, who
                  believes that mindfulness doesn&apos;t have to look like
                  meditation. It can look like movement, play, and pattern
                  recognition.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FounderVisionSection;

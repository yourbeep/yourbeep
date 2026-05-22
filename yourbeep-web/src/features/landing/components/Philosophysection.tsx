import { motion } from "framer-motion";

// ─── philosophy cards data ─────────────────────────────────────────────────
const philosophyCards = [
  {
    id: 1,
    image: "/media/landing/philosophy/wellbeing-skill.png",
    imagePosition: "object-center",
    heading: "Wellbeing isn't a belief. It's a skill.",
    body: `Most well-intentioned platforms that promote a "calm headspace" or developing a "mind-body connection" do want you to feel better in the moment. At Yourbeep, self-awareness is treated like a craft – we want you to reflect and understand why you feel the way you do, and then actually do something about it.`,
  },
  {
    id: 2,
    image: "/media/landing/philosophy/behavioural-wellbeing.png",
    imagePosition: "object-center",
    heading: "Overall behavioural wellbeing. Not just mental wellbeing.",
    body: `Mental wellbeing is about the mind – how you think, feel, and cope. Behavioural wellbeing is external—your habits, actions, and patterns that affect your performance. Meditation apps ask you to breathe & relax in the moment. Behavioural patterns reveal the mess across work, relationships, sleep, spending, health. That's where the real leverage for a better-you is.`,
  },
  {
    id: 3,
    image: "/media/landing/philosophy/unique-insights.png",
    imagePosition: "object-[center_20%]",
    heading: "You are unique. Your insights should be unique.",
    body: `If 8.3 billion people are uniquely wired, then how could the traditional one-size-fits-all meditation methods be practical? The aim is to address specific emotional needs for each demographic at different life stages – whether you're a Gen-Z trying to figure life out or a millennial trying to cope through the daily hustle – you need to find your inner beep.`,
  },
  {
    id: 4,
    image: "/media/landing/philosophy/active-engagement.png",
    imagePosition: "object-center",
    heading: "Active engagement. Not passive consumption.",
    body: `The reality about digital education – video consumption is passive, especially when it comes to wellness cues. Yourbeep completes the loop by educating on the right tools, making those tools interactive, providing personalized insights, and then keep you accountable throughout – because self-reflection gives the best insights.`,
  },
];

// ─── variants ──────────────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── single card ──────────────────────────────────────────────────────────
const PhilosophyCard = ({ card }) => (
  <motion.div
    variants={cardVariants}
    className="flex flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_2px_24px_rgba(13,42,52,0.08)] transition-shadow duration-300 hover:shadow-[0_8px_40px_rgba(13,42,52,0.14)]"
  >
    {/* image block */}
    <div className="h-[240px] w-full overflow-hidden bg-[#f0ebe3] sm:h-[280px] md:h-[320px] xl:h-[400px]">
      <img
        src={card.image}
        alt={card.heading}
        className={`h-full w-full object-cover ${card.imagePosition}`}
        loading="lazy"
        decoding="async"
      />
    </div>

    {/* text */}
    <div className="flex flex-col gap-3 p-5 md:gap-4 md:p-7">
      <h3
        className="text-base font-extrabold leading-snug text-[#1a3a44] md:text-[18px]"
        style={{ letterSpacing: "-0.02em" }}
      >
        {card.heading}
      </h3>
      <p className="text-[13px] leading-relaxed text-[#5a7a7a] md:text-sm md:leading-7">
        {card.body}
      </p>
    </div>
  </motion.div>
);

// ─── main export ──────────────────────────────────────────────────────────
const PhilosophySection = () => {
  return (
    <section id="philosophy" className="relative w-full bg-white px-4 py-14 md:px-6 md:py-28">
      <motion.div
        className="mx-auto max-w-[1320px]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {/* header */}
        <motion.div className="mb-10 text-left md:mb-14" variants={cardVariants}>
          <h2
            className="text-2xl font-bold text-[#1a3a44] md:text-[32px]"
            style={{ letterSpacing: "-0.03em" }}
          >
            The Beep&apos;s Core
          </h2>
        </motion.div>

        {/* responsive card grid: 1 → 2 → 4 columns */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
          {philosophyCards.map((card) => (
            <PhilosophyCard key={card.id} card={card} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default PhilosophySection;

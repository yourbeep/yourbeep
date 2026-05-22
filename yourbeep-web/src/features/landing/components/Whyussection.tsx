import { motion } from "framer-motion";
import whyUsYoursTruly from "../../../assets/landing/why-us/why-us-yours-truly.png";
import whyUsAccountability from "../../../assets/landing/why-us/why-us-accountability.png";
import whyUsDoers from "../../../assets/landing/why-us/why-us-doers.png";
import whyUsProgress from "../../../assets/landing/why-us/why-us-progress.png";
import whyUsRealLife from "../../../assets/landing/why-us/why-us-real-life.png";
import whyUsScience from "../../../assets/landing/why-us/why-us-science.png";

const cards = [
  {
    id: 1,
    image: whyUsYoursTruly,
    imageAlt: "Golden heart icon representing personalised care",
    label: "Yours, truly",
    body: "Personalised to your pace, your patterns, your life demands. Because one-size-fits-all was never really for all.",
    accent: "from-[#1a3a44] to-[#2a6878]",
  },
  {
    id: 2,
    image: whyUsAccountability,
    imageAlt: "Calendar with growing sprout representing accountability",
    label: "Accountability that doesn't ghost you",
    body: "Most platforms disappear after the course ends. Yourbeep stays with hooks, nudges, and check-ins that keep you on track long after the curriculum wraps.",
    accent: "from-[#0d4a5a] to-[#1a7a8a]",
  },
  {
    id: 3,
    image: whyUsDoers,
    imageAlt: "Runner icon representing action and momentum",
    label: "Built for doers, not just feelers",
    body: "Simple gamified activities that work on your commute, at your desk, or between meetings. No special equipment, no special circumstances.",
    accent: "from-[#1a3a44] to-[#2a6878]",
  },
  {
    id: 4,
    image: whyUsProgress,
    imageAlt: "Rising chart icon representing measurable progress",
    label: "Progress you can actually see",
    body: "Forget abstract breakthroughs. Yourbeep gives you real-time, personalised insights so your growth is measurable, not just felt.",
    accent: "from-[#153040] to-[#1f5866]",
  },
  {
    id: 5,
    image: whyUsRealLife,
    imageAlt: "City and nature balance icon representing real life",
    label: "Made for real life",
    body: "Designed for people juggling work, family, and everything in between, not people with unlimited time and a meditation cushion.",
    accent: "from-[#1a3a44] to-[#2a6878]",
  },
  {
    id: 6,
    image: whyUsScience,
    imageAlt: "Ancient wisdom and science icon",
    label: "Science in, jargon out",
    body: "Every activity is rooted in ancient wisdom and behavioural science, but delivered in plain language.",
    accent: "from-[#0d4a5a] to-[#1a7a8a]",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const WhyCard = ({ card }) => {
  return (
    <motion.div
      variants={cardVariants}
      className={`
        relative flex min-h-[260px] flex-col gap-3 overflow-hidden rounded-[20px] border border-white/10
        bg-gradient-to-br ${card.accent} p-6
        group cursor-default
      `}
      style={{
        boxShadow:
          "0 4px 24px rgba(13,42,52,0.22), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
      whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full sm:h-14 sm:w-14">
          <img
            src={card.image}
            alt={card.imageAlt}
            className="h-full w-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
        </div>
        <motion.span
          className="text-sm font-light text-white/30"
          initial={{ opacity: 0, x: -4 }}
          whileHover={{ opacity: 1, x: 0 }}
        >
          ↗
        </motion.span>
      </div>

      <h4
        className="text-[17px] font-bold leading-snug text-white md:text-[18px]"
        style={{ letterSpacing: "-0.01em" }}
      >
        {card.label}
      </h4>

      <p className="flex-1 text-[14px] leading-relaxed text-white/70 md:text-[15px]">
        {card.body}
      </p>

      <div className="mt-2 h-px w-12 rounded-full bg-white/20" />

      <div
        className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle, rgba(58,200,200,0.18) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
};

const WhyUsSection = () => {
  return (
    <section className="relative w-full px-4 py-20 md:px-6 md:py-28" id="why-us">
      <motion.div
        className="mx-auto max-w-[1320px]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div
          className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          variants={cardVariants}
        >
          <div>
            <h3
              className="text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl"
              style={{ letterSpacing: "-0.03em" }}
            >
              Why the beep should you care?
            </h3>
            <p className="mt-3 max-w-md text-base leading-relaxed text-white/75 md:text-lg">
              Simply, because we get you.
            </p>
          </div>

          <a
            href="#journey"
            className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-6 py-3 text-xs font-bold tracking-widest text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/20 md:self-auto"
          >
            START YOUR JOURNEY ↗
          </a>
        </motion.div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <WhyCard key={card.id} card={card} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default WhyUsSection;

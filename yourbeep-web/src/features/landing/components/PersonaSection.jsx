import { motion } from "framer-motion";

const personas = [
  {
    title: "The High-Functioning Performer",
    who: "You are a professional or entrepreneur, outwardly successful and inwardly restless.",
    why: "Structured support that respects your intelligence without feeling too woo-woo.",
    accent: "from-[#d9efe6] via-[#eef5eb] to-[#f8f4ea]",
    image: "/media/landing/persona/persona-high-functioning-performer.png",
  },
  {
    title: "The Resilient Overcomer",
    who: "You have learned to hold your own in systems that were not designed for you.",
    why: "Short, gamified activities that fit an unpredictable life and give quiet suppression somewhere to move.",
    accent: "from-[#e6efe0] via-[#f6f3ea] to-[#f3ece2]",
    image: "/media/landing/persona/persona-resilient-overcomer.png",
  },
  {
    title: "The Selfless Caregiver",
    who: "You pour everything into others and rarely leave enough room for yourself.",
    why: "A platform that reflects your depletion patterns before they become your new normal.",
    accent: "from-[#f0eadb] via-[#f8f5ec] to-[#e1eee7]",
    image: "/media/landing/persona/persona-selfless-caregiver.png",
  },
  {
    title: "The Curious Experimenter",
    who: "You are open to self-exploration but need it to feel engaging, not clinical.",
    why: "Progressive, episodic guidance with real insights to decode at your own pace.",
    accent: "from-[#dcecf3] via-[#f4f6ef] to-[#efe8df]",
    image: "/media/landing/persona/persona-curious-experimenter.png",
  },
  {
    title: "The Wavering In-Betweener",
    who: "You are between identities, routines, or life chapters and the ground feels less certain.",
    why: "A soft landing that helps separate fear from intuition when everything feels blurred.",
    accent: "from-[#e7efe2] via-[#f8f4ea] to-[#ece5dc]",
    image: "/media/landing/persona/persona-wavering-in-betweener.png",
  },
  {
    title: "The Inner Explorer",
    who: "You are already introspective and want a more structured, measurable way to deepen that work.",
    why: "Visual and creative pathways that make evolution feel tangible, not abstract.",
    accent: "from-[#e4eee9] via-[#f6f3ea] to-[#e7edf5]",
    image: "/media/landing/persona/persona-inner-explorer.png",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const PersonaSection = () => {
  return (
    <section className="bg-[#f4f2ea] px-4 py-16 md:px-6 md:py-24" id="personas">
      <motion.div
        className="mx-auto max-w-[1320px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
        }}
      >
        <motion.div
          variants={cardVariants}
          className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#4c8378]">
              Persona Paths
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-[-0.04em] text-[#17363b] md:text-5xl">
              Different inner lives need different entry points.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f7470] md:text-base">
              Yourbeep meets people where they actually are, not where wellness
              language assumes they should be.
            </p>
          </div>

        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {personas.map((persona) => (
            <motion.article
              key={persona.title}
              variants={cardVariants}
              className="overflow-hidden rounded-[28px] border border-[#e4e7dc] bg-white shadow-[0_18px_42px_rgba(24,52,58,0.06)]"
            >
              <div className={`h-[250px] bg-gradient-to-br ${persona.accent}`}>
                <img
                  src={persona.image}
                  alt={persona.title}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="space-y-4 p-6">
                <h3 className="text-[26px] font-bold leading-tight tracking-[-0.03em] text-[#18343a]">
                  {persona.title}
                </h3>

                <div className="rounded-[20px] bg-[#f7f5ee] px-4 py-4">
                  <p className="text-sm leading-7 text-[#5f7470]">{persona.who}</p>
                </div>

                <div className="rounded-[20px] bg-[#eef5f0] px-4 py-4">
                  <p className="text-sm leading-7 text-[#4a625d]">{persona.why}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default PersonaSection;

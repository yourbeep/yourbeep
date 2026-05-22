import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah T.",
    role: "Business Executive",
    text: "The sanctuary isn't just a physical space. It's a mental framework. The daily practices have fundamentally shifted how I approach conflict and stress in my corporate role.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    name: "David K.",
    role: "Artist",
    text: "I learned that stillness is an active choice. The curated environment of the Academy stripped away the non-essential, leaving only what truly matters.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  },
  {
    name: "Julian M.",
    role: "Architect, London",
    text: "Before YourBeep, my mind felt like a crowded room with the volume turned all the way up. The curriculum taught me how to inhabit my own life with intention and grace.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Maya L.",
    role: "Teacher",
    text: "The practices here have given me tools to navigate daily chaos with grace and presence. I feel more grounded than ever before.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
  {
    name: "Robert Chen",
    role: "Engineer",
    text: "A transformative experience that helped me reconnect with my inner self and find clarity in the midst of modern life's complexity.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
  {
    name: "Emma Wilson",
    role: "Designer, NYC",
    text: "YourBeep transformed my relationship with creativity and rest. I've found a rhythm that honors both my ambitions and my need for stillness.",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
  },
];

const n = testimonials.length;
const CARD_GAP = 300;
const VISIBLE_RANGE = 2;

const getAnimatedValues = (offset) => {
  const abs = Math.abs(offset);
  return {
    x: offset * CARD_GAP,
    scale: offset === 0 ? 1 : 0.84 - abs * 0.06,
    opacity: offset === 0 ? 1 : Math.max(0.18, 0.55 - abs * 0.15),
    filter: `blur(${offset === 0 ? 0 : 3 + abs * 1.5}px)`,
    zIndex: 10 - abs,
  };
};

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % n);
    }, 5200);
  };

  useEffect(() => {
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, []);

  const goTo = (index) => {
    clearInterval(intervalRef.current);
    setActiveIndex(index);
    startInterval();
  };

  // Compute circular offset for each card — shortest path through the ring
  const cards = testimonials.map((t, i) => {
    let offset = i - activeIndex;
    if (offset > n / 2) offset -= n;
    if (offset < -n / 2) offset += n;
    return { ...t, index: i, offset };
  });

  const visibleCards = cards.filter((c) => Math.abs(c.offset) <= VISIBLE_RANGE);

  return (
    <section
      id="stories"
      className="overflow-hidden bg-white px-4 py-12 md:px-6"
    >
      <div className="mx-auto max-w-[1000px]">
        {/* Header */}
        <div className="mb-10 rounded-[24px] bg-gradient-to-br from-[#1e6b7a] to-[#2a8898] px-6 py-4 sm:px-8 sm:py-5 md:mb-16">
          <span className="text-2xl font-bold tracking-tight text-white sm:text-[28px] md:text-[32px]">
            Testimonials
          </span>
        </div>

        {/* Carousel */}
        <div className="relative mx-auto flex h-[400px] items-center justify-center sm:h-[440px] md:h-[480px]">
          {visibleCards.map(({ index, offset, name, role, text, image }) => {
            const anim = getAnimatedValues(offset);

            return (
              <motion.div
                key={index}
                className="absolute w-[min(280px,calc(100vw-3rem))] max-w-[280px]"
                animate={{
                  x: anim.x,
                  scale: anim.scale,
                  opacity: anim.opacity,
                  filter: anim.filter,
                  zIndex: anim.zIndex,
                }}
                transition={{
                  duration: 0.75,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ pointerEvents: offset === 0 ? "auto" : "none" }}
              >
                <article className="flex h-full flex-col rounded-[22px] bg-white p-5 shadow-[0_24px_60px_rgba(30,35,30,0.09)] sm:p-7">
                  <div className="text-[32px] leading-none text-[#8a4030]">
                    "
                  </div>

                  <div className="mt-4 h-[130px] overflow-hidden rounded-[12px]">
                    <img
                      src={image}
                      alt={name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <p className="mt-5 flex-grow text-[13px] leading-[1.7] text-[#5b5f45]">
                    "{text}"
                  </p>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-[34px] w-[34px] shrink-0 rounded-full bg-[#f4f4f4]" />
                    <div>
                      <p className="text-[11px] font-semibold text-[#2c2e2a]">
                        {name}
                      </p>
                      <p className="text-[10px] text-[#8a9a9a]">{role}</p>
                    </div>
                  </div>
                </article>
              </motion.div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              className="cursor-pointer rounded-full border-none"
              animate={{
                width: activeIndex === i ? 24 : 8,
                height: 8,
                backgroundColor: activeIndex === i ? "#1e6b7a" : "#c4c0b4",
              }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

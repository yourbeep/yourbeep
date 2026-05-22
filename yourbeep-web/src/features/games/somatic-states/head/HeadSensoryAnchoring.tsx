import { motion } from "framer-motion";

const anchors = [
  {
    label: "Auditory",
    title: "External audio focus",
    description:
      "Listen for the farthest sound you can detect and let it become a fixed point in the distance.",
  },
  {
    label: "Somatic",
    title: "Ground contact",
    description:
      "Feel the weight of your body against the surface beneath you and notice the downward pull of gravity.",
  },
  {
    label: "Optic",
    title: "Visual stillness",
    description:
      "Fix your gaze on a single, unmoving point in the environment and soften your peripheral vision.",
  },
] as const;

export default function HeadSensoryAnchoring() {
  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-white p-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          Sensory anchoring
        </p>
        <h4 className="mt-2 text-2xl font-semibold text-[var(--text)]">
          Reconnect to the room
        </h4>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Establish equilibrium by connecting with external reference points. Use these anchors to
          stabilize the nervous system and return to a state of informed calm.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {anchors.map((anchor, index) => (
          <motion.div
            key={anchor.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <div className="flex h-32 items-center justify-center rounded-[18px] bg-white">
              <div className="relative h-20 w-20">
                {index === 0 ? (
                  <>
                    <div className="absolute inset-0 rounded-full border border-[var(--border)]" />
                    <div className="absolute inset-[12px] rounded-full border border-[var(--border)]" />
                    <div className="absolute inset-[24px] rounded-full border border-[var(--border)]" />
                    <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--text)]" />
                  </>
                ) : index === 1 ? (
                  <>
                    <div className="absolute left-1/2 top-2 h-12 w-0.5 -translate-x-1/2 bg-[var(--text)]" />
                    <div className="absolute bottom-3 left-1/2 h-0.5 w-10 -translate-x-1/2 bg-[var(--text)]" />
                  </>
                ) : (
                  <>
                    <div className="absolute inset-[8px] border border-[var(--text)]" />
                    <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 bg-[var(--primary)]" />
                  </>
                )}
              </div>
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              {anchor.label}
            </p>
            <p className="mt-2 text-base font-semibold text-[var(--text)]">{anchor.title}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{anchor.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

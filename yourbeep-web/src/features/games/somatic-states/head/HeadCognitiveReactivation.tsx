import { motion } from "framer-motion";

type HeadCognitiveReactivationProps = {
  mode?: "reactivation" | "diffusion";
};

const reactivationSteps = [
  "Turn your head slowly left and right.",
  "Track objects visually across the room.",
  "Stretch your jaw gently.",
  "Relax your eyebrows and forehead.",
];

const diffusionSteps = [
  "Notice one repeating thought without suppressing it.",
  "Silently label it as a thought, not a fact.",
  "Return to breath, sound, or contact whenever the thought hooks back in.",
  "Let spacious awareness widen around the thought stream.",
];

export default function HeadCognitiveReactivation({
  mode = "reactivation",
}: HeadCognitiveReactivationProps) {
  const steps = mode === "reactivation" ? reactivationSteps : diffusionSteps;

  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Head sequence
          </p>
          <h4 className="mt-2 text-2xl font-semibold text-[var(--text)]">
            {mode === "reactivation" ? "Expand the window" : "Cognitive diffusion drill"}
          </h4>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            {mode === "reactivation"
              ? "Broaden the field of awareness so the mind is not trapped inside one narrow channel of focus."
              : "Create space between you and the thought stream so the head can loosen its grip on immediate interpretation."}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Suggested run
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--text)]">
            {mode === "reactivation" ? "2 minutes" : "90 seconds"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-white">
                {index + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">
                  {mode === "reactivation" ? `Phase ${index + 1}` : `Practice ${index + 1}`}
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{step}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

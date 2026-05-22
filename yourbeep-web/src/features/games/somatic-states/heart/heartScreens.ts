import type { SomaticScreenDefinition } from "../services/somaticScreenTypes";

export const heartScreens: Record<string, SomaticScreenDefinition> = {
  baseline_pulse_awareness: {
    regionLabel: "Heart",
    eyebrow: "Heart practice",
    title: "Baseline Pulse Awareness",
    intro:
      "Start by feeling the pulse and charge in the heart area without changing it.",
    steps: [
      "Notice the rhythm under the breastbone or in the chest wall.",
      "Let the sensation be information, not a problem.",
      "Track whether it feels steady, muted, or amplified.",
    ],
  },
  activation_differentiation_test: {
    regionLabel: "Heart",
    eyebrow: "Heart practice",
    title: "Activation Differentiation Test",
    intro:
      "Differentiate heart-based activation from genuine panic or overwhelm by staying in direct contact with the rhythm.",
    steps: [
      "Feel the heartbeat without speeding yourself up.",
      "Notice whether the charge feels energizing or destabilizing.",
      "Use the result to choose regulation rather than reaction.",
    ],
  },
  coherence_breathing: {
    regionLabel: "Heart",
    eyebrow: "Heart practice",
    title: "Coherence Breathing",
    intro:
      "Synchronize the breath with the heartspace so rhythm becomes steadier and more coherent.",
    steps: [
      "Let the inhale rise smoothly without strain.",
      "Match the exhale to an equally smooth descent.",
      "Imagine the breath moving through the center of the chest.",
    ],
  },
  expansion_allowance: {
    regionLabel: "Heart",
    eyebrow: "Heart practice",
    title: "Expansion Allowance",
    intro:
      "If the heart wants to soften or open, give that movement permission without forcing intensity.",
    steps: [
      "Notice the first edge of softening in the chest.",
      "Allow the inhale to create more internal room.",
      "Exhale with the sense of making space rather than collapsing.",
    ],
  },
  sternum_pec_stretch: {
    regionLabel: "Heart",
    eyebrow: "Heart practice",
    title: "Sternum and Pec Stretch",
    intro:
      "Open the front body gently so protective compression around the heart can release.",
    steps: [
      "Lift through the sternum without arching hard.",
      "Let the collarbones widen and the chest broaden.",
      "Keep the breath soft while the front body lengthens.",
    ],
  },
  shoulder_neck_stretch: {
    regionLabel: "Heart",
    eyebrow: "Heart practice",
    title: "Shoulder and Neck Stretch",
    intro:
      "When heart activation spills upward, release the upper channels that are carrying the extra charge.",
    steps: [
      "Notice whether the neck and shoulders are bracing around the heartbeat.",
      "Lengthen gently through the side of the neck.",
      "Exhale and let the shoulder line drop away from the ears.",
    ],
  },
};

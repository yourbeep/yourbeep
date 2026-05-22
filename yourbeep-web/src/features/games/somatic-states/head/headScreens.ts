import type { SomaticScreenDefinition } from "../services/somaticScreenTypes";

export const headScreens: Record<string, SomaticScreenDefinition> = {
  "60_second_cognitive_check": {
    regionLabel: "Head",
    eyebrow: "Head practice",
    title: "60 Second Cognitive Check",
    intro:
      "Let the headspace settle without fixing it. For one minute, simply observe clarity, speed, and tension in the mind.",
    steps: [
      "Notice how quickly your attention is moving right now.",
      "Scan for pressure behind the eyes, forehead, or temples.",
      "Stay observational rather than analytical.",
    ],
  },
  expand_the_window: {
    regionLabel: "Head",
    eyebrow: "Head practice",
    title: "Expand the Window",
    intro:
      "Broaden the field of awareness so the mind is not trapped inside one narrow channel of focus.",
    steps: [
      "Soften your gaze and widen the edges of the visual field.",
      "Include sounds, temperature, and body contact in awareness.",
      "Keep returning to a sense of spaciousness instead of effort.",
    ],
  },
  co2_indicator: {
    regionLabel: "Head",
    eyebrow: "Head practice",
    title: "CO2 Indicator Check",
    intro:
      "Use this quick screen to notice whether lightness, disorientation, or head rush may be linked to breathing imbalance.",
    steps: [
      "Observe if the breath feels high, fast, or hard to settle.",
      "Notice any floaty or spacey sensation in the skull and eyes.",
      "Stay curious before moving to regulation.",
    ],
  },
  co2_rebalancing: {
    regionLabel: "Head",
    eyebrow: "Head practice",
    title: "CO2 Rebalancing",
    intro:
      "Slow the breathing pattern and lengthen the exhale so the nervous system can come back into better rhythm.",
    steps: [
      "Inhale gently without lifting the upper chest.",
      "Let the exhale be slower and quieter than the inhale.",
      "Keep the face and jaw soft throughout the cycle.",
    ],
  },
  sensory_anchoring: {
    regionLabel: "Head",
    eyebrow: "Head practice",
    title: "Sensory Anchoring",
    intro:
      "Bring the mind back into contact with the room through sensation instead of staying in internal spin.",
    steps: [
      "Name three things you can see around you.",
      "Find one stable sound and let it anchor attention.",
      "Press your feet or seat gently into the surface beneath you.",
    ],
  },
  flexibility_check: {
    regionLabel: "Head",
    eyebrow: "Head practice",
    title: "Flexibility Check",
    intro:
      "Assess whether the mind can shift and reorient, or whether it is locking into one fixed loop.",
    steps: [
      "Notice if attention can move easily between thoughts and body.",
      "Check whether the internal narrative feels rigid or adaptable.",
      "Let the answer be felt, not forced.",
    ],
  },
  cognitive_diffusion_drill: {
    regionLabel: "Head",
    eyebrow: "Head practice",
    title: "Cognitive Diffusion Drill",
    intro:
      "Create space between you and the thought stream so the head can loosen its grip on immediate interpretation.",
    steps: [
      "Notice one repeating thought without suppressing it.",
      "Silently label it as a thought, not a fact.",
      "Return to breath or sound whenever the mind hooks back in.",
    ],
  },
  fatigue_check: {
    regionLabel: "Head",
    eyebrow: "Head practice",
    title: "Fatigue Check",
    intro:
      "Differentiate true depletion from cognitive overload so your next action matches what the system actually needs.",
    steps: [
      "Notice whether the heaviness feels sleepy, numb, or overloaded.",
      "Check if your eyes want closure or if your mind wants relief.",
      "Let the body tell you whether rest or regulation is needed.",
    ],
  },
};

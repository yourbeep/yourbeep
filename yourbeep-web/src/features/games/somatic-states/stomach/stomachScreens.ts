import type { SomaticScreenDefinition } from "../services/somaticScreenTypes";

export const stomachScreens: Record<string, SomaticScreenDefinition> = {
  belly_softening: {
    regionLabel: "Stomach",
    eyebrow: "Stomach practice",
    title: "Belly Softening",
    intro:
      "Invite the abdomen to unbrace so the body can decide whether the belly is protecting, reacting, or opening.",
    steps: [
      "Notice where the abdomen is gripping against the inhale.",
      "Allow the exhale to melt the belly wall forward.",
      "Stay with softness rather than pushing for release.",
    ],
  },
  abdominal_scan: {
    regionLabel: "Stomach",
    eyebrow: "Stomach practice",
    title: "Abdominal Scan",
    intro:
      "Move through the stomach area slowly enough to distinguish surface holding from deeper reaction.",
    steps: [
      "Scan upper belly, navel line, and lower abdomen separately.",
      "Notice whether the sensation is fluttering, swirling, or armored.",
      "Pause where the signal is strongest.",
    ],
  },
  safety_cue: {
    regionLabel: "Stomach",
    eyebrow: "Stomach practice",
    title: "Safety Cue",
    intro:
      "Offer the gut one clear signal of present-time safety before asking it to settle.",
    steps: [
      "Find one anchor that feels unquestionably safe right now.",
      "Pair that anchor with a softer exhale.",
      "Let the belly receive the message without argument.",
    ],
  },
  gut_reaction: {
    regionLabel: "Stomach",
    eyebrow: "Stomach practice",
    title: "Gut Reaction",
    intro:
      "Listen for whether the stomach is reacting to uncertainty, threat, anticipation, or remembered stress.",
    steps: [
      "Feel where the reaction gathers most strongly.",
      "Notice whether it moves outward, inward, or downward.",
      "Name the reaction quality before moving on.",
    ],
  },
};

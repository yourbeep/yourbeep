import type { SomaticScreenDefinition } from "../services/somaticScreenTypes";

export const faceThroatScreens: Record<string, SomaticScreenDefinition> = {
  clench_detection_drill: {
    regionLabel: "Face & Throat",
    eyebrow: "Face and throat practice",
    title: "Clench Detection Drill",
    intro:
      "Before releasing anything, notice where the jaw, mouth, or throat is quietly gripping.",
    steps: [
      "Scan the jaw hinge, tongue, lips, and throat.",
      "Notice whether the holding is subtle or forceful.",
      "Stay with sensation instead of jumping to correction.",
    ],
  },
  jaw_awareness_reset: {
    regionLabel: "Face & Throat",
    eyebrow: "Face and throat practice",
    title: "Jaw Awareness Reset",
    intro:
      "Allow a small gap between the teeth and let the jaw descend without effort.",
    steps: [
      "Drop the lower jaw slightly away from the upper teeth.",
      "Keep the lips soft and the tongue relaxed.",
      "Breathe naturally through the nose while the jaw stays heavy.",
    ],
  },
  throat_openness_check: {
    regionLabel: "Face & Throat",
    eyebrow: "Face and throat practice",
    title: "Throat Openness Check",
    intro:
      "Explore whether the throat is open for breath and expression, or whether it is holding back.",
    steps: [
      "Swallow once and notice the quality of the movement.",
      "Feel the front of the throat while the breath moves through it.",
      "Notice whether openness increases when the jaw softens.",
    ],
  },
  belly_breathing: {
    regionLabel: "Face & Throat",
    eyebrow: "Face and throat practice",
    title: "Belly Breathing",
    intro:
      "Shift the breath downward so the throat can stop doing the work of regulation alone.",
    steps: [
      "Let the inhale travel lower into the belly.",
      "Allow the exhale to melt the throat and jaw together.",
      "Keep the shoulders quiet and the face unforced.",
    ],
  },
  neck_release_awareness: {
    regionLabel: "Face & Throat",
    eyebrow: "Face and throat practice",
    title: "Neck Release Awareness",
    intro:
      "Soften the protective brace in the neck without forcing range or stretch.",
    steps: [
      "Notice where the neck is shortening or hardening.",
      "Allow one slow breath to widen the back of the neck.",
      "Let the head feel supported instead of held up by effort.",
    ],
  },
  shoulder_drop: {
    regionLabel: "Face & Throat",
    eyebrow: "Face and throat practice",
    title: "Shoulder Drop",
    intro:
      "Invite the shoulders to release their contribution to jaw and throat tension.",
    steps: [
      "Inhale and sense where the shoulders are held.",
      "Exhale and let them descend without pushing.",
      "Notice if the throat opens more once the shoulders settle.",
    ],
  },
};

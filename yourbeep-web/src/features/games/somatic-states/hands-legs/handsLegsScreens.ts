import type { SomaticScreenDefinition } from "../services/somaticScreenTypes";

export const handsLegsScreens: Record<string, SomaticScreenDefinition> = {
  grounding_drill: {
    regionLabel: "Hands & Legs",
    eyebrow: "Hands and legs practice",
    title: "Grounding Drill",
    intro:
      "Use the limbs to re-establish contact with gravity and support instead of letting energy float upward.",
    steps: [
      "Press the feet or seat gently into the surface beneath you.",
      "Feel the hands receive contact without gripping.",
      "Let the body register support before taking the next breath.",
    ],
  },
  freeze_check: {
    regionLabel: "Hands & Legs",
    eyebrow: "Hands and legs practice",
    title: "Freeze Check",
    intro:
      "Assess whether the limbs are slowing from rest, depletion, or protective immobilization.",
    steps: [
      "Notice how available movement feels in the legs and hands.",
      "Check whether stillness feels chosen or stuck.",
      "Stay with the distinction before trying to mobilize.",
    ],
  },
  rhythmic_grounding: {
    regionLabel: "Hands & Legs",
    eyebrow: "Hands and legs practice",
    title: "Rhythmic Grounding",
    intro:
      "Create gentle rhythm through the limbs so the nervous system can come back into organized movement.",
    steps: [
      "Introduce a soft repeated movement through feet or hands.",
      "Let the rhythm be steady rather than intense.",
      "Feel whether repetition reduces the sense of freeze or scatter.",
    ],
  },
  fist_clench_release: {
    regionLabel: "Hands & Legs",
    eyebrow: "Hands and legs practice",
    title: "Fist Clench Release",
    intro:
      "Briefly clench and release to help the system distinguish bracing from letting go.",
    steps: [
      "Close the hands firmly enough to feel the effort.",
      "Release all at once and notice the difference.",
      "Let the forearms and hands soften before repeating.",
    ],
  },
  shoulder_drop: {
    regionLabel: "Hands & Legs",
    eyebrow: "Hands and legs practice",
    title: "Shoulder Drop",
    intro:
      "Help the arm pathway complete by letting upper-body guarding loosen as the limbs settle.",
    steps: [
      "Notice whether the arms stay braced by the shoulders.",
      "Exhale and let the shoulders descend without force.",
      "Feel the hands respond to the extra space.",
    ],
  },
  proprioception_grounding: {
    regionLabel: "Hands & Legs",
    eyebrow: "Hands and legs practice",
    title: "Proprioception Grounding",
    intro:
      "Use weight, contact, and joint position to help the body feel where it is in space again.",
    steps: [
      "Notice points of contact in feet, calves, or hands.",
      "Feel the boundaries of the limbs from the inside.",
      "Let spatial certainty reduce the urge to brace.",
    ],
  },
};

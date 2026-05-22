import type { SomaticScreenDefinition } from "../services/somaticScreenTypes";

export const chestScreens: Record<string, SomaticScreenDefinition> = {
  diaphragmatic_baseline_check: {
    regionLabel: "Chest",
    eyebrow: "Chest practice",
    title: "Diaphragmatic Baseline Check",
    intro:
      "Check where the breath is landing before you try to change the breathing pattern.",
    steps: [
      "Notice whether the breath is mostly upper chest or lower rib.",
      "Let the inhale happen without performance.",
      "Observe where expansion arrives first.",
    ],
  },
  "360_breathing": {
    regionLabel: "Chest",
    eyebrow: "Chest practice",
    title: "360 Breathing",
    intro:
      "Expand the breath laterally and posteriorly so the chest can widen instead of staying front-loaded.",
    steps: [
      "Imagine the inhale reaching the side ribs and back body.",
      "Let the breath spread rather than rise sharply upward.",
      "Keep the exhale long enough for the chest to soften.",
    ],
  },
  co2_check: {
    regionLabel: "Chest",
    eyebrow: "Chest practice",
    title: "CO2 Check",
    intro:
      "Use the chest sensation as a clue for whether breath imbalance is amplifying the unrest.",
    steps: [
      "Notice if the breath is fast, shallow, or effortful.",
      "Track whether the chest wants more air or more slowness.",
      "Stay curious before regulating.",
    ],
  },
  breath_hold_exercise: {
    regionLabel: "Chest",
    eyebrow: "Chest practice",
    title: "Breath Hold Exercise",
    intro:
      "Pause briefly after the exhale to help the breathing rhythm reorganize without force.",
    steps: [
      "Exhale softly and pause for a short comfortable hold.",
      "Release back into a gentle inhale without gulping.",
      "Repeat without strain or urgency.",
    ],
  },
  chest_tightness_vulnerability_check: {
    regionLabel: "Chest",
    eyebrow: "Chest practice",
    title: "Chest Tightness Check",
    intro:
      "Explore whether the tightness is mechanical, emotional, or protective in quality.",
    steps: [
      "Notice where the chest narrows most clearly.",
      "Ask whether the sensation feels guarded, fragile, or overloaded.",
      "Let the answer come from the body instead of the story.",
    ],
  },
  light_shoulder_arm_movements: {
    regionLabel: "Chest",
    eyebrow: "Chest practice",
    title: "Light Shoulder and Arm Movements",
    intro:
      "Introduce soft movement so the upper body can loosen without overwhelming the chest.",
    steps: [
      "Move the arms in small easy arcs.",
      "Keep the breath fluid while the chest tracks the motion.",
      "Stop before effort turns into pushing.",
    ],
  },
  lie_on_bed_head_back: {
    regionLabel: "Chest",
    eyebrow: "Chest practice",
    title: "Lie on Bed, Head Back",
    intro:
      "Let gravity help the sternum and front ribs release into a more open shape.",
    steps: [
      "Rest with support under you and let the chest receive the surface.",
      "Breathe into the front ribs without forcing expansion.",
      "Use the exhale to let the sternum soften and drop.",
    ],
  },
  sternum_pec_stretch: {
    regionLabel: "Chest",
    eyebrow: "Chest practice",
    title: "Sternum and Pec Stretch",
    intro:
      "Create more room across the front body so the breath doesn’t have to push through bracing.",
    steps: [
      "Widen the collarbones gently.",
      "Let the sternum rise slightly as the pecs lengthen.",
      "Keep the breath soft while the front body opens.",
    ],
  },
};

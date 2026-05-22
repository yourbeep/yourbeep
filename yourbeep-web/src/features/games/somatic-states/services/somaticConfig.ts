export const somaticSequences = {
  head: {
    bright_clear_focus: ["60_second_cognitive_check", "expand_the_window"],
    dizzy_spacey: ["co2_indicator", "co2_rebalancing", "sensory_anchoring"],
    heaviness_fog: ["flexibility_check", "cognitive_diffusion_drill", "fatigue_check"],
  },
  face_throat: {
    relaxed_bright: [],
    subtle_tension: [
      "clench_detection_drill",
      "jaw_awareness_reset",
      "throat_openness_check",
      "belly_breathing",
      "neck_release_awareness",
      "shoulder_drop",
    ],
    excessive_clench: [
      "clench_detection_drill",
      "jaw_awareness_reset",
      "throat_openness_check",
      "belly_breathing",
      "neck_release_awareness",
      "shoulder_drop",
    ],
  },
  heart: {
    steady_heart_integration: ["baseline_pulse_awareness"],
    increasing_pulse_activation: ["activation_differentiation_test", "coherence_breathing"],
    the_release_expansion: ["expansion_allowance", "sternum_pec_stretch"],
    pounding_heart_waver: [
      "activation_differentiation_test",
      "coherence_breathing",
      "shoulder_neck_stretch",
    ],
    heart_ache_chaos: ["expansion_allowance", "sternum_pec_stretch"],
  },
  chest: {
    calm: ["diaphragmatic_baseline_check", "360_breathing"],
    unrest: ["co2_check", "breath_hold_exercise"],
    spiral: ["co2_check", "breath_hold_exercise"],
    tightness: [
      "chest_tightness_vulnerability_check",
      "light_shoulder_arm_movements",
      "lie_on_bed_head_back",
      "sternum_pec_stretch",
    ],
  },
  stomach: {
    butterflies: ["belly_softening"],
    whirlpool: ["abdominal_scan", "belly_softening", "safety_cue", "gut_reaction"],
    armour: ["abdominal_scan", "belly_softening", "safety_cue", "gut_reaction"],
  },
  hands_legs: {
    calm: ["grounding_drill"],
    springy: ["grounding_drill"],
    sluggish: ["freeze_check", "rhythmic_grounding"],
    fidgety: ["fist_clench_release", "shoulder_drop"],
    braced: ["fist_clench_release", "shoulder_drop", "proprioception_grounding"],
    contracted: ["fist_clench_release", "shoulder_drop", "proprioception_grounding"],
  },
} as const;

export type SomaticRegionKey = keyof typeof somaticSequences;

export type SomaticSensationOption = {
  value: string;
  label: string;
  description: string;
};

export type SomaticRegionMeta = {
  label: string;
  eyebrow: string;
  description: string;
  color: string;
  glow: string;
  position: [number, number, number];
};

export const somaticRegionMeta: Record<SomaticRegionKey, SomaticRegionMeta> = {
  head: {
    label: "Head",
    eyebrow: "Cognitive field",
    description: "Use this when the sensation starts with mental sharpness, fog, dizziness, or internal pressure around the headspace.",
    color: "#67c6b8",
    glow: "rgba(103,198,184,0.28)",
    position: [0, 2.34, 0.34],
  },
  face_throat: {
    label: "Face & Throat",
    eyebrow: "Expression and holding",
    description: "Use this when jaw tension, throat tightness, swallowing restriction, or facial holding is what stands out first.",
    color: "#7ab7f0",
    glow: "rgba(122,183,240,0.28)",
    position: [0, 1.46, 0.4],
  },
  heart: {
    label: "Heart",
    eyebrow: "Pulse and charge",
    description: "Use this when the inner signal feels emotional, pulsing, tender, heavy, or highly activated through the heart space.",
    color: "#ea7b98",
    glow: "rgba(234,123,152,0.28)",
    position: [-0.24, 0.72, 0.38],
  },
  chest: {
    label: "Chest",
    eyebrow: "Breath and expansion",
    description: "Use this when breath, pressure, openness, constriction, or spiral energy is centered through the chest.",
    color: "#c884df",
    glow: "rgba(200,132,223,0.28)",
    position: [0.12, 0.36, 0.42],
  },
  stomach: {
    label: "Stomach",
    eyebrow: "Gut and safety",
    description: "Use this when butterflies, armor, gut reactivity, or belly-based unease are the clearest sensations.",
    color: "#efae59",
    glow: "rgba(239,174,89,0.28)",
    position: [0, -0.4, 0.38],
  },
  hands_legs: {
    label: "Hands & Legs",
    eyebrow: "Ground and discharge",
    description: "Use this when the body wants to fidget, brace, freeze, spring, or ground through the limbs.",
    color: "#8e88e8",
    glow: "rgba(142,136,232,0.28)",
    position: [0.84, -0.78, 0.18],
  },
};

export const somaticSensationCatalog: Record<SomaticRegionKey, SomaticSensationOption[]> = {
  head: [
    {
      value: "bright_clear_focus",
      label: "Bright & Clear Focus",
      description: "The mind feels open, alert, and cognitively available.",
    },
    {
      value: "dizzy_spacey",
      label: "Dizzy & Spacey",
      description: "Awareness feels floaty, disconnected, or mildly disoriented.",
    },
    {
      value: "heaviness_fog",
      label: "Heaviness & Fog",
      description: "Attention feels weighed down, slow, or mentally clouded.",
    },
  ],
  face_throat: [
    {
      value: "relaxed_bright",
      label: "Relaxed & Bright",
      description: "The jaw, face, and throat feel open, soft, and available.",
    },
    {
      value: "subtle_tension",
      label: "Subtle Tension",
      description: "There is mild clenching, holding, or narrowing in the face or throat.",
    },
    {
      value: "excessive_clench",
      label: "Excessive Clench",
      description: "The face and throat feel tightly braced, over-held, or compressed.",
    },
  ],
  heart: [
    {
      value: "steady_heart_integration",
      label: "Steady Heart Integration",
      description: "The heartspace feels steady, connected, and internally coherent.",
    },
    {
      value: "increasing_pulse_activation",
      label: "Increasing Pulse Activation",
      description: "The heart feels activated, quickening, or mobilized.",
    },
    {
      value: "the_release_expansion",
      label: "Release & Expansion",
      description: "Something through the heart feels like it wants to soften or open out.",
    },
    {
      value: "pounding_heart_waver",
      label: "Pounding Heart Waver",
      description: "The heartbeat feels strong, irregular, or emotionally charged.",
    },
    {
      value: "heart_ache_chaos",
      label: "Heart Ache & Chaos",
      description: "The heartspace feels painful, flooded, or emotionally disorganized.",
    },
  ],
  chest: [
    {
      value: "calm",
      label: "Calm",
      description: "The chest feels open enough for a grounded, even breath.",
    },
    {
      value: "unrest",
      label: "Unrest",
      description: "The chest feels unsettled, watchful, or unable to fully land.",
    },
    {
      value: "spiral",
      label: "Spiral",
      description: "The breath and energy feel like they are climbing or circling upward.",
    },
    {
      value: "tightness",
      label: "Tightness",
      description: "There is compression, bracing, or held pressure across the chest.",
    },
  ],
  stomach: [
    {
      value: "butterflies",
      label: "Butterflies",
      description: "The belly feels light, fluttery, and anticipatory.",
    },
    {
      value: "whirlpool",
      label: "Whirlpool",
      description: "The gut feels swirling, unsettled, or emotionally mixed.",
    },
    {
      value: "armour",
      label: "Armour",
      description: "The stomach feels protected, braced, or hardened against contact.",
    },
  ],
  hands_legs: [
    {
      value: "calm",
      label: "Calm",
      description: "The limbs feel settled and available for grounded movement.",
    },
    {
      value: "springy",
      label: "Springy",
      description: "There is gentle energy and readiness in the limbs.",
    },
    {
      value: "sluggish",
      label: "Sluggish",
      description: "Movement feels heavy, slowed, or hard to initiate.",
    },
    {
      value: "fidgety",
      label: "Fidgety",
      description: "The limbs want small repetitive movement or discharge.",
    },
    {
      value: "braced",
      label: "Braced",
      description: "The arms or legs feel guarded, locked, or held for protection.",
    },
    {
      value: "contracted",
      label: "Contracted",
      description: "The limbs feel pulled inward, shortened, or withdrawn.",
    },
  ],
};

export const somaticRegionOptions = (Object.entries(somaticRegionMeta) as Array<
  [SomaticRegionKey, SomaticRegionMeta]
>).map(([value, meta]) => ({
  value,
  label: meta.label,
})) as ReadonlyArray<{ value: SomaticRegionKey; label: string }>;

export const getSomaticSensationOptions = (region: SomaticRegionKey) =>
  somaticSensationCatalog[region];

export const humanizeKey = (value: string) =>
  value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

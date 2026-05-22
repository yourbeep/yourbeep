export const awarenessActivationOptions = [
  { value: "excitement_enthusiasm", label: "Excitement & Enthusiasm" },
  { value: "alert_nervous", label: "Alert & Nervous" },
  { value: "irritation_rage", label: "Irritation & Rage" },
  { value: "calm_steady", label: "Calm & Steady" },
  { value: "resilient_contesting", label: "Resilient & Contesting" },
  { value: "stuck_rigid", label: "Stuck & Rigid" },
] as const;

export const awarenessExpansionOptions = [
  { value: "joy_abundance", label: "Joy & Abundance" },
  { value: "surprise_embrace", label: "Surprise & Embrace" },
  { value: "spiralling_enveloped", label: "Spiralling & Enveloped" },
  { value: "compassion_acceptance", label: "Compassion & Acceptance" },
  { value: "protection_resistance", label: "Protection & Resistance" },
  { value: "repress_conflicted", label: "Repress & Conflicted" },
] as const;

export const awarenessDomainOptions = [
  { value: "work", label: "Work" },
  { value: "relationships", label: "Relationships" },
  { value: "family", label: "Family" },
  { value: "finances", label: "Finances" },
  { value: "personal_development", label: "Personal Development" },
  { value: "health", label: "Health" },
  { value: "previous_stress", label: "Previous Stress" },
] as const;

export const awarenessRootCauseOptions = [
  { value: "learned_emotional_strategy", label: "Learned emotional strategy" },
  { value: "recurring_environmental_stressor", label: "Recurring environmental stressor" },
  { value: "protective_belief_or_meaning", label: "Protective belief or meaning" },
  { value: "unmet_need", label: "Unmet need" },
] as const;

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

export const somaticRegionOptions = [
  { value: "head", label: "Head" },
  { value: "face_throat", label: "Face & Throat" },
  { value: "heart", label: "Heart" },
  { value: "chest", label: "Chest" },
  { value: "stomach", label: "Stomach" },
  { value: "hands_legs", label: "Hands & Legs" },
] as const;

export const patternCirclePatternOptions = [
  { value: "expansive", label: "Expansive" },
  { value: "scattered", label: "Scattered" },
  { value: "defined_spatial", label: "Defined spatial" },
  { value: "contained", label: "Contained" },
] as const;

export const patternDirectionPatternOptions = [
  { value: "defined_spatial", label: "Defined spatial" },
  { value: "scattered", label: "Scattered" },
  { value: "undefined_scattered", label: "Undefined scattered" },
  { value: "contained", label: "Contained" },
] as const;

export const spacingOptions = [
  { value: "wide", label: "Wide" },
  { value: "medium", label: "Medium" },
  { value: "narrow", label: "Narrow" },
] as const;

export const intervalPatternOptions = [
  { value: "wide_to_narrow", label: "Wide to narrow" },
  { value: "narrow_to_wide", label: "Narrow to wide" },
  { value: "medium", label: "Medium" },
  { value: "even", label: "Even rhythm" },
] as const;

export const reflectActionOptions = [
  { value: "acceptance", label: "Acceptance" },
  { value: "transfer", label: "Transfer" },
  { value: "remediation", label: "Remediation" },
  { value: "redesign", label: "Redesign" },
  { value: "no_action", label: "No action yet" },
] as const;

export const humanizeKey = (value: string) =>
  value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

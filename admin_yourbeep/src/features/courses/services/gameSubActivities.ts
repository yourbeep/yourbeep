export type GameSubActivityOption = {
  value: string;
  label: string;
  description: string;
};

const awarenessSubActivities: GameSubActivityOption[] = [
  {
    value: "mapping_life_domains",
    label: "Mapping Your Life Domains",
    description: "Choose two high-resource and two low-resource life domains.",
  },
  {
    value: "daily_activation",
    label: "Daily Activation",
    description: "Open the immediate activation map for the learner's present state.",
  },
  {
    value: "expansion_check",
    label: "Expansion Check",
    description: "Open the expansion or contraction mapping sequence.",
  },
];

const patternSubActivities: GameSubActivityOption[] = [
  {
    value: "draw_your_breath",
    label: "Draw Your Breath",
    description: "The first pattern-awareness drawing exercise.",
  },
  {
    value: "awareness_circles",
    label: "Awareness Circles",
    description: "The second pattern-awareness mapping exercise.",
  },
  {
    value: "scribble_drawing",
    label: "Scribble Drawing",
    description: "The third pattern-awareness expressive drawing exercise.",
  },
];

const somaticSubActivities: GameSubActivityOption[] = [
  ["60_second_cognitive_check", "60 Second Cognitive Check"],
  ["expand_the_window", "Expand the Window"],
  ["co2_indicator", "CO2 Indicator Check"],
  ["co2_rebalancing", "CO2 Rebalancing"],
  ["sensory_anchoring", "Sensory Anchoring"],
  ["flexibility_check", "Flexibility Check"],
  ["cognitive_diffusion_drill", "Cognitive Diffusion Drill"],
  ["fatigue_check", "Fatigue Check"],
  ["clench_detection_drill", "Clench Detection Drill"],
  ["jaw_awareness_reset", "Jaw Awareness Reset"],
  ["throat_openness_check", "Throat Openness Check"],
  ["belly_breathing", "Belly Breathing"],
  ["neck_release_awareness", "Neck Release Awareness"],
  ["shoulder_drop", "Shoulder Drop"],
  ["baseline_pulse_awareness", "Baseline Pulse Awareness"],
  ["activation_differentiation_test", "Activation Differentiation Test"],
  ["coherence_breathing", "Coherence Breathing"],
  ["expansion_allowance", "Expansion Allowance"],
  ["sternum_pec_stretch", "Sternum & Pec Stretch"],
  ["shoulder_neck_stretch", "Shoulder & Neck Stretch"],
  ["diaphragmatic_baseline_check", "Diaphragmatic Baseline Check"],
  ["360_breathing", "360 Breathing"],
  ["co2_check", "CO2 Check"],
  ["breath_hold_exercise", "Breath Hold Exercise"],
  ["chest_tightness_vulnerability_check", "Chest Tightness Check"],
  ["light_shoulder_arm_movements", "Light Shoulder and Arm Movements"],
  ["lie_on_bed_head_back", "Head Back Rest"],
  ["abdominal_scan", "Abdominal Scan"],
  ["belly_softening", "Belly Softening"],
  ["safety_cue", "Safety Cue"],
  ["gut_reaction", "Gut Reaction Inquiry"],
  ["grounding_drill", "Grounding Drill"],
  ["freeze_check", "Freeze Check"],
  ["rhythmic_grounding", "Rhythmic Grounding"],
  ["fist_clench_release", "Fist Clench Release"],
  ["proprioception_grounding", "Proprioception Grounding"],
].map(([value, label]) => ({
  value,
  label,
  description: `${label} somatic activity.`,
}));

const gameSubActivities: Record<string, GameSubActivityOption[]> = {
  awareness_states: awarenessSubActivities,
  pattern_awareness: patternSubActivities,
  somatic_states: somaticSubActivities,
  reflect_act: [],
};

export const getGameSubActivityOptions = (gameKey?: string | null) =>
  (gameKey ? gameSubActivities[gameKey] : null) ?? [];

export const getGameSubActivityLabel = (gameKey?: string | null, subActivityKey?: string | null) =>
  getGameSubActivityOptions(gameKey).find((item) => item.value === subActivityKey)?.label ?? null;

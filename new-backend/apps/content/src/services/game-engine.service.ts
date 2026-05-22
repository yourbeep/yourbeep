type AwarenessFlowStability = "Equilibrium" | "Waver" | "Chaos";
type AwarenessOrientation = "Activation" | "Grounding" | "Expansion" | "Embodiment";

type AwarenessStateMeta = {
  state: string;
  detectedState: string;
  energyOrientation: AwarenessOrientation;
  energyDescription: string;
  flowStability: AwarenessFlowStability;
  flowDescription: string;
  synthesisTitle: string;
  synthesisDescription: string;
  score: 1 | 2 | 3;
  metrics: {
    sensoryLoad: string;
    vagalInterference: "Low" | "Moderate" | "High";
  };
};

const awarenessStateMeta: Record<string, AwarenessStateMeta> = {
  excitement_enthusiasm: {
    state: "excitement_enthusiasm",
    detectedState: "Excitement & Enthusiasm",
    energyOrientation: "Activation",
    energyDescription: "Heightened neural response with energized readiness and purposeful momentum.",
    flowStability: "Equilibrium",
    flowDescription: "Steady focus and consistent regulation without internal fragmentation.",
    synthesisTitle: "Momentum with Stability",
    synthesisDescription: "Activation with Equilibrium suggests energized engagement that remains coherent and directed.",
    score: 3,
    metrics: { sensoryLoad: "42%", vagalInterference: "Low" },
  },
  alert_nervous: {
    state: "alert_nervous",
    detectedState: "Alert & Nervous",
    energyOrientation: "Activation",
    energyDescription: "Heightened neural response and systemic readiness with increased anticipatory scanning.",
    flowStability: "Waver",
    flowDescription: "Oscillating focus marked by internal tension and partial loss of steady regulation.",
    synthesisTitle: "Friction in the Pathway",
    synthesisDescription: "The intersection of Activation and Waver indicates mobilized energy meeting instability and vigilance.",
    score: 2,
    metrics: { sensoryLoad: "87%", vagalInterference: "High" },
  },
  irritation_rage: {
    state: "irritation_rage",
    detectedState: "Irritation & Rage",
    energyOrientation: "Activation",
    energyDescription: "Escalated activation with high charge, urgency, and aggressive protective mobilization.",
    flowStability: "Chaos",
    flowDescription: "Fragmented regulation where attention, emotion, and response pathways become disorganized.",
    synthesisTitle: "Overdriven Activation",
    synthesisDescription: "Activation with Chaos suggests a system under strain, responding with force before regulation can settle.",
    score: 1,
    metrics: { sensoryLoad: "94%", vagalInterference: "High" },
  },
  calm_steady: {
    state: "calm_steady",
    detectedState: "Calm & Steady",
    energyOrientation: "Grounding",
    energyDescription: "Settled grounding with physiological downshift and dependable internal support.",
    flowStability: "Equilibrium",
    flowDescription: "Balanced regulation with stable attention and embodied steadiness.",
    synthesisTitle: "Anchored Regulation",
    synthesisDescription: "Grounding with Equilibrium indicates a regulated base state that supports reflection and integration.",
    score: 3,
    metrics: { sensoryLoad: "28%", vagalInterference: "Low" },
  },
  resilient_contesting: {
    state: "resilient_contesting",
    detectedState: "Resilient & Contesting",
    energyOrientation: "Grounding",
    energyDescription: "Grounded effort that still carries friction, resistance, or guarded persistence.",
    flowStability: "Waver",
    flowDescription: "Partial steadiness interrupted by tension, pushback, or defensive holding.",
    synthesisTitle: "Guarded Stability",
    synthesisDescription: "Grounding with Waver reflects resilience that is present but still negotiating internal resistance.",
    score: 2,
    metrics: { sensoryLoad: "61%", vagalInterference: "Moderate" },
  },
  stuck_rigid: {
    state: "stuck_rigid",
    detectedState: "Stuck & Rigid",
    energyOrientation: "Grounding",
    energyDescription: "Collapsed or fixed grounding where response options narrow and flexibility drops away.",
    flowStability: "Chaos",
    flowDescription: "Disrupted flow expressed through immobilization, constriction, or inflexible defensive holding.",
    synthesisTitle: "Constricted Grounding",
    synthesisDescription: "Grounding with Chaos suggests immobilized protection rather than settled embodied regulation.",
    score: 1,
    metrics: { sensoryLoad: "76%", vagalInterference: "High" },
  },
  joy_abundance: {
    state: "joy_abundance",
    detectedState: "Joy & Abundance",
    energyOrientation: "Expansion",
    energyDescription: "Open outward orientation with receptivity, possibility, and positive energetic spread.",
    flowStability: "Equilibrium",
    flowDescription: "Sustained openness without fragmentation or overwhelm.",
    synthesisTitle: "Open Flourishing",
    synthesisDescription: "Expansion with Equilibrium indicates broad receptivity that remains coherent and supported.",
    score: 3,
    metrics: { sensoryLoad: "36%", vagalInterference: "Low" },
  },
  surprise_embrace: {
    state: "surprise_embrace",
    detectedState: "Surprise & Embrace",
    energyOrientation: "Expansion",
    energyDescription: "Expanding orientation with curiosity and movement toward new experience.",
    flowStability: "Waver",
    flowDescription: "Open but fluctuating engagement where novelty introduces some instability.",
    synthesisTitle: "Opening Under Tension",
    synthesisDescription: "Expansion with Waver suggests movement toward possibility while regulation is still adjusting.",
    score: 2,
    metrics: { sensoryLoad: "58%", vagalInterference: "Moderate" },
  },
  spiralling_enveloped: {
    state: "spiralling_enveloped",
    detectedState: "Spiralling & Enveloped",
    energyOrientation: "Expansion",
    energyDescription: "Unbounded outward spread that risks overwhelm, loss of containment, or cognitive flooding.",
    flowStability: "Chaos",
    flowDescription: "Destabilized openness where expansion loses coherence and becomes consuming.",
    synthesisTitle: "Overextended Field",
    synthesisDescription: "Expansion with Chaos reflects outward movement without sufficient containment or grounding.",
    score: 1,
    metrics: { sensoryLoad: "91%", vagalInterference: "High" },
  },
  compassion_acceptance: {
    state: "compassion_acceptance",
    detectedState: "Compassion & Acceptance",
    energyOrientation: "Embodiment",
    energyDescription: "Inward and outward integration marked by receptivity, compassion, and embodied connection.",
    flowStability: "Equilibrium",
    flowDescription: "Stable integration across attention, feeling, and bodily presence.",
    synthesisTitle: "Integrated Presence",
    synthesisDescription: "Embodiment with Equilibrium suggests connected awareness that can hold complexity without fragmenting.",
    score: 3,
    metrics: { sensoryLoad: "31%", vagalInterference: "Low" },
  },
  protection_resistance: {
    state: "protection_resistance",
    detectedState: "Protection & Resistance",
    energyOrientation: "Embodiment",
    energyDescription: "Embodied awareness is present, but it is guarded by protective reflexes and boundary tension.",
    flowStability: "Waver",
    flowDescription: "Intermittent connection where self-protection competes with openness and integration.",
    synthesisTitle: "Guarded Contact",
    synthesisDescription: "Embodiment with Waver indicates partial connection to self and others, filtered through defense.",
    score: 2,
    metrics: { sensoryLoad: "64%", vagalInterference: "Moderate" },
  },
  repress_conflicted: {
    state: "repress_conflicted",
    detectedState: "Repress & Conflicted",
    energyOrientation: "Embodiment",
    energyDescription: "Embodied signals are constrained, conflicted, or pushed out of awareness to maintain protection.",
    flowStability: "Chaos",
    flowDescription: "Disorganized embodiment where internal conflict disrupts integration and clarity.",
    synthesisTitle: "Fragmented Embodiment",
    synthesisDescription: "Embodiment with Chaos points to internal conflict and suppression overwhelming coherent presence.",
    score: 1,
    metrics: { sensoryLoad: "88%", vagalInterference: "High" },
  },
};

const normalizeOrientationLabel = (orientation: AwarenessOrientation) => orientation;
const normalizeFlowLabel = (flow: AwarenessFlowStability) =>
  flow === "Equilibrium" ? "Stable" : flow;

const selectDominantAwarenessState = (states: string[]) => {
  const metas = states.map((state) => awarenessStateMeta[state]).filter(Boolean);
  if (!metas.length) {
    throw new Error("Unknown awareness state");
  }

  return metas.sort((left, right) => left.score - right.score)[0]!;
};

export const buildAwarenessResultMapping = (states: string[]) => {
  const dominant = selectDominantAwarenessState(states);
  const averageScore = Number(
    (
      states
        .map((state) => awarenessStateMeta[state]?.score ?? dominant.score)
        .reduce((sum, value) => sum + value, 0) / states.length
    ).toFixed(2),
  );

  return {
    score: averageScore,
    resultMapping: {
      detectedState: dominant.detectedState,
      energyOrientation: {
        label: normalizeOrientationLabel(dominant.energyOrientation),
        description: dominant.energyDescription,
      },
      flowStability: {
        label: normalizeFlowLabel(dominant.flowStability),
        description: dominant.flowDescription,
      },
      stateSynthesis: {
        title: dominant.synthesisTitle,
        description: dominant.synthesisDescription,
      },
      metrics: dominant.metrics,
    },
  };
};

const somaticSequences = {
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

type ActivityDetail = {
  activityKey: string;
  title: string;
  subtitle: string;
  type: "timed_exercise" | "awareness_test" | "movement_exercise";
  instruction: string;
  durationSeconds?: number;
  canSkip: boolean;
  ui: {
    animationType: string;
    imageKey?: string;
  };
};

const somaticActivityCatalog: Record<string, ActivityDetail> = {
  "60_second_cognitive_check": {
    activityKey: "60_second_cognitive_check",
    title: "60 Second Cognitive Check",
    subtitle: "Mental Clarity Snapshot",
    type: "awareness_test",
    instruction: "Track clarity, attention, and internal speed for one minute without trying to change them.",
    durationSeconds: 60,
    canSkip: true,
    ui: { animationType: "timer_circle", imageKey: "cognitive_check" },
  },
  expand_the_window: {
    activityKey: "expand_the_window",
    title: "Expand the Window",
    subtitle: "Broaden Awareness",
    type: "timed_exercise",
    instruction: "Gently widen visual and bodily awareness while staying anchored in the present environment.",
    durationSeconds: 300,
    canSkip: true,
    ui: { animationType: "timer_circle", imageKey: "window_awareness" },
  },
  co2_indicator: {
    activityKey: "co2_indicator",
    title: "CO2 Indicator Check",
    subtitle: "Breath Regulation Test",
    type: "awareness_test",
    instruction: "Notice whether lightness, disorientation, or shallow breathing suggest a CO2 imbalance.",
    durationSeconds: 60,
    canSkip: true,
    ui: { animationType: "pulse_dots", imageKey: "breath_indicator" },
  },
  co2_rebalancing: {
    activityKey: "co2_rebalancing",
    title: "CO2 Rebalancing",
    subtitle: "Slow the Breath",
    type: "timed_exercise",
    instruction: "Reduce breathing intensity and slow the exhale to rebalance your breathing pattern.",
    durationSeconds: 180,
    canSkip: true,
    ui: { animationType: "breath_wave", imageKey: "co2_balance" },
  },
  sensory_anchoring: {
    activityKey: "sensory_anchoring",
    title: "Sensory Anchoring",
    subtitle: "Return to Orientation",
    type: "movement_exercise",
    instruction: "Use sight, sound, and touch cues around you to re-orient and settle your system.",
    durationSeconds: 180,
    canSkip: true,
    ui: { animationType: "focus_rings", imageKey: "sensory_anchor" },
  },
  flexibility_check: {
    activityKey: "flexibility_check",
    title: "Flexibility Check",
    subtitle: "Assess Cognitive Range",
    type: "awareness_test",
    instruction: "Check how adaptable your thinking feels right now and whether the mind feels fixed or fluid.",
    durationSeconds: 90,
    canSkip: true,
    ui: { animationType: "toggle_scale", imageKey: "cognitive_flexibility" },
  },
  cognitive_diffusion_drill: {
    activityKey: "cognitive_diffusion_drill",
    title: "Cognitive Diffusion Drill",
    subtitle: "Loosen Thought Fusion",
    type: "timed_exercise",
    instruction: "Notice thoughts as events rather than facts and allow them to pass without chasing them.",
    durationSeconds: 180,
    canSkip: true,
    ui: { animationType: "timer_circle", imageKey: "diffusion" },
  },
  fatigue_check: {
    activityKey: "fatigue_check",
    title: "Fatigue Check",
    subtitle: "Energy Availability",
    type: "awareness_test",
    instruction: "Assess whether heaviness reflects depletion, shutdown, or the need for physiological recovery.",
    durationSeconds: 60,
    canSkip: true,
    ui: { animationType: "bars", imageKey: "fatigue" },
  },
  clench_detection_drill: {
    activityKey: "clench_detection_drill",
    title: "Clench Detection Drill",
    subtitle: "Locate Holding",
    type: "awareness_test",
    instruction: "Scan the jaw, throat, and facial muscles for gripping, clenching, or holding patterns.",
    durationSeconds: 60,
    canSkip: true,
    ui: { animationType: "pulse_dots", imageKey: "jaw_anatomy" },
  },
  jaw_awareness_reset: {
    activityKey: "jaw_awareness_reset",
    title: "Jaw Awareness Exercise",
    subtitle: "Releasing Tension",
    type: "timed_exercise",
    instruction: "Drop the lower jaw and allow a small gap between the teeth while keeping the face soft.",
    durationSeconds: 180,
    canSkip: true,
    ui: { animationType: "timer_circle", imageKey: "jaw_anatomy" },
  },
  throat_openness_check: {
    activityKey: "throat_openness_check",
    title: "Throat Openness Check",
    subtitle: "Expression and Breath",
    type: "awareness_test",
    instruction: "Notice whether the throat feels open, guarded, tight, or restricted during breath and swallowing.",
    durationSeconds: 60,
    canSkip: true,
    ui: { animationType: "focus_rings", imageKey: "throat" },
  },
  belly_breathing: {
    activityKey: "belly_breathing",
    title: "Belly Breathing",
    subtitle: "Downshift the System",
    type: "timed_exercise",
    instruction: "Let the breath move low into the belly with soft expansion on the inhale and release on the exhale.",
    durationSeconds: 180,
    canSkip: true,
    ui: { animationType: "breath_wave", imageKey: "belly_breath" },
  },
  neck_release_awareness: {
    activityKey: "neck_release_awareness",
    title: "Neck Release Awareness",
    subtitle: "Reduce Bracing",
    type: "movement_exercise",
    instruction: "Notice and soften protective holding in the neck without forcing range of motion.",
    durationSeconds: 120,
    canSkip: true,
    ui: { animationType: "sway", imageKey: "neck_release" },
  },
  shoulder_drop: {
    activityKey: "shoulder_drop",
    title: "Shoulder Drop",
    subtitle: "Release Upward Tension",
    type: "movement_exercise",
    instruction: "Lift slightly, exhale, and allow the shoulders to drop without pushing them down.",
    durationSeconds: 90,
    canSkip: true,
    ui: { animationType: "sway", imageKey: "shoulders" },
  },
  baseline_pulse_awareness: {
    activityKey: "baseline_pulse_awareness",
    title: "Baseline Pulse Awareness",
    subtitle: "Track Heart Rhythm",
    type: "awareness_test",
    instruction: "Observe your pulse without changing it and notice whether it feels settled, activated, or irregular.",
    durationSeconds: 60,
    canSkip: true,
    ui: { animationType: "pulse_dots", imageKey: "heart" },
  },
  activation_differentiation_test: {
    activityKey: "activation_differentiation_test",
    title: "Activation Differentiation Test",
    subtitle: "Name the Charge",
    type: "awareness_test",
    instruction: "Differentiate excitement, urgency, fear, and mobilization without collapsing them into one feeling.",
    durationSeconds: 90,
    canSkip: true,
    ui: { animationType: "bars", imageKey: "activation" },
  },
  coherence_breathing: {
    activityKey: "coherence_breathing",
    title: "Coherence Breathing",
    subtitle: "Stabilize Rhythm",
    type: "timed_exercise",
    instruction: "Breathe in a slow rhythmic pattern to support cardiovascular and nervous system coherence.",
    durationSeconds: 180,
    canSkip: true,
    ui: { animationType: "breath_wave", imageKey: "coherence" },
  },
  expansion_allowance: {
    activityKey: "expansion_allowance",
    title: "Expansion Allowance",
    subtitle: "Make Space for Feeling",
    type: "timed_exercise",
    instruction: "Allow the chest and heart area to expand while noticing what emotions arise without suppressing them.",
    durationSeconds: 180,
    canSkip: true,
    ui: { animationType: "focus_rings", imageKey: "expansion" },
  },
  sternum_pec_stretch: {
    activityKey: "sternum_pec_stretch",
    title: "Sternum and Pec Stretch",
    subtitle: "Front Body Opening",
    type: "movement_exercise",
    instruction: "Open the front chest gently to reduce guarding across the sternum and pectoral area.",
    durationSeconds: 120,
    canSkip: true,
    ui: { animationType: "sway", imageKey: "sternum" },
  },
  shoulder_neck_stretch: {
    activityKey: "shoulder_neck_stretch",
    title: "Shoulder and Neck Stretch",
    subtitle: "Reduce Carry Load",
    type: "movement_exercise",
    instruction: "Ease tension through the neck and shoulders with slow, supported movement.",
    durationSeconds: 120,
    canSkip: true,
    ui: { animationType: "sway", imageKey: "neck_release" },
  },
  diaphragmatic_baseline_check: {
    activityKey: "diaphragmatic_baseline_check",
    title: "Diaphragmatic Baseline Check",
    subtitle: "Breath Foundation",
    type: "awareness_test",
    instruction: "Observe whether the breath naturally reaches the diaphragm or remains shallow and upper-chest led.",
    durationSeconds: 60,
    canSkip: true,
    ui: { animationType: "bars", imageKey: "diaphragm" },
  },
  "360_breathing": {
    activityKey: "360_breathing",
    title: "360 Breathing",
    subtitle: "Expand Around the Ribcage",
    type: "timed_exercise",
    instruction: "Breathe into the front, sides, and back of the ribcage to increase spatial breath awareness.",
    durationSeconds: 180,
    canSkip: true,
    ui: { animationType: "breath_wave", imageKey: "ribcage" },
  },
  co2_check: {
    activityKey: "co2_check",
    title: "CO2 Check",
    subtitle: "Assess Breath Efficiency",
    type: "awareness_test",
    instruction: "Notice whether fast, shallow, or dysregulated breathing suggests reduced CO2 tolerance.",
    durationSeconds: 60,
    canSkip: true,
    ui: { animationType: "pulse_dots", imageKey: "breath_indicator" },
  },
  breath_hold_exercise: {
    activityKey: "breath_hold_exercise",
    title: "Breath Hold Exercise",
    subtitle: "Build Tolerance",
    type: "timed_exercise",
    instruction: "Use a gentle breath-hold pattern to build tolerance without forcing or straining.",
    durationSeconds: 120,
    canSkip: true,
    ui: { animationType: "timer_circle", imageKey: "breath_hold" },
  },
  chest_tightness_vulnerability_check: {
    activityKey: "chest_tightness_vulnerability_check",
    title: "Chest Tightness Check",
    subtitle: "Explore the Guarding",
    type: "awareness_test",
    instruction: "Notice whether the tightness feels like protection, suppression, or fear of softening.",
    durationSeconds: 90,
    canSkip: true,
    ui: { animationType: "focus_rings", imageKey: "chest" },
  },
  light_shoulder_arm_movements: {
    activityKey: "light_shoulder_arm_movements",
    title: "Light Shoulder and Arm Movements",
    subtitle: "Invite Mobility",
    type: "movement_exercise",
    instruction: "Introduce light movement through shoulders and arms to reduce held defensive posture.",
    durationSeconds: 120,
    canSkip: true,
    ui: { animationType: "sway", imageKey: "shoulders" },
  },
  lie_on_bed_head_back: {
    activityKey: "lie_on_bed_head_back",
    title: "Head Back Rest",
    subtitle: "Open the Front Body",
    type: "movement_exercise",
    instruction: "Rest with the head supported back to allow the chest and throat to soften open.",
    durationSeconds: 180,
    canSkip: true,
    ui: { animationType: "still_pose", imageKey: "rest_pose" },
  },
  abdominal_scan: {
    activityKey: "abdominal_scan",
    title: "Abdominal Scan",
    subtitle: "Locate Gut Holding",
    type: "awareness_test",
    instruction: "Scan the abdomen and pelvis for churning, bracing, contraction, or emptiness.",
    durationSeconds: 90,
    canSkip: true,
    ui: { animationType: "focus_rings", imageKey: "abdomen" },
  },
  belly_softening: {
    activityKey: "belly_softening",
    title: "Belly Softening",
    subtitle: "Reduce Guarding",
    type: "timed_exercise",
    instruction: "Allow the abdominal wall to soften gradually without forcing release.",
    durationSeconds: 180,
    canSkip: true,
    ui: { animationType: "breath_wave", imageKey: "belly_breath" },
  },
  safety_cue: {
    activityKey: "safety_cue",
    title: "Safety Cue",
    subtitle: "Signal Enough Safety",
    type: "awareness_test",
    instruction: "Find a concrete cue that lets the body register even a small amount of safety.",
    durationSeconds: 60,
    canSkip: true,
    ui: { animationType: "pulse_dots", imageKey: "safety" },
  },
  gut_reaction: {
    activityKey: "gut_reaction",
    title: "Gut Reaction Inquiry",
    subtitle: "Name the Signal",
    type: "awareness_test",
    instruction: "Notice whether the gut response feels like fear, anticipation, protection, or aversion.",
    durationSeconds: 60,
    canSkip: true,
    ui: { animationType: "bars", imageKey: "gut" },
  },
  grounding_drill: {
    activityKey: "grounding_drill",
    title: "Grounding Drill",
    subtitle: "Reconnect Through Contact",
    type: "movement_exercise",
    instruction: "Use the feet, hands, and support surface to reinforce body contact and present-moment orientation.",
    durationSeconds: 120,
    canSkip: true,
    ui: { animationType: "pulse_dots", imageKey: "grounding" },
  },
  freeze_check: {
    activityKey: "freeze_check",
    title: "Freeze Check",
    subtitle: "Assess Shutdown",
    type: "awareness_test",
    instruction: "Notice whether sluggishness comes from low energy, protective shutdown, or motor inhibition.",
    durationSeconds: 60,
    canSkip: true,
    ui: { animationType: "bars", imageKey: "freeze" },
  },
  rhythmic_grounding: {
    activityKey: "rhythmic_grounding",
    title: "Rhythmic Grounding",
    subtitle: "Restore Movement",
    type: "movement_exercise",
    instruction: "Introduce simple rhythmic motion to bring the body back toward organized engagement.",
    durationSeconds: 150,
    canSkip: true,
    ui: { animationType: "sway", imageKey: "grounding" },
  },
  fist_clench_release: {
    activityKey: "fist_clench_release",
    title: "Fist Clench Release",
    subtitle: "Discharge Held Activation",
    type: "movement_exercise",
    instruction: "Clench and release the fists slowly to notice and reduce held charge.",
    durationSeconds: 90,
    canSkip: true,
    ui: { animationType: "pulse_dots", imageKey: "hands" },
  },
  proprioception_grounding: {
    activityKey: "proprioception_grounding",
    title: "Proprioception Grounding",
    subtitle: "Rebuild Body Boundaries",
    type: "movement_exercise",
    instruction: "Use pressure, weight, and joint awareness to re-establish clear physical boundaries.",
    durationSeconds: 150,
    canSkip: true,
    ui: { animationType: "focus_rings", imageKey: "body_map" },
  },
};

export const getSomaticSequence = (region: string, sensation: string) => {
  const regionMap = somaticSequences[region as keyof typeof somaticSequences];
  const sequence = regionMap?.[sensation as keyof typeof regionMap];
  if (!sequence) {
    throw new Error(`Unsupported region/sensation combination: ${region}/${sensation}`);
  }
  return [...sequence];
};

export const getActivityDetail = (activityKey: string) => {
  const activity = somaticActivityCatalog[activityKey];
  if (!activity) {
    throw new Error(`Activity not found: ${activityKey}`);
  }
  return activity;
};

export const listSomaticActivityDetails = () => Object.values(somaticActivityCatalog).map((activity) => ({ ...activity }));

export const getAwarenessScoreLabel = (score: number) => {
  if (score >= 2.5) return "Stable";
  if (score >= 1.75) return "Waver";
  return "Chaos";
};

export const getSomaticScoreLabel = (score: number) => {
  if (score >= 2.5) return "Integrated";
  if (score >= 1.75) return "Mixed";
  return "Dysregulated";
};

export const getPatternScoreLabel = (score: number) => {
  if (score >= 2.5) return "High";
  if (score >= 1.75) return "Medium";
  return "Low";
};

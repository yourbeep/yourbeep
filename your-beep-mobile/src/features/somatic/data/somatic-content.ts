import type { SomaticRegion } from '@/lib/api/types';

import { appImages } from '@/constants/images';
import type {
  ChestBreathDominance,
  ChestStateId,
  FaceThroatSensationId,
  HandsLegsStateId,
  HeadSensationId,
  HeartStateId,
  StomachBracingGroup,
  StomachBracingSignalId,
  StomachStateId,
} from '@/features/somatic/store/somatic-slice';

export interface SomaticRegionDot {
  active?: boolean;
  id: SomaticRegion;
  label: string;
  x: number;
  y: number;
}

export interface HeadSensationOption {
  accent: string;
  description: string;
  id: HeadSensationId;
  route:
    | '/somatic-head-cognitive-check'
    | '/somatic-head-co2-indicator'
    | '/somatic-head-flexibility-check';
  title: string;
  tone: 'mist' | 'sky' | 'sand';
}

export interface FaceThroatSensationOption {
  accent: string;
  description: string;
  id: FaceThroatSensationId;
  route:
    | '/somatic-face-throat-clench-detection'
    | '/somatic-face-throat-relaxed-bright';
  title: string;
  tone: 'mist' | 'sky' | 'sand';
}

export interface HeartStateOption {
  accent: string;
  description: string;
  icon: string;
  id: HeartStateId;
  route:
    | '/somatic-heart-activation-differentiation'
    | '/somatic-heart-baseline-pulse'
    | '/somatic-heart-expansion-allowance';
  title: string;
  tone: 'mist' | 'sky' | 'sand';
}

export interface ChestStateOption {
  accent: string;
  description: string;
  id: ChestStateId;
  route:
    | '/somatic-chest-diaphragmatic-baseline'
    | '/somatic-chest-co2-check'
    | '/somatic-chest-tightness-check';
  title: string;
  tone: 'mist' | 'sky' | 'sand';
}

export interface StomachStateOption {
  accent: string;
  description: string;
  id: StomachStateId;
  route: '/somatic-stomach-bracing-signals' | '/somatic-stomach-belly-softening';
  title: string;
  tone: 'mist' | 'sky' | 'sand';
}

export interface HandsLegsStateOption {
  icon: HandsLegsStateId;
  id: HandsLegsStateId;
  title: string;
  tone: 'mist' | 'sky' | 'sand';
}

export const somaticRegionDots: readonly SomaticRegionDot[] = [
  { active: true, id: 'head', label: 'Head', x: 54, y: 14 },
  { active: true, id: 'face-throat', label: 'Face & throat', x: 58, y: 30 },
  { active: true, id: 'heart', label: 'Heart', x: 28, y: 54 },
  { active: true, id: 'chest', label: 'Chest', x: 52, y: 47 },
  { active: true, id: 'stomach', label: 'Stomach', x: 51, y: 69 },
  { active: true, id: 'hands-legs', label: 'Hands & legs', x: 86, y: 73 },
] as const;

export const headSensations: readonly HeadSensationOption[] = [
  {
    accent: '#D6A869',
    description: 'Clarity, alert awareness, and visual sharpness.',
    id: 'brightness-clear-focus',
    route: '/somatic-head-cognitive-check',
    title: 'Brightness & Clear Focus',
    tone: 'sand',
  },
  {
    accent: '#A98C67',
    description: 'Pressure, dullness, or muted sensory processing.',
    id: 'heaviness-fog',
    route: '/somatic-head-flexibility-check',
    title: 'Heaviness / Fog',
    tone: 'mist',
  },
  {
    accent: '#77C8DE',
    description: 'Lightheadedness, float, and unstable internal orientation.',
    id: 'dizzy-spacey',
    route: '/somatic-head-co2-indicator',
    title: 'Dizzy / Spacey',
    tone: 'sky',
  },
  
] as const;

export const headSensationVisuals = {
  'brightness-clear-focus': appImages.Brightness,
  'dizzy-spacey': appImages.Dizzy,
  'heaviness-fog': appImages.HeavyFog,
} as const;

export const faceThroatSensations: readonly FaceThroatSensationOption[] = [
  {
    accent: '#7DC69A',
    description: 'Ease across jaw, throat, and facial expression.',
    id: 'relaxed-bright',
    route: '/somatic-face-throat-relaxed-bright',
    title: 'Relaxed & Bright',
    tone: 'sky',
  },
  {
    accent: '#D6B860',
    description: 'A quiet hold or subtle bracing through the throat.',
    id: 'subtle-tension',
    route: '/somatic-face-throat-clench-detection',
    title: 'Subtle Tension',
    tone: 'sand',
  },
  {
    accent: '#CE8C8C',
    description: 'Visible clench, compression, or constriction.',
    id: 'excessive-clench',
    route: '/somatic-face-throat-clench-detection',
    title: 'Excessive Clench',
    tone: 'mist',
  },
] as const;

export const faceThroatSensationVisuals = {
  'relaxed-bright': appImages.awarenessExpansionJoy,
  'subtle-tension': appImages.awarenessExpansionProtection,
  'excessive-clench': appImages.awarenessExpansionRepress,
} as const;

export const heartStates: readonly HeartStateOption[] = [
  {
    accent: '#54E3DB',
    description: 'Healthy Activation',
    icon: '◯',
    id: 'increasing-pulse',
    route: '/somatic-heart-activation-differentiation',
    title: 'Increasing Pulse',
    tone: 'sky',
  },
  {
    accent: '#C9C7F4',
    description: 'Expansion through the Heart',
    icon: '◎',
    id: 'release',
    route: '/somatic-heart-expansion-allowance',
    title: 'The Release',
    tone: 'mist',
  },
  {
    accent: '#D7D9E4',
    description: 'Integration',
    icon: '◌',
    id: 'steady-heart',
    route: '/somatic-heart-baseline-pulse',
    title: 'The Steady Heart',
    tone: 'mist',
  },
  {
    accent: '#FFC89B',
    description: 'Waver and Unrest',
    icon: '❤',
    id: 'pounding-heart',
    route: '/somatic-heart-activation-differentiation',
    title: 'The Pounding Heart',
    tone: 'sand',
  },
  {
    accent: '#FFCCD4',
    description: 'Chaos and ache',
    icon: '✶',
    id: 'heart-ache',
    route: '/somatic-heart-expansion-allowance',
    title: 'The Heart Ache',
    tone: 'sand',
  },
] as const;

export const chestStates: readonly ChestStateOption[] = [
    {
    accent: '#D5C7B8',
    description: '',
    id: 'spiral',
    route: '/somatic-chest-co2-check',
    title: 'Spiral',
    tone: 'sand',
  },
  
  {
    accent: '#C8D3F5',
    description: '',
    id: 'calm',
    route: '/somatic-chest-diaphragmatic-baseline',
    title: 'Calm',
    tone: 'mist',
  },
  {
    accent: '#D4E2F5',
    description: '',
    id: 'unrest',
    route: '/somatic-chest-co2-check',
    title: 'Unrest',
    tone: 'sky',
  },

  {
    accent: '#C6F1C8',
    description: '',
    id: 'tightness',
    route: '/somatic-chest-tightness-check',
    title: 'Tightness',
    tone: 'sky',
  },
] as const;

export const stomachStates: readonly StomachStateOption[] = [
  {
    accent: '#F2B985',
    description: 'Warm fluttering or tender movement through the gut.',
    id: 'butterflies',
    route: '/somatic-stomach-belly-softening',
    title: 'Butterflies',
    tone: 'sand',
  },
  {
    accent: '#7CC6DF',
    description: 'Looping pressure, churn, or emotional spin in the abdomen.',
    id: 'whirlpool',
    route: '/somatic-stomach-bracing-signals',
    title: 'Whirlpool',
    tone: 'mist',
  },
  {
    accent: '#E7C48F',
    description: 'Guarding, holding, or protective bracing around the stomach.',
    id: 'armour',
    route: '/somatic-stomach-bracing-signals',
    title: 'Armour',
    tone: 'sand',
  },
] as const;

export const stomachStateVisuals = {
  armour: null,
  butterflies: appImages.awarenessExpansionCompassion,
  whirlpool: appImages.HeavyFog,
} as const;

export const handsLegsStates: readonly HandsLegsStateOption[] = [
  { icon: 'calm', id: 'calm', title: 'Calm', tone: 'mist' },
  { icon: 'springy', id: 'springy', title: 'Springy', tone: 'sky' },
  { icon: 'braced', id: 'braced', title: 'Braced', tone: 'sand' },
  { icon: 'sluggish', id: 'sluggish', title: 'Sluggish', tone: 'mist' },
  { icon: 'contracted', id: 'contracted', title: 'Contracted', tone: 'sand' },
  { icon: 'fidgety', id: 'fidgety', title: 'Fidgety', tone: 'sand' },
] as const;

export const freezeCheckTemperatureOptions = ['Cold', 'Neutral', 'Warm'] as const;

export const rhythmicGroundingPrompt =
  'Shift weight slowly from heel to toe and let the floor resonate with each step.' as const;

export const shoulderDropInstructions = [
  {
    cue: 'Inhale:',
    detail: 'Shrug your shoulders high towards your ears. Hold for 3 seconds',
  },
  {
    cue: 'Exhale:',
    detail: 'Drop them suddenly, feeling the weight release.',
  },
] as const;

export const proprioceptionPrompt =
  'Tap each highlighted joint. Close your eyes and visualize the exact position of your limbs in space.' as const;

export const fistClenchMechanism =
  'Releasing instant tension through somatic awareness forces nervous system regulation.' as const;

export const stomachBracingGroups: readonly {
  id: StomachBracingGroup;
  options: readonly {
    id: StomachBracingSignalId;
    title: string;
  }[];
  title: string;
}[] = [
  {
    id: 'belly-softening',
    title: 'Belly softening',
    options: [
      { id: 'space', title: 'Space' },
      { id: 'tension', title: 'Tension' },
    ],
  },
  {
    id: 'abdominal-scan',
    title: 'Abdominal scan',
    options: [
      { id: 'neutral', title: 'Neutral' },
      { id: 'braced', title: 'Braced' },
    ],
  },
  {
    id: 'gut-reaction',
    title: 'Gut Reaction',
    options: [
      { id: 'release', title: 'Release' },
      { id: 'tighten', title: 'Tighten' },
    ],
  },
] as const;

export const stomachSignalVisuals: Record<StomachBracingSignalId, ReturnType<typeof require>> = {
  braced: appImages.HeavyFog,
  neutral: appImages.awarenessExpansionCompassion,
  release: appImages.awarenessExpansionCompassion,
  space: appImages.awarenessExpansionCompassion,
  tension: appImages.HeavyFog,
  tighten: appImages.HeavyFog,
};

export const somaticToneClasses = {
  mist: 'border-[#E5DCC7] bg-[#F8F4E8]',
  sand: 'border-[#F0D8C7] bg-[#FFF2EB]',
  sky: 'border-[#BFE4EA] bg-[#E4F6F7]',
} as const;

export const co2RebalancingProtocol = [
  'Take a normal breath in, then a normal breath out.',
  'Pinch nose and hold. Time until the very first urge to inhale.',
  'Release and breathe normally. Do not gasp.',
] as const;

export const cognitiveReactivationSteps = [
  'Turn your head slowly left and right.',
  'Track objects visually across the room.',
  'Stretch your jaw gently.',
  'Relax your eyebrows.',
] as const;

export const fogProtocolSteps = [
  'Drink a full glass of water.',
  'Step outside for 2 minutes of direct sunlight.',
  'Do 10 slow squats or calf raises to move blood.',
] as const;

export const heartActivationRows = [
  'Feelings',
  'Notice your breath',
  'Neck & shoulder',
] as const;

export const heartExpansionLevels = ['Level 1', 'Level 2', 'Level 3'] as const;

export const heartChestOpeningSteps = [
  'Place arms at 90 degrees in a doorway or corner.',
  'Lean gently forward until a stretch is felt in the chest.',
  'Maintain soft, even breath.',
] as const;

export const shoulderNeckStretchSteps = [
  {
    description:
      'Lift shoulders up to your ears on a slow, deep inhale. Hold the tension at the top.',
    step: 'Inhale & Lift',
  },
  {
    description:
      'Drop shoulders heavily and completely on a forceful exhale. Let the physical weight drop.',
    step: 'Exhale & Drop',
  },
  {
    description:
      'Execute gentle, slow neck rotations. Focus on the sensation of release in the cervical spine.',
    step: 'Rotate',
  },
] as const;

export const chestDominanceCopy: Record<ChestBreathDominance, string> = {
  belly:
    'If belly is dominant, it often indicates grounding. The diaphragm, a dome-shaped muscle below the lungs, is designed to be the primary muscle of respiration. It draws air into the lower, more vascularized parts of the lungs, allowing for better oxygen exchange.',
  'upper-chest':
    "If upper chest is dominant, it means you're either in Aligned Activation or in fight-or-flight mode. Typically, during high-stress situations or intense physical exertion, the body naturally shifts to rapid, shallow chest breathing to quickly take in air, but this is less efficient over time and can cause tightness in the neck and shoulders.",
};

export const chestBreathPhaseLabels = [
  'Inhale (4s)',
  'Hold (2s)',
  'Exhale (6s)',
] as const;

export const chestTightnessChecks = [
  {
    description:
      'Try some random movements such as shoulder circles, twisting. If the tightness changes when you shift positions, it is more likely related to muscle tension in your chest.',
    title: 'The Movement Test',
  },
  {
    description:
      'Close your eyes and vividly recall a recent upsetting event. If the tightness intensifies as you focus on the memory, it confirms a somatic link between your emotions and physical chest sensations.',
    title: 'Emotional Recall Check',
  },
  {
    description:
      'Try to breathe fully into your lungs expanding your chest in all directions. See if you feel tightness in your chest, especially in the front.',
    title: 'The Breath Test',
  },
  {
    description:
      'Curling up is one of the most common sleep postures, which has psychological ties to comfort and safety. However, a very tight curl can also be a sign of a dysregulated nervous system.',
    title: 'The Sleeping Position Test',
  },
  {
    description:
      'A slouched posture has been psychologically linked to feelings of sadness and shutting down.',
    title: 'The Body Language Test',
  },
] as const;

export const lightShoulderArmSteps = [
  {
    description: 'Allow your arms to hang loose. Visualize tension draining down through your fingertips.',
    title: 'Find Equilibrium',
  },
  {
    description:
      'Initiate tiny, slow forward circles with the shoulder joints. Keep breathing fluid.',
    title: 'Micro-Rotations',
  },
] as const;

export const headBackReleaseSteps = [
  'Lie on the bed with the head gently supported beyond the edge.',
  'Let the front of the throat and upper chest soften while breathing evenly.',
  'Stay for 60 to 90 seconds, then return slowly and observe any change in tightness.',
] as const;

export const headRegionLabel = 'Head Region';
export const chestRegionLabel = 'Chest Region';
export const stomachRegionLabel = 'Stomach Region';
export const handsLegsRegionLabel = 'Hands & Legs';

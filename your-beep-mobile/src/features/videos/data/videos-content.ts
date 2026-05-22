import { appImages } from '@/constants/images';

export type VideoId =
  | 'establishing-the-baseline'
  | 'mapping-vagal-responses'
  | 'presence-reset'
  | 'the-art-of-stillness'
  | 'the-sympathetic-shift'
  | 'vagal-tone-shift';

export const videoFilters = [
  'All Modules',
  'Module 1: Awareness',
  'Module 2: Somatics',
  'Module 3: Pattern',
] as const;

export const featuredVideo = {
  duration: '12:45',
  id: 'the-art-of-stillness' as const,
  source: appImages.onboardingJourney,
  tag: 'FEATURED MODULE',
  title: 'The Art of Stillness',
} as const;

export const videoSections = [
  {
    id: 'continue-watching',
    items: [
      {
        duration: '22:15',
        id: 'mapping-vagal-responses' as const,
        progress: 0,
        source: appImages.loginHero,
        tag: 'Somatics',
        title: '2.1: Mapping Vagal Responses',
      },
    ],
    title: 'Continue Watching',
  },
  {
    id: 'start-again',
    items: [
      {
        duration: '12:45',
        id: 'establishing-the-baseline' as const,
        progress: 100,
        source: appImages.onboardingJourney,
        tag: 'Awareness',
        title: '1.1: Establishing the Baseline',
      },
      {
        duration: '18:20',
        id: 'the-sympathetic-shift' as const,
        progress: 45,
        source: appImages.loginHero,
        tag: 'Awareness',
        title: '1.2: The Sympathetic Shift',
      },
      {
        duration: '22:15',
        id: 'mapping-vagal-responses' as const,
        progress: 0,
        source: appImages.onboardingJourney,
        tag: 'Somatics',
        title: '2.1: Mapping Vagal Responses',
      },
    ],
    title: 'Start Again',
  },
] as const;

export const videoLessonDetails = {
  'establishing-the-baseline': {
    credits: '40 CREDITS',
    currentTime: '06:30',
    description:
      'Establish the signals of calm attention and create a clean internal reference point for later comparison during change.',
    duration: '12:45',
    moduleLabel: 'Module 1.1',
    primaryTag: 'FOUNDATION',
    reflections: [
      {
        body: 'The baseline framing helped me notice how much tension I was carrying before I even started the rest of the practice.',
        id: 'baseline-reflection-1',
        user: 'CENTERED_LOOP',
      },
      {
        body: 'Slowing down enough to observe my resting state gave me a clearer comparison for the later modules.',
        id: 'baseline-reflection-2',
        user: 'QUIET_TRACK_17',
      },
    ],
    secondaryTag: 'MODULE 1',
    source: appImages.onboardingJourney,
    title: 'Establishing the Baseline',
    totalTime: '12:45',
    upNext: [
      {
        id: 'baseline-next-1',
        locked: false,
        module: 'MODULE 1.2',
        title: 'The Sympathetic Shift',
      },
      {
        id: 'baseline-next-2',
        locked: true,
        module: 'MODULE 1.3',
        title: 'Vagal Tone Assessment',
      },
    ],
  },
  'mapping-vagal-responses': {
    credits: '55 CREDITS',
    currentTime: '08:10',
    description:
      'Explore how vagal shifts appear through body cues, breath rhythm, and the subtle adjustments your nervous system makes under demand.',
    duration: '22:15',
    moduleLabel: 'Module 2.1',
    primaryTag: 'SOMATICS',
    reflections: [
      {
        body: 'The vagal mapping cues helped me understand which sensations come first when I leave regulation.',
        id: 'vagal-reflection-1',
        user: 'SOMAUSER_04',
      },
      {
        body: 'I noticed the connection between my shoulders and breathing pattern far more clearly during this lesson.',
        id: 'vagal-reflection-2',
        user: 'NEURAL_PATH_22',
      },
    ],
    secondaryTag: 'MODULE 2',
    source: appImages.loginHero,
    title: 'Mapping Vagal Responses',
    totalTime: '22:15',
    upNext: [
      {
        id: 'vagal-next-1',
        locked: false,
        module: 'MODULE 2.2',
        title: 'Coherence Breathing Practice',
      },
      {
        id: 'vagal-next-2',
        locked: true,
        module: 'MODULE 2.3',
        title: 'Regulation Recovery Drill',
      },
    ],
  },
  'presence-reset': {
    credits: '30 CREDITS',
    currentTime: '03:00',
    description:
      'A shorter reset designed to re-open attention, soften mental congestion, and help you step back into the present with more steadiness.',
    duration: '08:00',
    moduleLabel: 'Module 0.2',
    primaryTag: 'RESET',
    reflections: [
      {
        body: 'This quick lesson works well for me before meetings because it gives me a simple way to settle first.',
        id: 'presence-reflection-1',
        user: 'STEADY_FIELD',
      },
      {
        body: 'I liked how practical it felt. The smaller steps made it easier to actually use during the day.',
        id: 'presence-reflection-2',
        user: 'CALM_TRACE_8',
      },
    ],
    secondaryTag: 'MODULE 0',
    source: appImages.loginHero,
    title: 'Presence Reset',
    totalTime: '08:00',
    upNext: [
      {
        id: 'presence-next-1',
        locked: false,
        module: 'MODULE 1.1',
        title: 'Establishing the Baseline',
      },
      {
        id: 'presence-next-2',
        locked: true,
        module: 'MODULE 1.2',
        title: 'The Sympathetic Shift',
      },
    ],
  },
  'the-art-of-stillness': {
    credits: '45 CREDITS',
    currentTime: '08:24',
    description:
      'A guided lesson on maintaining internal steadiness while attention expands, helping you notice how stillness alters body-based perception.',
    duration: '18:45',
    moduleLabel: 'Module 0.1',
    primaryTag: 'CORE CONCEPT',
    reflections: [
      {
        body: 'The pacing was slower than I expected in a good way. It gave me enough room to notice shifts I usually miss.',
        id: 'stillness-reflection-1',
        user: 'INNER_COMPASS',
      },
      {
        body: 'I found the stillness practice grounding, especially when paired with the body awareness prompts.',
        id: 'stillness-reflection-2',
        user: 'FLOWSTATE_11',
      },
    ],
    secondaryTag: 'MODULE 0',
    source: appImages.onboardingJourney,
    title: 'The Art of Stillness',
    totalTime: '18:45',
    upNext: [
      {
        id: 'stillness-next-1',
        locked: false,
        module: 'MODULE 1.1',
        title: 'Establishing the Baseline',
      },
      {
        id: 'stillness-next-2',
        locked: true,
        module: 'MODULE 1.2',
        title: 'The Sympathetic Shift',
      },
    ],
  },
  'the-sympathetic-shift': {
    credits: '50 CREDITS',
    currentTime: '08:24',
    description:
      'A detailed exploration of the physiological markers of arousal. In this module, we examine how tracking subtle shifts in Heart Rate Variability (HRV) can map the critical boundary between optimal stress (eustress) and cognitive overload.',
    duration: '18:45',
    moduleLabel: 'Module 1.2',
    primaryTag: 'CORE CONCEPT',
    reflections: [
      {
        body: 'This concept of the boundary between stress and overload really clicked for me today. Looking at my HRV data during the shift was eye-opening.',
        id: 'sympathetic-reflection-1',
        user: 'SOMAUSER_04',
      },
      {
        body: 'The correlation between respiratory rate and peripheral vasoconstriction is something I never paid attention to before.',
        id: 'sympathetic-reflection-2',
        user: 'NEURAL_PATH_22',
      },
    ],
    secondaryTag: 'MODULE 1',
    source: appImages.loginHero,
    title: 'The Sympathetic Shift',
    totalTime: '18:45',
    upNext: [
      {
        id: 'sympathetic-next-1',
        locked: false,
        module: 'MODULE 1.3',
        title: 'Vagal Tone Assessment',
      },
      {
        id: 'sympathetic-next-2',
        locked: true,
        module: 'MODULE 1.4',
        title: 'Calibration Exercises',
      },
    ],
  },
  'vagal-tone-shift': {
    credits: '35 CREDITS',
    currentTime: '04:10',
    description:
      'A short guided sequence for noticing how the vagal system responds to breath pacing, recovery cues, and shifts in perceived safety.',
    duration: '12:00',
    moduleLabel: 'Module 2.0',
    primaryTag: 'PRACTICE',
    reflections: [
      {
        body: 'I used this after a stressful afternoon and it helped me find the change point between alertness and settling.',
        id: 'vagal-tone-reflection-1',
        user: 'RESTORE_MAP',
      },
      {
        body: 'The breathing rhythm and the naming of body cues made the practice feel very actionable for me.',
        id: 'vagal-tone-reflection-2',
        user: 'REGULATION_PATH',
      },
    ],
    secondaryTag: 'MODULE 2',
    source: appImages.onboardingJourney,
    title: 'Vagal Tone Shift',
    totalTime: '12:00',
    upNext: [
      {
        id: 'vagal-tone-next-1',
        locked: false,
        module: 'MODULE 2.1',
        title: 'Mapping Vagal Responses',
      },
      {
        id: 'vagal-tone-next-2',
        locked: true,
        module: 'MODULE 2.2',
        title: 'Coherence Breathing Practice',
      },
    ],
  },
} as const;

export const sharedLessonNotes = [
  {
    body: 'An early indicator of sympathetic nervous system activation, observable through thermal mapping prior to conscious awareness.',
    id: 'peripheral-vasoconstriction',
    title: 'Peripheral Vasoconstriction',
  },
  {
    body: 'Changes in breathing rhythm closely mirror the transition from baseline equilibrium to active stress response.',
    id: 'respiratory-rate',
    title: 'Respiratory Rate',
  },
] as const;

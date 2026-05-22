import { appImages } from '@/constants/images';

export const engagementCards = [
  {
    caption: '+12%',
    captionTone: 'success',
    icon: appImages.observationIcon,
    indicator: appImages.observationGrowthIcon,
    subtitle: 'Observation Time',
    title: '64 min',
  },
  {
    caption: 'Baseline',
    captionTone: 'muted',
    icon: appImages.reflectionIcon,
    indicator: '→',
    subtitle: 'Reflection Time',
    title: '36 min',
  },
] as const;

export const metricRows = [
  {
    change: '+4% vs last week',
    icon: appImages.emotionalSignalIcon,
    score: '88%',
    subtitle: 'Coherence Level',
    title: 'Emotional Signal',
  },
  {
    change: '+2% vs last week',
    icon: appImages.physiologicalIcon,
    score: '92%',
    subtitle: 'Restoration Index',
    title: 'Physiological Efficiency',
  },
  {
    change: '+2% vs last week',
    icon: appImages.physiologicalIcon,
    score: '92%',
    subtitle: 'Restoration Index',
    title: 'Pattern Efficiency',
  },
] as const;

export const recommendations = [
  {
    id: 'vagal-tone-shift',
    duration: '12 MIN',
    route: '/video/vagal-tone-shift',
    source: appImages.onboardingJourney,
    title: 'Vagal Tone Shift',
  },
  {
    id: 'presence-reset',
    duration: '8 MIN',
    route: '/video/presence-reset',
    source: appImages.loginHero,
    title: 'Presence Reset',
  },
] as const;

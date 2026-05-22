import { ImageSourcePropType } from 'react-native';

import { appImages } from '@/constants/images';

interface CourseSummary {
  description: string;
  iconLabel?: string;
  id: string;
  imageSource?: ImageSourcePropType;
  route?: '/behavioural-signal-intelligence';
  title: string;
  tone: 'cool' | 'warm' | 'warmStrong';
}

interface BehaviouralSignalModule {
  description: string;
  id: string;
  imageSource: ImageSourcePropType;
  route?: '/awareness-states' | '/pattern-awareness' | '/reflect-synthesis' | '/somatic-states';
  title: string;
  tone: 'cool' | 'warm' | 'warmStrong';
}

export const courses: readonly CourseSummary[] = [
  {
    description: 'Identify your current emotional energy',
    id: 'behavioural-signal-intelligence',
    imageSource: appImages.courseMeditationIllustration,
    route: '/behavioural-signal-intelligence',
    title: 'Behavioural Signal Intelligence',
    tone: 'warm',
  },
  {
    description: 'New courses will be launched soon.',
    iconLabel: '...',
    id: 'coming-soon',
    title: 'Coming soon.....',
    tone: 'cool',
  },
] as const;

export const behaviouralSignalModules: readonly BehaviouralSignalModule[] = [
  {
    description: 'Identify your current emotional energy',
    id: 'awareness-states',
    imageSource: appImages.courseMeditationIllustration,
    route: '/awareness-states',
    title: 'Awareness States',
    tone: 'warm',
  },
  {
    description: 'Map your current somatic sensations',
    id: 'somatic-states',
    imageSource: appImages.courseExerciseIllustration,
    route: '/somatic-states',
    title: 'Somatic states',
    tone: 'cool',
  },
  {
    description: 'Connect behaviours to nervous system cues',
    id: 'pattern-awareness',
    imageSource: appImages.courseTaskListIllustration,
    route: '/pattern-awareness',
    title: 'Pattern Awareness',
    tone: 'warmStrong',
  },
  {
    description: 'Insights into psychosomatic synthesis',
    id: 'reflect-and-act',
    imageSource: appImages.courseReflectIllustration,
    route: '/reflect-synthesis',
    title: 'Reflect and Act',
    tone: 'cool',
  },
] as const;

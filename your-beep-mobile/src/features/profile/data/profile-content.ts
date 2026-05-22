export interface ActivityLogEntry {
  badge: 'breath' | 'cognitive' | 'credits' | 'module';
  description: string;
  id: string;
  meta?: string;
  timestamp?: string;
  title: string;
}

export const rewards = [
  {
    id: '10-day-streak',
    label: 'Consistency',
    title: '10-Day Streak',
    tone: 'warm',
  },
  {
    id: 'neural-pioneer',
    label: 'Achievement',
    title: 'Neural Pioneer',
    tone: 'cool',
  },
  {
    id: 'vagal-master',
    label: 'Locked',
    title: 'Vagal Master',
    tone: 'muted',
  },
] as const;

export const settingsSections = [
  {
    id: 'dark-mode',
    label: 'Dark Mode',
    trailing: 'switch',
  },
  {
    id: 'privacy',
    label: 'Privacy Settings',
    trailing: 'chevron',
  },
  {
    id: 'currency',
    label: 'Currency',
    trailing: 'chevron',
  },
  {
    id: 'activity-log',
    label: 'Activity Log',
    trailing: 'chevron',
  },
  {
    id: 'help-support',
    label: 'Help & Support',
    trailing: 'chevron',
  },
  {
    id: 'raise-ticket',
    label: 'Raise Ticket',
    trailing: 'chevron',
  },
  {
    id: 'language',
    label: 'Language',
    trailing: 'chevron',
  },
] as const;

export const activityLogOverview = {
  currentStreak: 12,
  milestoneProgress: 75,
  totalSessions: 142,
} as const;

export const activityLogEntries: readonly ActivityLogEntry[] = [
  {
    badge: 'breath',
    description: 'Completed a 10-minute session focus regulation.',
    id: 'deep-diaphragmatic-breathing',
    title: 'Deep Diaphragmatic Breathing',
  },
  {
    badge: 'credits',
    description: 'Reward received for maintaining consistent biometric baselines over 3 consecutive days.',
    id: 'bio-credits-earned',
    meta: '+50 CREDITS',
    timestamp: '5H AGO',
    title: 'Bio-Credits Earned',
  },
  {
    badge: 'cognitive',
    description: 'Scored 85% accuracy on pattern recognition tasks under simulated moderate stress.',
    id: 'cognitive-load-assessment',
    timestamp: 'YESTERDAY',
    title: 'Cognitive Load Assessment',
  },
  {
    badge: 'module',
    description: 'Watched module 2 of the "Neural Architecture" series.',
    id: 'understanding-vagal-tone',
    timestamp: 'YESTERDAY',
    title: 'Understanding Vagal Tone',
  },
] as const;

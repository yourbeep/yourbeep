export const notificationGroups = [
  {
    id: 'today',
    title: 'Today',
    items: [
      {
        accent: '#D04545',
        icon: '△',
        id: 'tension-detected',
        message:
          'Micro-pattern analysis suggests jaw/ shoulder elevation. Initiate shoulder drop exercise.',
        time: '2m ago',
        title: 'Tension Detected',
      },
      {
        accent: '#1E8F7D',
        icon: '✦',
        id: 'module-unlocked',
        message: 'Vagal Tone Mastery is now available. Begin your next sequence.',
        time: '1h ago',
        title: 'New Module Unlocked',
      },
    ],
  },
  {
    id: 'yesterday',
    title: 'Yesterday',
    items: [
      {
        accent: '#C77B1B',
        icon: '◐',
        id: 'bio-credits',
        message: 'Awarded for successfully completing the somatic Shoulder Drop protocol.',
        time: '1d ago',
        title: 'Bio-Credits Earned: +50',
      },
      {
        accent: '#444444',
        icon: '↬',
        id: 'breath-check',
        message: 'Time for your daily CO2 tolerance baseline reading.',
        time: '1d ago',
        title: 'Breath Synchrony Check',
      },
      {
        accent: '#C68626',
        icon: '★',
        id: 'streak',
        message: 'Consistent somatic practice recorded. Your baseline is stabilizing.',
        time: '1d ago',
        title: '10-Day Streak Milestone Reached',
      },
    ],
  },
] as const;

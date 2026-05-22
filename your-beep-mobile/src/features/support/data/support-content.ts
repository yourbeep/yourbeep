export const supportCategories = [
  'Technical Issue',
  'Somatic Device Sync',
  'Curriculum Feedback',
  'Account & Billing',
] as const;

export const priorityLevels = ['low', 'medium', 'high'] as const;

export const recentTickets = [
  {
    date: 'Oct 24, 2023',
    id: 'device-calibration-error',
    status: 'solved',
    title: 'Device calibration error',
  },
  {
    date: 'Nov 02, 2023',
    id: 'neural-sync-latency',
    status: 'pending',
    title: 'Neural sync latency issue',
  },
  {
    date: 'Oct 15, 2023',
    id: 'billing-subscription-upgrade',
    status: 'solved',
    title: 'Billing inquiry - Subscription upgrade',
  },
] as const;

export const faqSections = [
  {
    iconTone: 'green',
    id: 'basics',
    questions: [
      {
        answer:
          'The Ethereal Academy is your guided learning space for awareness, somatic regulation, and behavioural insight practices.',
        id: 'what-is-ethereal-academy',
        question: 'What is The Ethereal Academy?',
      },
      {
        answer:
          'Open the journal module from the dashboard and tap the new entry action to start logging your reflections.',
        id: 'start-new-journal-entry',
        question: 'How do I start a new journal entry?',
      },
    ],
    title: 'The Basics',
  },
  {
    iconTone: 'peach',
    id: 'membership',
    questions: [
      {
        answer:
          'You can manage or cancel your subscription from your account settings and billing preferences page.',
        id: 'cancel-subscription',
        question: 'How do I cancel my subscription?',
      },
    ],
    title: 'Membership',
  },
] as const;

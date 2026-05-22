export type ReflectTimePeriod = 'daily' | 'weekly' | 'monthly';
export type ReflectActionCode = 'acceptance' | 'transfer' | 'remediation' | 'redesign' | 'no_action';

export type ReflectFocusAreaId =
  | 'emotional-state'
  | 'somatics'
  | 'presence-attention'
  | 'pattern'
  | 'action';

interface ReflectPeriodSummary {
  coherence: number;
  insightTitle: string;
  label: string;
  mappedFor: string;
  values: number[];
}

export interface ReflectFocusContent {
  cardTitle: string;
  description: string;
  how: string;
  id: ReflectFocusAreaId;
  label: string;
  note: string;
  protocolTitle: string;
  summary: string;
  when: string;
  why: string;
}

export interface ReflectRecommendationContent {
  code: ReflectActionCode;
  description: string;
  framework: string[];
  heroEyebrow: string;
  indicators: string[];
  outcomes: string[];
  previewBody: string;
  previewTitle: string;
}

export const reflectTimePeriodOptions: readonly { id: ReflectTimePeriod; label: string }[] = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
] as const;

export const reflectPeriodSummaries: Record<ReflectTimePeriod, ReflectPeriodSummary> = {
  daily: {
    coherence: 84,
    insightTitle: 'Daily Synthesis',
    label: 'Daily',
    mappedFor: 'Neural alignment mapped for June 12',
    values: [0.82, 0.68, 0.43, 0.58, 0.54],
  },
  weekly: {
    coherence: 79,
    insightTitle: 'Weekly Trend',
    label: 'Weekly',
    mappedFor: 'Neural alignment mapped for June 9 - June 15',
    values: [0.74, 0.63, 0.55, 0.61, 0.59],
  },
  monthly: {
    coherence: 81,
    insightTitle: 'Monthly Synthesis',
    label: 'Monthly',
    mappedFor: 'Neural alignment mapped for June 2026',
    values: [0.78, 0.66, 0.57, 0.69, 0.62],
  },
};

export const reflectFocusEntries: readonly ReflectFocusContent[] = [
  {
    cardTitle: 'Acceptance',
    description: 'Acknowledge the current biological state without immediate intervention.',
    how: 'Allow concentrated sensation clusters to diffuse naturally into the broader peripheral nervous system.',
    id: 'emotional-state',
    label: 'Emotional states',
    note: 'This works best when emotional tone is active but verbal analysis feels too fast or too sharp.',
    protocolTitle: 'Emotional Acceptance',
    summary: 'Scan physical sensations without attaching semantic labels. Notice temperature, density, and rhythm passively.',
    when: 'Scan physical sensations without attaching semantic labels. Notice temperature, density, and rhythm passively.',
    why: 'Expand the capacity to hold uncomfortable kinetic energy without triggering a reactionary physical response.',
  },
  {
    cardTitle: 'Acceptance',
    description: 'Acknowledge the current biological state without immediate intervention.',
    how: 'Allow concentrated sensation clusters to diffuse naturally into the broader peripheral nervous system.',
    id: 'somatics',
    label: 'Somatic awareness',
    note: 'This practice is highly effective when baseline cortisol levels are elevated and active modulation feels forced.',
    protocolTitle: 'Somatic Acceptance',
    summary: 'Expand the capacity to hold uncomfortable kinetic energy without triggering a reactionary physical response.',
    when: 'Scan physical sensations without attaching semantic labels. Notice temperature, density, and rhythm passively.',
    why: 'Expand the capacity to hold uncomfortable kinetic energy without triggering a reactionary physical response.',
  },
  {
    cardTitle: 'Presence',
    description: 'Stay with the signal long enough for the body to settle without needing to fix it right away.',
    how: 'Let sensation clusters widen gently into the surrounding field instead of staying locked at one point.',
    id: 'presence-attention',
    label: 'Presence & attention',
    note: 'Use this when concentration is narrow and the system needs steadier contact instead of more effort.',
    protocolTitle: 'Presence & Attention',
    summary: 'Allow concentrated sensation clusters to diffuse naturally into the broader peripheral nervous system.',
    when: 'Notice where attention narrows and keep the breath steady without chasing the strongest sensation.',
    why: 'This reduces over-fixation and helps the nervous system return to a broader, steadier field of awareness.',
  },
  {
    cardTitle: 'Observation',
    description: 'Observe the repeating signal without forcing a new outcome or interrupting the pattern too early.',
    how: 'Track the pattern from its center outward and allow the edges to soften before changing anything.',
    id: 'pattern',
    label: 'Pattern',
    note: 'Helpful when the same internal loop keeps repeating and the body needs space to show its full rhythm.',
    protocolTitle: 'Pattern Observation',
    summary: 'Allow concentrated sensation clusters to diffuse naturally into the broader peripheral nervous system.',
    when: 'Watch the recurring sequence in the body and note how it changes with breath, pace, and pressure.',
    why: 'This makes the pattern easier to recognize without adding control or resistance to it.',
  },
  {
    cardTitle: 'Pause',
    description: 'Create a small pause between impulse and movement so the action signal can reorganize.',
    how: 'Slow the urge to act just enough for the body to register support, weight, and direction.',
    id: 'action',
    label: 'Action',
    note: 'Use this when behavior feels immediate or reactive and you need a clearer pause before movement.',
    protocolTitle: 'Action Pause',
    summary: 'Allow concentrated sensation clusters to diffuse naturally into the broader peripheral nervous system.',
    when: 'Notice the body right before it moves and stay with that threshold for one full breath.',
    why: 'This helps separate urgency from action so movement becomes more informed and less reactive.',
  },
] as const;

export const reflectRecommendationEntries: readonly ReflectRecommendationContent[] = [
  {
    code: 'acceptance',
    description: 'Acknowledge the current biological state without immediate intervention.',
    framework: [
      'Name the pattern accurately',
      'Release self-judgment',
      'Adjusting expectations rather than conditions',
    ],
    heroEyebrow: 'Acceptance',
    indicators: [
      'Pattern is predictable and consistent',
      'Emotional intensity is proportionate to circumstances',
      'Attempts to change the pattern increase strain',
      'The emotion settles when acknowledged',
    ],
    outcomes: [
      'Reduced secondary stress',
      'Improved emotional tolerance',
      'Greater energy conservation',
    ],
    previewBody: 'Acknowledge the current biological state without immediate intervention.',
    previewTitle: 'Acceptance',
  },
  {
    code: 'transfer',
    description: 'Direct somatic activation into productive cognitive or creative output.',
    framework: [
      'Identify the quality of energy present',
      'Choose a compatible outlet',
      'Allow creative expression without escalation',
    ],
    heroEyebrow: 'Transfer',
    indicators: [
      'Recurrent restlessness or agitation',
      'Energy intensifies when constrained',
      'No clear source of distress, only pressure',
    ],
    outcomes: [
      'Decreased internal pressure',
      'Improved clarity and mood',
      'Preservation of vitality',
    ],
    previewBody: 'Direct somatic activation into productive cognitive or creative output.',
    previewTitle: 'Transfer',
  },
  {
    code: 'remediation',
    description: 'Apply targeted somatic drills to down-regulate high-intensity states.',
    framework: [
      'Identify the sustaining condition',
      'Introduce corrective adjustments',
      'Monitor change gradually',
    ],
    heroEyebrow: 'Remediate',
    indicators: [
      'Persistent contraction or activation without recovery',
      'Reduced access to grounding states',
      'Increasing emotional intensity over time',
      'Clear correlation with identifiable stressors',
    ],
    outcomes: [
      'Gradual restoration of energy',
      'Increased emotional flexibility',
      'Reduced recurrence of contraction',
    ],
    previewBody: 'Apply targeted somatic drills to down-regulate high-intensity states.',
    previewTitle: 'Remedy & Rectify',
  },
  {
    code: 'redesign',
    description: 'Modify environmental or behavioral structures to prevent recurring stressors.',
    framework: [
      'Reevaluate roles, routines, or commitments',
      'Identify where structure conflicts with capacity or values',
      'Make strategic, phased changes',
    ],
    heroEyebrow: 'Redesign',
    indicators: [
      'Long-standing patterns across contexts',
      'Emotional responses feel chronic',
      'Awareness does not reduce intensity',
      'Multiple domains show similar strain',
    ],
    outcomes: [
      'Long-term emotional alignment',
      'Reduced baseline stress',
      'Increased sense of agency',
    ],
    previewBody: 'Modify environmental or behavioral structures to prevent recurring stressors.',
    previewTitle: 'Redesign',
  },
  {
    code: 'no_action',
    description: 'No action is recommended until more signal is available.',
    framework: ['Complete the remaining course activities', 'Observe the next valid signal', 'Re-check the synthesis'],
    heroEyebrow: 'Pending',
    indicators: ['Signal is incomplete or still forming'],
    outcomes: ['Better recommendation accuracy once more data is available'],
    previewBody: 'No action is recommended until more signal is available.',
    previewTitle: 'Pending',
  },
] as const;

export function getReflectFocusContent(focusAreaId: ReflectFocusAreaId) {
  return reflectFocusEntries.find((entry) => entry.id === focusAreaId) ?? reflectFocusEntries[1];
}

export function getReflectRecommendationContent(code: ReflectActionCode) {
  return (
    reflectRecommendationEntries.find((entry) => entry.code === code) ??
    reflectRecommendationEntries[reflectRecommendationEntries.length - 1]
  );
}

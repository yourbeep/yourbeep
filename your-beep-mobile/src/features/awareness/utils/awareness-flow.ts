import {
  activationResults,
  expansionResults,
  type AwarenessResultContent,
} from '@/features/awareness/data/awareness-content';

type RootCauseSelection = Record<string, string | undefined>;

const activationStateMap: Record<string, string> = {
  'alert-nervous': 'alert_nervous',
  'calm-steady': 'calm_steady',
  'excitement-enthusiasm': 'excitement_enthusiasm',
  'irritation-rage': 'irritation_rage',
  'resilient-contesting': 'resilient_contesting',
  'stuck-rigid': 'stuck_rigid',
};

const expansionStateMap: Record<string, string> = {
  'compassion-acceptance': 'compassion_acceptance',
  'joy-abundance': 'joy_abundance',
  'protection-resistance': 'protection_resistance',
  'repress-conflicted': 'repress_conflicted',
  'spiralling-enveloped': 'spiralling_enveloped',
  'surprise-embrace': 'surprise_embrace',
};

const domainMap: Record<string, string> = {
  Family: 'family',
  Finances: 'finances',
  Health: 'health',
  'Personal Development': 'personal_development',
  'Previous Stress': 'previous_stress',
  Relationships: 'relationships',
  Work: 'work',
};

const rootCauseMap: Record<string, string> = {
  'learned-emotional-strategy': 'learned_emotional_strategy',
  'protective-belief-or-meaning': 'protective_belief_or_meaning',
  'recurring-environmental-stressor': 'recurring_environmental_stressor',
  'unmet-need': 'unmet_need',
};

function toObject(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function readString(source: Record<string, unknown> | null, keys: string[]) {
  if (!source) {
    return null;
  }

  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

function readMetricPair(source: Record<string, unknown> | null, index: number) {
  const metrics = source?.metrics;

  if (!Array.isArray(metrics)) {
    return null;
  }

  const metric = toObject(metrics[index]);
  if (!metric) {
    return null;
  }

  return {
    label:
      readString(metric, ['label', 'title', 'name']) ??
      (typeof metric.key === 'string' ? metric.key : null),
    value:
      readString(metric, ['value', 'score', 'displayValue']) ??
      (typeof metric.value === 'number' ? String(metric.value) : null),
  };
}

function normalizeSentence(value: string | null) {
  if (!value) {
    return null;
  }

  return value.replace(/\s+/g, ' ').trim();
}

export function toggleSelection(current: string[], value: string) {
  if (current.includes(value)) {
    return current.filter((item) => item !== value);
  }

  if (current.length >= 2) {
    return current;
  }

  return [...current, value];
}

export function getActivationResult(selectedIds: string[]): AwarenessResultContent {
  const pivot = selectedIds[selectedIds.length - 1] ?? 'alert-nervous';
  return activationResults[pivot] ?? activationResults['alert-nervous'];
}

export function getExpansionResult(selectedIds: string[]): AwarenessResultContent {
  const pivot = selectedIds[selectedIds.length - 1] ?? 'protection-resistance';
  return expansionResults[pivot] ?? expansionResults['protection-resistance'];
}

export function buildSummaryCards({
  activationSelections,
  expansionSelections,
  rootCauseSelections,
}: {
  activationSelections: string[];
  expansionSelections: string[];
  rootCauseSelections: RootCauseSelection;
}) {
  const activation = getActivationResult(activationSelections);
  const expansion = getExpansionResult(expansionSelections);
  const selectedCauses = Object.values(rootCauseSelections).filter(Boolean);
  const primaryCause = selectedCauses[0] ?? 'learned-emotional-strategy';

  return [
    {
      badge: activation.energyTitle,
      description: activation.synthesisTitle,
      id: 'mental',
      status: activation.flowTitle === 'Waver' ? 'Scattered' : 'Focused',
      title: 'Mental',
      tone: 'neutral' as const,
    },
    {
      badge: expansion.energyTitle === 'Embodiment' ? 'High Vagal Tone' : expansion.energyTitle,
      description: expansion.synthesisTitle,
      id: 'physical',
      status: expansion.energyTitle === 'Embodiment' ? 'Grounded' : 'Responsive',
      title: 'Physical',
      tone: 'mint' as const,
    },
    {
      badge:
        primaryCause === 'protective-belief-or-meaning'
          ? 'Dorsal Shift'
          : primaryCause === 'recurring-environmental-stressor'
            ? 'Boundary Load'
            : 'Adaptive Pattern',
      description:
        primaryCause === 'protective-belief-or-meaning'
          ? 'Boundary Erosion'
          : primaryCause === 'recurring-environmental-stressor'
            ? 'External Strain'
            : 'Relational Patterning',
      id: 'relational',
      status: primaryCause === 'protective-belief-or-meaning' ? 'Guarded' : 'Adaptive',
      title: 'Relational',
      tone: 'sand' as const,
    },
    {
      badge:
        expansion.flowTitle === 'Bloom' || expansion.flowTitle === 'Tender'
          ? 'Equilibrium'
          : 'Adaptive Support',
      description:
        activation.energyTitle === 'Regulation'
          ? 'Optimal Light Exposure'
          : 'Recovery-Supportive Context',
      id: 'environmental',
      status: activation.energyTitle === 'Regulation' ? 'Attuned' : 'Responsive',
      title: 'Environmental',
      tone: 'mint' as const,
    },
  ];
}

export function buildAwarenessSubmissionPayload({
  activationSelections,
  courseId,
  expansionSelections,
  highPoints,
  lowPoints,
  rootCauseSelections,
}: {
  activationSelections: string[];
  courseId: string;
  expansionSelections: string[];
  highPoints: string[];
  lowPoints: string[];
  rootCauseSelections: RootCauseSelection;
}) {
  const mappedActivationSelections = activationSelections
    .map((item) => activationStateMap[item])
    .filter(Boolean);
  const mappedExpansionSelections = expansionSelections
    .map((item) => expansionStateMap[item])
    .filter(Boolean);
  const mappedHighPoints = highPoints.map((item) => domainMap[item]).filter(Boolean);
  const mappedLowPoints = lowPoints.map((item) => domainMap[item]).filter(Boolean);
  const mappedRootCauses = Object.fromEntries(
    Object.entries(rootCauseSelections)
      .map(([key, value]) => [domainMap[key], value ? rootCauseMap[value] : undefined])
      .filter((entry): entry is [string, string] => Boolean(entry[0] && entry[1])),
  );

  return {
    courseId,
    payload: {
      activationSelections: mappedActivationSelections,
      expansionSelections: mappedExpansionSelections,
      rootCauses: mappedRootCauses,
      valueSystems: {
        highPoints: mappedHighPoints,
        lowPoints: mappedLowPoints,
      },
    },
    step: 3,
    type: 'awareness_states' as const,
  };
}

function mapActivationSelections(activationSelections: string[]) {
  return activationSelections.map((item) => activationStateMap[item]).filter(Boolean);
}

function mapExpansionSelections(expansionSelections: string[]) {
  return expansionSelections.map((item) => expansionStateMap[item]).filter(Boolean);
}

export function buildAwarenessStepOnePayload({
  activationSelections,
  courseId,
}: {
  activationSelections: string[];
  courseId: string;
}) {
  return {
    courseId,
    payload: {
      activationSelections: mapActivationSelections(activationSelections),
    },
    step: 1,
    type: 'awareness_states' as const,
  };
}

export function buildAwarenessStepTwoPayload({
  activationSelections,
  courseId,
  expansionSelections,
}: {
  activationSelections: string[];
  courseId: string;
  expansionSelections: string[];
}) {
  return {
    courseId,
    payload: {
      activationSelections: mapActivationSelections(activationSelections),
      expansionSelections: mapExpansionSelections(expansionSelections),
    },
    step: 2,
    type: 'awareness_states' as const,
  };
}

export function resolveAwarenessResultContent({
  fallback,
  rawResponse,
}: {
  fallback: AwarenessResultContent;
  rawResponse: unknown;
}) {
  const response = toObject(rawResponse);
  const submission = toObject(response?.submission);
  const submissionResult = toObject(submission?.result);
  const directResultMapping = toObject(response?.resultMapping);
  const activationResultMapping = toObject(response?.activationResultMapping);
  const expansionResultMapping = toObject(response?.expansionResultMapping);
  const nestedResultMapping = toObject(submissionResult?.resultMapping);
  const nestedActivationResultMapping = toObject(submissionResult?.activationResultMapping);
  const nestedExpansionResultMapping = toObject(submissionResult?.expansionResultMapping);
  const summary = toObject(response?.summary) ?? toObject(submissionResult?.summary);
  const score = toObject(response?.score) ?? toObject(submissionResult?.score);

  const mapping =
    directResultMapping ??
    activationResultMapping ??
    expansionResultMapping ??
    nestedResultMapping ??
    nestedActivationResultMapping ??
    nestedExpansionResultMapping ??
    submissionResult;

  const firstMetric = readMetricPair(mapping, 0);
  const secondMetric = readMetricPair(mapping, 1);

  return {
    detectedState:
      readString(mapping, ['detectedState', 'state', 'stateLabel', 'title']) ??
      fallback.detectedState,
    energyBody:
      normalizeSentence(
        readString(mapping, ['energyBody', 'energyDescription']) ??
          readString(toObject(mapping?.energyOrientation), ['body', 'description']) ??
          readString(summary, ['energyBody', 'energyDescription']),
      ) ?? fallback.energyBody,
    energyTitle:
      readString(mapping, ['energyTitle', 'energyLabel']) ??
      readString(toObject(mapping?.energyOrientation), ['title', 'label']) ??
      fallback.energyTitle,
    flowBody:
      normalizeSentence(
        readString(mapping, ['flowBody', 'flowDescription']) ??
          readString(toObject(mapping?.flowStability), ['body', 'description']) ??
          readString(summary, ['flowBody', 'flowDescription']),
      ) ?? fallback.flowBody,
    flowTitle:
      readString(mapping, ['flowTitle', 'flowLabel']) ??
      readString(toObject(mapping?.flowStability), ['title', 'label']) ??
      fallback.flowTitle,
    metricLeftLabel:
      firstMetric?.label ??
      readString(score, ['label', 'title']) ??
      fallback.metricLeftLabel,
    metricLeftValue:
      firstMetric?.value ??
      readString(score, ['finalScore', 'displayScore']) ??
      fallback.metricLeftValue,
    metricRightLabel:
      secondMetric?.label ??
      readString(summary, ['secondaryMetricLabel']) ??
      fallback.metricRightLabel,
    metricRightValue:
      secondMetric?.value ??
      readString(summary, ['secondaryMetricValue']) ??
      fallback.metricRightValue,
    synthesisBody:
      normalizeSentence(
        readString(mapping, ['synthesisBody']) ??
          readString(toObject(mapping?.stateSynthesis), ['body', 'description']) ??
          readString(summary, ['body', 'description', 'summaryText']),
      ) ?? fallback.synthesisBody,
    synthesisTitle:
      readString(mapping, ['synthesisTitle']) ??
      readString(toObject(mapping?.stateSynthesis), ['title', 'label']) ??
      readString(summary, ['title', 'label']) ??
      fallback.synthesisTitle,
  };
}

export function buildAwarenessBackendNote(rawResponse: unknown) {
  const response = toObject(rawResponse);
  const step = response?.step;
  const nestedResult = toObject(toObject(response?.submission)?.result);
  const summary = toObject(response?.summary) ?? toObject(nestedResult?.summary);
  const score = toObject(response?.score) ?? toObject(nestedResult?.score);

  const summaryText = normalizeSentence(
    readString(summary, ['summaryText', 'description', 'body']),
  );
  const scoreValue =
    readString(score, ['finalScore', 'displayScore']) ??
    (typeof score?.finalScore === 'number' ? String(score.finalScore) : null);

  const fragments = [
    typeof step === 'number' ? `Backend step ${step} synced.` : 'Backend mapping synced.',
    summaryText,
    scoreValue ? `Score: ${scoreValue}` : null,
  ].filter((item): item is string => Boolean(item));

  return fragments.length > 0 ? fragments.join(' ') : null;
}

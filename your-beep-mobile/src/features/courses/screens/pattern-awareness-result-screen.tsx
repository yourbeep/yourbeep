import { useEffect, useMemo, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { appImages } from '@/constants/images';
import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppHeader } from '@/components/navigation/app-header';
import { AppButton } from '@/components/ui/app-button';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { fetchGameResult, submitGame } from '@/lib/api';
import type { PatternExercisePayload } from '@/features/courses/utils/pattern-awareness';
import { useAppTheme } from '@/theme/use-app-theme';

const fallbackPatternMetrics = [
  {
    description:
      'Localized mapping points to inward focus, while edge-reaching suggests outward projection.',
    label: 'Spatial awareness',
    progress: 0.88,
    value: 'Stable',
    valueColor: '#0F7D71',
  },
  {
    description:
      'Sudden directional shifts indicate competing impulses, and gradual slowing suggests settling of the nervous system.',
    label: 'Rhythm',
    progress: 0.56,
    value: 'Fluid',
    valueColor: '#0F7D71',
  },
  {
    description:
      'Dense, overlapping maps indicate high activation, cognitive overload, or emotional compression.',
    label: 'Density',
    progress: 0.62,
    value: 'Expansive',
    valueColor: '#DF8A00',
  },
  {
    description: 'Fewer intervals indicate sustained attention and cognitive continuity.',
    label: 'Attention',
    progress: 0.62,
    value: 'Expansive',
    valueColor: '#DF8A00',
  },
  {
    description: 'Variation over time reveals shifts between effort, control, and release.',
    label: 'Adaptability',
    progress: 0.62,
    value: 'Cumulative',
    valueColor: '#DF8A00',
  },
] as const;

interface PatternMetric {
  description: string;
  label: string;
  progress: number;
  value: string;
  valueColor: string;
}

function getScoreColor(score: number) {
  if (score >= 2.5) {
    return '#0F7D71';
  }

  if (score >= 1.75) {
    return '#DF8A00';
  }

  return '#D85B38';
}

function getScoreLabel(value: unknown, fallback: string) {
  if (typeof value !== 'string' || !value.trim()) {
    return fallback;
  }

  return value
    .split(/[_\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function toNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function buildPatternSubmission(courseId: string, exercises: PatternExercisePayload[]) {
  return {
    courseId,
    payload: {
      exercises,
    },
    type: 'pattern_awareness' as const,
  };
}

function parsePatternPayload(rawValue: unknown): PatternExercisePayload[] {
  if (typeof rawValue !== 'string' || !rawValue.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;

    return Array.isArray(parsed)
      ? parsed.filter((item): item is PatternExercisePayload => {
          return Boolean(
            item &&
              typeof item === 'object' &&
              'exerciseKey' in item &&
              'durationSeconds' in item &&
              'metrics' in item,
          );
        })
      : [];
  } catch {
    return [];
  }
}

function buildPatternMetricCards(resultData: Record<string, unknown> | null) {
  if (!resultData) {
    return fallbackPatternMetrics;
  }

  const labels =
    resultData.labels && typeof resultData.labels === 'object'
      ? (resultData.labels as Record<string, unknown>)
      : {};
  const presenceScore = toNumber(resultData.presenceScore, 2);
  const actionScore = toNumber(resultData.actionScore, 2);
  const patternScore = toNumber(resultData.patternScore, 2);
  const overallScore = toNumber(resultData.overallScore, 2);

  return [
    {
      description:
        'Localized mapping points to inward focus, while edge-reaching suggests outward projection.',
      label: 'Spatial awareness',
      progress: Math.min(1, presenceScore / 3),
      value: getScoreLabel(labels.presenceAttention, 'Stable'),
      valueColor: getScoreColor(presenceScore),
    },
    {
      description:
        'Sudden directional shifts indicate competing impulses, and gradual slowing suggests settling of the nervous system.',
      label: 'Rhythm',
      progress: Math.min(1, actionScore / 3),
      value: getScoreLabel(labels.action, 'Fluid'),
      valueColor: getScoreColor(actionScore),
    },
    {
      description:
        'Dense, overlapping maps indicate high activation, cognitive overload, or emotional compression.',
      label: 'Density',
      progress: Math.min(1, patternScore / 3),
      value: getScoreLabel(labels.pattern, 'Expansive'),
      valueColor: getScoreColor(patternScore),
    },
    {
      description: 'Fewer intervals indicate sustained attention and cognitive continuity.',
      label: 'Attention',
      progress: Math.min(1, presenceScore / 3),
      value: getScoreLabel(labels.presenceAttention, 'Present'),
      valueColor: getScoreColor(presenceScore),
    },
    {
      description: 'Variation over time reveals shifts between effort, control, and release.',
      label: 'Adaptability',
      progress: Math.min(1, overallScore / 3),
      value: getScoreLabel(labels.action, 'Cumulative'),
      valueColor: getScoreColor(overallScore),
    },
  ] as const;
}

function PatternMetricCard({
  description,
  label,
  progress,
  value,
  valueColor,
}: PatternMetric) {
  const { colors, isDark } = useAppTheme();

  return (
    <View
      className="rounded-[20px] px-4 py-4"
      style={{ backgroundColor: isDark ? 'rgba(86,212,202,0.14)' : '#C9F3F1' }}
    >
      <View className="flex-row items-center justify-between gap-3">
        <Text className="font-poppinsSemi text-[12px] uppercase tracking-[2px]" style={{ color: colors.textPrimary }}>
          {label}
        </Text>
        <Text className="font-poppinsSemi text-[17px]" style={{ color: valueColor }}>
          {value}
        </Text>
      </View>

      <View className="mt-3 h-[5px] rounded-full bg-[rgba(255,255,255,0.72)]">
        <View className="h-[5px] rounded-full bg-black" style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }} />
      </View>

      <Text className="mt-4 font-poppinsRegular text-[15px] leading-[28px]" style={{ color: colors.textSecondary }}>
        {description}
      </Text>
    </View>
  );
}

export function PatternAwarenessResultScreen() {
  const params = useLocalSearchParams<{ courseId?: string; durationSeconds?: string; gameId?: string; patternPayload?: string }>();
  const { colors } = useAppTheme();
  const [resultData, setResultData] = useState<Record<string, unknown> | null>(null);
  const [submissionState, setSubmissionState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

  const effectiveCourseId = params.courseId ? String(params.courseId) : undefined;
  const effectiveGameId = params.gameId ? String(params.gameId) : undefined;
  const durationSeconds = Math.max(
    0,
    Number.parseInt(String(params.durationSeconds ?? '0'), 10) || 0,
  );
  const patternPayload = useMemo(
    () => parsePatternPayload(params.patternPayload),
    [params.patternPayload],
  );
  const hasCompletePatternPayload =
    patternPayload.length === 3 &&
    ['draw_your_breath', 'awareness_circles', 'scribble_drawing'].every((key) =>
      patternPayload.some((item) => item.exerciseKey === key),
    );
  const canSubmit = Boolean(effectiveCourseId && effectiveGameId);
  const patternMetrics = useMemo(() => buildPatternMetricCards(resultData), [resultData]);

  useEffect(() => {
    if (!effectiveGameId || submissionState !== 'idle') {
      return;
    }

    void (async () => {
      try {
        setSubmissionState('submitting');
        setSubmissionMessage(null);

        if (canSubmit && effectiveCourseId && hasCompletePatternPayload) {
          const response = await submitGame(
            effectiveGameId,
            buildPatternSubmission(effectiveCourseId, patternPayload),
          );
          const submission =
            response.submission && typeof response.submission === 'object'
              ? (response.submission as Record<string, unknown>)
              : null;
          const submissionResult =
            submission?.result && typeof submission.result === 'object'
              ? (submission.result as Record<string, unknown>)
              : null;

          setResultData(submissionResult);
          setSubmissionState('success');
          return;
        }

        const response = await fetchGameResult(effectiveGameId);
        const result =
          response && typeof response === 'object'
            ? (response as Record<string, unknown>)
            : null;
        const resultPayload =
          result?.result && typeof result.result === 'object'
            ? (result.result as Record<string, unknown>)
            : result;

        setResultData(resultPayload);
        setSubmissionState('success');
      } catch (error) {
        setSubmissionMessage(
          error instanceof Error && error.message
            ? error.message
            : 'We could not save this pattern result right now.',
        );
        setSubmissionState('error');
      }
    })();
  }, [
    canSubmit,
    durationSeconds,
    effectiveCourseId,
    effectiveGameId,
    hasCompletePatternPayload,
    patternPayload,
    submissionState,
  ]);

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <AppHeader
            onBackPress={() =>
              router.replace({
                pathname: '/pattern-awareness',
                params: {
                  ...(effectiveCourseId ? { courseId: effectiveCourseId } : {}),
                  ...(effectiveGameId ? { gameId: effectiveGameId } : {}),
                },
              })
            }
            subtitle=""
            title="Pattern Awareness"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <View className="gap-2 px-1">
            <Text className="font-poppinsSemi text-[32px] leading-[40px]" style={{ color: colors.textPrimary }}>
              Pattern Analysis
            </Text>
            <Text className="font-poppinsRegular text-[17px] leading-[30px]" style={{ color: colors.textSecondary }}>
              Your breath session has been decoded into a unique neuro-somatic signature.
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={160}>
          <View
            className="overflow-hidden rounded-[26px] border px-5 py-5"
            style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
          >
            <Image className="h-[210px] w-full rounded-[18px]" resizeMode="cover" source={appImages.PatternAwarenessSignature} />
            <View className="absolute bottom-5 left-1/2 ml-[-86px] rounded-full bg-black px-5 py-2">
              <Text className="font-poppinsMedium text-[13px] text-[#52AEE1]">
                ◎ Alpha Signature {patternPayload.length > 0 ? `${patternPayload.length} exercises` : durationSeconds > 0 ? `${durationSeconds}s` : '7.2-B'}
              </Text>
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={200}>
          <View className="gap-3">
            {submissionState === 'success' ? (
              <Text className="font-poppinsRegular text-[13px]" style={{ color: colors.accent }}>
                Pattern activity saved to your course progress.
              </Text>
            ) : submissionState === 'submitting' ? (
              <Text className="font-poppinsRegular text-[13px]" style={{ color: colors.textSecondary }}>
                Saving your pattern awareness session...
              </Text>
            ) : submissionState === 'error' ? (
              <Text className="font-poppinsRegular text-[13px]" style={{ color: '#E45B38' }}>
                {submissionMessage ?? 'We could not save this pattern result right now.'}
              </Text>
            ) : canSubmit && !hasCompletePatternPayload ? (
              <Text className="font-poppinsRegular text-[13px]" style={{ color: colors.textSecondary }}>
                Pattern reopen mode detected. Loading the latest backend result instead of submitting an incomplete payload.
              </Text>
            ) : !canSubmit ? (
              <Text className="font-poppinsRegular text-[13px]" style={{ color: colors.textSecondary }}>
                Backend game context is missing for this flow, so this result is showing locally only.
              </Text>
            ) : null}
          </View>
        </AnimatedReveal>

        <View className="gap-3">
          {patternMetrics.map((metric, index) => (
            <AnimatedReveal delay={220 + index * 60} key={metric.label}>
              <PatternMetricCard {...metric} />
            </AnimatedReveal>
          ))}
        </View>

        <AnimatedReveal delay={580}>
          <AppButton
            label="Continue"
            onPress={() =>
              router.replace({
                pathname: '/behavioural-signal-intelligence',
                params: effectiveCourseId ? { courseId: effectiveCourseId } : undefined,
              })
            }
            variant="secondary"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={650}>
          <AppButton
            label="Restart activity"
            onPress={() =>
              router.replace({
                pathname: '/pattern-awareness',
                params: {
                  ...(effectiveCourseId ? { courseId: effectiveCourseId } : {}),
                  ...(effectiveGameId ? { gameId: effectiveGameId } : {}),
                },
              })
            }
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

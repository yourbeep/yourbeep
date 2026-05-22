import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppHeader } from '@/components/navigation/app-header';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AwarenessScreenIntro } from '@/features/awareness/components/awareness-screen-intro';
import { SummaryCard } from '@/features/awareness/components/summary-card';
import { useAwarenessFlow } from '@/features/awareness/context/awareness-flow-context';
import { submitGame } from '@/lib/api';
import { buildAwarenessSubmissionPayload, buildSummaryCards } from '@/features/awareness/utils/awareness-flow';
import { useAppTheme } from '@/theme/use-app-theme';

export function AwarenessSummaryScreen() {
  const params = useLocalSearchParams<{ courseId?: string; gameId?: string }>();
  const { colors } = useAppTheme();
  const [submissionState, setSubmissionState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<string | null>(null);
  const {
    activationSelections,
    courseId,
    expansionSelections,
    gameId,
    highPoints,
    lowPoints,
    resetFlow,
    rootCauseSelections,
  } = useAwarenessFlow();
  const summaryCards = buildSummaryCards({
    activationSelections,
    expansionSelections,
    rootCauseSelections,
  });

  const effectiveCourseId = courseId ?? (params.courseId ? String(params.courseId) : undefined);
  const effectiveGameId = gameId ?? (params.gameId ? String(params.gameId) : undefined);
  const canSubmit = Boolean(effectiveCourseId && effectiveGameId);

  const handleFinish = async () => {
    if (!effectiveCourseId || !effectiveGameId || submissionState === 'submitting') {
      return;
    }

    setSubmissionState('submitting');
    setSubmissionErrorMessage(null);

    try {
      await submitGame(
        effectiveGameId,
        buildAwarenessSubmissionPayload({
          activationSelections,
          courseId: effectiveCourseId,
          expansionSelections,
          highPoints,
          lowPoints,
          rootCauseSelections,
        }),
      );

      setSubmissionState('success');
    } catch (error) {
      setSubmissionErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : 'We could not save the awareness result right now.',
      );
      setSubmissionState('error');
    }
  };

  useEffect(() => {
    if (!canSubmit || submissionState !== 'idle') {
      return;
    }

    void handleFinish();
  }, [canSubmit, submissionState, effectiveCourseId, effectiveGameId]);

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <AppHeader
            onBackPress={() => router.replace('/awareness-root-cause')}
            subtitle=""
            title="Awareness Summary"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <AwarenessScreenIntro
            description="A high-precision synthesis of your current multidimensional state, correlating internal sensation with external drivers."
            title="Awareness Summary"
          />
        </AnimatedReveal>

        <View className="gap-4">
          {summaryCards.map((item, index) => (
            <AnimatedReveal delay={160 + index * 60} key={item.id}>
              <SummaryCard
                badge={item.badge}
                description={item.description}
                status={item.status}
                title={item.title}
                tone={item.tone}
              />
            </AnimatedReveal>
          ))}
        </View>

        <AnimatedReveal delay={420}>
          <View className="gap-3">
            {submissionState === 'success' ? (
              <Text className="font-poppinsRegular text-[13px]" style={{ color: colors.accent }}>
                Assessment saved to your course activity.
              </Text>
            ) : submissionState === 'submitting' ? (
              <Text className="font-poppinsRegular text-[13px]" style={{ color: colors.textSecondary }}>
                Saving your awareness summary...
              </Text>
            ) : submissionState === 'error' ? (
              <Text className="font-poppinsRegular text-[13px]" style={{ color: '#E45B38' }}>
                {submissionErrorMessage ?? 'We could not save the awareness result right now.'}
              </Text>
            ) : !canSubmit ? (
              <Text className="font-poppinsRegular text-[13px]" style={{ color: colors.textSecondary }}>
                Backend game context is missing for this flow, so this summary is showing locally only.
              </Text>
            ) : null}
          </View>
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

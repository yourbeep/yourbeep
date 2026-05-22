import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

import { AwarenessResultTemplate } from '@/features/awareness/components/awareness-result-template';
import { useAwarenessFlow } from '@/features/awareness/context/awareness-flow-context';
import { submitGame } from '@/lib/api';
import {
  buildAwarenessBackendNote,
  buildAwarenessStepOnePayload,
  getActivationResult,
  resolveAwarenessResultContent,
} from '@/features/awareness/utils/awareness-flow';
import { useAppTheme } from '@/theme/use-app-theme';

export function ActivationResultScreen() {
  const params = useLocalSearchParams<{ courseId?: string; gameId?: string }>();
  const { colors } = useAppTheme();
  const { activationSelections, courseId, gameId } = useAwarenessFlow();
  const [submissionState, setSubmissionState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const [backendResponse, setBackendResponse] = useState<unknown>(null);
  const effectiveCourseId = courseId ?? (params.courseId ? String(params.courseId) : undefined);
  const effectiveGameId = gameId ?? (params.gameId ? String(params.gameId) : undefined);
  const fallbackResult = getActivationResult(activationSelections);
  const resolvedResult = resolveAwarenessResultContent({
    fallback: fallbackResult,
    rawResponse: backendResponse,
  });
  const backendNote = buildAwarenessBackendNote(backendResponse);

  useEffect(() => {
    if (!effectiveCourseId || !effectiveGameId || submissionState !== 'idle') {
      return;
    }

    void (async () => {
      setSubmissionState('submitting');
      setSubmissionMessage(null);

      try {
        const response = await submitGame(
          effectiveGameId,
          buildAwarenessStepOnePayload({
            activationSelections,
            courseId: effectiveCourseId,
          }),
        );
        setBackendResponse(response);
        setSubmissionState('success');
      } catch (error) {
        setSubmissionMessage(
          error instanceof Error && error.message
            ? error.message
            : 'We could not sync step 1 right now.',
        );
        setSubmissionState('error');
      }
    })();
  }, [activationSelections, effectiveCourseId, effectiveGameId, submissionState]);

  return (
    <>
      <StatusBar style="light" />
      <View className="px-6 pt-2">
        {submissionState === 'submitting' ? (
          <Text className="font-poppinsRegular text-[13px]" style={{ color: colors.textSecondary }}>
            Saving awareness step 1...
          </Text>
        ) : submissionState === 'success' ? (
          <Text className="font-poppinsRegular text-[13px]" style={{ color: colors.accent }}>
            Awareness step 1 saved.
          </Text>
        ) : submissionState === 'error' ? (
          <Text className="font-poppinsRegular text-[13px]" style={{ color: '#E45B38' }}>
            {submissionMessage ?? 'We could not sync step 1 right now.'}
          </Text>
        ) : null}
      </View>
      <AwarenessResultTemplate
        backHref="/awareness-states"
        backParams={{ courseId: params.courseId, gameId: params.gameId }}
        nextParams={{ courseId: params.courseId, gameId: params.gameId }}
        nextHref="/awareness-expansion"
        backendNote={backendNote}
        result={resolvedResult}
        title="Result Mapping"
      />
    </>
  );
}

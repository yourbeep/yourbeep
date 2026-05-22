import { useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { SomaticMapCard } from '@/features/somatic/components/somatic-map-card';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import {
  clearSomaticSubmissionState,
  resetCurrentSomaticRegion,
  selectRegion,
  setSomaticCourseContext,
} from '@/features/somatic/store/somatic-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAppTheme } from '@/theme/use-app-theme';

export function SomaticBodyMapScreen() {
  const params = useLocalSearchParams<{ courseId?: string; gameId?: string }>();
  const dispatch = useAppDispatch();
  const { colors } = useAppTheme();
  const completedRegions = useAppSelector((state) => state.somatic.completedRegions);
  const storedCourseId = useAppSelector((state) => state.somatic.courseId);
  const submissionMessage = useAppSelector((state) => state.somatic.submissionMessage);
  const submissionState = useAppSelector((state) => state.somatic.submissionState);
  const effectiveCourseId = params.courseId ? String(params.courseId) : storedCourseId;
  const completedRegionCount = useMemo(
    () => Object.values(completedRegions).filter(Boolean).length,
    [completedRegions],
  );

  useEffect(() => {
    if (!params.courseId && !params.gameId) {
      return;
    }

    dispatch(
      setSomaticCourseContext({
        courseId: params.courseId ? String(params.courseId) : undefined,
        gameId: params.gameId ? String(params.gameId) : undefined,
      }),
    );
  }, [dispatch, params.courseId, params.gameId]);

  useEffect(() => {
    if (submissionState !== 'error') {
      return;
    }

    dispatch(clearSomaticSubmissionState());
  }, [dispatch, submissionState]);

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader
            onBackPress={() =>
              router.replace({
                pathname: '/behavioural-signal-intelligence',
                params: effectiveCourseId ? { courseId: effectiveCourseId } : undefined,
              })
            }
          />
        </AnimatedReveal>

        <AnimatedReveal delay={100}>
          <View className="items-center gap-3 px-4">
            <Text className="text-center font-poppinsRegular text-[14px] leading-[24px]" style={{ color: colors.textSecondary }}>
              Select a region to map your current somatic state.
            </Text>

            {completedRegionCount > 0 ? (
              <Text className="text-center font-poppinsRegular text-[13px]" style={{ color: colors.accent }}>
                Completed somatic regions: {completedRegionCount}/6
              </Text>
            ) : null}

            {submissionState === 'submitting' ? (
              <Text className="text-center font-poppinsRegular text-[13px]" style={{ color: colors.textSecondary }}>
                Saving your somatic state...
              </Text>
            ) : submissionState === 'success' ? (
              <Text className="text-center font-poppinsRegular text-[13px]" style={{ color: colors.accent }}>
                {submissionMessage ?? 'Somatic state saved to your course activity.'}
              </Text>
            ) : submissionState === 'error' ? (
              <Text className="text-center font-poppinsRegular text-[13px]" style={{ color: '#E45B38' }}>
                {submissionMessage ?? 'We could not save the somatic state right now.'}
              </Text>
            ) : null}
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={180}>
          <SomaticMapCard
            onSelectRegion={(region) => {
              dispatch(clearSomaticSubmissionState());
              dispatch(resetCurrentSomaticRegion());
              dispatch(selectRegion(region));
              if (region === 'head') {
                router.push('/somatic-head-selection');
                return;
              }

              if (region === 'face-throat') {
                router.push('/somatic-face-throat-selection');
                return;
              }

              if (region === 'heart') {
                router.push('/somatic-heart-selection');
                return;
              }

              if (region === 'chest') {
                router.push('/somatic-chest-selection');
                return;
              }

              if (region === 'stomach') {
                router.push('/somatic-stomach-selection');
                return;
              }

              if (region === 'hands-legs') {
                router.push('/somatic-hands-legs-selection');
              }
            }}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

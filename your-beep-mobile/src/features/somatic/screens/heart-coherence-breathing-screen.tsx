import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { SomaticBackendActivityPanel } from '@/features/somatic/components/somatic-backend-activity-panel';
import { HeartCoherenceWave } from '@/features/somatic/components/heart-coherence-wave';
import { useCompleteSomaticRegion } from '@/features/somatic/hooks/use-complete-somatic-region';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { useAppSelector } from '@/store/hooks';
import { useAppTheme } from '@/theme/use-app-theme';

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function HeartCoherenceBreathingScreen() {
  const { colors, isDark } = useAppTheme();
  const { completeCurrentRegion, submissionState } = useCompleteSomaticRegion();
  const selectedHeartState = useAppSelector((state) => state.somatic.selectedHeartState);
  const [remainingSeconds, setRemainingSeconds] = useState(180);
  const totalCycles = 18;

  useEffect(() => {
    if (remainingSeconds <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds]);

  const completedCycles = useMemo(
    () => Math.min(totalCycles, Math.floor((180 - remainingSeconds) / 10)),
    [remainingSeconds],
  );

  const nextRoute =
    selectedHeartState === 'pounding-heart'
      ? '/somatic-heart-shoulder-neck-stretch'
      : '/somatic-states';

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <View className="gap-3 px-1">
            <Text className="font-poppinsSemi text-[32px] leading-[40px]" style={{ color: colors.textPrimary }}>
              Coherence Breathing
            </Text>
            <Text className="font-poppinsRegular text-[17px] leading-[30px]" style={{ color: colors.textSecondary }}>
              Syncing heart rate variability.
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <View className="gap-6">
            <SomaticBackendActivityPanel activityKey="coherence_breathing" />
            <HeartCoherenceWave
              active={remainingSeconds > 0}
              prompt='"Inhale deeply through the heart... Exhale, letting go of resistance."'
            />
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={240}>
          <View className="flex-row justify-between gap-4">
            <View className="flex-1 rounded-[18px] border px-4 py-5" style={{ backgroundColor: colors.surface, borderColor: isDark ? colors.primaryBorder : '#E3E0D4' }}>
              <Text className="text-center font-poppinsMedium text-[18px] tracking-[1.8px]" style={{ color: colors.textMuted }}>
                Remaining
              </Text>
              <Text className="mt-2 text-center font-poppinsSemi text-[28px]" style={{ color: colors.textPrimary }}>
                {formatTime(remainingSeconds)}
              </Text>
            </View>

            <View className="flex-1 rounded-[18px] border px-4 py-5" style={{ backgroundColor: colors.surface, borderColor: isDark ? colors.primaryBorder : '#E3E0D4' }}>
              <Text className="text-center font-poppinsMedium text-[18px] tracking-[1.8px]" style={{ color: colors.textMuted }}>
                Cycles
              </Text>
              <Text className="mt-2 text-center font-poppinsSemi text-[28px]" style={{ color: colors.textPrimary }}>
                {completedCycles}/{totalCycles}
              </Text>
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={320}>
          <AppButton
            disabled={submissionState === 'submitting'}
            label="Next"
            onPress={() => {
              if (nextRoute === '/somatic-states') {
                void completeCurrentRegion();
                return;
              }

              router.replace(nextRoute);
            }}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

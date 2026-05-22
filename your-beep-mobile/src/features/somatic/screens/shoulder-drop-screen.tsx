import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { useCompleteSomaticRegion } from '@/features/somatic/hooks/use-complete-somatic-region';
import { SessionPlayerControls } from '@/features/somatic/components/session-player-controls';
import { SomaticChip } from '@/features/somatic/components/somatic-chip';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { useAppTheme } from '@/theme/use-app-theme';

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function ShoulderDropScreen() {
  const { colors, isDark } = useAppTheme();
  const { completeCurrentRegion, submissionState } = useCompleteSomaticRegion();
  const [secondsRemaining, setSecondsRemaining] = useState(120);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || secondsRemaining <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [paused, secondsRemaining]);

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <View className="gap-2 px-1">
            <Text className="font-poppinsSemi text-[28px] leading-[36px]" style={{ color: colors.textPrimary }}>
              Shoulder Drop
            </Text>
            <Text className="font-poppinsRegular text-[14px] leading-[24px]" style={{ color: colors.textSecondary }}>
              Focus on the downward release of energy.
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={160}>
          <View
            className="rounded-[18px] border p-5"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.38)',
              borderColor: isDark ? colors.primaryBorder : '#E7E1CC',
            }}
          >
            <View className="items-center">
              <SomaticChip label="Tension Release" />
            </View>

            <View className="mt-3 items-center justify-center">
              <View className="h-[220px] w-[220px] items-center justify-center rounded-full border-[8px]" style={{ backgroundColor: colors.surface, borderColor: '#54E7DC' }}>
                <Text className="font-poppinsSemi text-[36px]" style={{ color: colors.textPrimary }}>
                  {formatTime(secondsRemaining)}
                </Text>
                <Text className="font-poppinsMedium text-[13px] uppercase tracking-[1px]" style={{ color: colors.textMuted }}>
                  Remaining
                </Text>
              </View>
            </View>

            <View className="mt-6 items-center gap-3">
              <Text className="text-center font-poppinsRegular text-[15px] leading-[28px]" style={{ color: colors.textSecondary }}>
                Inhale, shrugging shoulders to ears...
              </Text>
              <Text className="text-center font-poppinsRegular text-[15px] leading-[28px]" style={{ color: colors.textPrimary }}>
                Exhale, letting them fall completely.
              </Text>
            </View>

            <View className="mt-6">
              <SessionPlayerControls
                durationLabel={formatTime(secondsRemaining)}
                onPauseToggle={() => setPaused((current) => !current)}
                paused={paused}
                progress={1 - secondsRemaining / 120}
              />
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={260}>
          <AppButton
            disabled={submissionState === 'submitting'}
            label="Next"
            onPress={() => {
              void completeCurrentRegion();
            }}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

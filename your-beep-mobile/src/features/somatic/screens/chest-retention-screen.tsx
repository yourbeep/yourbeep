import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Heart, Pause, Play, RotateCcw, SkipForward } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { ChestBreathingCompass } from '@/features/somatic/components/chest-breathing-compass';
import { useCompleteSomaticRegion } from '@/features/somatic/hooks/use-complete-somatic-region';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { useAppTheme } from '@/theme/use-app-theme';

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function ChestRetentionScreen() {
  const { colors, isDark } = useAppTheme();
  const { completeCurrentRegion, submissionState } = useCompleteSomaticRegion();
  const [running, setRunning] = useState(true);
  const [remainingSeconds, setRemainingSeconds] = useState(105);

  useEffect(() => {
    if (!running || remainingSeconds <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds, running]);

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={140}>
          <View
            className="self-center rounded-full border px-4 py-2"
            style={{ backgroundColor: colors.surface, borderColor: isDark ? colors.primaryBorder : '#E6E4D7' }}
          >
            <View className="flex-row items-center gap-2">
              <Heart color={colors.primary} fill={colors.primary} size={14} />
              <Text className="font-poppinsSemi text-[14px]" style={{ color: colors.textPrimary }}>64 BPM</Text>
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={200}>
          <View className="items-center px-3 pt-8">
            <ChestBreathingCompass
              active={running}
              mode="retention"
              secondsLabel={formatTime(remainingSeconds)}
              targetLabel="Target: 02:00"
            />

            <View className="mt-8 items-center px-5">
              <Text className="font-poppinsMedium text-[18px]" style={{ color: colors.textPrimary }}>
                Maintain stillness.
              </Text>
              <Text className="mt-2 text-center font-poppinsRegular text-[15px] leading-[30px]" style={{ color: colors.textSecondary }}>
                Observe the density shifting. Allow the biological rhythm to anchor you.
              </Text>
            </View>

            <View className="mt-10 flex-row items-center justify-center gap-8">
              <Pressable
                className="h-14 w-14 items-center justify-center rounded-full border"
                onPress={() => setRemainingSeconds((current) => Math.min(120, current + 10))}
                style={{ backgroundColor: colors.surface, borderColor: isDark ? colors.primaryBorder : '#DCDCDC' }}
              >
                <RotateCcw color={colors.textSecondary} size={20} />
              </Pressable>
              <Pressable
                className="h-[76px] w-[76px] items-center justify-center rounded-full shadow-brand"
                onPress={() => setRunning((current) => !current)}
                style={{ backgroundColor: isDark ? colors.textPrimary : '#000000' }}
              >
                {running ? <Pause color={isDark ? colors.primary : '#FFFFFF'} size={28} /> : <Play color={isDark ? colors.primary : '#FFFFFF'} size={28} />}
              </Pressable>
              <Pressable
                className="h-14 w-14 items-center justify-center rounded-full border"
                onPress={() => {
                  void completeCurrentRegion();
                }}
                style={{ backgroundColor: colors.surface, borderColor: isDark ? colors.primaryBorder : '#DCDCDC' }}
                disabled={submissionState === 'submitting'}
              >
                <SkipForward color={colors.textSecondary} size={20} />
              </Pressable>
            </View>
          </View>
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

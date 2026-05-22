import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { RotateCcw, Play, Pause, Volume2, ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { SomaticChip } from '@/features/somatic/components/somatic-chip';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { useAppTheme } from '@/theme/use-app-theme';

const AnimatedView = Animated.createAnimatedComponent(View);

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(1, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function HeartReleaseBreathingScreen() {
  const { colors, isDark } = useAppTheme();
  const [running, setRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = running
      ? withRepeat(
          withSequence(
            withTiming(1.1, {
              duration: 2400,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(0.9, {
              duration: 2400,
              easing: Easing.inOut(Easing.ease),
            }),
          ),
          -1,
          false,
        )
      : withTiming(1, { duration: 220 });
  }, [running, scale]);

  useEffect(() => {
    if (!running || remainingSeconds <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds, running]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const phaseLabel = useMemo(() => {
    const cycleSecond = (300 - remainingSeconds) % 8;
    return cycleSecond < 4 ? 'INHALE' : 'EXHALE';
  }, [remainingSeconds]);

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <View className="gap-3 px-1">
            <SomaticChip label="Expansion allowance" />
            <Text className="font-poppinsSemi text-[32px] leading-[40px]" style={{ color: colors.textPrimary }}>
              The Release
            </Text>
            <Text className="font-poppinsRegular text-[17px] leading-[30px]" style={{ color: colors.textSecondary }}>
              Allow the heart centre to soften and expand. Breathe into the space behind the sternum.
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <View className="items-center py-3">
            <AnimatedView
              className="h-[300px] w-[300px] items-center justify-center rounded-full border-[5px] border-[#FFB158]"
              style={ringStyle}
            >
              <View className="h-[246px] w-[246px] items-center justify-center rounded-full border border-[rgba(255,177,88,0.18)] bg-[rgba(255,198,132,0.06)]">
                <Text className="font-poppinsSemi text-[66px] leading-[72px]" style={{ color: colors.textPrimary }}>
                  {formatTime(remainingSeconds)}
                </Text>
                <Text className="mt-2 font-poppinsMedium text-[18px] tracking-[1.8px]" style={{ color: colors.textMuted }}>
                  {phaseLabel}
                </Text>
              </View>
            </AnimatedView>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={240}>
          <View className="rounded-[24px] border p-5" style={{ backgroundColor: colors.surface, borderColor: isDark ? colors.primaryBorder : '#E5E1D5' }}>
            <View className="flex-row items-center justify-between">
              <Text className="font-poppinsSemi text-[18px]" style={{ color: colors.textPrimary }}>Vagal Tone Target</Text>
              <Text className="font-poppinsSemi text-[18px] text-[#54D9D0]">High</Text>
            </View>

            <View className="mt-6 flex-row items-center justify-center gap-8">
              <Pressable
                className="h-[58px] w-[58px] items-center justify-center rounded-full border"
                style={{ backgroundColor: colors.surface, borderColor: isDark ? colors.primaryBorder : '#E6E3D8' }}
                onPress={() => {
                  setRemainingSeconds(300);
                  setRunning(false);
                }}
              >
                <RotateCcw color={colors.textSecondary} size={24} />
              </Pressable>

              <Pressable
                className="h-[88px] w-[88px] items-center justify-center rounded-full shadow-brand"
                style={{ backgroundColor: isDark ? colors.textPrimary : '#000000' }}
                onPress={() => setRunning((current) => !current)}
              >
                {running ? <Pause color={isDark ? colors.primary : '#FFFFFF'} size={34} /> : <Play color={isDark ? colors.primary : '#FFFFFF'} size={34} />}
              </Pressable>

              <Pressable className="h-[58px] w-[58px] items-center justify-center rounded-full border" style={{ backgroundColor: colors.surface, borderColor: isDark ? colors.primaryBorder : '#E6E3D8' }}>
                <Volume2 color={colors.textSecondary} size={24} />
              </Pressable>
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={320}>
          <AppButton
            label="Next"
            onPress={() => router.push('/somatic-heart-expansion-allowance')}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

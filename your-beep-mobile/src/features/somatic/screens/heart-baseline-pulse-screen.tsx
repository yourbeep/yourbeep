import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Play, Pause, ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { useCompleteSomaticRegion } from '@/features/somatic/hooks/use-complete-somatic-region';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { useAppTheme } from '@/theme/use-app-theme';

const AnimatedView = Animated.createAnimatedComponent(View);

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function HeartBaselinePulseScreen() {
  const { colors, isDark } = useAppTheme();
  const { completeCurrentRegion, submissionState } = useCompleteSomaticRegion();
  const [running, setRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(180);
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = running
      ? withRepeat(
          withTiming(1.08, {
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true,
        )
      : withTiming(1, { duration: 220 });
  }, [pulse, running]);

  useEffect(() => {
    if (!running || remainingSeconds <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds, running]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

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
              Baseline Pulse Awareness
            </Text>
            <Text className="font-poppinsRegular text-[17px] leading-[30px]" style={{ color: colors.textSecondary }}>
              Place your hand over your heart. Observe the rhythm without judgment.
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={160}>
          <View className="items-center py-4">
            <View className="h-[278px] w-[278px] items-center justify-center rounded-full border border-[rgba(111,235,216,0.18)] bg-[rgba(112,239,217,0.08)]">
              <View className="h-[212px] w-[212px] items-center justify-center rounded-full bg-[rgba(90,229,213,0.16)]">
                <AnimatedView
                  className="h-[126px] w-[126px] items-center justify-center rounded-full border-[5px]"
                  style={[pulseStyle, { backgroundColor: colors.surface, borderColor: '#93F0DE' }]}
                >
                  <View className="h-12 w-12 rounded-full bg-[#0B7E71]" />
                </AnimatedView>
              </View>
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={230}>
          <View className="items-center">
            <View
              className="rounded-full border px-8 py-3"
              style={{ backgroundColor: colors.surface, borderColor: isDark ? colors.primaryBorder : '#E2E0D4' }}
            >
              <Text className="font-poppinsSemi text-[40px]" style={{ color: colors.textPrimary }}>
                {formatTime(remainingSeconds)}
              </Text>
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={300}>
          <View className="items-center">
            <Pressable
              className="h-[112px] w-[112px] items-center justify-center rounded-full shadow-brand"
              style={{ backgroundColor: isDark ? colors.textPrimary : '#000000' }}
              onPress={() => setRunning((current) => !current)}
            >
              {running ? <Pause color={isDark ? colors.primary : '#FFFFFF'} size={34} /> : <Play color={isDark ? colors.primary : '#FFFFFF'} size={34} />}
            </Pressable>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={370}>
          <AppButton
            disabled={submissionState === 'submitting'}
            label="Complete"
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

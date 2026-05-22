import { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { SomaticBackendActivityPanel } from '@/features/somatic/components/somatic-backend-activity-panel';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { appImages } from '@/constants/images';
import { useAppTheme } from '@/theme/use-app-theme';

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function JawAwarenessExerciseScreen() {
  const [secondsRemaining, setSecondsRemaining] = useState(105);
  const { colors, isDark } = useAppTheme();

  useEffect(() => {
    if (secondsRemaining <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining]);

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <View className="gap-2 px-1">
            <Text className="font-poppinsSemi text-[26px] leading-[36px]" style={{ color: colors.textPrimary }}>
              Jaw Awareness Reset
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={160}>
          <View className="items-center gap-6 px-2 pt-2">
            <SomaticBackendActivityPanel activityKey="jaw_awareness_reset" />

            <View className="items-center">
              <View className="h-[248px] w-[248px] items-center justify-center rounded-full border-[8px] border-[#0C7B73] bg-transparent">
                <View className="h-[204px] w-[204px] items-center justify-center rounded-full bg-[#2C2C2C]">
                  <Image
                    className="h-[176px] w-[176px] rounded-full"
                    resizeMode="contain"
                    source={appImages.jaw}
                  />
                </View>
              </View>

              <View
                className="-mt-4 flex-row items-center gap-3 rounded-full border px-5 py-2"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.primaryBorder,
                }}
              >
                <View className="h-2.5 w-2.5 rounded-full bg-[#0C8B77]" />
                <Text
                  className="font-poppinsSemi text-[16px] leading-[18px]"
                  style={{ color: colors.textPrimary }}
                >
                  Releasing{'\n'}Tension
                </Text>
              </View>
            </View>

            <View className="mt-8 items-center gap-2 px-4">
              <Text className="text-center font-poppinsSemi text-[26px] leading-[34px]" style={{ color: colors.textPrimary }}>
                Drop the lower jaw.
              </Text>
              <Text className="text-center font-poppinsRegular text-[16px] leading-[32px]" style={{ color: colors.textSecondary }}>
                Allow a small gap to form between your upper and lower teeth. Breathe naturally
                through the nose.
              </Text>
            </View>

            <View className="mt-8 flex-row items-center gap-4">
              <Text className="font-poppinsSemi text-[18px]" style={{ color: colors.textPrimary }}>
                {formatTime(secondsRemaining)}
              </Text>
              <View className="h-8 w-[2px] rounded-full" style={{ backgroundColor: isDark ? colors.primaryBorder : '#D4D8DB' }} />
              <Text className="font-poppinsSemi text-[18px]" style={{ color: colors.textPrimary }}>03:00</Text>
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={260}>
          <AppButton
            label="Next"
            onPress={() => router.push('/somatic-face-throat-throat-openness')}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>

        <AnimatedReveal delay={320}>
          <AppButton
            label="Skip Activity"
            onPress={() => router.push('/somatic-face-throat-throat-openness')}
            variant="secondary"
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

import { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, Clock3 } from 'lucide-react-native';

import { appImages } from '@/constants/images';
import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { useCompleteSomaticRegion } from '@/features/somatic/hooks/use-complete-somatic-region';
import { proprioceptionPrompt } from '@/features/somatic/data/somatic-content';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { useAppTheme } from '@/theme/use-app-theme';

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function HandsLegsProprioceptionGroundingScreen() {
  const [secondsRemaining, setSecondsRemaining] = useState(60);
  const { colors, isDark } = useAppTheme();
  const { completeCurrentRegion, submissionState } = useCompleteSomaticRegion();

  useEffect(() => {
    if (secondsRemaining <= 0) return undefined;
    const timer = setInterval(() => {
      setSecondsRemaining((value) => Math.max(0, value - 1));
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
            <Text className="font-poppinsSemi text-[32px] leading-[38px]" style={{ color: colors.textPrimary }}>
              Proprioception Grounding
            </Text>
            <Text className="font-poppinsRegular text-[14px]" style={{ color: colors.textSecondary }}>
              Kinetic Awareness
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <View
            className="overflow-hidden rounded-[22px] p-3"
            style={{ backgroundColor: isDark ? colors.surface : '#3A3A3A' }}
          >
            <Image
              className="h-[230px] w-full rounded-[18px]"
              resizeMode="cover"
              source={appImages.Proprioception}
            />
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={240}>
          <View
            className="rounded-[18px] px-5 py-5 shadow-brand"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.primaryBorder,
              borderWidth: 1,
            }}
          >
            <Text className="text-center font-poppinsRegular text-[13px] leading-[22px]" style={{ color: colors.textSecondary }}>
              {proprioceptionPrompt}
            </Text>
            <View className="mt-4 flex-row items-center justify-center gap-2">
              <Clock3 color={colors.textMuted} size={14} strokeWidth={2} />
              <Text className="font-poppinsSemi text-[20px]" style={{ color: colors.textPrimary }}>
                {formatTime(secondsRemaining)}
              </Text>
            </View>
            <View
              className="mt-3 h-[4px] w-full rounded-full"
              style={{ backgroundColor: isDark ? colors.surfaceMuted : '#E5E8E0' }}
            >
              <View
                className="h-[4px] rounded-full bg-[#67E4D2]"
                style={{ width: `${(1 - secondsRemaining / 60) * 100}%` }}
              />
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={320}>
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

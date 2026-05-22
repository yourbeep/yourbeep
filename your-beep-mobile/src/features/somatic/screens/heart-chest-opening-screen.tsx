import { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, Play, Pause } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { useCompleteSomaticRegion } from '@/features/somatic/hooks/use-complete-somatic-region';
import { SomaticChip } from '@/features/somatic/components/somatic-chip';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { heartChestOpeningSteps } from '@/features/somatic/data/somatic-content';
import { appImages } from '@/constants/images';
import { useAppTheme } from '@/theme/use-app-theme';

interface HeartChestOpeningScreenProps {
  chipLabel?: string;
  finishRoute?: string;
  subtitle?: string;
}

export function HeartChestOpeningScreen({
  chipLabel = 'Exercise #2',
  finishRoute = '/somatic-states',
  subtitle = 'Sternum & pec stretch. Open the thoracic cavity to release somatic bracing and lengthen the pectoral fibers.',
}: HeartChestOpeningScreenProps) {
  const { colors, isDark } = useAppTheme();
  const { completeCurrentRegion, submissionState } = useCompleteSomaticRegion();
  const [running, setRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(30);

  useEffect(() => {
    if (!running || remainingSeconds <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds, running]);

  const complete = remainingSeconds === 0;

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <View className="gap-3 px-1">
            <SomaticChip label={chipLabel} />
            <Text className="font-poppinsSemi text-[32px] leading-[40px]" style={{ color: colors.textPrimary }}>
              Sternum & Pec Stretch
            </Text>
            <Text className="font-poppinsRegular text-[17px] leading-[30px]" style={{ color: colors.textSecondary }}>
              {subtitle}
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <View className="overflow-hidden p-4">
            <View className="flex items-center px-3 py-4">
              <Image
                className="h-[172px] w-[403px]"
                resizeMode="cover"
                source={appImages.ChestOpening}
              />
              {/* <View className="absolute right-3 top-3 rounded-full bg-brand-surface px-4 py-2">
                <Text className="font-poppinsSemi text-[14px] text-brand-text">Vagal Tone Active</Text>
              </View> */}
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={240}>
          <View className="gap-5 px-1">
            <Text className="font-poppinsSemi text-[28px] leading-[36px]" style={{ color: colors.textPrimary }}>
              Kinetic Sequence
            </Text>
            <View className="gap-5">
              {heartChestOpeningSteps.map((step, index) => (
                <View className="flex-row gap-4" key={step}>
                  <View className="items-center">
                    <View
                      className="h-10 w-10 items-center justify-center rounded-full border-2"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: index === 0 ? '#0B7E71' : isDark ? colors.primaryBorder : '#D8D9E2',
                      }}
                    >
                      <Text className="font-poppinsSemi text-[16px]" style={{ color: index === 0 ? '#0B7E71' : colors.textMuted }}>
                        {index + 1}
                      </Text>
                    </View>
                    {index !== heartChestOpeningSteps.length - 1 ? (
                      <View className="mt-1 h-10 w-[2px]" style={{ backgroundColor: isDark ? colors.primaryBorder : '#DDE9E0' }} />
                    ) : null}
                  </View>

                  <Text className="flex-1 pt-1 font-poppinsRegular text-[16px] leading-[30px]" style={{ color: colors.textSecondary }}>
                    {step}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={310}>
          <View
            className="rounded-[28px] border px-6 py-7"
            style={{ backgroundColor: colors.surface, borderColor: isDark ? colors.primaryBorder : '#E8E3D6' }}
          >
            <Text className="text-center font-poppinsMedium text-[18px] tracking-[1.8px]" style={{ color: colors.textMuted }}>
              HOLD DURATION
            </Text>
            <Text className="mt-2 text-center font-poppinsSemi text-[64px] leading-[72px]" style={{ color: colors.textPrimary }}>
              {remainingSeconds}
              <Text className="font-poppinsRegular text-[32px]" style={{ color: colors.textMuted }}> s</Text>
            </Text>

            <View className="mx-auto mt-4 h-3 w-[170px] overflow-hidden rounded-full" style={{ backgroundColor: isDark ? colors.surfaceStrong : '#E4E7E7' }}>
              <View
                className="h-3 rounded-full bg-[#0B7E71]"
                style={{ width: `${((30 - remainingSeconds) / 30) * 100}%` }}
              />
            </View>

            <View className="mt-6">
              <AppButton
                disabled={submissionState === 'submitting'}
                label={complete ? 'Complete' : running ? 'Pause Flow' : 'Start Flow'}
                onPress={() => {
                  if (complete) {
                    if (finishRoute === '/somatic-states') {
                      void completeCurrentRegion();
                      return;
                    }

                    router.replace(finishRoute);
                    return;
                  }

                  setRunning((current) => !current);
                }}
                trailing={
                  complete ? (
                    <ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />
                  ) : running ? (
                    <Pause color="#FEFEE5" size={18} strokeWidth={2.2} />
                  ) : (
                    <Play color="#FEFEE5" size={18} strokeWidth={2.2} />
                  )
                }
              />
            </View>
          </View>
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

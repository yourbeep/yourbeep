import { useEffect, useState } from 'react';
import { ImageBackground, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { cognitiveReactivationSteps } from '@/features/somatic/data/somatic-content';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { SomaticScreenHero } from '@/features/somatic/components/somatic-screen-hero';
import { appImages } from '@/constants/images';
import { useAppTheme } from '@/theme/use-app-theme';

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function CognitiveReactivationScreen() {
  const { colors, isDark } = useAppTheme();
  const [secondsRemaining, setSecondsRemaining] = useState(120);

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
          <SomaticScreenHero
            description="Exercise #1: create distance from the mental fog by shifting attention and softening fixation."
            title="Cognitive Diffusion Drill"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={160}>
          <ImageBackground
            className="overflow-hidden p-4 h-[227px] w-[406px]
            flex items-center justify-center"
            imageStyle={{ borderRadius: 24 }}
            source={appImages.Cognitive}
          >
            <View
              className="items-center gap-2 rounded-full px-6 py-5 h-[150px] w-[169px]"
              style={{ backgroundColor: isDark ? 'rgba(19,36,42,0.82)' : 'rgba(255,255,255,0.72)' }}
            >
              <Text className="font-poppinsSemi text-[10px] uppercase tracking-[1.2px]" style={{ color: colors.textMuted }}>
                Session   
              </Text>
              <Text className="font-poppinsSemi text-[36px]" style={{ color: colors.textPrimary }}>
                {formatTimer(secondsRemaining)}
              </Text>
              <View className="h-[4px] w-14 rounded-full bg-[#49D1C8]" />
            </View>
          </ImageBackground>
        </AnimatedReveal>

        <AnimatedReveal delay={240}>
          <View className="gap-4 px-2">
            <View className="gap-3">
              <Text className="font-poppinsSemi text-[18px]" style={{ color: colors.textPrimary }}>
                Diffusion Sequence
              </Text>
              <View className="h-[1px]" style={{ backgroundColor: isDark ? colors.primaryBorder : '#E8E6D8' }} />
            </View>

            <View className="relative pl-10">
              <View className="absolute left-[15px] top-0 h-[170px] w-[1px]" style={{ backgroundColor: isDark ? colors.primaryBorder : '#D6D8DE' }} />

              {cognitiveReactivationSteps.map((step, index) => {
                const isPrimary = index === 0;

                return (
                  <View className={isPrimary ? 'mb-6' : 'mb-5'} key={step}>
                    <View
                      className={`absolute left-[-33px] top-1 h-8 w-8 items-center justify-center rounded-full border ${
                        isPrimary
                          ? 'border-[#0E5969] bg-brand-primary'
                          : 'border-[#CFCFD6] bg-[#F1F1F5]'
                      }`}
                    >
                      <Text
                        className={`font-poppinsSemi text-[16px] ${
                          isPrimary ? 'text-brand-background' : 'text-brand-textMuted'
                        }`}
                      >
                        {index + 1}
                      </Text>
                    </View>

                    {isPrimary ? (
                      <View
                        className="rounded-[14px] px-5 py-4 shadow-[0_8px_24px_rgba(16,42,67,0.08)]"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: isDark ? colors.primaryBorder : '#D7DBE3',
                          borderWidth: 1,
                        }}
                      >
                        <Text className="font-poppinsRegular text-[16px] leading-[24px]" style={{ color: colors.textPrimary }}>
                          {step}
                        </Text>
                      </View>
                    ) : (
                      <Text className="pt-1 font-poppinsRegular text-[16px] leading-[24px]" style={{ color: colors.textSecondary }}>
                        {step}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={320}>
          <AppButton
            label="Next"
            onPress={() => router.push('/somatic-head-fog-vs-fatigue')}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

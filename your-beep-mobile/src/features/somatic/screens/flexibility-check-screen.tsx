import { ImageBackground, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { SomaticAwarenessTestHero } from '@/features/somatic/components/somatic-awareness-test-hero';
import { SomaticStepCard } from '@/features/somatic/components/somatic-step-card';
import { appImages } from '@/constants/images';
import { useAppTheme } from '@/theme/use-app-theme';

export function FlexibilityCheckScreen() {
  const { colors, isDark } = useAppTheme();

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <SomaticAwarenessTestHero
            chipLabel="Diagnostics Module"
            description="Assess your capacity to shift attention between conflicting neuro-somatic signals."
            subtitle="The Flexibility Check"
            title="Awareness Test #3"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={160}>
          <ImageBackground
            source={appImages.Flexiblity}
            className="h-[163px] w-[387px] overflow-hidden rounded-[24px] py-4"
            imageStyle={{ borderRadius: 24 }}
          >
          </ImageBackground>
        </AnimatedReveal>

        <AnimatedReveal delay={230}>
          <SomaticStepCard accent="cool" title="Guided Investigation">
            <Text className="font-poppinsRegular text-[13px] leading-[22px]" style={{ color: colors.textSecondary }}>
              Pick any current topic of stress or fixation. Sit quietly for a moment, then ask yourself:
            </Text>

            <View className="mt-4 gap-3">
              <Text className="font-poppinsRegular text-[13px] leading-[22px]" style={{ color: colors.textPrimary }}>
                ○ Can I generate two alternative perspectives on this issue?
              </Text>
              <Text className="font-poppinsRegular text-[13px] leading-[22px]" style={{ color: colors.textPrimary }}>
                ○ Can I pause mid-sentence while explaining my frustration?
              </Text>
            </View>

            <View
              className="mt-4 rounded-[14px] p-3"
              style={{ backgroundColor: isDark ? colors.surface : '#F5F7F8' }}
            >
              <Text className="font-poppinsRegular text-[13px] leading-[22px]" style={{ color: colors.textSecondary }}>
                The goal is not to solve the issue, but to observe your structural capacity to shift focus away from it.
              </Text>
            </View>
          </SomaticStepCard>
        </AnimatedReveal>

        <AnimatedReveal delay={300}>
          <AppButton
            label="Next"
            onPress={() => router.push('/somatic-head-cognitive-reactivation')}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

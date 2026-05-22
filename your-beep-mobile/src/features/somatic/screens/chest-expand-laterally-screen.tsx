import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { ChestBreathingCompass } from '@/features/somatic/components/chest-breathing-compass';
import { useCompleteSomaticRegion } from '@/features/somatic/hooks/use-complete-somatic-region';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { SomaticScreenHero } from '@/features/somatic/components/somatic-screen-hero';
import { chestBreathPhaseLabels } from '@/features/somatic/data/somatic-content';
import { useAppTheme } from '@/theme/use-app-theme';

export function ChestExpandLaterallyScreen() {
  const { colors, isDark } = useAppTheme();
  const { completeCurrentRegion, submissionState } = useCompleteSomaticRegion();

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <SomaticScreenHero
            description="Draw the breath deep into your side ribs and lower back. Feel the abstract markers expand outward."
            title="Expand Laterally"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={160}>
          <View className="flex-row gap-2">
            {chestBreathPhaseLabels.map((label, index) => (
              <View
                className="rounded-full px-3 py-1.5"
                key={label}
                style={{ backgroundColor: index === 0 ? (isDark ? colors.textPrimary : '#000000') : (isDark ? colors.surfaceStrong : '#E6E4E7') }}
              >
                <Text className="font-poppinsSemi text-[12px]" style={{ color: index === 0 ? (isDark ? colors.primary : '#FFFFFF') : colors.textMuted }}>
                  {label}
                </Text>
              </View>
            ))}
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={220}>
          <ChestBreathingCompass mode="poster" />
        </AnimatedReveal>

        <AnimatedReveal delay={290}>
          <ChestBreathingCompass secondsLabel="03:45" />
        </AnimatedReveal>

        <AnimatedReveal delay={360}>
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

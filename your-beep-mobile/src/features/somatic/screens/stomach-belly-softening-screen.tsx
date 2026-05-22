import { useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { BreathingRing } from '@/features/somatic/components/breathing-ring';
import { useCompleteSomaticRegion } from '@/features/somatic/hooks/use-complete-somatic-region';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { useAppSelector } from '@/store/hooks';
import { useAppTheme } from '@/theme/use-app-theme';

export function StomachBellySofteningScreen() {
  const { colors } = useAppTheme();
  const { completeCurrentRegion, submissionState } = useCompleteSomaticRegion();
  const selectedStomachState = useAppSelector((state) => state.somatic.selectedStomachState);
  const [inhalePhase, setInhalePhase] = useState(true);

  const nextLabel = selectedStomachState === 'butterflies' ? 'Complete' : 'Next';

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
              Belly Softening
            </Text>
            <Text className="font-poppinsRegular text-[17px] leading-[30px]" style={{ color: colors.textSecondary }}>
              Exercise #1: soften the abdominal wall and let the breath spread through the lower belly without forcing it.
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <View className="gap-8 px-2">
            <View className="items-center justify-center py-2">
              <BreathingRing
                active
                centerLabel={inhalePhase ? 'SOFTEN' : 'RELEASE'}
                mode="expand"
              />
            </View>

            <Text className="text-center font-poppinsRegular text-[15px] leading-[28px]" style={{ color: colors.textSecondary }}>
              Let the inhale widen the belly. Let the exhale release any held bracing in the gut.
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={260}>
          <AppButton
            disabled={submissionState === 'submitting'}
            label={nextLabel}
            onPress={() => {
              if (selectedStomachState === 'butterflies') {
                void completeCurrentRegion();
                return;
              }

              setInhalePhase((current) => !current);
              router.push('/somatic-stomach-safety-cue');
            }}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

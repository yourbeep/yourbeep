import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { BreathingRing } from '@/features/somatic/components/breathing-ring';
import { SomaticBackendActivityPanel } from '@/features/somatic/components/somatic-backend-activity-panel';
import { useCompleteSomaticRegion } from '@/features/somatic/hooks/use-complete-somatic-region';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { SomaticAwarenessTestHero } from '@/features/somatic/components/somatic-awareness-test-hero';
import { useAppTheme } from '@/theme/use-app-theme';

export function HeadExpandWindowScreen() {
  const { colors } = useAppTheme();
  const { completeCurrentRegion, submissionState } = useCompleteSomaticRegion();
  const [breathCount, setBreathCount] = useState(5);
  const [inhalePhase, setInhalePhase] = useState(true);

  useEffect(() => {
    if (breathCount <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setInhalePhase((current) => !current);
      setBreathCount((current) => (inhalePhase ? current : Math.max(0, current - 1)));
    }, 3000);

    return () => clearInterval(timer);
  }, [breathCount, inhalePhase]);

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <SomaticAwarenessTestHero
            description="Take five slow diaphragmatic breaths and widen your attention beyond the initial point of focus."
            subtitle="Expand the Window"
            title="Exercise #1"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <View className="gap-8 px-2">
            <SomaticBackendActivityPanel activityKey="expand_the_window" />

            <View className="items-center justify-center py-2">
              <BreathingRing
                active={breathCount > 0}
                centerLabel={inhalePhase ? 'INHALE' : 'EXHALE'}
                mode="expand"
              />
            </View>

            <View className="items-center gap-2">
              <Text className="font-poppinsSemi text-[28px]" style={{ color: colors.textPrimary }}>
                {breathCount}
              </Text>
              <Text className="font-poppinsRegular text-[15px] leading-[26px]" style={{ color: colors.textSecondary }}>
                Slow diaphragmatic breaths remaining
              </Text>
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={260}>
          <AppButton
            disabled={submissionState === 'submitting'}
            label={breathCount > 0 ? 'Finish Early' : 'Complete'}
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

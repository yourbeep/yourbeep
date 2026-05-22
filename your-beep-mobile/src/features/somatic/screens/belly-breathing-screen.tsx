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
import { SessionPlayerControls } from '@/features/somatic/components/session-player-controls';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { useAppTheme } from '@/theme/use-app-theme';

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function BellyBreathingScreen() {
  const { colors } = useAppTheme();
  const [secondsRemaining, setSecondsRemaining] = useState(180);
  const [paused, setPaused] = useState(false);
  const [inhalePhase, setInhalePhase] = useState(true);

  useEffect(() => {
    if (paused || secondsRemaining <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((current) => Math.max(0, current - 1));
      setInhalePhase((current) => !current);
    }, 3000);

    return () => clearInterval(timer);
  }, [paused, secondsRemaining]);

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
              Exercise #
            </Text>
            <Text className="font-poppinsMedium text-[18px]" style={{ color: colors.textPrimary }}>Belly Breathing</Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={160}>
          <View className="gap-8 px-2">
            <SomaticBackendActivityPanel activityKey="belly_breathing" />

            <View className="items-center justify-center py-2">
              <BreathingRing
                active={!paused}
                centerLabel={inhalePhase ? 'INHALE' : 'EXHALE'}
                mode="expand"
              />
            </View>

            <SessionPlayerControls
              durationLabel={formatTime(secondsRemaining)}
              onPauseToggle={() => setPaused((current) => !current)}
              paused={paused}
              progress={1 - secondsRemaining / 180}
            />
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={260}>
          <AppButton
            label="Next"
            onPress={() => router.push('/somatic-face-throat-neck-release')}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>

        <AnimatedReveal delay={320}>
          <AppButton
            label="Skip Activity"
            onPress={() => router.push('/somatic-face-throat-neck-release')}
            variant="secondary"
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

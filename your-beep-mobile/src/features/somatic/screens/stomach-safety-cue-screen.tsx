import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { SafetyCueOrb } from '@/features/somatic/components/safety-cue-orb';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { useAppTheme } from '@/theme/use-app-theme';

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(1, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function StomachSafetyCueScreen() {
  const { colors } = useAppTheme();
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
          <View className="gap-3 px-1">
            <Text className="font-poppinsSemi text-[32px] leading-[40px]" style={{ color: colors.textPrimary }}>
              Safety Cue
            </Text>
            <Text className="font-poppinsRegular text-[17px] leading-[30px]" style={{ color: colors.textSecondary }}>
              Exercise #2: connect with a visceral sense of safety. Place one hand on the heart and one on the stomach.
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <SafetyCueOrb active={secondsRemaining > 0} secondsLabel={formatTime(secondsRemaining)} />
        </AnimatedReveal>

        <AnimatedReveal delay={250}>
          <Text className="text-center font-poppinsSemi text-[18px]" style={{ color: colors.textPrimary }}>
            Tell yourself, &quot;I&apos;m safe&quot;
          </Text>
        </AnimatedReveal>

        <AnimatedReveal delay={330}>
          <AppButton
            label="Next"
            onPress={() => {
              router.push('/somatic-stomach-gut-reaction');
            }}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

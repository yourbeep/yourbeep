import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { SessionPlayerControls } from '@/features/somatic/components/session-player-controls';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { headBackReleaseSteps } from '@/features/somatic/data/somatic-content';
import { useAppTheme } from '@/theme/use-app-theme';

export function ChestHeadBackScreen() {
  const { colors, isDark } = useAppTheme();
  const [running, setRunning] = useState(true);
  const [remainingSeconds, setRemainingSeconds] = useState(120);

  useEffect(() => {
    if (!running || remainingSeconds <= 0) {
      return undefined;
    }
    const timer = setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds, running]);

  const durationLabel = `0${Math.floor(remainingSeconds / 60)}:${(remainingSeconds % 60)
    .toString()
    .padStart(2, '0')}`;

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
              Supported Head-Back Release
            </Text>
            <Text className="font-poppinsRegular text-[17px] leading-[30px]" style={{ color: colors.textSecondary }}>
              Create space across the front chest and throat while the upper body rests.
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <View className="rounded-[26px] border p-5" style={{ backgroundColor: colors.surface, borderColor: isDark ? colors.primaryBorder : '#E4E0D2' }}>
            <View className="h-[244px] rounded-[20px]" style={{ backgroundColor: isDark ? colors.surfaceMuted : 'rgba(230,234,236,0.56)' }}>
              <View className="flex-1 items-center justify-center">
                <Text className="font-poppinsMedium text-[14px]" style={{ color: colors.textMuted }}>
                  Resting pose placeholder
                </Text>
              </View>
            </View>

            <View className="mt-5 gap-4">
              {headBackReleaseSteps.map((step, index) => (
                <View className="flex-row gap-4" key={step}>
                  <View className="h-9 w-9 items-center justify-center rounded-full border" style={{ backgroundColor: colors.surfaceMuted, borderColor: isDark ? colors.primaryBorder : '#DADCE8' }}>
                    <Text className="font-poppinsSemi text-[13px]" style={{ color: colors.primary }}>{index + 1}</Text>
                  </View>
                  <Text className="flex-1 font-poppinsRegular text-[15px] leading-[26px]" style={{ color: colors.textSecondary }}>
                    {step}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={260}>
          <SessionPlayerControls
            durationLabel={durationLabel}
            onPauseToggle={() => setRunning((current) => !current)}
            paused={!running}
            progress={(120 - remainingSeconds) / 120}
          />
        </AnimatedReveal>

        <AnimatedReveal delay={340}>
          <AppButton
            label="Next"
            onPress={() => router.push('/somatic-chest-sternum-pec')}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

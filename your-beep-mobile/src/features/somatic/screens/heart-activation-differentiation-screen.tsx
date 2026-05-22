import { useMemo, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { HeartSegmentToggle } from '@/features/somatic/components/heart-segment-toggle';
import { SomaticChip } from '@/features/somatic/components/somatic-chip';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { heartActivationRows } from '@/features/somatic/data/somatic-content';
import { appImages } from '@/constants/images';
import { useAppTheme } from '@/theme/use-app-theme';

type ToggleValue = 'left' | 'right';

export function HeartActivationDifferentiationScreen() {
  const { colors, isDark } = useAppTheme();
  const [answers, setAnswers] = useState<Record<string, ToggleValue>>({
    Feelings: 'left',
    'Notice your breath': 'left',
    'Neck & shoulder': 'left',
  });

  const explanation = useMemo(() => {
    const threatCount = Object.values(answers).filter((value) => value === 'right').length;
    return threatCount >= 2
      ? 'Threat often includes contraction, urgency, and muscle bracing. Use the next exercise to widen the breath and soften resistance.'
      : 'Excitement usually includes expansion and fluidity. Use the next exercise to organize that activation without suppressing it.';
  }, [answers]);

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <View className="gap-3 px-1">
            <SomaticChip label="Diagnostic Protocol" />
            <Text className="font-poppinsSemi text-[32px] leading-[40px]" style={{ color: colors.textPrimary }}>
              Differentiating Activation
            </Text>
            <Text className="font-poppinsRegular text-[17px] leading-[30px]" style={{ color: colors.textSecondary }}>
              Diagnostic protocol to determine if heart activation originates from physiological exertion or emotional state change.
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <View
            className="overflow-hidden rounded-[28px] border px-5 py-6"
            style={{
              backgroundColor: isDark ? colors.surface : '#FFF8EF',
              borderColor: isDark ? colors.primaryBorder : '#F5CBB5',
            }}
          >
            <Text className="font-poppinsRegular text-[16px] leading-[30px]" style={{ color: colors.textSecondary }}>
              Areas of highest cognitive or emotional resonance.
            </Text>

            <View className="mt-6 flex-row gap-4">
              <View className="min-w-0 flex-1 gap-4">
                {heartActivationRows.map((label) => (
                  <View className="gap-2" key={label}>
                    <Text className="font-poppinsSemi text-[16px] leading-[24px]" style={{ color: colors.primary }}>
                      {label}
                    </Text>
                    <HeartSegmentToggle
                      onChange={(value) =>
                        setAnswers((current) => ({
                          ...current,
                          [label]: value,
                        }))
                      }
                      value={answers[label]}
                    />
                  </View>
                ))}
              </View>

              <View className="w-[96px] items-end justify-end">
                <Image
                  className="h-[136px] w-[92px]"
                  resizeMode="contain"
                  source={appImages.Illustration}
                />
              </View>
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={250}>
          <Text className="px-1 font-poppinsRegular text-[16px] leading-[30px]" style={{ color: colors.textSecondary }}>
            {explanation}
          </Text>
        </AnimatedReveal>

        <AnimatedReveal delay={320}>
          <AppButton
            label="Next"
            onPress={() => router.push('/somatic-heart-coherence-breathing')}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

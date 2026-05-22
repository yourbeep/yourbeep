import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, Thermometer, Hand } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { useCompleteSomaticRegion } from '@/features/somatic/hooks/use-complete-somatic-region';
import { freezeCheckTemperatureOptions } from '@/features/somatic/data/somatic-content';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { useAppTheme } from '@/theme/use-app-theme';

export function HandsLegsFreezeCheckScreen() {
  const { colors, isDark } = useAppTheme();
  const { completeCurrentRegion, submissionState } = useCompleteSomaticRegion();
  const [temperature, setTemperature] =
    useState<(typeof freezeCheckTemperatureOptions)[number]>('Neutral');
  const [taps, setTaps] = useState(0);

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
              Freeze Check
            </Text>
            <Text className="font-poppinsRegular text-[17px] leading-[28px]" style={{ color: colors.textSecondary }}>
              Assess for neuro-somatic dorsal-vagal response.
            </Text>
          </View>
        </AnimatedReveal>

        <View className="gap-4">
          <AnimatedReveal delay={170}>
            <View
              className="rounded-[22px] p-5"
              style={{
                backgroundColor: isDark ? colors.surface : '#F2FFF8',
                borderColor: isDark ? colors.primaryBorder : '#D4EFE2',
                borderWidth: 1,
              }}
            >
              <View className="flex-row items-start justify-between gap-4">
                <View className="flex-1 gap-2">
                  <Text className="font-poppinsSemi text-[10px] uppercase tracking-[1px] text-[#18A68E]">
                    Step 02
                  </Text>
                  <Text className="font-poppinsSemi text-[18px]" style={{ color: colors.textPrimary }}>
                    Motor Initiation
                  </Text>
                  <Text className="font-poppinsRegular text-[13px] leading-[22px]" style={{ color: colors.textSecondary }}>
                    Attempt a small finger tap. Notice the lag between the thought to move and the physical action.
                  </Text>
                </View>
                <Hand color="#1A7769" size={18} strokeWidth={2} />
              </View>

              <Pressable
                className="mt-5 rounded-[14px] py-3"
                onPress={() => setTaps((value) => value + 1)}
                style={{
                  backgroundColor: isDark ? colors.surfaceMuted : '#F7F4F4',
                  borderColor: isDark ? colors.primaryBorder : '#D8D6E4',
                  borderWidth: 1,
                }}
              >
                <Text className="text-center font-poppinsMedium text-[12px]" style={{ color: colors.textPrimary }}>
                  Tap Here {taps > 0 ? `(${taps})` : ''}
                </Text>
              </Pressable>
            </View>
          </AnimatedReveal>

          <AnimatedReveal delay={240}>
            <View
              className="rounded-[22px] p-5"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.primaryBorder,
                borderWidth: 1,
              }}
            >
              <View className="flex-row items-start justify-between gap-4">
                <View className="flex-1 gap-2">
                  <Text className="font-poppinsSemi text-[10px] uppercase tracking-[1px] text-[#18A68E]">
                    Step 01
                  </Text>
                  <Text className="font-poppinsSemi text-[18px]" style={{ color: colors.textPrimary }}>
                    Core Temperature
                  </Text>
                  <Text className="font-poppinsRegular text-[13px] leading-[22px]" style={{ color: colors.textSecondary }}>
                    Observe internal warmth. Roughly, your palms for 5-10 sec. Do you feel heat, or a cold hollowness?
                  </Text>
                </View>
                <Thermometer color="#1A7769" size={18} strokeWidth={2} />
              </View>

              <View className="mt-5 flex-row gap-2">
                {freezeCheckTemperatureOptions.map((item) => {
                  const active = item === temperature;
                  return (
                    <Text
                      className="flex-1 rounded-[12px] px-3 py-3 text-center font-poppinsMedium text-[12px]"
                      key={item}
                      onPress={() => setTemperature(item)}
                      style={{
                        backgroundColor: active ? '#F3F2EB' : '#F7F6F1',
                        color: active ? '#183743' : '#5A7078',
                      }}
                    >
                      {item}
                    </Text>
                  );
                })}
              </View>
            </View>
          </AnimatedReveal>
        </View>

        <AnimatedReveal delay={320}>
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

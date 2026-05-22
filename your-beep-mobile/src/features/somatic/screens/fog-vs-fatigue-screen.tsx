import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, Droplets, Sun, Dumbbell, ClipboardList } from 'lucide-react-native';
import { SvgXml } from 'react-native-svg';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { fogVsFatigueSvg } from '@/features/somatic/data/fog-vs-fatigue-svg';
import { fogProtocolSteps } from '@/features/somatic/data/somatic-content';
import { useCompleteSomaticRegion } from '@/features/somatic/hooks/use-complete-somatic-region';
import { SomaticChip } from '@/features/somatic/components/somatic-chip';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { SomaticScreenHero } from '@/features/somatic/components/somatic-screen-hero';
import { useAppTheme } from '@/theme/use-app-theme';

export function FogVsFatigueScreen() {
  const { colors, isDark } = useAppTheme();
  const { completeCurrentRegion, submissionState } = useCompleteSomaticRegion();
  const protocolIcons = [Droplets, Sun, Dumbbell] as const;

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <SomaticScreenHero
            description="Determine if your state is emotional fog or physiological depletion."
            title="Fog vs. Fatigue"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={160}>
          <View
            className="overflow-hidden rounded-[24px]"
            // style={{
            //   backgroundColor: colors.surface,
            //   borderColor: colors.primaryBorder,
            // }}
          >
            <View className="relative h-[258px] w-[358px] self-center rounded-[24px]">
              <SvgXml height="100%" width="100%"  xml={fogVsFatigueSvg} />
              <View className="absolute inset-x-0 bottom-0 flex-row px-5 pb-5">
                  <View
                    className="mr-1 flex-1 rounded-[18px] border px-4 py-5"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.primaryBorder,
                    }}
                  >
                    <Text className="font-poppinsSemi text-[16px]" style={{ color: colors.textPrimary }}>
                      • Fog
                    </Text>
                    <Text
                      className="mt-1 font-poppinsRegular text-[14px] leading-[23px]"
                      style={{ color: colors.textSecondary }}
                    >
                      Emotional overload, mental clutter.
                    </Text>
                  </View>

                  <View
                    className="ml-1 flex-1 rounded-[18px] border px-4 py-5"
                    style={{
                      backgroundColor: isDark ? '#17353A' : '#E7FBFB',
                      borderColor: '#8FE4DD',
                    }}
                  >
                    <Text className="font-poppinsSemi text-[16px] text-[#14897E]">• Fatigue</Text>
                    <Text className="mt-1 font-poppinsRegular text-[14px] leading-[23px] text-brand-textSecondary">
                      Physiological depletion, low energy.
                    </Text>
                  </View>
              </View>
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={230}>
          <View className="gap-4">
            <View className="flex-row items-center gap-3 px-1">
              <ClipboardList color="#0B867E" size={22} strokeWidth={2} />
              <Text className="font-poppinsSemi text-[16px]" style={{ color: colors.textPrimary }}>
                Protocol
              </Text>
            </View>

            {fogProtocolSteps.map((step, index) => {
              const Icon = protocolIcons[index];

              return (
                <View
                  className="rounded-[22px] border px-5 py-6"
                  key={step}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.primaryBorder,
                  }}
                >
                  <View className="flex-row items-start justify-between gap-5">
                    <View className="flex-1 gap-4">
                      <View
                        className="self-start rounded-full px-3 py-1"
                        style={{
                          backgroundColor: isDark ? colors.surfaceStrong : '#F4F3F1',
                        }}
                      >
                        <Text
                          className="font-poppinsSemi text-[12px]"
                          style={{ color: colors.textMuted }}
                        >
                          Step {index + 1}
                        </Text>
                      </View>
                      <Text
                        className="font-poppinsRegular text-[18px] leading-[32px]"
                        style={{ color: colors.textPrimary }}
                      >
                        {step}
                      </Text>
                    </View>

                    <View
                      className="items-center justify-center rounded-[16px] border"
                      style={{
                        backgroundColor: isDark ? colors.surfaceStrong : '#F7F8F4',
                        borderColor: colors.primaryBorder,
                        height: 56,
                        width: 56,
                      }}
                    >
                      <Icon color={colors.textMuted} size={22} strokeWidth={2} />
                    </View>
                  </View>
                </View>
              );
            })}

            <View
              className="rounded-[20px] border px-5 py-5"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.primaryBorder,
              }}
            >
              <View className="flex-row items-center gap-2">
                <SomaticChip label="Analysis" />
              </View>
              <Text
                className="mt-4 font-poppinsRegular text-[16px] leading-[34px]"
                style={{ color: colors.textPrimary }}
              >
                If clarity improves quickly, it was likely circulation or hydration. If the
                feeling persists unchanged, emotional overload is involved.
              </Text>
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={320}>
          <AppButton
            disabled={submissionState === 'submitting'}
            label="Finish"
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

import { useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { ChestAccordionCard } from '@/features/somatic/components/chest-accordion-card';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { chestTightnessChecks } from '@/features/somatic/data/somatic-content';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setChestTightnessIntensity as setIntensity } from '@/features/somatic/store/somatic-slice';
import { useAppTheme } from '@/theme/use-app-theme';

const intensityOptions = ['trace', 'mild', 'moderate', 'severe'] as const;

export function ChestTightnessCheckScreen() {
  const { colors, isDark } = useAppTheme();
  const dispatch = useAppDispatch();
  const selectedIntensity = useAppSelector((state) => state.somatic.chestTightnessIntensity);
  const [expanded, setExpanded] = useState<string>('The Breath Test');

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
              Chest Tightness{'\n'}Vulnerability Check
            </Text>
            <Text className="font-poppinsRegular text-[17px] leading-[30px]" style={{ color: colors.textSecondary }}>
              Focus awareness on the sternum and intercostal pathways. Identify the primary focus of density.
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <View className="overflow-hidden rounded-[26px] border border-[#DCD8CC] bg-[#2B2D2E] p-4">
            <View className="h-[342px] rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[#2F3132]">
              <View className="absolute right-4 top-4 rounded-[12px] bg-[rgba(255,255,255,0.12)] px-4 py-2">
                <Text className="font-poppinsSemi text-[13px]" style={{ color: colors.textInverse }}>
                  Region{'\n'}Anterior Thorax
                </Text>
              </View>
              <View className="absolute inset-x-10 top-1/2 h-[1px] bg-[rgba(255,255,255,0.08)]" />
              <View className="absolute left-1/2 top-10 h-[262px] w-[1px] bg-[rgba(255,255,255,0.08)]" />
              <View className="absolute left-1/2 top-1/2 h-[120px] w-[120px] -translate-x-[60px] -translate-y-[60px] rounded-full bg-[rgba(224,29,29,0.28)]" />
              <View className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-2 -translate-y-2 rounded-full bg-[#D62323]" />
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={230}>
          <Text className="px-1 font-poppinsSemi text-[12px] uppercase tracking-[1.2px]" style={{ color: colors.textMuted }}>
            Select density profile
          </Text>
        </AnimatedReveal>

        <View className="gap-3">
          {chestTightnessChecks.map((item, index) => (
            <AnimatedReveal delay={260 + index * 40} key={item.title}>
              <ChestAccordionCard
                description={item.description}
                expanded={expanded === item.title}
                onPress={() => setExpanded((current) => (current === item.title ? '' : item.title))}
                title={item.title}
              />
            </AnimatedReveal>
          ))}
        </View>

        <AnimatedReveal delay={500}>
          <View className="gap-3 px-1">
            <View className="flex-row items-center justify-between">
              <Text className="font-poppinsSemi text-[12px] uppercase tracking-[1.2px]" style={{ color: colors.textMuted }}>
                Resonance intensity
              </Text>
              <Text className="font-poppinsSemi text-[14px] text-[#D94848]">High Focus</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {intensityOptions.map((option) => {
                const active = selectedIntensity === option;
                return (
                  <Text
                    className="rounded-full border px-5 py-3 font-poppinsMedium text-[14px]"
                    key={option}
                    onPress={() => dispatch(setIntensity(option))}
                    style={
                      active
                        ? { borderColor: '#F3A3A3', backgroundColor: '#FFD8D8', color: '#C33A3A' }
                        : {
                            borderColor: isDark ? colors.primaryBorder : '#D8D7D7',
                            backgroundColor: isDark ? colors.surface : '#EFF0EE',
                            color: colors.textMuted,
                          }
                    }
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                );
              })}
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={560}>
          <AppButton
            label="Next"
            onPress={() => router.push('/somatic-chest-light-shoulder-arm')}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

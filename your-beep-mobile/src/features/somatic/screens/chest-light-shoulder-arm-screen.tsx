import { Image, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { appImages } from '@/constants/images';
import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { SomaticChip } from '@/features/somatic/components/somatic-chip';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { lightShoulderArmSteps } from '@/features/somatic/data/somatic-content';
import { useAppTheme } from '@/theme/use-app-theme';

export function ChestLightShoulderArmScreen() {
  const { colors, isDark } = useAppTheme();

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <View className="gap-3 px-1">
            <SomaticChip label="Phase 1: Tightness Relief" />
            <Text className="font-poppinsSemi text-[32px] leading-[40px]" style={{ color: colors.textPrimary }}>
              Light Shoulder & Arm{'\n'}Movements
            </Text>
            <View className="flex-row gap-2">
              <SomaticChip label="Mobility" />
              <SomaticChip label="2 Mins" />
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <View className="overflow-hidden rounded-[28px] p-1" style={{ backgroundColor: colors.surface }}>
            <Image
              className="h-[260px] w-full rounded-[24px]"
              resizeMode="cover"
              source={appImages.ChestLighterSoldier}
            />
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={240}>
          <View className="gap-7 px-1">
            {lightShoulderArmSteps.map((step, index) => (
              <View className="flex-row gap-4" key={step.title}>
                <View className="items-center">
                  <View className="h-10 w-10 items-center justify-center rounded-full border border-[#83DAD4] bg-[#E8FFF7]">
                    <Text className="font-poppinsSemi text-[14px]" style={{ color: colors.primary }}>{index + 1}</Text>
                  </View>
                  {index !== lightShoulderArmSteps.length - 1 ? (
                    <View className="mt-1 h-12 w-[2px]" style={{ backgroundColor: isDark ? colors.primaryBorder : '#DBEDE7' }} />
                  ) : null}
                </View>
                <View className="flex-1">
                  <Text className="font-poppinsSemi text-[18px]" style={{ color: colors.textPrimary }}>{step.title}</Text>
                  <Text className="mt-1 font-poppinsRegular text-[15px] leading-[28px]" style={{ color: colors.textSecondary }}>
                    {step.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={310}>
          <AppButton
            label="Next"
            onPress={() => router.push('/somatic-chest-head-back')}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

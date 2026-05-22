import { Image, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, TimerReset, Lightbulb } from 'lucide-react-native';

import { appImages } from '@/constants/images';
import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { SomaticChip } from '@/features/somatic/components/somatic-chip';
import { fistClenchMechanism } from '@/features/somatic/data/somatic-content';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { useAppTheme } from '@/theme/use-app-theme';

export function HandsLegsFistClenchScreen() {
  const { colors, isDark } = useAppTheme();

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <View className="gap-2 px-1">
            <SomaticChip label="Remediation Exercise" />
            <Text className="font-poppinsSemi text-[32px] leading-[38px]" style={{ color: colors.textPrimary }}>
              Fist Clench & Release
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <View
            className="overflow-hidden rounded-[22px] shadow-brand"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.primaryBorder,
              borderWidth: 1,
            }}
          >
            <Image
              className="h-[220px] w-full"
              resizeMode="cover"
              source={appImages.FistClench}
            />

            <View className="gap-4 p-5">
              <View className="flex-row items-center gap-2">
                <TimerReset color="#B67C17" size={14} strokeWidth={2} />
                <Text className="font-poppinsSemi text-[12px] text-[#9D731A]">5 Seconds</Text>
              </View>

              <View className="gap-1">
                <Text className="font-poppinsRegular text-[14px] leading-[24px]" style={{ color: colors.textSecondary }}>
                  <Text className="font-poppinsSemi" style={{ color: colors.textPrimary }}>Inhale:</Text> Clench both fists for 5 seconds.
                </Text>
                <Text className="font-poppinsRegular text-[14px] leading-[24px]" style={{ color: colors.textSecondary }}>
                  <Text className="font-poppinsSemi" style={{ color: colors.textPrimary }}>Exhale:</Text> Exhale forcefully and release the fists
                </Text>
              </View>
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={250}>
          <View
            className="rounded-[18px] p-4"
            style={{ backgroundColor: isDark ? colors.surface : '#EAF3E8' }}
          >
            <View className="flex-row items-center gap-2">
              <Lightbulb color="#4AD4C7" size={16} strokeWidth={2} />
              <Text className="font-poppinsSemi text-[14px]" style={{ color: colors.textPrimary }}>Neural Mechanism</Text>
            </View>
            <Text className="mt-3 font-poppinsRegular text-[13px] leading-[22px]" style={{ color: colors.textSecondary }}>
              {fistClenchMechanism}
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={320}>
          <AppButton
            label="Next"
            onPress={() => router.push('/somatic-hands-legs-shoulder-drop')}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

import { Image, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { appImages } from '@/constants/images';
import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { useCompleteSomaticRegion } from '@/features/somatic/hooks/use-complete-somatic-region';
import { SomaticChip } from '@/features/somatic/components/somatic-chip';
import { shoulderDropInstructions } from '@/features/somatic/data/somatic-content';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { useAppSelector } from '@/store/hooks';
import { useAppTheme } from '@/theme/use-app-theme';

export function HandsLegsShoulderDropScreen() {
  const selectedState = useAppSelector((state) => state.somatic.selectedHandsLegsState);
  const { colors } = useAppTheme();
  const { completeCurrentRegion, submissionState } = useCompleteSomaticRegion();
  const nextRoute =
    selectedState === 'braced' || selectedState === 'contracted'
      ? '/somatic-hands-legs-proprioception-grounding'
      : '/somatic-states';

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
              Shoulder Drop
            </Text>
            <Text className="font-poppinsRegular text-[14px]" style={{ color: colors.textSecondary }}>
              Perform 10-15 Reps
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={160}>
          <View className="items-center">
            <Image
              className="h-[260px] w-[260px] rounded-full"
              resizeMode="cover"
              source={appImages.ShoulderDrop}
            />
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={240}>
          <View
            className="rounded-[16px] p-4"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.primaryBorder,
              borderWidth: 1,
            }}
          >
            {shoulderDropInstructions.map((item, index) => (
              <View className={`flex-row gap-2 ${index === 0 ? 'mb-4' : ''}`} key={item.cue}>
                <Text className="font-poppinsSemi text-[14px]" style={{ color: colors.textPrimary }}>{item.cue}</Text>
                <Text className="flex-1 font-poppinsRegular text-[14px] leading-[24px]" style={{ color: colors.textSecondary }}>
                  {item.detail}
                </Text>
              </View>
            ))}
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={320}>
          <AppButton
            disabled={submissionState === 'submitting'}
            label="Next"
            onPress={() => {
              if (nextRoute === '/somatic-states') {
                void completeCurrentRegion();
                return;
              }

              router.push(nextRoute);
            }}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

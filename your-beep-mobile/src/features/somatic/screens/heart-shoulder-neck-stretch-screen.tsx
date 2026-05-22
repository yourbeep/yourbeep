import { Image, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { useCompleteSomaticRegion } from '@/features/somatic/hooks/use-complete-somatic-region';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { shoulderNeckStretchSteps } from '@/features/somatic/data/somatic-content';
import { appImages } from '@/constants/images';

export function HeartShoulderNeckStretchScreen() {
  const { completeCurrentRegion, submissionState } = useCompleteSomaticRegion();

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <View className="overflow-hidden rounded-[28px] border border-[#E5E2D8] bg-brand-surface p-6">
            <View className="absolute left-6 top-6 rounded-full bg-brand-surface px-4 py-2">
              <Text className="font-poppinsSemi text-[16px] text-brand-text">Est. 3 Min</Text>
            </View>

            <View className="mt-6 h-[394px] rounded-[24px] bg-[#D7D7D7]">
              <View className="flex-1 items-center justify-center">
                <Image className="h-full w-full" resizeMode="cover" source={appImages.Female} />
              </View>
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <View className="gap-3 px-1">
            <Text className="font-poppinsSemi text-[32px] leading-[40px] text-brand-text">
              Shoulder & Neck Stretch
            </Text>
            <Text className="font-poppinsRegular text-[17px] leading-[30px] text-brand-textSecondary">
              Release somatic bracing associated with heart unrest to restore equilibrium.
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={240}>
          <View className="gap-7 px-1">
            {shoulderNeckStretchSteps.map((item, index) => (
              <View className="flex-row gap-5" key={item.step}>
                <View className="items-center">
                  <View className="h-[68px] w-[68px] items-center justify-center rounded-full border border-[#D7DCE6] bg-brand-surface">
                    <Text className="font-poppinsSemi text-[18px] text-brand-text">
                      0{index + 1}
                    </Text>
                  </View>
                  {index !== shoulderNeckStretchSteps.length - 1 ? (
                    <View className="mt-1 h-16 w-[2px] bg-[#DDEFE8]" />
                  ) : null}
                </View>

                <View className="flex-1 pt-2">
                  <Text className="font-poppinsSemi text-[18px] leading-[28px] text-brand-text">
                    {item.step}
                  </Text>
                  <Text className="mt-1 font-poppinsRegular text-[16px] leading-[30px] text-brand-textSecondary">
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
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

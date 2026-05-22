import { Image, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ScreenShell } from '@/components/layout/screen-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { appImages } from '@/constants/images';

export function OnboardingWelcomeScreen() {
  const router = useRouter();

  return (
    <>
      <StatusBar style="dark" />
      <ScreenShell contentClassName="pb-10">
        <AnimatedReveal delay={80} distance={20}>
          <View className="-mx-[22px]">
            <Image
              className="h-[430px] w-full rounded-none"
              resizeMode="cover"
              source={appImages.onboardingJourney}
            />
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={220}>
          <View className="mt-1 items-center gap-5 px-3">
            <Text className="font-poppinsSemi max-w-[320px] text-center text-[30px] leading-[44px] text-brand-primary">
              Welcome to your sanctuary.
            </Text>
            <Text className="font-poppinsRegular max-w-[340px] text-center text-[16px] leading-[38px] text-brand-textSecondary">
              A space to breathe, reflect, and grow at your own pace.
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={360} distance={18}>
          <AppButton
            className="mt-6 min-h-[62px]"
            label="Get Started"
            onPress={() => router.push('/login')}
          />
        </AnimatedReveal>
      </ScreenShell>
    </>
  );
}

import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ScreenShell } from '@/components/layout/screen-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { FloatingImage } from '@/components/ui/floating-image';
import { appImages } from '@/constants/images';

export function OnboardingLogoScreen() {
  const router = useRouter();

  return (
    <Pressable className="flex-1" onPress={() => router.push('/onboarding-welcome')}>
      <StatusBar style="dark" />
      <ScreenShell
        contentClassName="flex-1 items-center justify-center pb-10"
        scrollEnabled={false}
      >
        <AnimatedReveal delay={120} distance={22}>
          <FloatingImage source={appImages.onboardingLogo} style={{ height: 360, width: 260 }} />
        </AnimatedReveal>

        <AnimatedReveal delay={520} distance={16}>
          <View className="mt-5 gap-4">
            <Text className="text-center text-[12px] font-bold uppercase tracking-[1.3px] text-brand-primary">
              UNDERSTANDING • BALANCE • EMPATHY
            </Text>
            <Text className="text-center text-[13px] text-brand-textSecondary">
              Tap anywhere to continue
            </Text>
          </View>
        </AnimatedReveal>
      </ScreenShell>
    </Pressable>
  );
}

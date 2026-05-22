import { useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, RotateCw } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { RadioDirectionRow } from '@/features/somatic/components/radio-direction-row';
import { SomaticAwarenessTestHero } from '@/features/somatic/components/somatic-awareness-test-hero';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';

export function NeckReleaseAwarenessScreen() {
  const [selectedDirection, setSelectedDirection] = useState<'left-right' | 'down-up' | null>(
    'left-right',
  );

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <SomaticAwarenessTestHero subtitle="Neck Release Awareness" title="Awareness Test #3" />
        </AnimatedReveal>

        <AnimatedReveal delay={160}>
          <View className="rounded-[18px] border border-[#E7E1CC] bg-[rgba(255,255,255,0.38)] p-4">
            <View className="items-center justify-center rounded-full bg-[rgba(255,255,255,0.78)] p-6">
              <View className="relative h-[270px] w-[270px] items-center justify-center rounded-full bg-[rgba(248,248,243,0.9)]">
                <View className="absolute h-[1px] w-[140px] bg-[#C8CDD0]" />
                <View className="absolute h-[140px] w-[1px] bg-[#C8CDD0]" />
                <View className="absolute left-[72px] top-[62px] h-3 w-3 rounded-full bg-[#118E83]" />
                <View className="absolute right-[66px] top-[130px] h-3 w-3 rounded-full bg-[#118E83]" />
                <View className="h-[2px] w-10 bg-[#7CCFD1]" />
              </View>
            </View>

            <View className="mt-5 items-center">
              <View className="flex-row items-center gap-2 rounded-full bg-[#F4F5F1] px-4 py-2">
                <RotateCw color="#0B857B" size={14} strokeWidth={2.2} />
                <Text className="font-poppinsSemi text-[13px] text-brand-text">
                  Gently rotate your head
                </Text>
              </View>
            </View>

            <Text className="mt-6 text-center font-poppinsRegular text-[13px] text-brand-textSecondary">
              Turn your neck
            </Text>

            <View className="mt-4 gap-3">
              <RadioDirectionRow
                label="left & right"
                onPress={() => setSelectedDirection('left-right')}
                selected={selectedDirection === 'left-right'}
              />
              <RadioDirectionRow
                label="Down & Up"
                onPress={() => setSelectedDirection('down-up')}
                selected={selectedDirection === 'down-up'}
              />
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={260}>
          <AppButton
            disabled={!selectedDirection}
            label="Next"
            onPress={() => router.push('/somatic-face-throat-shoulder-drop')}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

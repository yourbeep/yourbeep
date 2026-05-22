import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { appImages } from '@/constants/images';
import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { SelectionAnswerCard } from '@/features/somatic/components/selection-answer-card';
import { SomaticAwarenessTestHero } from '@/features/somatic/components/somatic-awareness-test-hero';
import { SomaticChip } from '@/features/somatic/components/somatic-chip';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { useAppTheme } from '@/theme/use-app-theme';

const options = [
  { description: 'Fluidity in movement', id: 'supple', title: 'Supple' },
  { description: 'Minor underlying tension', id: 'subtle-bracing', title: 'Subtle Bracing' },
  { description: 'Persistent clenching', id: 'rigid-lock', title: 'Rigid Lock' },
] as const;

export function FaceThroatClenchDetectionScreen() {
  const { colors, isDark } = useAppTheme();
  const [selectedId, setSelectedId] = useState<(typeof options)[number]['id'] | null>('subtle-bracing');

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <SomaticAwarenessTestHero subtitle="Clench Detection Drill" title="Awareness Test #1" />
        </AnimatedReveal>

        <AnimatedReveal delay={160}>
          <View className="overflow-hidden rounded-[22px] p-6">
            <Image
              className="h-[322px] w-[350px] rounded-[20px]"
              resizeMode="cover"
              source={appImages.HumanFace}
            />
            {/* <View className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-[#A9E7E0] bg-brand-surface px-4 py-2">
              <Text className="font-poppinsSemi text-[12px] uppercase tracking-[0.8px] text-[#0A8D80]">
                Live Biofeedback
              </Text>
            </View> */}
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={230}>
          <View className="flex-row items-center justify-between px-1">
            <SomaticChip label="Face & throat pathway" />
            <Text className="font-poppinsSemi text-[14px]" style={{ color: colors.textMuted }}>01/04</Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={260}>
          <View className="rounded-[16px] border-l-[3px] bg-transparent pl-4" style={{ borderLeftColor: '#11907F' }}>
            <Text className="font-poppinsRegular text-[15px] leading-[32px]" style={{ color: colors.textPrimary }}>
              Gently scan your masseter and temporal muscles. Note any resistance.
            </Text>
          </View>
        </AnimatedReveal>

        <View className="gap-4">
          {options.map((option, index) => (
            <AnimatedReveal delay={320 + index * 60} key={option.id}>
              <SelectionAnswerCard
                description={option.description}
                onPress={() => setSelectedId(option.id)}
                selected={selectedId === option.id}
                title={option.title}
              />
            </AnimatedReveal>
          ))}
        </View>

        <AnimatedReveal delay={500}>
          <AppButton
            disabled={!selectedId}
            label="Next"
            onPress={() => router.push('/somatic-face-throat-jaw-awareness')}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

import { View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { HeartStateCard } from '@/features/somatic/components/heart-state-card';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { SomaticScreenHero } from '@/features/somatic/components/somatic-screen-hero';
import { heartStates } from '@/features/somatic/data/somatic-content';
import { selectHeartState } from '@/features/somatic/store/somatic-slice';
import { useAppDispatch } from '@/store/hooks';

export function HeartResonanceScreen() {
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();
  const horizontalInset = width < 390 ? 20 : 16;
  const gutter = 12;
  const cardWidth = (width - horizontalInset * 2 - gutter) / 2;

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.replace('/somatic-states')} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <SomaticScreenHero
            description="Select the state that reflects your heart region."
            title="Heart Resonance"
          />
        </AnimatedReveal>

        <View className="flex-row flex-wrap justify-center gap-3 px-2">
          {heartStates.map((option, index) => {
            const isLastOddCard =
              heartStates.length % 2 === 1 && index === heartStates.length - 1;

            return (
            <AnimatedReveal
              delay={170 + index * 60}
              key={option.id}
              style={{ width: isLastOddCard ? width - horizontalInset * 2 : cardWidth }}
            >
              <HeartStateCard
                onPress={() => {
                  dispatch(selectHeartState(option.id));
                  router.push(option.route);
                }}
                option={option}
              />
            </AnimatedReveal>
            );
          })}
        </View>
      </MainAppShell>
    </>
  );
}

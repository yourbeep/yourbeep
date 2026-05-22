import { View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { SomaticScreenHero } from '@/features/somatic/components/somatic-screen-hero';
import { StomachStateCard } from '@/features/somatic/components/stomach-state-card';
import {
  stomachStates,
  stomachStateVisuals,
} from '@/features/somatic/data/somatic-content';
import { selectStomachState } from '@/features/somatic/store/somatic-slice';
import { useAppDispatch } from '@/store/hooks';

export function StomachSelectionScreen() {
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();
  const horizontalInset = width < 390 ? 20 : 16;
  const gutter = 12;
  const cardWidth = (width - horizontalInset * 2 - gutter) / 2;
  const fullWidth = width - horizontalInset * 2;

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.replace('/somatic-states')} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <SomaticScreenHero
            description="Select the sensation that best describes your gut state right now. This helps calibrate your biological baseline."
            title="Stomach Region"
          />
        </AnimatedReveal>

        <View className="flex-row flex-wrap justify-center gap-3 px-2">
          {stomachStates.map((option, index) => {
            const isLastOddCard =
              stomachStates.length % 2 === 1 && index === stomachStates.length - 1;
            const isWide = option.id === 'armour' || isLastOddCard;

            return (
            <AnimatedReveal
              delay={170 + index * 60}
              key={option.id}
              style={{ width: isWide ? fullWidth : cardWidth }}
            >
              <StomachStateCard
                onPress={() => {
                  dispatch(selectStomachState(option.id));
                  router.push(option.route);
                }}
                source={stomachStateVisuals[option.id]}
                title={option.title}
                wide={isWide}
              />
            </AnimatedReveal>
            );
          })}
        </View>
      </MainAppShell>
    </>
  );
}

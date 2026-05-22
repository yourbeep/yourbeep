import { View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { HeadSensationCard } from '@/features/somatic/components/head-sensation-card';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { SomaticScreenHero } from '@/features/somatic/components/somatic-screen-hero';
import {
  faceThroatSensations,
  faceThroatSensationVisuals,
} from '@/features/somatic/data/somatic-content';
import { useAppDispatch } from '@/store/hooks';
import { selectFaceThroatSensation } from '@/features/somatic/store/somatic-slice';

export function FaceThroatSensationScreen() {
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();
  const horizontalInset = width < 390 ? 20 : 16;
  const gutter = 12;
  const halfWidth = (width - horizontalInset * 2 - gutter) / 2;
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
            chipLabel="Face & Throat"
            description="Tap the visualization that most closely matches your internal state."
            title="Select Sensation"
          />
        </AnimatedReveal>

        <View className="flex-row flex-wrap justify-center gap-3 px-2">
          {faceThroatSensations.map((option, index) => {
            const isLastOddCard =
              faceThroatSensations.length % 2 === 1 && index === faceThroatSensations.length - 1;
            const isWide = option.id === 'excessive-clench' || isLastOddCard;

            return (
            <AnimatedReveal
              delay={170 + index * 70}
              key={option.id}
              style={{ width: isWide ? fullWidth : halfWidth }}
            >
              <HeadSensationCard
                hideDescription
                onPress={() => {
                  dispatch(selectFaceThroatSensation(option.id));
                  router.push(option.route);
                }}
                option={option}
                source={faceThroatSensationVisuals[option.id]}
                variant="selection"
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

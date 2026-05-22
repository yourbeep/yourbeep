import { View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { HeadSensationCard } from '@/features/somatic/components/head-sensation-card';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { SomaticScreenHero } from '@/features/somatic/components/somatic-screen-hero';
import {
  headRegionLabel,
  headSensations,
  headSensationVisuals,
} from '@/features/somatic/data/somatic-content';
import { useAppDispatch } from '@/store/hooks';
import {
  clearSomaticSubmissionState,
  resetCurrentSomaticRegion,
  selectHeadSensation,
} from '@/features/somatic/store/somatic-slice';

export function HeadSensationScreen() {
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
          <SomaticRouteHeader
            onBackPress={() => {
              dispatch(clearSomaticSubmissionState());
              dispatch(resetCurrentSomaticRegion());
              router.replace('/somatic-states');
            }}
          />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <SomaticScreenHero
            chipLabel={headRegionLabel}
            description="Tap the visualization that most closely matches your internal state."
            descriptionClassName="text-[17px] leading-[30px]"
            title="Select Sensation"
            titleClassName="text-[32px] leading-[40px]"
          />
        </AnimatedReveal>

        <View className="flex-row flex-wrap justify-center gap-3 px-2">
          {headSensations.map((option, index) => {
            const isLastOddCard =
              headSensations.length % 2 === 1 && index === headSensations.length - 1;
            const isWide = option.id === 'dizzy-spacey' || isLastOddCard;

            return (
            <AnimatedReveal
              delay={170 + index * 70}
              key={option.id}
              style={{ width: isWide ? fullWidth : cardWidth }}
            >
              <HeadSensationCard
                hideDescription
                onPress={() => {
                  dispatch(selectHeadSensation(option.id));
                  router.push(option.route);
                }}
                option={option}
                source={headSensationVisuals[option.id]}
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

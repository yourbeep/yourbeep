import { View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { HeadSensationCard } from '@/features/somatic/components/head-sensation-card';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { SomaticScreenHero } from '@/features/somatic/components/somatic-screen-hero';
import {
  chestRegionLabel,
  chestStates,
  faceThroatSensationVisuals,
  headSensationVisuals,
} from '@/features/somatic/data/somatic-content';
import { selectChestState } from '@/features/somatic/store/somatic-slice';
import { useAppDispatch } from '@/store/hooks';

const chestVisuals = {
  calm: faceThroatSensationVisuals['relaxed-bright'],
  spiral: headSensationVisuals['heaviness-fog'],
  tightness: faceThroatSensationVisuals['subtle-tension'],
  unrest: faceThroatSensationVisuals['excessive-clench'],
} as const;

export function ChestSelectionScreen() {
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
            chipLabel={chestRegionLabel}
            description="Select the card that closest resembles the current density and movement of energy in your chest cavity."
            title="Chest Region"
          />
        </AnimatedReveal>

        <View className="flex-row flex-wrap justify-center gap-3 px-2">
          {chestStates.map((option, index) => (
            <AnimatedReveal delay={170 + index * 60} key={option.id} style={{ width: cardWidth }}>
              <HeadSensationCard
                hideDescription
                onPress={() => {
                  dispatch(selectChestState(option.id));
                  router.push(option.route);
                }}
                option={option}
                source={chestVisuals[option.id]}
                variant="selection"
              />
            </AnimatedReveal>
          ))}
        </View>
      </MainAppShell>
    </>
  );
}

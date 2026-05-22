import { View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { HandsLegsStateCard } from '@/features/somatic/components/hands-legs-state-card';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { SomaticScreenHero } from '@/features/somatic/components/somatic-screen-hero';
import { handsLegsRegionLabel, handsLegsStates } from '@/features/somatic/data/somatic-content';
import {
  selectHandsLegsState,
  type HandsLegsStateId,
} from '@/features/somatic/store/somatic-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

function nextRouteForState(stateId: HandsLegsStateId) {
  if (stateId === 'sluggish') return '/somatic-hands-legs-freeze-check' as const;
  if (stateId === 'calm' || stateId === 'springy') {
    return '/somatic-hands-legs-rhythmic-grounding' as const;
  }
  return '/somatic-hands-legs-fist-clench' as const;
}

export function HandsLegsSelectionScreen() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.somatic.selectedHandsLegsState);
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
            description="Select the state that best describes your physical limb state right now."
            title={handsLegsRegionLabel}
          />
        </AnimatedReveal>

        <View className="flex-row flex-wrap justify-center gap-3 px-2">
          {handsLegsStates.map((option, index) => (
            <AnimatedReveal
              delay={170 + index * 40}
              key={option.id}
              style={{
                width:
                  handsLegsStates.length % 2 === 1 && index === handsLegsStates.length - 1
                    ? width - horizontalInset * 2
                    : cardWidth,
              }}
            >
              <HandsLegsStateCard
                onPress={() => dispatch(selectHandsLegsState(option.id))}
                selected={selected === option.id}
                stateId={option.id}
                title={option.title}
              />
            </AnimatedReveal>
          ))}
        </View>

        <AnimatedReveal delay={430}>
          <AppButton
            disabled={!selected}
            label="Next"
            onPress={() => {
              if (!selected) return;
              router.push(nextRouteForState(selected));
            }}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

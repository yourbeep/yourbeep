import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { CountdownOrb } from '@/features/somatic/components/countdown-orb';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { SomaticAwarenessTestHero } from '@/features/somatic/components/somatic-awareness-test-hero';
import { headSensations } from '@/features/somatic/data/somatic-content';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCo2IndicatorSeconds } from '@/features/somatic/store/somatic-slice';

export function Co2IndicatorScreen() {
  const dispatch = useAppDispatch();
  const remainingSeconds = useAppSelector((state) => state.somatic.co2IndicatorSeconds);
  const selectedHeadSensation = useAppSelector((state) => state.somatic.selectedHeadSensation);
  const [running, setRunning] = useState(false);

  const chipLabel = useMemo(
    () =>
      headSensations.find((item) => item.id === selectedHeadSensation)?.title ?? 'Head Region',
    [selectedHeadSensation],
  );

  useEffect(() => {
    if (!running || remainingSeconds <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      dispatch(setCo2IndicatorSeconds(Math.max(0, remainingSeconds - 1)));
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch, remainingSeconds, running]);

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <SomaticAwarenessTestHero
            chipLabel={chipLabel}
            description="Track when the first clear urge to breathe appears so you can measure the intensity of the dizzy or spacey state."
            subtitle="The CO2 Indicator"
            title="Awareness Test #2"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <CountdownOrb active={running && remainingSeconds > 0} seconds={remainingSeconds} />
        </AnimatedReveal>

        <AnimatedReveal delay={260}>
          <AppButton
            label={running ? 'Stop Test' : remainingSeconds === 0 ? 'Continue' : 'Start Test'}
            onPress={() => {
              if (remainingSeconds === 0) {
                dispatch(setCo2IndicatorSeconds(60));
                router.push('/somatic-head-co2-rebalancing');
                return;
              }

              setRunning((current) => !current);
            }}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>

        <AnimatedReveal delay={330}>
          <AppButton
            label="Skip Activity"
            onPress={() => router.push('/somatic-head-co2-rebalancing')}
            variant="secondary"
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

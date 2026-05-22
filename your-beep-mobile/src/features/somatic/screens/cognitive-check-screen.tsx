import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';
import { ImageBackground } from 'react-native';
import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { CountdownOrb } from '@/features/somatic/components/countdown-orb';
import { useCompleteSomaticRegion } from '@/features/somatic/hooks/use-complete-somatic-region';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { SomaticScreenHero } from '@/features/somatic/components/somatic-screen-hero';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCognitiveCheckSeconds } from '@/features/somatic/store/somatic-slice';
import { appImages } from '@/constants/images';

export function CognitiveCheckScreen() {
  const dispatch = useAppDispatch();
  const { completeCurrentRegion, submissionState } = useCompleteSomaticRegion();
  const remainingSeconds = useAppSelector((state) => state.somatic.cognitiveCheckSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || remainingSeconds <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      dispatch(setCognitiveCheckSeconds(Math.max(0, remainingSeconds - 1)));
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
          <SomaticScreenHero
            chipLabel="Awareness Test #1"
            description="Track your attention for sixty seconds and notice whether focus stays stable without drifting."
            title="The 60-Second Cognitive Check"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <ImageBackground className='rounded-full' source={appImages.Neural} > 
            <CountdownOrb active={running && remainingSeconds > 0} seconds={remainingSeconds} />
          </ImageBackground>
          
        </AnimatedReveal>

        <AnimatedReveal delay={260}>
          <AppButton
            label={running ? 'Stop Test' : remainingSeconds === 0 ? 'Next' : 'Start Test'}
            onPress={() => {
              if (remainingSeconds === 0) {
                dispatch(setCognitiveCheckSeconds(60));
                router.push('/somatic-head-expand-window');
                return;
              }

              setRunning((current) => !current);
            }}
            disabled={submissionState === 'submitting'}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

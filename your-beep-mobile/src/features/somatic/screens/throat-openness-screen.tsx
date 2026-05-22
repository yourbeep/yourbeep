import { useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import {
  BreathingTubeSequence,
  type BreathingTubePhase,
} from '@/features/somatic/components/breathing-tube-sequence';
import { SessionPlayerControls } from '@/features/somatic/components/session-player-controls';
import { SomaticAwarenessTestHero } from '@/features/somatic/components/somatic-awareness-test-hero';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { useAppTheme } from '@/theme/use-app-theme';

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function ThroatOpennessScreen() {
  const { colors } = useAppTheme();
  const [secondsRemaining, setSecondsRemaining] = useState(180);
  const [paused, setPaused] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseSeconds, setPhaseSeconds] = useState(3);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [manualPhase, setManualPhase] = useState<number | null>(null);
  const [manualStartTime, setManualStartTime] = useState<number | null>(null);
  const phaseStartedAtRef = useRef(Date.now());
  const pausedElapsedMsRef = useRef(0);
  const manualResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phases: readonly BreathingTubePhase[] = [
    { darkColor: '#214E5C', duration: 3, id: 'inhale-top', label: 'Inhale', lightColor: '#52C2E7' },
    { darkColor: '#5AB9D7', duration: 3, id: 'exhale-hum', label: 'Exhale & Hum', lightColor: '#80D5EB' },
    { darkColor: '#9FD4D6', duration: 3, id: 'inhale-bottom', label: 'Inhale', lightColor: '#C6EFEC' },
  ] as const;

  useEffect(() => {
    if (paused || secondsRemaining <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const currentPhase = phases[phaseIndex];
      const elapsedMs = now - phaseStartedAtRef.current;
      const currentProgress = Math.min(1, elapsedMs / (currentPhase.duration * 1000));

      setPhaseProgress(currentProgress);
      setPhaseSeconds(Math.max(0, Math.ceil(currentPhase.duration - elapsedMs / 1000)));

      if (currentProgress >= 1) {
        setPhaseIndex((current) => {
          const next = (current + 1) % phases.length;
          phaseStartedAtRef.current = now;
          pausedElapsedMsRef.current = 0;
          setPhaseProgress(0);
          setPhaseSeconds(phases[next].duration);
          return next;
        });
      }
    }, 50);

    return () => clearInterval(timer);
  }, [paused, phaseIndex, secondsRemaining]);

  useEffect(() => {
    phaseStartedAtRef.current = Date.now();
    pausedElapsedMsRef.current = 0;
    setPhaseProgress(0);
    setPhaseSeconds(phases[phaseIndex].duration);
  }, [phaseIndex]);

  useEffect(() => {
    if (!paused) {
      phaseStartedAtRef.current = Date.now() - pausedElapsedMsRef.current;
      return;
    }

    pausedElapsedMsRef.current = Math.min(
      phases[phaseIndex].duration * 1000,
      Date.now() - phaseStartedAtRef.current,
    );
  }, [paused, phaseIndex]);

  useEffect(() => {
    return () => {
      if (manualResetTimerRef.current) {
        clearTimeout(manualResetTimerRef.current);
      }
    };
  }, []);

  const phaseLabel = useMemo(() => phases[phaseIndex].label, [phaseIndex]);

  const handleTubePress = (pressedPhase: number) => {
    if (manualResetTimerRef.current) {
      clearTimeout(manualResetTimerRef.current);
    }

    setManualPhase(pressedPhase);
    setManualStartTime(Date.now());

    manualResetTimerRef.current = setTimeout(() => {
      setManualPhase(null);
      setManualStartTime(null);
    }, phases[pressedPhase].duration * 1000);
  };

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <SomaticAwarenessTestHero subtitle="Throat openness test" title="Awareness Test #2" />
        </AnimatedReveal>

        <AnimatedReveal delay={160}>
          <View className="gap-8 px-2">
            <View className="items-center justify-center py-3">
              <BreathingTubeSequence
                activePhaseIdx={phaseIndex}
                manualPhase={manualPhase}
                manualStartTime={manualStartTime}
                onTubePress={handleTubePress}
                phases={phases}
                progress={phaseProgress}
              />
            </View>

            <View className="items-center">
              <Text className="font-poppinsMedium text-[14px]" style={{ color: colors.textSecondary }}>
                {phaseLabel} • {phaseSeconds}s
              </Text>
            </View>

            <SessionPlayerControls
              durationLabel={formatTime(secondsRemaining)}
              onPauseToggle={() => setPaused((current) => !current)}
              paused={paused}
              progress={1 - secondsRemaining / 180}
            />
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={260}>
          <AppButton
            label="Next"
            onPress={() => router.push('/somatic-face-throat-belly-breathing')}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>

        <AnimatedReveal delay={320}>
          <AppButton
            label="Skip Activity"
            onPress={() => router.push('/somatic-face-throat-belly-breathing')}
            variant="secondary"
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

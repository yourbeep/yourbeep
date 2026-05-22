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
import { ProtocolPanel } from '@/features/somatic/components/protocol-panel';
import { SomaticBackendActivityPanel } from '@/features/somatic/components/somatic-backend-activity-panel';
import { SomaticChip } from '@/features/somatic/components/somatic-chip';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { co2RebalancingProtocol } from '@/features/somatic/data/somatic-content';
import { useAppTheme } from '@/theme/use-app-theme';

const phases: readonly BreathingTubePhase[] = [
  { darkColor: '#214E5C', duration: 5, id: 'breathe-out', label: 'Breathe Out', lightColor: '#53C6F1' },
  { darkColor: '#5AB9D7', duration: 10, id: 'hold', label: 'Hold', lightColor: '#7ED7EF' },
  { darkColor: '#9FD4D6', duration: 5, id: 'breathe-in', label: 'Breathe In', lightColor: '#C2E9E6' },
] as const;

export function Co2RebalancingScreen() {
  const { colors } = useAppTheme();
  const [active, setActive] = useState(true);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseSeconds, setPhaseSeconds] = useState<number>(phases[0].duration);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [manualPhase, setManualPhase] = useState<number | null>(null);
  const [manualStartTime, setManualStartTime] = useState<number | null>(null);
  const phaseStartedAtRef = useRef(Date.now());
  const pausedElapsedMsRef = useRef(0);
  const manualResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const currentPhase = phases[phaseIndex];
      const elapsedMs = now - phaseStartedAtRef.current;
      const currentProgress = Math.min(1, elapsedMs / (currentPhase.duration * 1000));

      setPhaseProgress(currentProgress);
      setPhaseSeconds(Math.max(0, Math.ceil(currentPhase.duration - elapsedMs / 1000)));

      if (currentProgress >= 1) {
        setPhaseIndex((previous) => {
          const next = (previous + 1) % phases.length;
          phaseStartedAtRef.current = now;
          pausedElapsedMsRef.current = 0;
          setPhaseProgress(0);
          setPhaseSeconds(phases[next].duration);
          return next;
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [active, phaseIndex]);

  useEffect(() => {
    phaseStartedAtRef.current = Date.now();
    pausedElapsedMsRef.current = 0;
    setPhaseProgress(0);
    setPhaseSeconds(phases[phaseIndex].duration);
  }, [phaseIndex]);

  useEffect(() => {
    if (active) {
      phaseStartedAtRef.current = Date.now() - pausedElapsedMsRef.current;
      return;
    }

    pausedElapsedMsRef.current = Math.min(
      phases[phaseIndex].duration * 1000,
      Date.now() - phaseStartedAtRef.current,
    );
  }, [active, phaseIndex]);

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
          <View className="gap-3 px-1">
            <SomaticChip label="Exercise #1" />
            <Text className="font-poppinsSemi text-[32px] leading-[40px]" style={{ color: colors.textPrimary }}>
              CO2 Rebalancing
            </Text>
            <Text className="font-poppinsRegular text-[17px] leading-[30px]" style={{ color: colors.textSecondary }}>
              Use guided breath pacing to rebalance the system after the CO2 indicator awareness test.
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <View className="gap-6">
            <View className="items-center justify-center py-4">
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

            <AppButton label="Pause/Play" onPress={() => setActive((current) => !current)} />

            <SomaticBackendActivityPanel activityKey="co2_rebalancing" />

            <ProtocolPanel steps={co2RebalancingProtocol} title="Guided Protocol" />
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={260}>
          <AppButton
            label="Next"
            onPress={() => router.push('/somatic-head-sensory-anchoring')}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

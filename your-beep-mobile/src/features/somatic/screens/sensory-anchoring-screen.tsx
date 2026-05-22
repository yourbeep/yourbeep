import { useCallback } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import {
  AnchoringTaskCard,
  AudioFocusGraphic,
  GroundContactGraphic,
} from '@/features/somatic/components/anchoring-task-card';
import { useCompleteSomaticRegion } from '@/features/somatic/hooks/use-complete-somatic-region';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { SomaticScreenHero } from '@/features/somatic/components/somatic-screen-hero';
import { VisualStillnessPad } from '@/features/somatic/components/visual-stillness-pad';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setVisualStillnessPosition,
  toggleCompletedAnchor,
} from '@/features/somatic/store/somatic-slice';
import { useAppTheme } from '@/theme/use-app-theme';

export function SensoryAnchoringScreen() {
  const { colors, isDark } = useAppTheme();
  const dispatch = useAppDispatch();
  const { completeCurrentRegion, submissionState } = useCompleteSomaticRegion();
  const completedAnchors = useAppSelector((state) => state.somatic.completedAnchors);
  const handlePositionChange = useCallback(
    (position: { x: number; y: number }) => {
      dispatch(setVisualStillnessPosition(position));
    },
    [dispatch],
  );

  return (
    <>                                                                                              
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <SomaticScreenHero
            description="Exercise #2: establish equilibrium by connecting with external reference points."
            title="Sensory Anchoring"
          />
        </AnimatedReveal>

        <View className="gap-4">
          <AnimatedReveal delay={160}>
            <AnchoringTaskCard
              checked={completedAnchors.audio}
              description="Listen for the farthest sound you can detect."
              index={1}
              onToggle={() => dispatch(toggleCompletedAnchor('audio'))}
              title="External Audio Focus"
            >
              <AudioFocusGraphic />
            </AnchoringTaskCard>
          </AnimatedReveal>

          <AnimatedReveal delay={230}>
            <AnchoringTaskCard
              checked={completedAnchors.ground}
              description="Feel the weight of your body against the surface beneath you."
              index={2}
              onToggle={() => dispatch(toggleCompletedAnchor('ground'))}
              title="Ground Contact"
            >
              <GroundContactGraphic />
            </AnchoringTaskCard>
          </AnimatedReveal>

          <AnimatedReveal delay={300}>
            <AnchoringTaskCard
              checked={completedAnchors.visual}
              description="Fix your gaze on a single, unmoving point in your environment."
              index={3}
              onToggle={() => dispatch(toggleCompletedAnchor('visual'))}
              title="Visual Stillness"
            >
              <VisualStillnessPad onPositionChange={handlePositionChange} />
            </AnchoringTaskCard>
          </AnimatedReveal>
        </View>

        <AnimatedReveal delay={380}>
          <View
            className="rounded-[18px] border p-4"
            style={{
              backgroundColor: isDark ? colors.surfaceMuted : '#FBFFF8',
              borderColor: isDark ? colors.primaryBorder : '#DCE8D7',
            }}
          >
            <Text className="font-poppinsMedium text-[14px]" style={{ color: colors.textPrimary }}>
              Stay with whichever anchor feels most steady, then continue when your focus begins to settle.
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={450}>
          <AppButton
            disabled={submissionState === 'submitting'}
            label="Finish"
            onPress={() => {
              void completeCurrentRegion();
            }}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

import { useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { SelectionAnswerCard } from '@/features/somatic/components/selection-answer-card';
import { useCompleteSomaticRegion } from '@/features/somatic/hooks/use-complete-somatic-region';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { setStomachBracingSelection } from '@/features/somatic/store/somatic-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAppTheme } from '@/theme/use-app-theme';

const options = [
  { id: 'release', title: 'Release', description: 'The gut loosens or unwinds when you meet it with safety.' },
  { id: 'tighten', title: 'Tighten', description: 'The gut contracts more as the sensation becomes more noticeable.' },
] as const;

export function StomachGutReactionScreen() {
  const { colors } = useAppTheme();
  const dispatch = useAppDispatch();
  const { completeCurrentRegion, submissionState } = useCompleteSomaticRegion();
  const selected = useAppSelector((state) => state.somatic.stomachBracingSelections['gut-reaction']);
  const [localSelection, setLocalSelection] = useState<typeof options[number]['id'] | null>(
    selected === 'release' || selected === 'tighten' ? selected : null,
  );

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <View className="gap-3 px-1">
            <Text className="font-poppinsSemi text-[32px] leading-[40px]" style={{ color: colors.textPrimary }}>
              Gut Reaction
            </Text>
            <Text className="font-poppinsRegular text-[17px] leading-[30px]" style={{ color: colors.textSecondary }}>
              Exercise #3: notice whether the gut releases or tightens after the safety cue.
            </Text>
          </View>
        </AnimatedReveal>

        <View className="gap-4">
          {options.map((option, index) => (
            <AnimatedReveal delay={170 + index * 70} key={option.id}>
              <SelectionAnswerCard
                description={option.description}
                onPress={() => {
                  setLocalSelection(option.id);
                  dispatch(
                    setStomachBracingSelection({
                      group: 'gut-reaction',
                      value: option.id,
                    }),
                  );
                }}
                selected={localSelection === option.id}
                title={option.title}
              />
            </AnimatedReveal>
          ))}
        </View>

        <AnimatedReveal delay={320}>
          <AppButton
            disabled={!localSelection || submissionState === 'submitting'}
            label="Complete"
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

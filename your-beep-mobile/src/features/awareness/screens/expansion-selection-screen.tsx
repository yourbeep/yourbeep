import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppHeader } from '@/components/navigation/app-header';
import { AppButton } from '@/components/ui/app-button';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AwarenessOptionCard } from '@/features/awareness/components/awareness-option-card';
import { AwarenessScreenIntro } from '@/features/awareness/components/awareness-screen-intro';
import { useAwarenessFlow } from '@/features/awareness/context/awareness-flow-context';
import { expansionOptions } from '@/features/awareness/data/awareness-content';
import { toggleSelection } from '@/features/awareness/utils/awareness-flow';

export function ExpansionSelectionScreen() {
  const params = useLocalSearchParams<{ courseId?: string; gameId?: string }>();
  const { expansionSelections, setExpansionSelections } = useAwarenessFlow();

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <AppHeader
            onBackPress={() => router.replace('/awareness-activation-result')}
            subtitle=""
            title="Awareness States"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <AwarenessScreenIntro
            description="Select the energy pattern that most closely resonates with your current internal state."
            title={"Let's check for\nexpansion."}
          />
        </AnimatedReveal>

        <View className="flex-row flex-wrap justify-between gap-y-4">
          {expansionOptions.map((option, index) => (
            <AnimatedReveal
              delay={160 + index * 45}
              key={option.id}
              style={{ marginBottom: 16, width: '48.5%' }}
            >
              <AwarenessOptionCard
                onPress={() => {
                  setExpansionSelections(toggleSelection(expansionSelections, option.id));
                }}
                option={option}
                selected={expansionSelections.includes(option.id)}
              />
            </AnimatedReveal>
          ))}
        </View>

        <AnimatedReveal delay={460}>
          <AppButton
            disabled={expansionSelections.length < 2}
            label="Next"
            onPress={() =>
              router.push({
                params: {
                  courseId: params.courseId,
                  gameId: params.gameId,
                },
                pathname: '/awareness-expansion-result',
              })
            }
            trailing={<ArrowRight color="#FEFEE5" size={20} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

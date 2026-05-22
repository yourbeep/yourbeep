import { Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppHeader } from '@/components/navigation/app-header';
import { AppButton } from '@/components/ui/app-button';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AwarenessScreenIntro } from '@/features/awareness/components/awareness-screen-intro';
import { RootCauseCard } from '@/features/awareness/components/root-cause-card';
import { useAwarenessFlow } from '@/features/awareness/context/awareness-flow-context';
import { rootCauseOptions } from '@/features/awareness/data/awareness-content';
import { useAppTheme } from '@/theme/use-app-theme';

export function RootCauseScreen() {
  const params = useLocalSearchParams<{ courseId?: string; gameId?: string }>();
  const { colors } = useAppTheme();
  const {
    currentRootCauseDomain,
    currentRootCauseIndex,
    orderedDomains,
    rootCauseSelections,
    setCurrentRootCauseIndex,
    setRootCauseForDomain,
  } = useAwarenessFlow();

  const selectedCause = currentRootCauseDomain
    ? rootCauseSelections[currentRootCauseDomain]
    : undefined;

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <AppHeader
            onBackPress={() => router.replace('/awareness-value-mapping')}
            subtitle=""
            title="Awareness Summary"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <AwarenessScreenIntro
            description="Isolate the primary biological or cognitive driver maintaining the current energetic state."
            title="Root Cause"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={150}>
          <View className="gap-3">
            {orderedDomains.length > 0 ? (
              <View className="flex-row flex-wrap gap-2">
                {orderedDomains.map((domain, index) => {
                  const selected = index === currentRootCauseIndex;

                  return (
                    <Pressable
                      className="rounded-full border px-3 py-2"
                      key={`${domain}-${index}`}
                      onPress={() => setCurrentRootCauseIndex(index)}
                      style={{
                        backgroundColor: selected ? colors.accentSoft : colors.surface,
                        borderColor: selected ? colors.accent : colors.primaryBorder,
                      }}
                    >
                      <Text
                        className="font-poppinsMedium text-[11px] uppercase tracking-[0.5px]"
                        style={{ color: selected ? colors.accent : colors.textMuted }}
                      >
                        {domain}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
            <Text className="font-poppinsSemi text-[30px] leading-[38px]" style={{ color: colors.textPrimary }}>
              {currentRootCauseDomain ?? 'Select Domain'}
            </Text>
            <Text className="font-poppinsRegular text-[13px] leading-[22px]" style={{ color: colors.textSecondary }}>
              Choose the strongest driver for this domain before moving to the next one.
            </Text>
          </View>
        </AnimatedReveal>

        <View className="gap-4">
          {rootCauseOptions.map((option, index) => (
            <AnimatedReveal delay={210 + index * 55} key={option.id}>
              <RootCauseCard
                description={option.description}
                icon={option.icon}
                onPress={() => {
                  if (!currentRootCauseDomain) {
                    return;
                  }

                  setRootCauseForDomain(currentRootCauseDomain, option.id);
                }}
                selected={selectedCause === option.id}
                title={option.title}
              />
            </AnimatedReveal>
          ))}
        </View>

        <AnimatedReveal delay={470}>
          <AppButton
            disabled={!selectedCause}
            label={currentRootCauseIndex < orderedDomains.length - 1 ? 'Next' : 'Finish'}
            onPress={() => {
              if (currentRootCauseIndex < orderedDomains.length - 1) {
                setCurrentRootCauseIndex(currentRootCauseIndex + 1);
                return;
              }

              router.push({
                params: {
                  courseId: params.courseId,
                  gameId: params.gameId,
                },
                pathname: '/awareness-summary',
              });
            }}
            trailing={<ArrowRight color="#FEFEE5" size={20} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

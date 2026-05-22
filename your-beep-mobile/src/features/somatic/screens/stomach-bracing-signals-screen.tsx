import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { StomachSignalCard } from '@/features/somatic/components/stomach-signal-card';
import type { StomachBracingSignalId } from '@/features/somatic/store/somatic-slice';
import {
  stomachSignalVisuals,
} from '@/features/somatic/data/somatic-content';
import { setStomachBracingSelection } from '@/features/somatic/store/somatic-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAppTheme } from '@/theme/use-app-theme';

export function StomachBracingSignalsScreen() {
  const { colors } = useAppTheme();
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.somatic.stomachBracingSelections['abdominal-scan']);
  const abdominalScanOptions: Array<{ id: StomachBracingSignalId; title: string }> = [
    { id: 'neutral', title: 'Neutral' },
    { id: 'braced', title: 'Braced' },
  ];

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <View className="gap-2 px-1">
            <Text className="font-poppinsSemi text-[32px] leading-[40px]" style={{ color: colors.textPrimary }}>
              Abdominal Scan
            </Text>
            <Text className="font-poppinsRegular text-[17px] leading-[28px]" style={{ color: colors.textSecondary }}>
              Awareness test: observe the baseline state of the abdomen before moving into the exercises.
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <View className="gap-3">
            <Text className="font-poppinsMedium text-[15px]" style={{ color: colors.textPrimary }}>
              Abdominal scan
            </Text>
            <View className="flex-row justify-between">
              {abdominalScanOptions.map((option) => (
                <View key={option.id} style={{ width: '47.5%' }}>
                  <StomachSignalCard
                    onPress={() =>
                      dispatch(
                        setStomachBracingSelection({
                          group: 'abdominal-scan',
                          value: option.id,
                        }),
                      )
                    }
                    selected={selected === option.id}
                    source={stomachSignalVisuals[option.id]}
                    title={option.title}
                  />
                </View>
              ))}
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={320}>
          <AppButton
            disabled={!selected}
            label="Next"
            onPress={() => router.push('/somatic-stomach-belly-softening')}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

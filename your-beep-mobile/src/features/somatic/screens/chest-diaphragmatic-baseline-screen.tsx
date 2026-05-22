import { Image, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { appImages } from '@/constants/images';
import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { SomaticScreenHero } from '@/features/somatic/components/somatic-screen-hero';
import { chestDominanceCopy } from '@/features/somatic/data/somatic-content';
import { setChestBreathDominance } from '@/features/somatic/store/somatic-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAppTheme } from '@/theme/use-app-theme';

export function ChestDiaphragmaticBaselineScreen() {
  const { colors, isDark } = useAppTheme();
  const dispatch = useAppDispatch();
  const dominance = useAppSelector((state) => state.somatic.chestBreathDominance);

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <SomaticScreenHero
            description="Assess the engagement, lateral expansion, and symmetry of your lower ribcage during a resting breath cycle."
            title="Diaphragmatic Baseline Check"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <View
            className="overflow-hidden rounded-[24px] border p-3"
            style={{ backgroundColor: colors.surface, borderColor: isDark ? colors.primaryBorder : '#E7E2D7' }}
          >
            <Image
              className="h-[230px] w-full rounded-[18px]"
              resizeMode="cover"
              source={appImages.ChestHuman}
            />
            <Text className="mt-4 font-poppinsRegular text-[14px] leading-[24px]" style={{ color: colors.textSecondary }}>
              Place one hand on your upper chest and the other on your stomach. Notice which hand moves more.
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={240}>
          <View
            className="rounded-[22px] border p-4"
            style={{
              backgroundColor: isDark ? colors.surfaceMuted : '#FFF8E9',
              borderColor: isDark ? colors.primaryBorder : '#E7E1D2',
            }}
          >
            <Text className="font-poppinsSemi text-[13px] uppercase tracking-[0.8px]" style={{ color: colors.primary }}>
              Which part were you breathing from
            </Text>

            <View
              className="mt-3 h-12 w-[212px] flex-row overflow-hidden rounded-full"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <Pressable
                className="flex-1 items-center justify-center"
                onPress={() => dispatch(setChestBreathDominance('upper-chest'))}
                style={dominance === 'upper-chest' ? { backgroundColor: colors.primary } : undefined}
              >
                <Text className="text-center font-poppinsSemi text-[14px]" style={{ color: dominance === 'upper-chest' ? colors.textInverse : '#183743' }}>
                  Upper chest
                </Text>
              </Pressable>
              <Pressable
                className="flex-1 items-center justify-center"
                onPress={() => dispatch(setChestBreathDominance('belly'))}
                style={dominance === 'belly' ? { backgroundColor: colors.primary } : undefined}
              >
                <Text className="text-center font-poppinsSemi text-[14px]" style={{ color: dominance === 'belly' ? colors.textInverse : '#183743' }}>
                  Belly
                </Text>
              </Pressable>
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={300}>
          <View
            className="rounded-[24px] border p-5"
            style={{
              backgroundColor: isDark ? colors.surfaceMuted : '#FFF4DF',
              borderColor: isDark ? colors.primaryBorder : '#F1DFC4',
            }}
          >
            <Text className="font-poppinsRegular text-[15px] leading-[28px]" style={{ color: colors.textSecondary }}>
              {chestDominanceCopy[dominance]}
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={360}>
          <AppButton
            label="Next"
            onPress={() => router.push('/somatic-chest-expand-laterally')}
            trailing={<ArrowRight color="#FEFEE5" size={18} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { useCompleteSomaticRegion } from '@/features/somatic/hooks/use-complete-somatic-region';
import { SomaticChip } from '@/features/somatic/components/somatic-chip';
import { SomaticRouteHeader } from '@/features/somatic/components/somatic-route-header';
import { useAppTheme } from '@/theme/use-app-theme';

export function FaceThroatRelaxedBrightScreen() {
  const { colors, isDark } = useAppTheme();
  const { completeCurrentRegion, submissionState } = useCompleteSomaticRegion();

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <SomaticRouteHeader onBackPress={() => router.back()} />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <View className="gap-3 px-1">
            <SomaticChip label="Face & throat pathway" />
            <Text className="font-poppinsSemi text-[32px] leading-[40px]" style={{ color: colors.textPrimary }}>
              Relaxed & Bright
            </Text>
            <Text className="font-poppinsRegular text-[17px] leading-[30px]" style={{ color: colors.textSecondary }}>
              Your face and throat do not show a clench pattern right now, so no additional awareness test is required for this region.
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <View
            className="rounded-[24px] border p-5"
            style={{
              backgroundColor: isDark ? colors.surfaceMuted : '#F5FFF9',
              borderColor: isDark ? colors.primaryBorder : '#D8ECDC',
            }}
          >
            <Text className="font-poppinsRegular text-[15px] leading-[28px]" style={{ color: colors.textSecondary }}>
              Stay with the sense of ease in the jaw, throat, and facial muscles, then return to the somatic map.
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={250}>
          <AppButton
            disabled={submissionState === 'submitting'}
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

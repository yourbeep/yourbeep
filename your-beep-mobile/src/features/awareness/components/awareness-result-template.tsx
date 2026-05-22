import { Image, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';

import { appImages } from '@/constants/images';
import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppHeader } from '@/components/navigation/app-header';
import { AppButton } from '@/components/ui/app-button';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AwarenessResultCard } from '@/features/awareness/components/awareness-result-card';
import { AwarenessResultContent } from '@/features/awareness/data/awareness-content';
import { useAppTheme } from '@/theme/use-app-theme';

interface AwarenessResultTemplateProps {
  backendNote?: string | null;
  backHref: string;
  backParams?: Record<string, string | undefined>;
  nextParams?: Record<string, string | undefined>;
  nextHref: string;
  result: AwarenessResultContent;
  title: string;
}

export function AwarenessResultTemplate({
  backendNote,
  backHref,
  backParams,
  nextParams,
  nextHref,
  result,
  title,
}: AwarenessResultTemplateProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <MainAppShell showBottomNav={false}>
      <AnimatedReveal>
        <AppHeader
          onBackPress={() =>
            router.replace({
              params: backParams,
              pathname: backHref,
            })
          }
          subtitle=""
          title="Awareness States"
        />
      </AnimatedReveal>

      <AnimatedReveal delay={90}>
        <View className="gap-3 px-1">
          <Text className="font-poppinsSemi text-[32px] leading-[40px]" style={{ color: colors.textPrimary }}>
            {title}
          </Text>
          {backendNote ? (
            <View
              className="self-start rounded-[16px] border px-4 py-3"
              style={{
                backgroundColor: isDark ? 'rgba(86, 212, 202, 0.12)' : '#EAF8F5',
                borderColor: isDark ? 'rgba(86, 212, 202, 0.22)' : '#C9EAE1',
              }}
            >
              <Text className="font-poppinsRegular text-[13px] leading-[22px]" style={{ color: colors.textSecondary }}>
                {backendNote}
              </Text>
            </View>
          ) : null}
          <View className="flex-row items-center justify-between gap-4">
            <View>
              <Text className="font-poppinsRegular text-[14px]" style={{ color: colors.textSecondary }}>
                Detected State
              </Text>
              <Text className="font-poppinsRegular text-[14px]" style={{ color: colors.textSecondary }}>
                Pivot:
              </Text>
            </View>
            <View
              className="flex-row items-center gap-2 rounded-full border px-4 py-2"
              style={{
                backgroundColor: isDark ? '#35271F' : '#FFF7EF',
                borderColor: isDark ? 'rgba(248,194,164,0.24)' : '#F8C2A4',
              }}
            >
              <Image className="h-[12px] w-[13px] rounded-none" resizeMode="cover" source={appImages.resultMap} />
              <Text className="font-poppinsSemi text-[12px] uppercase tracking-[0.6px]" style={{ color: '#E45B38' }}>
                {result.detectedState}
              </Text>
            </View>
          </View>
        </View>
      </AnimatedReveal>

      <View className="gap-4">
        <AnimatedReveal delay={170}>
          <AwarenessResultCard
            body={result.energyBody}
            icon="activity"
            title={`Energy Orientation: ${result.energyTitle}`}
            tone="sage"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={240}>
          <AwarenessResultCard
            body={result.flowBody}
            icon="waves"
            title={`Flow Stability: ${result.flowTitle}`}
            tone="peach"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={310}>
          <View
            className="rounded-[22px] border px-6 py-5"
            style={{
              backgroundColor: isDark ? '#302920' : '#FFF2E2',
              borderColor: isDark ? 'rgba(241,223,204,0.14)' : '#F1DFCC',
            }}
          >
            <View className="flex-row items-center gap-3">
              <View className="h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: colors.surface }}>
                <Text className="font-poppinsSemi text-[16px]" style={{ color: colors.textSecondary }}>✣</Text>
              </View>
              <Text className="font-poppinsSemi text-[16px]" style={{ color: colors.textSecondary }}>
                STATE SYNTHESIS
              </Text>
            </View>

            <Text className="mt-5 font-poppinsSemi text-[30px] leading-[38px]" style={{ color: colors.textPrimary }}>
              {result.synthesisTitle}
            </Text>
            <Text className="mt-5 font-poppinsRegular text-[15px] leading-[30px]" style={{ color: colors.textSecondary }}>
              {result.synthesisBody}
            </Text>

            <View className="mt-7 flex-row gap-8">
              <View className="border-l pl-3" style={{ borderLeftColor: '#F3B08D' }}>
                <Text className="font-poppinsSemi text-[22px]" style={{ color: colors.textPrimary }}>
                  {result.metricLeftValue}
                </Text>
                <Text className="font-poppinsMedium text-[12px] tracking-[0.4px]" style={{ color: colors.textMuted }}>
                  {result.metricLeftLabel}
                </Text>
              </View>
              <View className="border-l pl-3" style={{ borderLeftColor: colors.primaryBorder }}>
                <Text className="font-poppinsSemi text-[22px]" style={{ color: colors.textPrimary }}>
                  {result.metricRightValue}
                </Text>
                <Text className="font-poppinsMedium text-[12px] tracking-[0.4px]" style={{ color: colors.textMuted }}>
                  {result.metricRightLabel}
                </Text>
              </View>
            </View>
          </View>
        </AnimatedReveal>
      </View>

      <AnimatedReveal delay={390}>
        <AppButton
          label="Next"
          onPress={() => {
            router.push({
              params: nextParams,
              pathname: nextHref,
            });
          }}
          trailing={<ArrowRight color="#FEFEE5" size={20} strokeWidth={2.2} />}
        />
      </AnimatedReveal>
    </MainAppShell>
  );
}

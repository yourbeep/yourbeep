import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppHeader } from '@/components/navigation/app-header';
import { AppButton } from '@/components/ui/app-button';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AwarenessScreenIntro } from '@/features/awareness/components/awareness-screen-intro';
import { DomainPill } from '@/features/awareness/components/domain-pill';
import { useAwarenessFlow } from '@/features/awareness/context/awareness-flow-context';
import { valueSystemOptions } from '@/features/awareness/data/awareness-content';
import { toggleSelection } from '@/features/awareness/utils/awareness-flow';
import { useAppTheme } from '@/theme/use-app-theme';

function DomainSection({
  description,
  icon,
  options,
  selected,
  title,
  onToggle,
}: {
  description: string;
  icon: 'down' | 'up';
  options: typeof valueSystemOptions;
  onToggle: (value: string) => void;
  selected: string[];
  title: string;
}) {
  const { colors, isDark } = useAppTheme();
  const Icon = icon === 'up' ? TrendingUp : TrendingDown;

  return (
    <View
      className="gap-4 rounded-[26px] border p-5"
      style={{
        backgroundColor: isDark ? '#302920' : '#FFF7E9',
        borderColor: isDark ? 'rgba(243,216,180,0.18)' : '#F3D8B4',
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Icon color={colors.accent} size={18} strokeWidth={2} />
          <Text className="font-poppinsSemi text-[17px]" style={{ color: colors.textPrimary }}>
            {title}
          </Text>
        </View>
        <View
          className="rounded-full px-3 py-1"
          style={{ backgroundColor: isDark ? colors.accentSoft : '#D5F7EF' }}
        >
          <Text className="font-poppinsMedium text-[12px]" style={{ color: colors.accent }}>
            {selected.length === 2 ? '2 Selected' : 'Select 2'}
          </Text>
        </View>
      </View>

      <Text className="font-poppinsRegular text-[14px] leading-[24px]" style={{ color: colors.textSecondary }}>
        {description}
      </Text>

      <View className="flex-row flex-wrap gap-3">
        {options.map((option) => (
          <View className="w-[48%]" key={`${title}-${option.id}`}>
            <DomainPill
              icon={option.icon}
              label={option.title}
              onPress={() => onToggle(option.id)}
              selected={selected.includes(option.id)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

export function ValueSystemMappingScreen() {
  const params = useLocalSearchParams<{ courseId?: string; gameId?: string }>();
  const { highPoints, lowPoints, setCurrentRootCauseIndex, setHighPoints, setLowPoints } =
    useAwarenessFlow();
  const hasOverlap = highPoints.some((value) => lowPoints.includes(value));

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <AppHeader
            onBackPress={() => router.replace('/awareness-expansion-result')}
            subtitle=""
            title="Awareness States"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <AwarenessScreenIntro
            description="Identify the core domains currently exerting the highest and lowest influence on your biological baseline."
            title="Value System Mapping"
          />
        </AnimatedReveal>

        <View className="gap-5">
          <AnimatedReveal delay={160}>
            <DomainSection
              description="Areas of highest cognitive or emotional resonance."
              icon="up"
              onToggle={(value) => {
                if (!highPoints.includes(value) && lowPoints.includes(value)) {
                  return;
                }

                setHighPoints(toggleSelection(highPoints, value));
              }}
              options={valueSystemOptions}
              selected={highPoints}
              title="High Points"
            />
          </AnimatedReveal>

          <AnimatedReveal delay={240}>
            <DomainSection
              description="Areas of lowest engagement or depleted resources."
              icon="down"
              onToggle={(value) => {
                if (!lowPoints.includes(value) && highPoints.includes(value)) {
                  return;
                }

                setLowPoints(toggleSelection(lowPoints, value));
              }}
              options={valueSystemOptions}
              selected={lowPoints}
              title="Low Points"
            />
          </AnimatedReveal>
        </View>

        {hasOverlap ? (
          <AnimatedReveal delay={290}>
            <Text className="px-1 font-poppinsRegular text-[13px]" style={{ color: '#E45B38' }}>
              High Points and Low Points must be different domains.
            </Text>
          </AnimatedReveal>
        ) : null}

        <AnimatedReveal delay={320}>
          <AppButton
            disabled={highPoints.length < 2 || lowPoints.length < 2 || hasOverlap}
            label="Next"
            onPress={() => {
              setCurrentRootCauseIndex(0);
              router.push({
                params: {
                  courseId: params.courseId,
                  gameId: params.gameId,
                },
                pathname: '/awareness-root-cause',
              });
            }}
            trailing={<ArrowRight color="#FEFEE5" size={20} strokeWidth={2.2} />}
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

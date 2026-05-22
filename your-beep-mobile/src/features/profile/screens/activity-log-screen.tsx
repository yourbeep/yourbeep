import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Brain, Coins, Flame, PlayCircle, SlidersHorizontal, TrendingUp, Wind } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppHeader } from '@/components/navigation/app-header';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import { activityLogEntries, activityLogOverview } from '@/features/profile/data/profile-content';
import { useAppTheme } from '@/theme/use-app-theme';

function ActivityBadge({ kind }: { kind: (typeof activityLogEntries)[number]['badge'] }) {
  if (kind === 'breath') {
    return (
      <View className="h-12 w-12 items-center justify-center rounded-full bg-[#75F0E4]">
        <Wind color="#0B3F4E" size={18} strokeWidth={2.1} />
      </View>
    );
  }

  if (kind === 'credits') {
    return (
      <View className="h-12 w-12 items-center justify-center rounded-full bg-[#FFD59A]">
        <Coins color="#4A3414" size={18} strokeWidth={2.1} />
      </View>
    );
  }

  if (kind === 'cognitive') {
    return (
      <View className="h-12 w-12 items-center justify-center rounded-full bg-[#D9E0FF]">
        <Brain color="#38445F" size={18} strokeWidth={2.1} />
      </View>
    );
  }

  return (
    <View className="h-12 w-12 items-center justify-center rounded-full bg-[#E2E2E2]">
      <PlayCircle color="#4D4D4D" size={18} strokeWidth={2.1} />
    </View>
  );
}

export function ActivityLogScreen() {
  const { colors, isDark } = useAppTheme();

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <AppHeader onBackPress={() => router.back()} subtitle="" title="Activity Log" />
        </AnimatedReveal>

        <AnimatedReveal delay={100}>
          <View
            className="rounded-[24px] border px-5 py-5"
            style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
          >
            <View className="flex-row items-start justify-between gap-4">
              <Text className="font-poppinsSemi text-[28px] leading-[34px]" style={{ color: colors.textPrimary }}>
                Engagement Overview
              </Text>
              <TrendingUp color={colors.accent} size={20} strokeWidth={2} />
            </View>

            <View className="mt-5 flex-row gap-5">
              <View className="flex-1">
                <Text className="font-poppinsSemi text-[11px] tracking-[1.2px]" style={{ color: colors.textMuted }}>
                  TOTAL SESSIONS
                </Text>
                <Text className="mt-1 font-poppinsSemi text-[42px] leading-[44px]" style={{ color: colors.textPrimary }}>
                  {activityLogOverview.totalSessions}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="font-poppinsSemi text-[11px] tracking-[1.2px]" style={{ color: colors.textMuted }}>
                  CURRENT STREAK
                </Text>
                <View className="mt-1 flex-row items-center gap-2">
                  <Text className="font-poppinsSemi text-[42px] leading-[44px]" style={{ color: colors.textPrimary }}>
                    {activityLogOverview.currentStreak}
                  </Text>
                  <Flame color="#FFAE41" fill="#FFAE41" size={17} />
                </View>
              </View>
            </View>

            <View className="mt-5 h-[6px] rounded-full" style={{ backgroundColor: isDark ? colors.surfaceStrong : '#E6E3E7' }}>
              <View
                className="h-[6px] rounded-full"
                style={{ backgroundColor: colors.primary, width: `${activityLogOverview.milestoneProgress}%` }}
              />
            </View>
            <Text className="mt-3 text-right font-poppinsSemi text-[12px]" style={{ color: colors.textSecondary }}>
              {activityLogOverview.milestoneProgress}% to Next Milestone
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={170}>
          <View className="flex-row items-center justify-between">
            <Text className="font-poppinsSemi text-[26px]" style={{ color: colors.textPrimary }}>
              Recent Activity
            </Text>
            <View
              className="flex-row items-center gap-2 rounded-full border px-4 py-2"
              style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
            >
              <SlidersHorizontal color={colors.textSecondary} size={14} strokeWidth={2} />
              <Text className="font-poppinsSemi text-[12px]" style={{ color: colors.textSecondary }}>
                FILTER
              </Text>
            </View>
          </View>
        </AnimatedReveal>

        <View className="gap-4">
          {activityLogEntries.map((entry, index) => (
            <AnimatedReveal delay={220 + index * 50} key={entry.id}>
              <View
                className="rounded-[22px] border px-4 py-4"
                style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
              >
                <View className="flex-row gap-3">
                  <ActivityBadge kind={entry.badge} />
                  <View className="min-w-0 flex-1">
                    <View className="flex-row items-start justify-between gap-3">
                      <Text className="flex-1 font-poppinsSemi text-[16px] leading-[24px]" style={{ color: colors.textPrimary }}>
                        {entry.title}
                      </Text>
                      {entry.timestamp ? (
                        <Text className="font-poppinsSemi text-[11px] tracking-[1px]" style={{ color: colors.textMuted }}>
                          {entry.timestamp}
                        </Text>
                      ) : null}
                    </View>
                    <Text className="mt-1 font-poppinsRegular text-[15px] leading-[26px]" style={{ color: colors.textSecondary }}>
                      {entry.description}
                    </Text>
                    {entry.meta ? (
                      <View
                        className="mt-3 self-start rounded-full px-3 py-1.5"
                        style={{ backgroundColor: isDark ? 'rgba(255,216,169,0.18)' : '#FFD8A9' }}
                      >
                        <Text
                          className="font-poppinsSemi text-[11px] tracking-[0.6px]"
                          style={{ color: isDark ? '#F0D8AE' : '#3F2C11' }}
                        >
                          {entry.meta}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            </AnimatedReveal>
          ))}
        </View>

        <AnimatedReveal delay={460}>
          <AppButton label="Load More History" />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

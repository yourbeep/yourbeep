import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SectionHeading } from '@/components/ui/section-heading';
import { DashboardHeader } from '@/features/dashboard/components/dashboard-header';
import { EngagementCard } from '@/features/dashboard/components/engagement-card';
import { MetricRow } from '@/features/dashboard/components/metric-row';
import { ProtocolCard } from '@/features/dashboard/components/protocol-card';
import { RecommendationCard } from '@/features/dashboard/components/recommendation-card';
import { appImages } from '@/constants/images';
import {
  engagementCards,
  metricRows,
  recommendations,
} from '@/features/dashboard/data/dashboard-content';
import { fetchUserDashboard } from '@/lib/api';
import { env } from '@/lib/config/env';
import type { CurrentUserDashboard } from '@/lib/api/types';
import { useAppSelector } from '@/store/hooks';
import { useAppTheme } from '@/theme/use-app-theme';

export function DashboardScreen() {
  const router = useRouter();
  const { colors, isDark } = useAppTheme();
  const [dashboardData, setDashboardData] = useState<CurrentUserDashboard | null>(null);
  const authReady = useAppSelector((state) => state.auth.isReady);
  const authToken = useAppSelector((state) => state.auth.token);
  const stateCardTextColor = isDark ? colors.textPrimary : colors.textInverse;
  const stateCardMutedColor = isDark ? colors.textMuted : 'rgba(254,254,229,0.7)';

  useEffect(() => {
    if (!authReady && !env.apiBearerToken) {
      return;
    }

    if (!authToken && !env.apiBearerToken) {
      setDashboardData(null);
      return;
    }

    let active = true;

    fetchUserDashboard()
      .then((data) => {
        if (active) {
          setDashboardData(data);
        }
      })
      .catch(() => {
        if (active) {
          setDashboardData(null);
        }
      });

    return () => {
      active = false;
    };
  }, [authReady, authToken]);

  const resolvedGreeting = dashboardData?.header.greeting
    ? `${dashboardData.header.greeting},`
    : 'Good Evening,';
  const resolvedName = dashboardData?.header.user.name ?? 'Alolika';
  const resolvedSubtitle =
    dashboardData?.header.subtitle ?? "Let's check in with your current state";
  const resolvedLevel = dashboardData?.progression.level ?? 2;
  const resolvedPoints = dashboardData?.progression.totalXp ?? 440;
  const resolvedProgress = dashboardData?.progression.progressPercentage ?? 44;
  const resolvedArrow =
    dashboardData?.progression.stateDirection === 'down'
      ? '↓'
      : dashboardData?.progression.stateDirection === 'flat'
        ? '→'
        : '↑';

  const resolvedEngagementCards = useMemo(() => {
    if (!dashboardData) {
      return engagementCards;
    }

    return [
      {
        caption:
          dashboardData.activityEngagement.observationTime.trend === 'baseline'
            ? 'Baseline'
            : `${dashboardData.activityEngagement.observationTime.changePercentage > 0 ? '+' : ''}${Math.round(
                dashboardData.activityEngagement.observationTime.changePercentage,
              )}%`,
        captionTone:
          dashboardData.activityEngagement.observationTime.trend === 'baseline' ? 'muted' : 'success',
        icon: appImages.observationIcon,
        indicator: appImages.observationGrowthIcon,
        subtitle: 'Observation Time',
        title: `${Math.round(dashboardData.activityEngagement.observationTime.minutes)} min`,
      },
      {
        caption:
          dashboardData.activityEngagement.reflectionTime.trend === 'baseline'
            ? 'Baseline'
            : `${dashboardData.activityEngagement.reflectionTime.changePercentage > 0 ? '+' : ''}${Math.round(
                dashboardData.activityEngagement.reflectionTime.changePercentage,
              )}%`,
        captionTone:
          dashboardData.activityEngagement.reflectionTime.trend === 'baseline' ? 'muted' : 'success',
        icon: appImages.reflectionIcon,
        indicator: '→',
        subtitle: 'Reflection Time',
        title: `${Math.round(dashboardData.activityEngagement.reflectionTime.minutes)} min`,
      },
    ] as const;
  }, [dashboardData]);

  const resolvedMetricRows = useMemo(() => {
    if (!dashboardData) {
      return metricRows;
    }

    return dashboardData.metrics.map((item) => ({
      change: `${item.weeklyChange > 0 ? '+' : ''}${Math.round(item.weeklyChange)}% vs last week`,
      icon:
        item.icon === 'waves'
          ? appImages.emotionalSignalIcon
          : item.icon === 'moon'
            ? appImages.physiologicalIcon
            : appImages.physiologicalIcon,
      score: `${Math.round(item.score)}%`,
      subtitle: item.subtitle,
      title: item.title,
    }));
  }, [dashboardData]);

  const resolvedRecommendations = useMemo(() => {
    if (!dashboardData?.recommendations.length) {
      return recommendations;
    }

    return dashboardData.recommendations.map((item) => ({
      duration: `${Math.max(1, Math.round(item.durationMinutes))} MIN`,
      id: item.id,
      source: item.thumbnailUrl ? ({ uri: item.thumbnailUrl } as const) : appImages.onboardingJourney,
      title: item.title,
    }));
  }, [dashboardData]);

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell
        activeRoute="/home"
        contentClassName="pt-0"
        onTabNavigate={(route) => router.replace(route)}
      >
        <AnimatedReveal>
          <DashboardHeader
            greeting={resolvedGreeting}
            name={resolvedName}
            onNotificationPress={() => router.push('/notifications')}
            subtitle={resolvedSubtitle}
          />
        </AnimatedReveal>

        <AnimatedReveal delay={110}>
          <View
            className="mt-3 gap-5 rounded-[20px] p-5"
            style={{ backgroundColor: isDark ? colors.surfaceStrong : colors.primary }}
          >
            <View className="flex-row items-center justify-between gap-3">
              <View className="gap-1">
                <Text
                  className="text-[12px] font-extrabold tracking-[1.2px]"
                  style={{ color: stateCardMutedColor }}
                >
                  CURRENT STATE
                </Text>
                <Text className="text-[34px] font-extrabold" style={{ color: stateCardTextColor }}>
                  User Level: {String(resolvedLevel).padStart(2, '0')}
                </Text>
                <Text className="text-base font-bold" style={{ color: colors.accent }}>
                  Points Earned: {resolvedPoints}
                </Text>
              </View>

              <View
                className="h-[58px] w-[58px] items-center justify-center rounded-full border-[3px]"
                style={{ borderColor: isDark ? colors.primaryBorder : 'rgba(254,254,229,0.24)' }}
              >
                <Text className="text-[28px] font-extrabold" style={{ color: colors.accent }}>
                  {resolvedArrow}
                </Text>
              </View>
            </View>

            <ProgressBar progress={resolvedProgress} />
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={190} >
          <SectionHeading title="Activity engagement" />
        </AnimatedReveal>

        <View className="flex-row gap-3">
          {resolvedEngagementCards.map((item, index) => (
            <View className="flex-1" key={item.subtitle}>
              <AnimatedReveal delay={260 + index * 80}>
                <EngagementCard
                  caption={item.caption}
                  captionTone={item.captionTone}
                  icon={item.icon}
                  indicator={item.indicator}
                  subtitle={item.subtitle}
                  title={item.title}
                />
              </AnimatedReveal>
            </View>
          ))}
        </View>

        <AnimatedReveal delay={360} >
          <SectionHeading title="Metrics" />
        </AnimatedReveal>

        <View className="gap-3">
          {resolvedMetricRows.map((item, index) => (
            <AnimatedReveal delay={430 + index * 70} key={item.title}>
              <MetricRow
                change={item.change}
                icon={item.icon}
                score={item.score}
                subtitle={item.subtitle}
                title={item.title}
              />
            </AnimatedReveal>
          ))}
        </View>

        <AnimatedReveal delay={640}>
          <SectionHeading title="Scheduled Protocol" />
        </AnimatedReveal>

        <AnimatedReveal delay={700}>
          <ProtocolCard />
        </AnimatedReveal>

        <AnimatedReveal delay={780}>
          <SectionHeading title="Recommended for Your State" />
        </AnimatedReveal>

        <AnimatedReveal delay={860}>
          <ScrollView
            horizontal
            contentContainerStyle={{ columnGap: 12, paddingRight: 22 }}
            showsHorizontalScrollIndicator={false}
          >
            {resolvedRecommendations.map((item) => (
              <RecommendationCard
                duration={item.duration}
                key={item.title}
                source={item.source}
                title={item.title}
              />
            ))}
          </ScrollView>
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

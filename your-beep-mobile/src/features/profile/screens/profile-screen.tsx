import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppButton } from '@/components/ui/app-button';
import { AppHeader } from '@/components/navigation/app-header';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { RewardCard } from '@/features/profile/components/reward-card';
import { SettingsRow } from '@/features/profile/components/settings-row';
import { rewards, settingsSections } from '@/features/profile/data/profile-content';
import { fetchUserProfile, fetchUserStats } from '@/lib/api';
import { env } from '@/lib/config/env';
import type { CurrentUser, CurrentUserStats } from '@/lib/api/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setThemeMode } from '@/features/ui/store/ui-slice';
import { signOutFirebaseUser } from '@/lib/firebase/client';
import { useAppTheme } from '@/theme/use-app-theme';

export function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authReady = useAppSelector((state) => state.auth.isReady);
  const authToken = useAppSelector((state) => state.auth.token);
  const themeMode = useAppSelector((state) => state.ui.themeMode);
  const { colors, isDark } = useAppTheme();
  const [userProfile, setUserProfile] = useState<CurrentUser | null>(null);
  const [userStats, setUserStats] = useState<CurrentUserStats | null>(null);

  useEffect(() => {
    if (!authReady && !env.apiBearerToken) {
      return;
    }

    if (!authToken && !env.apiBearerToken) {
      setUserProfile(null);
      setUserStats(null);
      return;
    }

    let active = true;

    Promise.all([fetchUserProfile(), fetchUserStats()])
      .then(([profile, stats]) => {
        if (!active) return;
        setUserProfile(profile.user);
        setUserStats(stats);
      })
      .catch(() => {
        if (!active) return;
        setUserProfile(null);
        setUserStats(null);
      });

    return () => {
      active = false;
    };
  }, [authReady, authToken]);

  const routeForSetting = (
    id: (typeof settingsSections)[number]['id'],
  ): '/activity-log' | '/help-support' | '/privacy-settings' | '/raise-ticket' | undefined => {
    if (id === 'activity-log') return '/activity-log';
    if (id === 'help-support') return '/help-support';
    if (id === 'privacy') return '/privacy-settings';
    if (id === 'raise-ticket') return '/raise-ticket';
    return undefined;
  };

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell activeRoute="/profile" onTabNavigate={(route) => router.replace(route)}>
        <AnimatedReveal>
          <AppHeader onBackPress={() => router.replace('/home')} subtitle="" title="Profile" />
        </AnimatedReveal>

        <AnimatedReveal delay={110}>
          <View className="mt-1 items-center gap-3">
            <View className="h-[92px] w-[92px] items-center justify-center rounded-full border-[3px] border-[#67F1D2] bg-[#1B2023]">
              <Text className="font-poppinsSemi text-[32px] text-brand-textInverse">
                {(userProfile?.name?.[0] ?? 'J').toUpperCase()}
              </Text>
            </View>
            <Text className="font-poppinsSemi text-[28px]" style={{ color: colors.textPrimary }}>
              {userProfile?.name ?? 'Jessica Jones'}
            </Text>
            <View
              className="rounded-full px-4 py-2"
              style={{ backgroundColor: isDark ? colors.surfaceStrong : '#E9E7EE' }}
            >
              <Text className="font-poppinsMedium text-[12px]" style={{ color: colors.textSecondary }}>
                USER LEVEL: {String(userStats?.userLevel ?? 2).padStart(2, '0')}
              </Text>
            </View>
          </View>
        </AnimatedReveal>

        <View className="gap-4">
          <AnimatedReveal delay={190}>
            <View className="flex-row items-center justify-between">
              <Text
                className="font-poppinsSemi text-[24px]"
                style={{ color: isDark ? colors.textPrimary : colors.primary }}
              >
                Rewards Center
              </Text>
              <Text className="font-poppinsMedium text-[13px]" style={{ color: colors.textPrimary }}>
                View All
              </Text>
            </View>
          </AnimatedReveal>

          <AnimatedReveal delay={260}>
            <ScrollView
              horizontal
              contentContainerStyle={{ columnGap: 12, paddingRight: 22 }}
              showsHorizontalScrollIndicator={false}
            >
              {rewards.map((item) => (
                <RewardCard key={item.id} label={item.label} title={item.title} tone={item.tone} />
              ))}
            </ScrollView>
          </AnimatedReveal>
        </View>

        <View className="gap-4">
          <AnimatedReveal delay={330}>
            <Text
              className="font-poppinsSemi text-[24px]"
              style={{ color: isDark ? colors.textPrimary : colors.primary }}
            >
              App Settings
            </Text>
          </AnimatedReveal>

          <AnimatedReveal delay={390}>
            <View
              className="overflow-hidden rounded-[22px] border"
              style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
            >
              {settingsSections.map((item, index) => (
                <View
                  className={index === 0 ? '' : 'border-t'}
                  style={index === 0 ? undefined : { borderTopColor: colors.primaryBorder }}
                  key={item.id}
                >
                  <SettingsRow
                    enabled={item.id === 'dark-mode' ? themeMode === 'dark' : undefined}
                    label={item.label}
                    onPress={
                      routeForSetting(item.id)
                        ? () => router.push(routeForSetting(item.id)!)
                        : undefined
                    }
                    onToggle={
                      item.id === 'dark-mode'
                        ? (value) => dispatch(setThemeMode(value ? 'dark' : 'light'))
                        : undefined
                    }
                    trailing={item.trailing}
                  />
                </View>
              ))}
            </View>
          </AnimatedReveal>
        </View>

        <AnimatedReveal delay={470}>
          <AppButton
            className="border bg-transparent"
            label="Logout"
            onPress={async () => {
              await signOutFirebaseUser();
              router.replace('/login');
            }}
            variant="ghost"
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}

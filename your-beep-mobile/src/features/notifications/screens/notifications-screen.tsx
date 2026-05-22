import { useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppHeader } from '@/components/navigation/app-header';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { NotificationCard } from '@/features/notifications/components/notification-card';
import { markAllAsRead } from '@/features/notifications/store/notifications-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAppTheme } from '@/theme/use-app-theme';

function groupLabel(timestamp: string) {
  const notificationDate = new Date(timestamp);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  if (notificationDate >= startOfToday) {
    return 'Today';
  }

  if (notificationDate >= startOfYesterday) {
    return 'Yesterday';
  }

  return 'Earlier';
}

export function NotificationsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { colors } = useAppTheme();
  const items = useAppSelector((state) => state.notifications.items);

  useEffect(() => {
    dispatch(markAllAsRead());
  }, [dispatch]);

  const groupedNotifications = useMemo(() => {
    const groups = new Map<string, typeof items>();

    items.forEach((item) => {
      const key = groupLabel(item.timestamp);
      const current = groups.get(key) ?? [];
      groups.set(key, [...current, item]);
    });

    return [...groups.entries()].map(([title, groupItems]) => ({
      id: title.toLowerCase(),
      items: groupItems,
      title,
    }));
  }, [items]);

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <AppHeader
            onBackPress={() => router.replace('/home')}
            subtitle=""
            title="Notifications"
          />
        </AnimatedReveal>

        <View className="gap-7">
          {groupedNotifications.map((group, groupIndex) => (
            <View className="gap-3" key={group.id}>
              <AnimatedReveal delay={100 + groupIndex * 110}>
                <Text className="font-poppinsSemi text-[24px]" style={{ color: colors.textPrimary }}>
                  {group.title}
                </Text>
              </AnimatedReveal>

              <View className="gap-3">
                {group.items.map((item, itemIndex) => (
                  <AnimatedReveal delay={170 + groupIndex * 110 + itemIndex * 60} key={item.id}>
                    <NotificationCard
                      accent={item.accent ?? '#1E8F7D'}
                      icon={item.icon ?? '✦'}
                      message={item.message}
                      time={new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      title={item.title}
                    />
                  </AnimatedReveal>
                ))}
              </View>
            </View>
          ))}

          {!groupedNotifications.length ? (
            <AnimatedReveal delay={120}>
              <View className="rounded-[20px] border px-5 py-5" style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}>
                <Text className="font-poppinsSemi text-[18px]" style={{ color: colors.textPrimary }}>
                  No notifications yet
                </Text>
                <Text className="mt-2 font-poppinsRegular text-[14px] leading-[24px]" style={{ color: colors.textSecondary }}>
                  The backend currently supports device token registration, and this screen will populate when live push notifications are received by the app.
                </Text>
              </View>
            </AnimatedReveal>
          ) : null}
        </View>
      </MainAppShell>
    </>
  );
}

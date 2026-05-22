import { PropsWithChildren } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavBar } from '@/components/navigation/bottom-nav-bar';
import { useAppTheme } from '@/theme/use-app-theme';

interface MainAppShellProps extends PropsWithChildren {
  activeRoute?: '/courses' | '/home' | '/profile' | '/videos';
  contentClassName?: string;
  onTabNavigate?: (route: '/courses' | '/home' | '/profile' | '/videos') => void;
  showBottomNav?: boolean;
  scrollEnabled?: boolean;
  topAreaColor?: string;
}

export function MainAppShell({
  activeRoute,
  children,
  contentClassName,
  onTabNavigate,
  showBottomNav = true,
  scrollEnabled = true,
  topAreaColor,
}: MainAppShellProps) {
  const { colors } = useAppTheme();
  const { width } = useWindowDimensions();
  const safeAreaTopColor = topAreaColor ?? colors.primary;
  const horizontalPadding = width < 390 ? 16 : 22;
  const bottomPadding = showBottomNav ? 144 : width < 390 ? 40 : 48;
  const body = scrollEnabled ? (
    <ScrollView className="flex-1" style={{ backgroundColor: colors.background }} showsVerticalScrollIndicator={false}>
      <View
        className={`gap-6 pt-0 ${contentClassName ?? ''}`}
        style={{ paddingBottom: bottomPadding, paddingHorizontal: horizontalPadding }}
      >
        {children}
      </View>
    </ScrollView>
  ) : (
    <View
      className={`flex-1 gap-6 pt-0 ${contentClassName ?? ''}`}
      style={{ backgroundColor: colors.background }}
    >
      <View style={{ flex: 1, paddingBottom: bottomPadding, paddingHorizontal: horizontalPadding }}>
        {children}
      </View>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: safeAreaTopColor }}>
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: safeAreaTopColor }}
        edges={['top', 'left', 'right']}
      >
        {body}
      </SafeAreaView>

      {showBottomNav ? (
        <View className="absolute inset-x-0 bottom-0" pointerEvents="box-none">
          <SafeAreaView className="bg-transparent" edges={['bottom']} style={{ backgroundColor: colors.background }}>
            <BottomNavBar
              activeRoute={activeRoute ?? '/home'}
              onNavigate={(route) => {
                onTabNavigate?.(route);
              }}
            />
          </SafeAreaView>
        </View>
      ) : null}
    </View>
  );
}

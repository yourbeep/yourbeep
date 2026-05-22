import { Image, ImageSourcePropType, Pressable, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { appImages } from '@/constants/images';
import { useAppTheme } from '@/theme/use-app-theme';

interface NavItem {
  activeIcon: ImageSourcePropType;
  inactiveIcon: ImageSourcePropType;
  label: string;
  route: '/courses' | '/home' | '/profile' | '/videos';
}

const navItems: NavItem[] = [
  {
    activeIcon: appImages.navHomeActive,
    inactiveIcon: appImages.navHomeInactive,
    label: 'Home',
    route: '/home',
  },
  {
    activeIcon: appImages.navBookmarkActive,
    inactiveIcon: appImages.navBookmarkInactive,
    label: 'Modules',
    route: '/courses',
  },
  {
    activeIcon: appImages.navVideoActive,
    inactiveIcon: appImages.navVideoInactive,
    label: 'Videos',
    route: '/videos',
  },
  {
    activeIcon: appImages.navProfileActive,
    inactiveIcon: appImages.navProfileInactive,
    label: 'Profile',
    route: '/profile',
  },
];

interface BottomNavBarProps {
  activeRoute: NavItem['route'];
  onNavigate: (route: NavItem['route']) => void;
}

export function BottomNavBar({ activeRoute, onNavigate }: BottomNavBarProps) {
  const { colors, isDark } = useAppTheme();

  const handlePress = async (route: NavItem['route']) => {
    if (route === activeRoute) {
      return;
    }

    await Haptics.selectionAsync();
    onNavigate(route);
  };

  return (
    <View className="px-5 pb-4">
      <View
        className="flex-row items-center rounded-[42px] border px-3 py-3 shadow-brand"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.primaryBorder,
        }}
      >
        {navItems.map((item) => {
          const active = activeRoute === item.route;

          return (
            <View className="flex-1 px-1" key={item.route}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                className="rounded-full"
                onPress={() => void handlePress(item.route)}
              >
                <View
                  className="h-[64px] items-center justify-center rounded-full px-2"
                  style={
                    active
                      ? { backgroundColor: isDark ? colors.primaryMuted : colors.primary }
                      : undefined
                  }
                >
                  <View className="items-center justify-center gap-1">
                    <Image
                      className="h-6 w-6"
                      resizeMode="contain"
                      source={active ? item.activeIcon : item.inactiveIcon}
                      style={!active ? { tintColor: isDark ? colors.textSecondary : '#1A3540' } : undefined}
                    />
                    <Text
                      className="font-poppinsMedium text-[11px]"
                      style={{
                        color: active
                          ? isDark
                            ? colors.textPrimary
                            : '#FEFEE5'
                          : isDark
                            ? colors.textSecondary
                            : colors.textMuted,
                      }}
                    >
                      {item.label}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

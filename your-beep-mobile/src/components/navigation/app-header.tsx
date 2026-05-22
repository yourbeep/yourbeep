import { Pressable, Text, View } from 'react-native';
import { Bell, ChevronLeft } from 'lucide-react-native';
import { useAppSelector } from '@/store/hooks';
import { useAppTheme } from '@/theme/use-app-theme';

interface AppHeaderProps {
  highlight?: string;
  onBackPress?: () => void;
  onNotificationPress?: () => void;
  subtitle: string;
  title: string;
  variant?: 'home' | 'section';
}

export function AppHeader({
  highlight,
  onBackPress,
  onNotificationPress,
  subtitle,
  title,
  variant = 'section',
}: AppHeaderProps) {
  const isHome = variant === 'home';
  const { colors, isDark } = useAppTheme();
  const unreadCount = useAppSelector((state) => state.notifications.unreadCount);

  return (
    <View
      className="-mx-[22px] overflow-hidden rounded-b-[32px] px-6 pb-5 pt-10"
      style={{ backgroundColor: colors.primary }}
    >
      {isHome ? (
        <View className="flex-row items-end justify-between gap-4">
          <View className="flex-1 gap-2">
            <Text
              className="font-poppinsRegular text-[20px] leading-[36px]"
              style={{ color: 'rgba(254,254,229,0.72)' }}
            >
              {title}
              {highlight ? (
                <Text className="font-poppinsSemi" style={{ color: colors.textInverse }}>
                  {' '}
                  {highlight}
                </Text>
              ) : null}
            </Text>

            <Text
              className="font-poppinsRegular text-[14px] leading-[24px]"
              style={{ color: 'rgba(254,254,229,0.7)' }}
            >
              {subtitle}
            </Text>
          </View>

          <View className="flex-row items-center gap-4">
            <Pressable
              className="h-[42px] w-[42px] items-center justify-center rounded-[14px] border"
              style={{
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderColor: 'rgba(255,255,255,0.08)',
              }}
              onPress={onNotificationPress}
            >
              <Bell color="#D4D9E7" size={23} strokeWidth={1.8} />
              {unreadCount > 0 ? (
                <View className="absolute right-[7px] top-[7px] h-2.5 w-2.5 rounded-full bg-[#E0B92D]" />
              ) : null}
            </Pressable>

            <View className="h-[42px] w-[42px] items-center justify-center rounded-[14px] border-2 border-[#C8F7F7] bg-[#F3CFAD]">
              <Text className="font-poppinsSemi text-[14px]" style={{ color: colors.primary }}>
                AJ
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View className="flex-row items-center gap-4">
          <Pressable
            className="h-[34px] w-[34px] items-center justify-center rounded-full"
            style={{ backgroundColor: isDark ? colors.surfaceStrong : colors.surface }}
            onPress={onBackPress}
          >
            <ChevronLeft
              color={isDark ? colors.textPrimary : colors.primary}
              size={20}
              strokeWidth={2.4}
            />
          </Pressable>

          <Text
            className="font-poppinsSemi text-[28px] leading-[34px]"
            style={{ color: colors.textInverse }}
          >
            {title}
          </Text>
        </View>
      )}
    </View>
  );
}

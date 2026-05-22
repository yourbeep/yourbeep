import { Text, View } from 'react-native';
import { useAppTheme } from '@/theme/use-app-theme';

interface NotificationCardProps {
  accent: string;
  icon: string;
  message: string;
  time: string;
  title: string;
}

export function NotificationCard({ accent, icon, message, time, title }: NotificationCardProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View
      className="rounded-[16px] border p-4"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.primaryBorder,
      }}
    >
      <View className="flex-row items-start gap-3">
        <View
          className="h-8 w-8 items-center justify-center rounded-full"
          style={{
            backgroundColor: isDark ? colors.surfaceStrong : colors.surfaceMuted,
            borderColor: `${accent}33`,
            borderWidth: 1,
          }}
        >
          <Text className="font-poppinsSemi text-[14px]" style={{ color: accent }}>
            {icon}
          </Text>
        </View>

        <View className="flex-1 gap-1">
          <View className="flex-row items-start justify-between gap-3">
            <Text
              className="flex-1 font-poppinsSemi text-[15px] leading-[20px]"
              style={{ color: colors.textPrimary }}
            >
              {title}
            </Text>
            <Text
              className="font-poppinsMedium text-[11px]"
              style={{ color: colors.textMuted }}
            >
              {time}
            </Text>
          </View>

          <Text
            className="font-poppinsRegular text-[14px] leading-[22px]"
            style={{ color: colors.textSecondary }}
          >
            {message}
          </Text>
        </View>
      </View>
    </View>
  );
}

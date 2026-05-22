import { Image, ImageSourcePropType, Text, View } from 'react-native';
import { useAppTheme } from '@/theme/use-app-theme';

interface MetricRowProps {
  change: string;
  icon: ImageSourcePropType;
  score: string;
  subtitle: string;
  title: string;
}

export function MetricRow({ change, icon, score, subtitle, title }: MetricRowProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View
      className="flex-row items-center gap-3 rounded-[18px] p-4"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-1 flex-row items-center gap-3">
        <View
          className="h-[42px] w-[42px] items-center justify-center rounded-full"
          style={{ backgroundColor: isDark ? colors.surfaceStrong : colors.surfaceMuted }}
        >
          <Image
            className="h-6 w-6"
            resizeMode="contain"
            source={icon}
            style={{ tintColor: isDark ? colors.textPrimary : colors.primary }}
          />
        </View>

        <View className="gap-1">
          <Text className="font-poppinsSemi text-base" style={{ color: colors.textPrimary }}>
            {title}
          </Text>
          <Text className="font-poppinsMedium text-[13px]" style={{ color: colors.textSecondary }}>
            {subtitle}
          </Text>
        </View>
      </View>

      <View className="items-end gap-1">
        <Text className="font-poppinsSemi text-base" style={{ color: colors.textPrimary }}>
          {score}
        </Text>
        <Text className="font-poppinsMedium text-[13px]" style={{ color: colors.success }}>
          {change}
        </Text>
      </View>
    </View>
  );
}

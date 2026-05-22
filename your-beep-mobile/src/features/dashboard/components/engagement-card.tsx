import { Image, ImageSourcePropType, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/theme/use-app-theme';

interface EngagementCardProps {
  caption: string;
  captionTone?: 'muted' | 'success';
  icon: ImageSourcePropType;
  indicator: ImageSourcePropType | string;
  subtitle: string;
  title: string;
}

export function EngagementCard({
  caption,
  captionTone = 'success',
  icon,
  indicator,
  subtitle,
  title,
}: EngagementCardProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View className="min-h-[120px] flex-1 overflow-hidden rounded-[18px]">
      <LinearGradient
        style={{ flex: 1, padding: 16 }}
        colors={
          isDark
            ? ['rgba(102, 215, 206, 0.12)', colors.surfaceStrong]
            : ['rgba(25, 74, 90, 0.14)', 'rgba(255, 255, 255, 0.84)']
        }
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      >
        <View className="flex-row items-center gap-3">
          <Image
            className="h-6 w-6"
            resizeMode="contain"
            source={icon}
            style={{ tintColor: isDark ? colors.textPrimary : colors.primary }}
          />
          <Text className="flex-1 font-poppinsMedium text-[13px]" style={{ color: colors.textSecondary }}>
            {subtitle}
          </Text>
        </View>
        <Text className="mt-2 font-poppinsSemi text-[28px]" style={{ color: colors.textPrimary }}>
          {title}
        </Text>
        <View className="mt-2 flex-row items-center gap-2">
          {typeof indicator === 'string' ? (
            <Text className="font-poppinsMedium text-[20px] leading-5" style={{ color: colors.textSecondary }}>
              {indicator}
            </Text>
          ) : (
            <Image
              className="h-5 w-5"
              resizeMode="contain"
              source={indicator}
              style={{ tintColor: isDark ? colors.textPrimary : colors.primary }}
            />
          )}
          <Text
            className="font-poppinsMedium text-[13px]"
            style={{ color: captionTone === 'muted' ? colors.textSecondary : colors.success }}
          >
            {caption}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/use-app-theme';

interface RootCauseCardProps {
  description: string;
  icon: string;
  onPress: () => void;
  selected?: boolean;
  title: string;
}

export function RootCauseCard({
  description,
  icon,
  onPress,
  selected = false,
  title,
}: RootCauseCardProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <Pressable
      className="rounded-[18px] border p-5"
      onPress={onPress}
      style={{
        backgroundColor: selected ? (isDark ? colors.accentSoft : '#E7FAF4') : colors.surface,
        borderColor: selected ? colors.accent : colors.primaryBorder,
      }}
    >
      <View className="flex-row items-start gap-4">
        <View
          className="h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(25,74,90,0.05)' }}
        >
          <Text className="font-poppinsSemi text-[16px]" style={{ color: colors.primary }}>
            {icon}
          </Text>
        </View>

        <View className="flex-1 gap-2">
          <Text className="font-poppinsSemi text-[16px] leading-[24px]" style={{ color: colors.textPrimary }}>
            {title}
          </Text>
          <Text className="font-poppinsRegular text-[14px] leading-[26px]" style={{ color: colors.textSecondary }}>
            {description}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

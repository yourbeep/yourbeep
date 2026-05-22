import { Pressable, Text, View, useWindowDimensions } from 'react-native';

import type { HeartStateOption } from '@/features/somatic/data/somatic-content';
import { useAppTheme } from '@/theme/use-app-theme';

interface HeartStateCardProps {
  onPress: () => void;
  option: HeartStateOption;
}

export function HeartStateCard({
  onPress,
  option,
}: HeartStateCardProps) {
  const { colors, isDark } = useAppTheme();
  const { width } = useWindowDimensions();
  const isCompact = width < 390;
  const toneStyle = {
    mist: { backgroundColor: isDark ? colors.surface : '#FFFEF7', borderColor: isDark ? colors.primaryBorder : '#E7E3D3' },
    sand: { backgroundColor: isDark ? colors.surface : '#FFF7EC', borderColor: isDark ? colors.primaryBorder : '#F4D9C2' },
    sky: { backgroundColor: isDark ? colors.surface : '#E5FAEC', borderColor: isDark ? colors.primaryBorder : '#BFE7D7' },
  }[option.tone];

  return (
    <Pressable
      className={`overflow-hidden rounded-[20px] border ${
        isCompact ? 'min-h-[126px] px-3 py-3' : 'min-h-[149px] px-4 py-4'
      }`}
      onPress={onPress}
      style={toneStyle}
    >
      <View
        className={`items-center justify-center rounded-full self-center ${
          isCompact ? 'mb-3 h-[38px] w-[38px]' : 'mb-4 h-[46px] w-[46px]'
        }`}
        style={{ backgroundColor: option.accent }}
      >
        <Text className={`${isCompact ? 'text-[16px]' : 'text-[20px]'} font-poppinsSemi`} style={{ color: colors.primary }}>
          {option.icon}
        </Text>
      </View>

      <View className="flex-1 items-center gap-1">
        <Text
          className={`text-center font-poppinsSemi ${
            isCompact ? 'text-[14px] leading-[20px]' : 'text-[16px] leading-[24px]'
          }`}
          style={{ color: colors.textPrimary }}
        >
          {option.title}
        </Text>
        <Text
          className={`text-center font-poppinsRegular ${
            isCompact ? 'text-[12px] leading-[18px]' : 'text-[13px] leading-[22px]'
          }`}
          style={{ color: colors.textSecondary }}
        >
          {option.description}
        </Text>
      </View>
    </Pressable>
  );
}

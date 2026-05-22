import { Text, View } from 'react-native';
import { useAppTheme } from '@/theme/use-app-theme';

export function ProtocolCard() {
  const { colors, isDark } = useAppTheme();

  return (
    <View className="flex-row gap-3 h-[100px]">
      <View className="relative w-[14px] items-center py-3">
        <View className="h-full w-[3px] rounded-full" style={{ backgroundColor: colors.accent }} />
        <View
          className="absolute left-[-0px] top-10 h-4 w-4 rounded-full border-4"
          style={{ backgroundColor: colors.accent, borderColor: colors.background }}
        />
      </View>

      <View
        className="flex-1 gap-4 rounded-[18px] border p-4"
        style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
      >
        <View className="flex-row gap-3">
          <Text className="flex-1 text-[18px] font-extrabold" style={{ color: colors.textPrimary }}>
            Morning Awareness Reset
          </Text>
          <Text className="text-base font-extrabold" style={{ color: colors.textPrimary }}>
            08:00 AM
          </Text>
        </View>

        <View className="flex-row gap-2">
          <View
            className="rounded-full px-3 py-1"
            style={{ backgroundColor: isDark ? colors.accentSoft : colors.primarySoft }}
          >
            <Text className="text-[12px] font-extrabold" style={{ color: isDark ? colors.accent : colors.primary }}>
              VAGAL TONE
            </Text>
          </View>
          <View
            className="rounded-full px-3 py-1"
            style={{ backgroundColor: isDark ? colors.surfaceStrong : colors.surfaceMuted }}
          >
            <Text className="text-[12px] font-bold" style={{ color: colors.textSecondary }}>
              15 MIN
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

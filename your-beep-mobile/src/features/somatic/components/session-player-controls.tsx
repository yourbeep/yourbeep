import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/use-app-theme';

interface SessionPlayerControlsProps {
  durationLabel: string;
  onBackTen?: () => void;
  onForwardTen?: () => void;
  onPauseToggle?: () => void;
  paused?: boolean;
  progress?: number;
}

export function SessionPlayerControls({
  durationLabel,
  onBackTen,
  onForwardTen,
  onPauseToggle,
  paused = false,
  progress = 0.25,
}: SessionPlayerControlsProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View
      className="rounded-[18px] border p-4"
      style={{
        backgroundColor: isDark ? 'rgba(19,36,42,0.72)' : 'rgba(255,255,255,0.42)',
        borderColor: colors.primaryBorder,
      }}
    >
      <Text className="text-center font-poppinsSemi text-[18px]" style={{ color: colors.textPrimary }}>
        {durationLabel}
      </Text>

      <View className="mt-5 h-[3px] rounded-full" style={{ backgroundColor: isDark ? colors.surfaceStrong : '#E7E5DB' }}>
        <View
          className="h-[3px] rounded-full"
          style={{ backgroundColor: colors.accent, width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
        />
      </View>

      <View className="mt-5 flex-row items-center justify-center gap-8">
        <Pressable
          className="h-12 w-12 items-center justify-center rounded-full"
          onPress={onBackTen}
          style={{ backgroundColor: colors.surface }}
        >
          <Text className="font-poppinsSemi text-[12px]" style={{ color: colors.textSecondary }}>10</Text>
        </Pressable>

        <Pressable
          className="h-14 w-14 items-center justify-center rounded-full"
          onPress={onPauseToggle}
          style={{ backgroundColor: isDark ? colors.textPrimary : '#000000' }}
        >
          <Text className="font-poppinsSemi text-[18px]" style={{ color: isDark ? colors.primary : '#FFFFFF' }}>
            {paused ? '▶' : '❚❚'}
          </Text>
        </Pressable>

        <Pressable
          className="h-12 w-12 items-center justify-center rounded-full"
          onPress={onForwardTen}
          style={{ backgroundColor: colors.surface }}
        >
          <Text className="font-poppinsSemi text-[12px]" style={{ color: colors.textSecondary }}>10</Text>
        </Pressable>
      </View>
    </View>
  );
}

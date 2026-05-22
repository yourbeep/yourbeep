import { Pressable, Text } from 'react-native';
import { useAppTheme } from '@/theme/use-app-theme';

interface FilterChipProps {
  active?: boolean;
  label: string;
  onPress?: () => void;
}

export function FilterChip({ active = false, label, onPress }: FilterChipProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <Pressable
      className="min-h-[34px] items-center justify-center rounded-full border px-4"
      onPress={onPress}
      style={{
        backgroundColor: active ? colors.accent : colors.surface,
        borderColor: active ? colors.accent : colors.primaryBorder,
      }}
    >
      <Text
        className="font-poppinsMedium text-[12px]"
        style={{ color: active ? (isDark ? '#0C181D' : colors.primary) : colors.textSecondary }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

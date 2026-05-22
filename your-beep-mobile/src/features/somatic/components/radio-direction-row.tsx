import { Pressable, Text, View } from 'react-native';
import { useAppTheme } from '@/theme/use-app-theme';

interface RadioDirectionRowProps {
  label: string;
  onPress: () => void;
  selected?: boolean;
}

export function RadioDirectionRow({
  label,
  onPress,
  selected = false,
}: RadioDirectionRowProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <Pressable
      className="flex-row items-center justify-between rounded-[14px] border px-4 py-4"
      onPress={onPress}
      style={{ backgroundColor: colors.surface, borderColor: isDark ? colors.primaryBorder : '#EAE5D8' }}
    >
      <Text className="font-poppinsMedium text-[16px]" style={{ color: colors.textPrimary }}>{label}</Text>
      <View
        className="h-6 w-6 rounded-full border"
        style={{
          backgroundColor: selected ? colors.accentSoft : 'transparent',
          borderColor: selected ? colors.primary : isDark ? colors.primaryBorder : '#CACCD4',
        }}
      />
    </Pressable>
  );
}

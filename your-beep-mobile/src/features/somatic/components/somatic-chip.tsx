import { Text, View } from 'react-native';
import { useAppTheme } from '@/theme/use-app-theme';

interface SomaticChipProps {
  label: string;
}

export function SomaticChip({ label }: SomaticChipProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View
      className="self-start rounded-full border px-3 py-1"
      style={{
        backgroundColor: isDark ? colors.surface : '#F4FFF9',
        borderColor: isDark ? 'rgba(255,255,255,0.14)' : '#BCEBDD',
      }}
    >
      <Text
        className="font-poppinsSemi text-[10px] uppercase tracking-[0.8px]"
        style={{ color: isDark ? colors.textPrimary : '#1A7769' }}
      >
        {label}
      </Text>
    </View>
  );
}

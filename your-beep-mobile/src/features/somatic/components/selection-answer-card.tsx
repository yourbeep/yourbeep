import { Pressable, Text, View } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';

import { useAppTheme } from '@/theme/use-app-theme';

interface SelectionAnswerCardProps {
  description?: string;
  onPress: () => void;
  selected?: boolean;
  title: string;
}

export function SelectionAnswerCard({
  description,
  onPress,
  selected = false,
  title,
}: SelectionAnswerCardProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <Pressable
      className="rounded-[16px] border p-5"
      onPress={onPress}
      style={{
        backgroundColor: colors.surface,
        borderColor: selected ? colors.accent : isDark ? colors.primaryBorder : '#E8E5D8',
      }}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="font-poppinsSemi text-[17px]" style={{ color: colors.textPrimary }}>
            {title}
          </Text>
          {description ? (
            <Text className="mt-1 font-poppinsRegular text-[13px] leading-[19px]" style={{ color: colors.textSecondary }}>
              {description}
            </Text>
          ) : null}
        </View>

        <CheckCircle2
          color={selected ? colors.primary : colors.textMuted}
          fill={selected ? colors.accentSoft : 'transparent'}
          size={22}
          strokeWidth={2}
        />
      </View>
    </Pressable>
  );
}

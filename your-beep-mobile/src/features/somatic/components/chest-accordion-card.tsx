import { Pressable, Text, View } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useAppTheme } from '@/theme/use-app-theme';

interface ChestAccordionCardProps {
  description: string;
  expanded: boolean;
  onPress: () => void;
  title: string;
}

export function ChestAccordionCard({
  description,
  expanded,
  onPress,
  title,
}: ChestAccordionCardProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View
      className="rounded-[18px] border"
      style={{ backgroundColor: colors.surface, borderColor: isDark ? colors.primaryBorder : '#ECE6D6' }}
    >
      <Pressable className="flex-row items-center justify-between px-5 py-5" onPress={onPress}>
        <Text className="font-poppinsSemi text-[16px]" style={{ color: colors.primary }}>{title}</Text>
        {expanded ? (
          <ChevronUp color={colors.primary} size={20} strokeWidth={2.3} />
        ) : (
          <ChevronDown color={colors.primary} size={20} strokeWidth={2.3} />
        )}
      </Pressable>
      {expanded ? (
        <View className="px-5 pb-5 pt-3" style={{ borderTopWidth: 1, borderTopColor: isDark ? colors.primaryBorder : '#F1EDDF' }}>
          <Text className="font-poppinsRegular text-[14px] leading-[24px]" style={{ color: colors.textSecondary }}>
            {description}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

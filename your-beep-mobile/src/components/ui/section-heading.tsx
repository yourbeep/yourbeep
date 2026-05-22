import { Text, View } from 'react-native';
import { useAppTheme } from '@/theme/use-app-theme';

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
}

export function SectionHeading({ subtitle, title }: SectionHeadingProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View className="gap-2">
      <Text
        className="font-poppinsSemi text-[20px] leading-9"
        style={{ color: isDark ? colors.textPrimary : colors.primary }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          className="font-poppinsRegular text-base leading-7"
          style={{ color: colors.textSecondary }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

import { Text, View } from 'react-native';

import { useAppTheme } from '@/theme/use-app-theme';

interface AwarenessScreenIntroProps {
  description: string;
  title: string;
}

export function AwarenessScreenIntro({ description, title }: AwarenessScreenIntroProps) {
  const { colors } = useAppTheme();

  return (
    <View className="gap-3 px-1">
      <Text className="font-poppinsSemi text-[32px] leading-[42px]" style={{ color: colors.textPrimary }}>
        {title}
      </Text>
      <Text className="font-poppinsRegular text-[15px] leading-[30px]" style={{ color: colors.textSecondary }}>
        {description}
      </Text>
    </View>
  );
}

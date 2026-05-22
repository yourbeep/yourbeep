import { Image, ImageSourcePropType, Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/use-app-theme';

interface StomachSignalCardProps {
  onPress: () => void;
  selected: boolean;
  source: ImageSourcePropType;
  title: string;
}

export function StomachSignalCard({
  onPress,
  selected,
  source,
  title,
}: StomachSignalCardProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <Pressable
      className="overflow-hidden rounded-[20px] border"
      onPress={onPress}
      style={{
        backgroundColor: colors.surface,
        borderColor: selected ? colors.primary : isDark ? colors.primaryBorder : '#E5E0D3',
      }}
    >
      <Image className="h-[108px] w-full" resizeMode="cover" source={source} />
      <View className="px-4 py-4">
        <Text className="font-poppinsMedium text-[17px]" style={{ color: colors.textPrimary }}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

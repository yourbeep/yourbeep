import { Image, ImageSourcePropType, Pressable, Text, View } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAppTheme } from '@/theme/use-app-theme';

interface StomachStateCardProps {
  onPress: () => void;
  source?: ImageSourcePropType | null;
  title: string;
  wide?: boolean;
}

export function StomachStateCard({
  onPress,
  source,
  title,
  wide = false,
}: StomachStateCardProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <Pressable
      className={`overflow-hidden rounded-[24px] border ${wide ? '' : 'min-h-[178px]'}`}
      onPress={onPress}
      style={{ backgroundColor: colors.surface, borderColor: isDark ? colors.primaryBorder : '#E5DCC7' }}
    >
      {source ? (
        <Image className={`${wide ? 'h-[118px]' : 'h-[120px]'} w-full`} resizeMode="cover" source={source} />
      ) : (
        <LinearGradient
          className="h-[118px] w-full"
          colors={['#FFF3DD', '#FFD39B', '#FFEFD9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}

      <View className="flex-row items-center justify-between px-5 py-4">
        <Text className="font-poppinsMedium text-[18px]" style={{ color: colors.textPrimary }}>
          {title}
        </Text>
        {wide ? <ArrowRight color={colors.textMuted} size={18} strokeWidth={2.2} /> : null}
      </View>
    </Pressable>
  );
}

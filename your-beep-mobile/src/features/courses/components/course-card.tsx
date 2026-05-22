import { Image, ImageSourcePropType, Pressable, Text, View } from 'react-native';
import { useAppTheme } from '@/theme/use-app-theme';

interface CourseCardProps {
  description: string;
  heightClassName?: string;
  iconLabel?: string;
  imageClassName?: string;
  imageSource?: ImageSourcePropType;
  onPress?: () => void;
  roundedClassName?: string;
  title: string;
  tone: 'cool' | 'warm' | 'warmStrong';
  widthClassName?: string;
}

export function CourseCard({
  description,
  heightClassName,
  iconLabel,
  imageClassName,
  imageSource,
  onPress,
  roundedClassName,
  title,
  tone,
  widthClassName,
}: CourseCardProps) {
  const { colors, isDark } = useAppTheme();
  const toneStyle =
    tone === 'warm'
      ? {
          backgroundColor: isDark ? '#1F2A2E' : '#FFF6E7',
          borderColor: isDark ? 'rgba(255, 223, 160, 0.16)' : '#F1E8D4',
        }
      : tone === 'warmStrong'
        ? {
            backgroundColor: isDark ? '#2A2620' : '#F7E1C7',
            borderColor: isDark ? 'rgba(235, 205, 170, 0.2)' : '#EBCDAA',
          }
        : {
            backgroundColor: isDark ? '#1B2A25' : '#E7F7E5',
            borderColor: isDark ? 'rgba(122, 227, 181, 0.18)' : '#CDE9D8',
          };

  const content = (
    <>
      {imageSource ? (
        <Image
          className={imageClassName ?? 'h-[56px] w-[56px]'}
          resizeMode="contain"
          source={imageSource}
        />
      ) : (
        <View className="h-12 w-12 items-center justify-center rounded-full bg-[#F6D365]">
          <Text className="font-poppinsSemi text-[13px]" style={{ color: colors.primary }}>
            {iconLabel}
          </Text>
        </View>
      )}

      <View className="mt-5 gap-2">
        <Text className="font-poppinsSemi text-[14px]" style={{ color: colors.textPrimary }}>
          {title}
        </Text>
        <Text className="font-poppinsRegular text-[11px]" style={{ color: colors.textSecondary }}>
          {description}
        </Text>
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        className={`border p-5 ${roundedClassName ?? 'rounded-[30px]'} ${
          heightClassName ?? 'min-h-[176px]'
        } ${widthClassName ?? 'flex-1'}`}
        onPress={onPress}
        style={toneStyle}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      className={`border p-5 ${roundedClassName ?? 'rounded-[30px]'} ${
        heightClassName ?? 'min-h-[176px]'
      } ${widthClassName ?? 'flex-1'}`}
      style={toneStyle}
    >
      {content}
    </View>
  );
}

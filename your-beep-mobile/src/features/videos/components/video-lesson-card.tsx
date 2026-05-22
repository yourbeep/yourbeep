import { ImageBackground, ImageSourcePropType, Pressable, Text, View } from 'react-native';
import { EllipsisVertical, Play } from 'lucide-react-native';

import { ProgressBar } from '@/components/ui/progress-bar';
import { useAppTheme } from '@/theme/use-app-theme';

interface VideoLessonCardProps {
  duration: string;
  onPress?: () => void;
  progress: number;
  source: ImageSourcePropType;
  tag: string;
  title: string;
}

export function VideoLessonCard({
  duration,
  onPress,
  progress,
  source,
  tag,
  title,
}: VideoLessonCardProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open lesson ${title}`}
      className="rounded-[18px] border p-3"
      onPress={onPress}
      style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
    >
      <View className="flex-row gap-3">
        <ImageBackground
          className="h-[76px] w-[98px] overflow-hidden rounded-[12px]"
          imageStyle={{ borderRadius: 12 }}
          resizeMode="cover"
          source={source}
        >
          <View className="flex-1 justify-between p-2">
            <View className="h-6 w-6 items-center justify-center rounded-full bg-[rgba(0,0,0,0.34)]">
              <Play color="#FEFEE5" fill="#FEFEE5" size={12} strokeWidth={1.4} />
            </View>

            <View className="self-end rounded-md bg-[rgba(0,0,0,0.56)] px-1.5 py-0.5">
              <Text className="font-poppinsMedium text-[9px] text-brand-textInverse">
                {duration}
              </Text>
            </View>
          </View>
        </ImageBackground>

        <View className="flex-1 gap-2">
          <View className="flex-row items-start justify-between gap-2">
            <View className="flex-1 gap-2">
              <View className="self-start rounded-full bg-brand-accentSoft px-2 py-1">
                <Text
                  className="font-poppinsMedium text-[10px]"
                  style={{ color: isDark ? colors.accent : colors.primary }}
                >
                  {tag}
                </Text>
              </View>
              <Text className="font-poppinsMedium text-[15px] leading-[22px]" style={{ color: colors.textPrimary }}>
                {title}
              </Text>
            </View>

            <EllipsisVertical color={colors.textSecondary} size={18} strokeWidth={1.8} />
          </View>

          <View className="gap-1">
            <Text className="font-poppinsRegular text-[11px]" style={{ color: colors.textSecondary }}>
              {progress}%
            </Text>
            <ProgressBar progress={progress} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

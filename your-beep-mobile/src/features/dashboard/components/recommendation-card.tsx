import { ImageBackground, ImageSourcePropType, Pressable, Text, View } from 'react-native';

interface RecommendationCardProps {
  duration: string;
  onPress?: () => void;
  source: ImageSourcePropType;
  title: string;
}

export function RecommendationCard({ duration, onPress, source, title }: RecommendationCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open video ${title}`}
      className="w-[272px]"
      onPress={onPress}
    >
      {({ pressed }) => (
        <View
          className={`overflow-hidden rounded-[24px] border border-[rgba(25,74,90,0.08)] bg-brand-surface shadow-[0_14px_28px_rgba(25,74,90,0.12)] ${
            pressed ? 'opacity-95' : 'opacity-100'
          }`}
        >
          <ImageBackground
            className="h-[172px] justify-between"
            imageStyle={{ borderRadius: 24 }}
            resizeMode="cover"
            source={source}
          >
            <View className="flex-1 items-center justify-center bg-[rgba(0,0,0,0.18)]">
              <View className="h-[74px] w-[74px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.24)] bg-[rgba(37,37,40,0.72)]">
                <Text className="ml-1 font-poppinsSemi text-[34px] leading-[38px] text-brand-textInverse">
                  ▶
                </Text>
              </View>
            </View>

            <View className="absolute bottom-4 right-4 rounded-full bg-[rgba(0,0,0,0.64)] px-3 py-1.5">
              <Text className="font-poppinsSemi text-[12px] tracking-[0.6px] text-brand-textInverse">
                {duration}
              </Text>
            </View>
          </ImageBackground>
        </View>
      )}
    </Pressable>
  );
}

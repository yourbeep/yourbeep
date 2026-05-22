import { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { appImages } from '@/constants/images';
import { useAppTheme } from '@/theme/use-app-theme';

const AnimatedView = Animated.createAnimatedComponent(View);

interface SafetyCueOrbProps {
  active: boolean;
  secondsLabel: string;
}

export function SafetyCueOrb({ active, secondsLabel }: SafetyCueOrbProps) {
  const { colors, isDark } = useAppTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = active
      ? withRepeat(
          withSequence(
            withTiming(1.08, {
              duration: 1800,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(1, {
              duration: 1800,
              easing: Easing.inOut(Easing.ease),
            }),
          ),
          -1,
          false,
        )
      : withTiming(1, { duration: 220 });
  }, [active, scale]);

  const outerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.94 + (scale.value - 1) * 0.65 }],
  }));

  return (
    <View className="items-center justify-center py-6">
      <AnimatedView
        className="h-[252px] w-[252px] items-center justify-center rounded-full border-[3px]"
        style={[outerStyle, { borderColor: colors.primary }]}
      >
        <AnimatedView
          className="h-[196px] w-[196px] items-center justify-center rounded-full border"
          style={[
            innerStyle,
            {
              backgroundColor: isDark ? 'rgba(86,212,202,0.12)' : 'rgba(128,242,223,0.16)',
              borderColor: isDark ? 'rgba(86,212,202,0.40)' : '#9CE6DD',
            },
          ]}
        >
          <View
            className="h-[132px] w-[132px] items-center justify-center rounded-full"
            style={{ backgroundColor: isDark ? 'rgba(245,245,232,0.06)' : 'rgba(15,40,50,0.08)' }}
          >
            <Image className="h-[110px] w-[110px] rounded-full" resizeMode="cover" source={appImages.SafetyCue} />
            <View className="absolute inset-0 items-center justify-center">
              <Text className="font-poppinsSemi text-[34px]" style={{ color: colors.textPrimary }}>
                {secondsLabel}
              </Text>
            </View>
          </View>
        </AnimatedView>
      </AnimatedView>
    </View>
  );
}

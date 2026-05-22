import { useEffect } from 'react';
import { Image, ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);

interface FloatingImageProps {
  source: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
}

export function FloatingImage({ source, style }: FloatingImageProps) {
  const drift = useSharedValue(0);

  useEffect(() => {
    drift.value = withRepeat(
      withTiming(1, {
        duration: 3400,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );
  }, [drift]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: drift.value * -8,
      },
      {
        scale: 1 + drift.value * 0.01,
      },
    ],
  }));

  return <AnimatedImage resizeMode="contain" source={source} style={[style, animatedStyle]} />;
}

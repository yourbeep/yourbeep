import { PropsWithChildren, useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedRevealProps extends PropsWithChildren {
  axis?: 'x' | 'y';
  delay?: number;
  distance?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export function AnimatedReveal({
  axis = 'y',
  children,
  delay = 0,
  distance = 18,
  duration = 650,
  style,
}: AnimatedRevealProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [delay, duration, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      axis === 'x'
        ? {
            translateX: interpolate(progress.value, [0, 1], [distance, 0]),
          }
        : {
            translateY: interpolate(progress.value, [0, 1], [distance, 0]),
          },
      {
        scale: interpolate(progress.value, [0, 1], [0.98, 1]),
      },
    ],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

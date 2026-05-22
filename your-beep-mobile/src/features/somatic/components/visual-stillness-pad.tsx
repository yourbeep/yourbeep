import { useEffect, useRef } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useAppTheme } from '@/theme/use-app-theme';

interface VisualStillnessPadProps {
  onPositionChange: (position: { x: number; y: number }) => void;
}

export function VisualStillnessPad({ onPositionChange }: VisualStillnessPadProps) {
  const { colors, isDark } = useAppTheme();
  const latestOnPositionChange = useRef(onPositionChange);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const boundsX = useSharedValue(42);
  const boundsY = useSharedValue(18);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  useEffect(() => {
    latestOnPositionChange.current = onPositionChange;
  }, [onPositionChange]);

  useEffect(() => {
    latestOnPositionChange.current({ x: 0, y: 0 });
  }, []);

  const gesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = Math.max(-boundsX.value, Math.min(boundsX.value, startX.value + event.translationX));
      translateY.value = Math.max(-boundsY.value, Math.min(boundsY.value, startY.value + event.translationY));
    })
    .onEnd(() => {
      latestOnPositionChange.current({
        x: Number(translateX.value.toFixed(1)),
        y: Number(translateY.value.toFixed(1)),
      });
    });

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    boundsX.value = Math.max(20, width / 2 - 18);
    boundsY.value = Math.max(12, height / 2 - 18);
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
  };

  return (
    <GestureDetector gesture={gesture}>
      <View className="h-[76px] items-center justify-center" onLayout={handleLayout}>
        <View className="absolute h-[1px] w-full" style={{ backgroundColor: isDark ? colors.primaryBorder : '#D0D5D8' }} />
        <View className="absolute h-full w-[1px]" style={{ backgroundColor: isDark ? colors.primaryBorder : '#D0D5D8' }} />
        <Animated.View
          className="h-4 w-4 rounded-full border-2 border-[#2CA4B2] bg-[#0E6B75]"
          style={dotStyle}
        />
      </View>
    </GestureDetector>
  );
}

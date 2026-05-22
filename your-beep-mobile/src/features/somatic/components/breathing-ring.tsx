import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useAppTheme } from '@/theme/use-app-theme';

interface BreathingRingProps {
  active: boolean;
  centerLabel: string;
  mode?: 'pulse' | 'expand';
}

export function BreathingRing({
  active,
  centerLabel,
  mode = 'pulse',
}: BreathingRingProps) {
  const { colors, isDark } = useAppTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = active
      ? withRepeat(
          withSequence(
            withTiming(mode === 'expand' ? 1.18 : 1.08, {
              duration: 1600,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(1, {
              duration: 1600,
              easing: Easing.inOut(Easing.ease),
            }),
          ),
          -1,
          false,
        )
      : withTiming(1, { duration: 200 });
  }, [active, mode, scale]);

  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="items-center justify-center py-3">
      <View
        className="h-[242px] w-[242px] items-center justify-center rounded-full border"
        style={{
          backgroundColor: isDark ? 'rgba(208,245,222,0.10)' : 'rgba(208,245,222,0.18)',
          borderColor: isDark ? 'rgba(216,240,225,0.75)' : '#D8F0E1',
        }}
      >
        <View
          className="h-[186px] w-[186px] items-center justify-center rounded-full"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.62)' : 'rgba(255,255,255,0.55)' }}
        >
          <Animated.View
            className="h-[104px] w-[104px] items-center justify-center rounded-full bg-[#2FB5B2]"
            style={innerStyle}
          >
            <Text className="font-poppinsSemi text-[18px] tracking-[1.2px]" style={{ color: '#12313B' }}>
              {centerLabel}
            </Text>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

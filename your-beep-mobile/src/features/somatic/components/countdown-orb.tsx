import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useAppTheme } from '@/theme/use-app-theme';

interface CountdownOrbProps {
  active?: boolean;
  caption?: string;
  seconds: number;
}

const AnimatedView = Animated.createAnimatedComponent(View);

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');

  return `${minutes}:${seconds}`;
}

export function CountdownOrb({ active = false, caption = 'Duration', seconds }: CountdownOrbProps) {
  const { colors, isDark } = useAppTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = active
      ? withRepeat(
          withTiming(1.06, {
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true,
        )
      : withTiming(1, {
          duration: 200,
        });
  }, [active, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="items-center justify-center py-3">
      <View
        className="h-[228px] w-[228px] items-center justify-center rounded-full border"
        style={{
          backgroundColor: isDark ? 'rgba(19,36,42,0.46)' : 'rgba(255,255,255,0.48)',
          borderColor: isDark ? 'rgba(86,212,202,0.22)' : '#D1E9E1',
        }}
      >
        <View
          className="h-[180px] w-[180px] items-center justify-center rounded-full border"
          style={{
            backgroundColor: isDark ? 'rgba(19,36,42,0.72)' : 'rgba(255,255,255,0.58)',
            borderColor: isDark ? 'rgba(245,245,232,0.08)' : 'rgba(25,74,90,0.06)',
          }}
        >
          <AnimatedView
            className="h-[112px] w-[112px] items-center justify-center rounded-full"
            style={[animatedStyle, { backgroundColor: colors.surface }]}
          >
            <Text className="font-poppinsSemi text-[30px]" style={{ color: colors.textPrimary }}>
              {formatTime(seconds)}
            </Text>
            <Text className="mt-1 font-poppinsMedium text-[10px] uppercase tracking-[1px]" style={{ color: colors.textMuted }}>
              {caption}
            </Text>
          </AnimatedView>
        </View>
      </View>
    </View>
  );
}

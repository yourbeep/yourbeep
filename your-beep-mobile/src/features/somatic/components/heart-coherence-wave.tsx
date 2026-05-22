import { useEffect, useState } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useAppTheme } from '@/theme/use-app-theme';

interface HeartCoherenceWaveProps {
  active: boolean;
  prompt: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function HeartCoherenceWave({ active, prompt }: HeartCoherenceWaveProps) {
  const { colors, isDark } = useAppTheme();
  const [width, setWidth] = useState(320);
  const travel = useSharedValue(0);

  useEffect(() => {
    let cancelled = false;

    const runLoop = async () => {
      while (!cancelled && active) {
        travel.value = withTiming(0, { duration: 120 });
        await new Promise((resolve) => setTimeout(resolve, 120));
        if (cancelled || !active) break;

        travel.value = withTiming(1, {
          duration: 4800,
          easing: Easing.inOut(Easing.ease),
        });
        await new Promise((resolve) => setTimeout(resolve, 4800));
      }
    };

    if (active) {
      void runLoop();
    } else {
      travel.value = withTiming(0, { duration: 200 });
    }

    return () => {
      cancelled = true;
    };
  }, [active, travel]);

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    setWidth(nativeEvent.layout.width);
  };

  const orbStyle = useAnimatedStyle(() => {
    const x = interpolate(travel.value, [0, 0.5, 1], [width * 0.16, width * 0.5, width * 0.84]);
    const y = interpolate(travel.value, [0, 0.5, 1], [44, 164, 44]);
    const scale = interpolate(travel.value, [0, 0.5, 1], [1.28, 0.56, 1.28]);

    return {
      transform: [{ translateX: x - 26 }, { translateY: y - 26 }, { scale }],
    };
  });

  const pathD = `M 0 132 C ${width * 0.12} 48, ${width * 0.26} 30, ${width * 0.48} 168 S ${
    width * 0.78
  } 48, ${width} 132`;

  return (
    <View className="items-center">
      <View className="relative h-[250px] w-full" onLayout={handleLayout}>
        <Svg className="absolute inset-0" height="250" width={width}>
          <Path d={pathD} fill="none" stroke={isDark ? colors.textPrimary : '#050505'} strokeWidth={7} />
        </Svg>

        <AnimatedView
          className="absolute h-[52px] w-[52px] rounded-full bg-[#3A95BE]"
          style={orbStyle}
        />
      </View>

      <Text className="mt-3 text-center font-poppinsRegular text-[17px] leading-[32px]" style={{ color: colors.textSecondary }}>
        {prompt}
      </Text>
    </View>
  );
}

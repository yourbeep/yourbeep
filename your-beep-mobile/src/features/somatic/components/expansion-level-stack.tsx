import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { heartExpansionLevels } from '@/features/somatic/data/somatic-content';
import { useAppTheme } from '@/theme/use-app-theme';

interface ExpansionLevelStackProps {
  levelSeconds?: readonly number[];
}

const TOTAL_LEVELS = heartExpansionLevels.length;
const AnimatedView = Animated.createAnimatedComponent(View);
const STACK_HEIGHT = 350;
const STACK_WIDTH = 60;
const STACK_PADDING = 6;
const ORB_SIZE = 50;
const TRACK_HEIGHT = STACK_HEIGHT - STACK_PADDING * 2;
const LEVEL_HEIGHT = TRACK_HEIGHT / TOTAL_LEVELS;

export function ExpansionLevelStack({
  levelSeconds = [5, 7, 10],
}: ExpansionLevelStackProps) {
  const { colors, isDark } = useAppTheme();
  const labels = useMemo(() => heartExpansionLevels.slice().reverse(), []);
  const orbOffsets = useMemo(
    () =>
      Array.from({ length: TOTAL_LEVELS }, (_, index) => {
        const levelTop = STACK_PADDING + (TOTAL_LEVELS - index - 1) * LEVEL_HEIGHT;
        return levelTop + (LEVEL_HEIGHT - ORB_SIZE) / 2;
      }),
    [],
  );
  const [activeLevel, setActiveLevel] = useState(0);
  const translateY = useSharedValue(orbOffsets[0]);

  useEffect(() => {
    setActiveLevel(0);
    translateY.value = orbOffsets[0];

    const animation = withRepeat(
      withSequence(
        ...orbOffsets.flatMap((offset, index) => [
          withTiming(offset - (LEVEL_HEIGHT - ORB_SIZE) / 2, {
            duration: levelSeconds[index] * 1000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(offset + (LEVEL_HEIGHT - ORB_SIZE) / 2, {
            duration: levelSeconds[index] * 1000,
            easing: Easing.inOut(Easing.ease),
          }),
        ]),
      ),
      -1,
      false,
    );

    translateY.value = animation;

    const timers = levelSeconds.map((seconds, index) =>
      setInterval(() => {
        setActiveLevel(index);
      }, levelSeconds.slice(0, index + 1).reduce((sum, value) => sum + value * 2000, 0)),
    );

    return () => {
      cancelAnimation(translateY);
      timers.forEach(clearInterval);
    };
  }, [levelSeconds, orbOffsets, translateY]);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View className="flex-row items-center justify-center gap-5 self-center">
      <View
        className="relative items-center justify-center overflow-hidden rounded-[42px]"
        style={{
          backgroundColor: isDark ? colors.surfaceMuted : '#C7EFEC',
          height: STACK_HEIGHT,
          width: STACK_WIDTH,
        }}
      >
        <View
          className="absolute inset-x-0 bottom-0"
          style={{ backgroundColor: '#49B9DE', height: LEVEL_HEIGHT + STACK_PADDING }}
        />
        <View
          className="absolute inset-x-0"
          style={{ backgroundColor: '#73CCE5', bottom: LEVEL_HEIGHT - STACK_PADDING, height: LEVEL_HEIGHT }}
        />
        <View
          className="absolute inset-x-0 top-0"
          style={{ backgroundColor: '#BFE9E6', height: LEVEL_HEIGHT + STACK_PADDING }}
        />
        {Array.from({ length: TOTAL_LEVELS }).map((_, index) => {
          const levelTop = STACK_PADDING + index * LEVEL_HEIGHT;
          return (
            <View
              className="absolute rounded-full bg-[rgba(112,205,230,0.22)]"
              key={index}
              style={{
                height: ORB_SIZE - 8,
                left: STACK_WIDTH / 2,
                marginLeft: -(ORB_SIZE - 8) / 2,
                top: levelTop + (LEVEL_HEIGHT - (ORB_SIZE - 8)) / 2,
                width: ORB_SIZE - 8,
              }}
            />
          );
        })}
        <AnimatedView
          className="absolute rounded-full"
          style={[
            orbStyle,
            {
              backgroundColor: isDark ? colors.primary : '#25596D',
              height: ORB_SIZE,
              left: STACK_WIDTH / 2,
              marginLeft: -ORB_SIZE / 2,
              width: ORB_SIZE,
            },
          ]}
        />
      </View>

      <View className="justify-between" style={{ height: STACK_HEIGHT - 48 }}>
        {labels.map((level, index) => (
          <View className="justify-center" key={level} style={{ height: LEVEL_HEIGHT }}>
            <Text
              className="font-poppinsSemi text-[17px]"
              style={{ color: activeLevel === TOTAL_LEVELS - index - 1 ? colors.primary : colors.textPrimary }}
            >
              {level}
            </Text>
            <Text className="font-poppinsRegular text-[12px]" style={{ color: colors.textSecondary }}>
              {levelSeconds[TOTAL_LEVELS - index - 1]}s up • {levelSeconds[TOTAL_LEVELS - index - 1]}s down
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

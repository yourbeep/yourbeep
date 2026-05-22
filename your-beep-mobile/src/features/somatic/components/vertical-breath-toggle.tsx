import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useAppTheme } from '@/theme/use-app-theme';

interface VerticalBreathToggleProps {
  active: boolean;
  phases?: readonly {
    color: string;
    label: string;
  }[];
  phaseIndex: number;
}

const defaultPhases = [
  { color: '#52C2E7', label: 'Breathe Out' },
  { color: '#80D5EB', label: 'Hold' },
  { color: '#C6EFEC', label: 'Breath In' },
] as const;

export function VerticalBreathToggle({
  active,
  phases = defaultPhases,
  phaseIndex,
}: VerticalBreathToggleProps) {
  const { colors, isDark } = useAppTheme();
  const motion = useSharedValue(phaseIndex);
  const inputRange = phases.map((_, index) => index);
  const translateRange = phases.map((_, index) => 2 + index * 132);
  const scaleRange = phases.map((_, index) => 1.04 - index * 0.05);
  const stackHeight = phases.length * 118 + (phases.length - 1) * 14;

  useEffect(() => {
    motion.value = withTiming(phaseIndex, {
      duration: active ? 360 : 220,
      easing: Easing.inOut(Easing.ease),
    });
  }, [active, motion, phaseIndex]);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(motion.value, inputRange, translateRange),
      },
      {
        scale: interpolate(motion.value, inputRange, scaleRange),
      },
    ],
  }));

  return (
    <View className="w-[300px] items-center self-center">
      <View className="relative flex-row items-start justify-center gap-8">
        <Animated.View
          className="absolute left-[13px] top-[3px] z-10 h-[45px] w-[45px] rounded-full"
          style={[orbStyle, { backgroundColor: isDark ? colors.primary : '#21596D' }]}
        />

        <View className="gap-[14px]" style={{ height: stackHeight }}>
          {phases.map((phase, index) => (
            <View
              className="h-[118px] w-[70px] rounded-[35px]"
              key={`${phase.label}-${index}`}
              style={{
                backgroundColor: phase.color,
                opacity: phaseIndex === index ? 1 : 0.9,
              }}
            />
          ))}
        </View>

        <View className="justify-between py-4" style={{ height: stackHeight }}>
          {phases.map((phase, index) => (
            <Text
              className="font-poppinsSemi text-[20px] leading-[28px]"
              key={`${phase.label}-label-${index}`}
              style={{ color: phaseIndex === index ? colors.textPrimary : colors.textSecondary }}
            >
              {phase.label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

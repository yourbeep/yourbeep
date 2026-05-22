import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useAppTheme } from '@/theme/use-app-theme';

interface BreathPhaseStackProps {
  active: boolean;
  phaseIndex: number;
}

const phases = [
  { color: '#1C8DA1', label: 'Breathe Out' },
  { color: '#6AD6EF', label: 'Hold' },
  { color: '#C9F1EE', label: 'Breathe In' },
] as const;

export function BreathPhaseStack({ active, phaseIndex }: BreathPhaseStackProps) {
  const { colors, isDark } = useAppTheme();
  const motion = useSharedValue(phaseIndex);

  useEffect(() => {
    motion.value = active
      ? withRepeat(
          withSequence(
            withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
            withTiming(2, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          ),
          -1,
          false,
        )
      : withTiming(phaseIndex, { duration: 250 });
  }, [active, motion, phaseIndex]);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(motion.value, [0, 1, 2], [0, 106, 212]),
      },
      {
        scale: interpolate(motion.value, [0, 1, 2], [1.02, 0.96, 0.92]),
      },
    ],
  }));

  return (
    <View className="relative flex-row items-start gap-5 py-2">
      <Animated.View
        className="absolute left-[6px] top-0 h-[58px] w-[58px] rounded-full border-[4px]"
        style={[
          orbStyle,
          {
            backgroundColor: isDark ? colors.primary : '#1F596D',
            borderColor: '#57C6E7',
          },
        ]}
      />

      <View className="gap-4">
        {phases.map((phase, index) => (
          <View
            className="h-[94px] w-[56px] rounded-[28px]"
            key={`${phase.label}-${index}`}
            style={{
              backgroundColor: phase.color,
              opacity: phaseIndex === index ? 1 : 0.9,
            }}
          />
        ))}
      </View>

      <View className="gap-[68px] pt-4">
        {phases.map((phase, index) => (
          <Text
            className="font-poppinsSemi text-[18px]"
            key={`${phase.label}-text-${index}`}
            style={{ color: colors.textPrimary }}
          >
            {phase.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

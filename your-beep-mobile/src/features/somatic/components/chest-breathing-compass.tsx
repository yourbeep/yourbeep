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

interface ChestBreathingCompassProps {
  active?: boolean;
  mode?: 'poster' | 'retention' | 'ring';
  secondsLabel?: string;
  targetLabel?: string;
}

export function ChestBreathingCompass({
  active = true,
  mode = 'ring',
  secondsLabel = '03:45',
  targetLabel = 'Target: 02:00',
}: ChestBreathingCompassProps) {
  const { colors, isDark } = useAppTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = active
      ? withRepeat(
          withSequence(
            withTiming(1.08, {
              duration: 2200,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(0.92, {
              duration: 2200,
              easing: Easing.inOut(Easing.ease),
            }),
          ),
          -1,
          false,
        )
      : withTiming(1, { duration: 200 });
  }, [active, scale]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (mode === 'poster') {
    return (
      <View
        className="overflow-hidden rounded-[28px] border p-3"
        style={{
          backgroundColor: isDark ? 'rgba(19,36,42,0.84)' : 'rgba(255,255,255,0.72)',
          borderColor: colors.primaryBorder,
        }}
      >
        <Image
          className="h-[280px] w-full rounded-[22px]"
          resizeMode="cover"
          source={appImages.Breath360}
        />
      </View>
    );
  }

  if (mode === 'retention') {
    return (
      <View className="items-center">
        <View className="relative h-[286px] w-[286px] items-center justify-center">
          <View
            className="absolute h-[266px] w-[266px] rounded-full border"
            style={{ borderColor: isDark ? 'rgba(86,212,202,0.24)' : 'rgba(173,222,211,0.32)' }}
          />
          <AnimatedView
            className="h-[228px] w-[228px] items-center justify-center rounded-full border"
            style={[
              ringStyle,
              {
                backgroundColor: isDark ? 'rgba(19,36,42,0.92)' : 'rgba(255,255,255,0.82)',
                borderColor: isDark ? 'rgba(86,212,202,0.22)' : '#D9EADB',
              },
            ]}
          >
            <Text className="font-poppinsSemi text-[28px]" style={{ color: colors.textPrimary }}>
              ≋ Retention
            </Text>
            <Text className="mt-2 font-poppinsSemi text-[50px] leading-[56px]" style={{ color: colors.textPrimary }}>
              {secondsLabel}
            </Text>
            <Text className="mt-2 font-poppinsMedium text-[16px] tracking-[0.6px]" style={{ color: colors.textSecondary }}>
              {targetLabel}
            </Text>
          </AnimatedView>
        </View>
      </View>
    );
  }

  return (
    <View className="items-center">
      <View className="relative h-[286px] w-[286px] items-center justify-center">
        <View
          className="absolute h-[286px] w-[286px] rounded-full border"
          style={{ borderColor: isDark ? 'rgba(86,212,202,0.16)' : 'rgba(173,222,211,0.25)' }}
        />
        <View
          className="absolute h-[248px] w-[248px] rounded-full border"
          style={{ borderColor: isDark ? 'rgba(86,212,202,0.12)' : 'rgba(173,222,211,0.18)' }}
        />

        {[
          { left: 136, top: 0 },
          { left: 136, top: 258 },
          { left: 0, top: 136 },
          { left: 258, top: 136 },
        ].map((marker, index) => (
          <View
            className="absolute h-8 w-[5px] rounded-full bg-[#57E2D7]"
            key={`cardinal-${index}`}
            style={marker}
          />
        ))}

        {[
          { left: 36, top: 58 },
          { left: 224, top: 58 },
          { left: 36, top: 214 },
          { left: 224, top: 214 },
        ].map((marker, index) => (
          <View
            className="absolute h-[7px] w-[7px] rounded-full bg-[#FFB45A]"
            key={`orb-${index}`}
            style={marker}
          />
        ))}

        <AnimatedView
          className="h-[196px] w-[196px] items-center justify-center rounded-full border-2"
          style={[
            ringStyle,
            {
              backgroundColor: isDark ? 'rgba(86,212,202,0.10)' : 'rgba(195,255,245,0.16)',
              borderColor: isDark ? 'rgba(86,212,202,0.46)' : '#A7F0E8',
            },
          ]}
        >
          <View
            className="h-[124px] w-[124px] items-center justify-center rounded-full border-[4px]"
            style={{ backgroundColor: colors.surface, borderColor: isDark ? colors.textPrimary : '#000000' }}
          >
            <Text className="font-poppinsSemi text-[30px] leading-[46px]" style={{ color: colors.textPrimary }}>
              {secondsLabel}
            </Text>
            <Text className="mt-1 font-poppinsMedium text-[10px] tracking-[1px]" style={{ color: colors.textMuted }}>
              REMAINING
            </Text>
          </View>
        </AnimatedView>
      </View>
    </View>
  );
}

import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useAppTheme } from '@/theme/use-app-theme';

interface AnchoringTaskCardProps {
  checked: boolean;
  children: React.ReactNode;
  description: string;
  index: number;
  title: string;
  onToggle: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function AnchoringTaskCard({
  checked,
  children,
  description,
  index,
  onToggle,
  title,
}: AnchoringTaskCardProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View className="flex-row items-start gap-3">
      <View className="items-center">
        <View
          className="h-8 w-8 items-center justify-center rounded-full border"
          style={{ backgroundColor: colors.surface, borderColor: isDark ? colors.primaryBorder : '#B8C0D6' }}
        >
          <Text className="font-poppinsMedium text-[12px]" style={{ color: colors.textSecondary }}>{index}</Text>
        </View>
        {index < 3 ? <View className="mt-1 h-16 w-[1px]" style={{ backgroundColor: isDark ? colors.primaryBorder : '#D8E1D2' }} /> : null}
      </View>

      <Pressable
        className="flex-1 rounded-[16px] border p-4"
        onPress={onToggle}
        style={{ backgroundColor: colors.surface, borderColor: isDark ? colors.primaryBorder : '#E5E5DE' }}
      >
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="font-poppinsMedium text-[16px]" style={{ color: colors.textPrimary }}>{title}</Text>
            <Text className="mt-1 font-poppinsRegular text-[12px] leading-[18px]" style={{ color: colors.textSecondary }}>
              {description}
            </Text>
          </View>

          <View
            className="h-5 w-5 items-center justify-center rounded-[4px] border"
            style={{
              backgroundColor: checked ? colors.primary : colors.surface,
              borderColor: checked ? colors.primary : isDark ? colors.primaryBorder : '#C9CEDA',
            }}
          >
            {checked ? <Check color="#FEFEE5" size={13} strokeWidth={2.5} /> : null}
          </View>
        </View>

        <View
          className="mt-4 overflow-hidden rounded-[12px] px-3 py-4"
          style={{ backgroundColor: isDark ? colors.surfaceMuted : '#F5F5F2' }}
        >
          {children}
        </View>
      </Pressable>
    </View>
  );
}

export function AudioFocusGraphic() {
  const { colors } = useAppTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.15, {
        duration: 1600,
        easing: Easing.out(Easing.ease),
      }),
      -1,
      true,
    );
  }, [scale]);

  const rippleStyle = useAnimatedStyle(() => ({
    opacity: 2 - scale.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="h-[62px] items-center justify-center">
      <AnimatedView
        className="absolute h-10 w-10 rounded-full border border-[#BFDDE1]"
        style={rippleStyle}
      />
      <AnimatedView
        className="absolute h-16 w-16 rounded-full border border-[#D7EAF0]"
        style={rippleStyle}
      />
      <View className="h-4 w-4 rounded-full border-4 border-[#84C7D0]" style={{ backgroundColor: colors.surface }} />
    </View>
  );
}

export function GroundContactGraphic() {
  const lift = useSharedValue(0);

  useEffect(() => {
    lift.value = withRepeat(
      withTiming(1, {
        duration: 1400,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [lift]);

  const lineStyle = useAnimatedStyle(() => ({
    width: 46 + lift.value * 28,
  }));

  return (
    <View className="h-[62px] items-center justify-end">
      <AnimatedView className="h-[2px] rounded-full bg-[#4DBCC3]" style={lineStyle} />
      <View className="mt-2 h-4 w-[2px] bg-[#8AB9C2]" />
    </View>
  );
}

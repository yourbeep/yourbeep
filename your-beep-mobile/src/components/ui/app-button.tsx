import { ReactNode } from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useAppTheme } from '@/theme/use-app-theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface AppButtonProps {
  className?: string;
  disabled?: boolean;
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  trailing?: ReactNode;
  variant?: ButtonVariant;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AppButton({
  className,
  disabled = false,
  label,
  onPress,
  style,
  trailing,
  variant = 'primary',
}: AppButtonProps) {
  const { colors } = useAppTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.985, {
      damping: 16,
      stiffness: 220,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 16,
      stiffness: 220,
    });
  };

  const variantStyle =
    variant === 'primary'
      ? {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          shadowColor: colors.shadow,
        }
      : variant === 'secondary'
        ? {
            backgroundColor: colors.surface,
            borderColor: colors.primaryBorder,
          }
        : {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          };

  const labelColor =
    variant === 'primary'
      ? colors.textInverse
      : variant === 'secondary'
        ? colors.textPrimary
        : colors.primary;

  return (
    <Animated.View style={[animatedStyle, style]}>
      <AnimatedPressable
        className={`${baseClasses} ${disabled ? 'opacity-45' : ''} ${className ?? ''}`}
        disabled={disabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={variantStyle}
      >
        <View className="flex-row items-center justify-center gap-3">
          <Text className="font-poppinsSemi text-base" style={{ color: labelColor }}>
            {label}
          </Text>
          {trailing}
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

const baseClasses = 'min-h-[58px] w-full items-center justify-center rounded-full px-5';

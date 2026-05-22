import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/use-app-theme';

interface HeartSegmentToggleProps {
  leftLabel?: string;
  onChange: (value: 'left' | 'right') => void;
  rightLabel?: string;
  value: 'left' | 'right';
}

export function HeartSegmentToggle({
  leftLabel = 'Excitement',
  onChange,
  rightLabel = 'Threat',
  value,
}: HeartSegmentToggleProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View
      className="h-[46px] flex-row overflow-hidden rounded-full"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <Pressable
        className="flex-1 items-center justify-center"
        onPress={() => onChange('left')}
        style={value === 'left' ? { backgroundColor: colors.primary } : undefined}
      >
        <Text className="font-poppinsSemi text-[14px]" style={{ color: value === 'left' ? colors.textInverse : '#183743' }}>
          {leftLabel}
        </Text>
      </Pressable>

      <Pressable
        className="flex-1 items-center justify-center"
        onPress={() => onChange('right')}
        style={value === 'right' ? { backgroundColor: colors.primary } : undefined}
      >
        <Text className="font-poppinsSemi text-[14px]" style={{ color: value === 'right' ? colors.textInverse : '#183743' }}>
          {rightLabel}
        </Text>
      </Pressable>
    </View>
  );
}

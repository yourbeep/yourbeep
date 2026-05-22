import { Text, View } from 'react-native';

import { useAppTheme } from '@/theme/use-app-theme';

interface ProtocolPanelProps {
  steps: readonly string[];
  title: string;
}

export function ProtocolPanel({ steps, title }: ProtocolPanelProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View
      className="rounded-[24px] px-6 py-5"
      style={{ backgroundColor: isDark ? colors.surfaceMuted : '#ECF4DF' }}
    >
      <View className="flex-row items-center gap-4">
        <View className="h-8 w-1 rounded-full" style={{ backgroundColor: colors.primary }} />
        <Text className="font-poppinsSemi text-[18px]" style={{ color: colors.textPrimary }}>
          {title}
        </Text>
      </View>

      <View className="mt-5 gap-5">
        {steps.map((step, index) => (
          <View className="flex-row gap-4" key={step}>
            <Text className="w-6 font-poppinsMedium text-[13px]" style={{ color: colors.success }}>
              {(index + 1).toString().padStart(2, '0')}
            </Text>
            <Text className="flex-1 font-poppinsRegular text-[13px] leading-[22px]" style={{ color: colors.textSecondary }}>
              {step}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

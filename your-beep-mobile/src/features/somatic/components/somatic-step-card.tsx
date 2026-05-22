import { Text, View } from 'react-native';

import { useAppTheme } from '@/theme/use-app-theme';

interface SomaticStepCardProps {
  accent?: 'cool' | 'neutral';
  indexLabel?: string;
  rightIcon?: string;
  title?: string;
  children: React.ReactNode;
}

export function SomaticStepCard({
  accent = 'neutral',
  children,
  indexLabel,
  rightIcon,
  title,
}: SomaticStepCardProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View
      className="rounded-[16px] border p-4"
      style={
        accent === 'cool'
          ? {
              backgroundColor: isDark ? '#182C2F' : '#F2FFFD',
              borderColor: isDark ? 'rgba(214,241,236,0.18)' : '#D6F1EC',
            }
          : {
              backgroundColor: colors.surface,
              borderColor: isDark ? 'rgba(232,231,221,0.12)' : '#E8E7DD',
            }
      }
    >
      {title ? (
        <View className="flex-row items-start justify-between gap-3">
          <View>
            {indexLabel ? (
              <Text className="font-poppinsSemi text-[10px] uppercase tracking-[0.8px]" style={{ color: colors.textMuted }}>
                {indexLabel}
              </Text>
            ) : null}
            <Text className="mt-1 font-poppinsMedium text-[15px]" style={{ color: colors.textPrimary }}>
              {title}
            </Text>
          </View>

          {rightIcon ? (
            <Text className="font-poppinsSemi text-[18px]" style={{ color: colors.textMuted }}>
              {rightIcon}
            </Text>
          ) : null}
        </View>
      ) : null}

      <View className={title ? 'mt-3' : ''}>{children}</View>
    </View>
  );
}

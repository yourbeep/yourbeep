import { Text, View } from 'react-native';

import { SomaticChip } from '@/features/somatic/components/somatic-chip';
import { useAppTheme } from '@/theme/use-app-theme';

interface SomaticAwarenessTestHeroProps {
  chipLabel?: string;
  description?: string;
  subtitle?: string;
  title: string;
}

export function SomaticAwarenessTestHero({
  chipLabel,
  description,
  subtitle,
  title,
}: SomaticAwarenessTestHeroProps) {
  const { colors } = useAppTheme();

  return (
    <View className="gap-3 px-1">
      {chipLabel ? <SomaticChip label={chipLabel} /> : null}
      <View className="gap-2">
        <Text className="font-poppinsSemi text-[32px] leading-[38px]" style={{ color: colors.textPrimary }}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="font-poppinsMedium text-[20px] leading-[28px]" style={{ color: colors.textPrimary }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {description ? (
        <Text className="max-w-[300px] font-poppinsRegular text-[17px] leading-[30px]" style={{ color: colors.textSecondary }}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}

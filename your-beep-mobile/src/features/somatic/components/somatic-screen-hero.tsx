import { Text, View, useWindowDimensions } from 'react-native';

import { SomaticChip } from '@/features/somatic/components/somatic-chip';
import { useAppTheme } from '@/theme/use-app-theme';

interface SomaticScreenHeroProps {
  chipLabel?: string;
  description: string;
  descriptionClassName?: string;
  title: string;
  titleClassName?: string;
}

export function SomaticScreenHero({
  chipLabel,
  description,
  descriptionClassName,
  title,
  titleClassName,
}: SomaticScreenHeroProps) {
  const { colors } = useAppTheme();
  const { width } = useWindowDimensions();
  const isCompact = width < 390;

  return (
    <View className="gap-3 px-1">
      {chipLabel ? <SomaticChip label={chipLabel} /> : null}
      <Text
        className={`font-poppinsSemi ${
          isCompact ? 'text-[24px] leading-[32px]' : 'text-[32px] leading-[40px]'
        } ${
          titleClassName ?? ''
        }`}
        style={{ color: colors.textPrimary }}
      >
        {title}
      </Text>
      <Text
        className={`font-poppinsRegular ${
          isCompact ? 'text-[15px] leading-[26px]' : 'text-[17px] leading-[30px]'
        } ${
          descriptionClassName ?? ''
        }`}
        style={{ color: colors.textSecondary }}
      >
        {description}
      </Text>
    </View>
  );
}

import { Text, View } from 'react-native';

import { useAppTheme } from '@/theme/use-app-theme';

interface SummaryCardProps {
  badge: string;
  description: string;
  status: string;
  title: string;
  tone: 'mint' | 'neutral' | 'sand';
}

export function SummaryCard({ badge, description, status, title, tone }: SummaryCardProps) {
  const { colors, isDark } = useAppTheme();

  const toneStyle =
    tone === 'mint'
      ? { backgroundColor: isDark ? '#20312B' : '#E0FAEE', borderColor: isDark ? 'rgba(199,239,229,0.18)' : '#C7EFE5' }
      : tone === 'neutral'
        ? { backgroundColor: isDark ? '#232B2D' : '#F6F7F1', borderColor: isDark ? 'rgba(230,231,223,0.16)' : '#E6E7DF' }
        : { backgroundColor: isDark ? '#31271F' : '#FAEAD3', borderColor: isDark ? 'rgba(240,221,195,0.16)' : '#F0DDC3' };

  const badgeStyle =
    tone === 'mint'
      ? { backgroundColor: isDark ? 'rgba(191,243,229,0.14)' : '#BFF3E5', color: '#0D7F77' }
      : tone === 'neutral'
        ? { backgroundColor: isDark ? 'rgba(228,229,224,0.12)' : '#E4E5E0', color: colors.textSecondary }
        : { backgroundColor: isDark ? 'rgba(255,215,165,0.16)' : '#FFD7A5', color: '#A56619' };

  return (
    <View className="rounded-[22px] border p-4" style={toneStyle}>
      <Text className="font-poppinsSemi text-[11px] uppercase tracking-[0.7px]" style={{ color: colors.textSecondary }}>
        {title}
      </Text>
      <Text className="mt-2 font-poppinsMedium text-[15px]" style={{ color: colors.textSecondary }}>
        • {status}
      </Text>
      <Text className="mt-1 font-poppinsRegular text-[14px] leading-[24px]" style={{ color: colors.textSecondary }}>
        {description}
      </Text>
      <View className="mt-3 self-start rounded-full px-3 py-1" style={{ backgroundColor: badgeStyle.backgroundColor }}>
        <Text className="font-poppinsMedium text-[12px]" style={{ color: badgeStyle.color }}>
          {badge}
        </Text>
      </View>
    </View>
  );
}

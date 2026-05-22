import { Text, View } from 'react-native';
import { BadgeCheck, Flame, Lock } from 'lucide-react-native';
import { useAppTheme } from '@/theme/use-app-theme';

interface RewardCardProps {
  label: string;
  title: string;
  tone: 'cool' | 'muted' | 'warm';
}

export function RewardCard({ label, title, tone }: RewardCardProps) {
  const { colors, isDark } = useAppTheme();
  const icon =
    tone === 'warm' ? (
      <Flame color="#F9A84E" size={20} strokeWidth={2} />
    ) : tone === 'cool' ? (
      <BadgeCheck color="#4AD4C7" size={20} strokeWidth={2} />
    ) : (
      <Lock color="#D9D6C8" size={20} strokeWidth={2} />
    );

  return (
    <View
      className="w-[144px] h-[140px] rounded-[12px] border p-4"
      style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
    >
      <View
        className="h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: isDark ? colors.surfaceStrong : '#F5F6F2' }}
      >
        {icon}
      </View>
      <Text className="mt-5 font-poppinsSemi text-[15px] leading-[21px]" style={{ color: colors.textPrimary }}>
        {title}
      </Text>
      <Text className="mt-1 font-poppinsRegular text-[12px]" style={{ color: colors.textSecondary }}>
        {label}
      </Text>
    </View>
  );
}

import { Text, View } from 'react-native';
import { Activity, Waves, Waypoints } from 'lucide-react-native';

import { useAppTheme } from '@/theme/use-app-theme';

interface AwarenessResultCardProps {
  body: string;
  icon: 'activity' | 'waves' | 'waypoints';
  title: string;
  tone: 'peach' | 'sage' | 'surface';
}

const iconMap = {
  activity: Activity,
  waves: Waves,
  waypoints: Waypoints,
} as const;

export function AwarenessResultCard({ body, icon, title, tone }: AwarenessResultCardProps) {
  const Icon = iconMap[icon];
  const { colors, isDark } = useAppTheme();
  const toneStyle =
    tone === 'peach'
      ? { backgroundColor: isDark ? '#2D251E' : '#F8E2C9' }
      : tone === 'sage'
        ? { backgroundColor: isDark ? '#22302B' : '#D9E2DB' }
        : { backgroundColor: isDark ? '#302920' : '#FFF2E2' };

  return (
    <View className="overflow-hidden rounded-[22px]" style={toneStyle}>
      <View
        className="h-[92px]"
        style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.68)' }}
      />
      <View className="gap-4 px-6 py-5">
        <View className="flex-row items-center gap-3">
          <View className="h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: colors.surface }}>
            <Icon color={colors.textSecondary} size={17} strokeWidth={1.8} />
          </View>
          <Text className="font-poppinsSemi text-[16px] leading-[24px]" style={{ color: colors.textPrimary }}>
            {title}
          </Text>
        </View>

        <Text className="font-poppinsRegular text-[15px] leading-[30px]" style={{ color: colors.textSecondary }}>
          {body}
        </Text>
      </View>
    </View>
  );
}

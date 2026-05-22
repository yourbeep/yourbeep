import { View } from 'react-native';
import { useAppTheme } from '@/theme/use-app-theme';

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View
      className="h-2 overflow-hidden rounded-full"
      style={{
        backgroundColor: isDark ? colors.primaryBorder : 'rgba(254,254,229,0.14)',
      }}
    >
      <View
        className="h-full rounded-full"
        style={{ backgroundColor: colors.accent, width: `${Math.max(0, Math.min(progress, 100))}%` }}
      />
    </View>
  );
}

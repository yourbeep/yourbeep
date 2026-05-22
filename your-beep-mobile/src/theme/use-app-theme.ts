import { useAppSelector } from '@/store/hooks';
import { getThemeColors } from '@/theme/colors';

export function useAppTheme() {
  const mode = useAppSelector((state) => state.ui.themeMode);
  const colors = getThemeColors(mode);

  return {
    colors,
    isDark: mode === 'dark',
    mode,
  };
}

export interface AppThemeColors {
  accent: string;
  accentSoft: string;
  background: string;
  primary: string;
  primaryBorder: string;
  primaryMuted: string;
  primarySoft: string;
  shadow: string;
  success: string;
  surface: string;
  surfaceMuted: string;
  surfaceStrong: string;
  textInverse: string;
  textMuted: string;
  textPrimary: string;
  textSecondary: string;
}

export const lightColors: AppThemeColors = {
  background: '#FEFEE5',
  primary: '#0A3F4F',
  primaryMuted: '#2A687A',
  primarySoft: '#E1F0EA',
  primaryBorder: 'rgba(25, 74, 90, 0.14)',
  surface: '#FFFFFF',
  surfaceMuted: '#F2F4E8',
  surfaceStrong: '#E7EBDD',
  textPrimary: '#0A3F4F',
  textSecondary: '#5A7078',
  textMuted: '#82939A',
  textInverse: '#FEFEE5',
  accent: '#3CA7A0',
  accentSoft: '#D7EFE8',
  success: '#2B8A72',
  shadow: 'rgba(25, 74, 90, 0.14)',
};

export const darkColors: AppThemeColors = {
  background: '#0C181D',
  primary: '#0A3F4F',
  primaryMuted: '#2E6A7A',
  primarySoft: '#14333B',
  primaryBorder: 'rgba(151, 210, 214, 0.14)',
  surface: '#13242A',
  surfaceMuted: '#172D35',
  surfaceStrong: '#1E3942',
  textPrimary: '#F5F5E8',
  textSecondary: '#B8C7CC',
  textMuted: '#8A9DA4',
  textInverse: '#FEFEE5',
  accent: '#56D4CA',
  accentSoft: 'rgba(86, 212, 202, 0.18)',
  success: '#65CBA8',
  shadow: 'rgba(0, 0, 0, 0.32)',
};
export const colors = lightColors;

export function getThemeColors(mode: 'dark' | 'light'): AppThemeColors {
  return mode === 'dark' ? darkColors : lightColors;
}

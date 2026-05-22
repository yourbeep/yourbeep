export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  section: 40,
  page: 22,
} as const;

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 34,
  pill: 999,
} as const;

export const typography = {
  display: 40,
  hero: 34,
  title: 28,
  subtitle: 18,
  body: 16,
  bodyLg: 18,
  caption: 13,
  overline: 12,
} as const;

export const shadows = {
  soft: {
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 1,
    shadowRadius: 24,
  },
} as const;

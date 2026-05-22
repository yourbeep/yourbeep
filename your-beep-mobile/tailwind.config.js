/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          background: '#FEFEE5',
          primary: '#194A5A',
          primaryMuted: '#2A687A',
          primarySoft: '#E1F0EA',
          primaryBorder: 'rgba(25, 74, 90, 0.14)',
          surface: '#FFFFFF',
          surfaceMuted: '#F2F4E8',
          surfaceStrong: '#E7EBDD',
          text: '#183743',
          textSecondary: '#5A7078',
          textMuted: '#82939A',
          textInverse: '#FEFEE5',
          accent: '#3CA7A0',
          accentSoft: '#D7EFE8',
          success: '#2B8A72',
        },
      },
      boxShadow: {
        brand: '0px 14px 28px rgba(25, 74, 90, 0.14)',
      },
      fontFamily: {
        poppinsRegular: ['Poppins_400Regular'],
        poppinsMedium: ['Poppins_500Medium'],
        poppinsSemi: ['Poppins_600SemiBold'],
      },
    },
  },
  plugins: [],
};

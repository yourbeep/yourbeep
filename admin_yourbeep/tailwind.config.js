/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0d6e6e',
        'primary-dark': '#0a5c5c',
        'primary-light': '#e6f4f4',
        'bg-cream': '#fefce8',
        'sidebar-bg': '#e8f5e3',
        'card-bg': '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

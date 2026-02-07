const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#101018',
        'text-primary': '#F0F0F0',
        'text-secondary': '#a1a1aa',
        'accent-blue': '#2563EB',
        'accent-purple': '#7C3AED',
        'border-color': '#27272a',
      },
      fontFamily: {
        sans: ['var(--font-sora)', ...fontFamily.sans],
        display: ['var(--font-syne)', ...fontFamily.sans],
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        scroll: 'scroll 30s linear infinite',
      },
    },
  },
  plugins: [],
};

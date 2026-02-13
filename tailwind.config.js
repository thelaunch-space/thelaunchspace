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
        'accent-emerald': '#10B981',
        'accent-amber': '#F59E0B',
        'accent-rose': '#F43F5E',
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
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        scroll: 'scroll 30s linear infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'scan-line': 'scan-line 4s linear infinite',
      },
    },
  },
  plugins: [],
};

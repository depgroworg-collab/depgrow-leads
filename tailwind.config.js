/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#7C3AED', light: '#8B5CF6', dark: '#6D28D9' },
        hot:   { DEFAULT: '#EF4444', bg: '#FEE2E2', text: '#991B1B' },
        warm:  { DEFAULT: '#F59E0B', bg: '#FEF3C7', text: '#92400E' },
        cold:  { DEFAULT: '#6B7280', bg: '#F3F4F6', text: '#374151' },
      },
      animation: {
        'fade-in':    'fadeIn 0.25s ease',
        'slide-up':   'slideUp 0.3s ease',
        'pulse-slow': 'pulse 3s ease infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                     to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}

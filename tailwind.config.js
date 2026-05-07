/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        terminal: {
          bg: '#07111f',
          card: '#0d1b2e',
          soft: '#13243a',
          teal: '#0f766e',
          mint: '#2dd4bf',
        },
      },
      boxShadow: {
        glow: '0 0 40px rgba(45, 212, 191, 0.18)',
      },
    },
  },
  plugins: [],
};

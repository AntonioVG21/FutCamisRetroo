/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        gray: {
          900: '#0c0c14',
          800: '#151523',
          700: '#21213a',
        },
        yellow: {
          500: '#FFBC2D',
          600: '#E9A617',
          700: '#d49615',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'bounce-delayed': 'bounce 1s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
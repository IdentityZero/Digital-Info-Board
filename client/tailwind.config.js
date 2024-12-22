/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyanBlue: {
          light: '#6bb8e1',
          DEFAULT: '#55a2d1',
          dark: '#428bb6',
          darker: '#3b83a5'

        },
        lightBlue: {
          DEFAULT: '#38b6ff',
          50: '#e3f8ff',
          100: '#c9efff',
          200: '#91ddff',
          300: '#5acbff',
          400: '#38b6ff',
          500: '#2090cc',
          600: '#176e99',
          700: '#11516f',
          800: '#0a3446',
          900: '#041a23'
        },
        darkTeal: {
          DEFAULT: '#0f4143'
        },
        vanilla: {
          50: '#fbfaf5',
          100: '#f5f4e6',
          200: '#ebe9d3',
          300: '#dcd7b9',
          400: '#c4be97',
        },
        btDanger: {
          DEFAULT: '#dc3545',
          hover: '#bb2d3b',
          active: '#8e1d2c'
        },
        btPrimary: {
          DEFAULT: '#0d6efd',
          hover: '#0b5ed7',
          active: '#084298'
        },
        btSecondary: {
          DEFAULT: '#6c757d',
          hover: '#5c636a',
          active: '#44494e'
        },
        yellowishBeige: {
          DEFAULT: '#f5f4e6'
        },
        desaturatedBlueGray: {
          DEFAULT: '#6e8ea4'
        }
      }
    },
  },
  plugins: [],
}
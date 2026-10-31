/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FEF2F2',
          100: '#FDE8E8',
          200: '#FBD5D5',
          300: '#F8B4B4',
          400: '#F98080',
          500: '#E51E25', // Main Cafena Red from screenshot
          600: '#D3171D',
          700: '#B9141A',
          800: '#991116',
          900: '#7E1115',
        },
        coffee: {
          dark: '#2A1B12',
          medium: '#4A3528',
          light: '#8C6D58',
          cream: '#F5EBE1',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Montserrat"', '"Inter"', 'sans-serif'],
        condensed: ['"Barlow Condensed"', '"Oswald"', 'sans-serif'],
        vietnam: ['"Be Vietnam Pro"', 'sans-serif'],
        cursive: ['"Barlow Condensed"', '"Montserrat"', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.35s ease-out forwards',
        slideLeft: 'slideLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        slideUp: 'slideUp 0.3s ease-out forwards',
        pulseSubtle: 'pulseSubtle 2.5s infinite ease-in-out',
        float: 'float 3.5s infinite ease-in-out',
      }
    },
  },
  plugins: [],
}

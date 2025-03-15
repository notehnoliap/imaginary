/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // 蓝色
          light: '#93C5FD',
          dark: '#1D4ED8',
        },
        secondary: {
          DEFAULT: '#10B981', // 绿色
          light: '#6EE7B7',
          dark: '#047857',
        },
        accent: {
          DEFAULT: '#F59E0B', // 橙色
          light: '#FCD34D',
          dark: '#B45309',
        },
        background: {
          DEFAULT: '#F9FAFB', // 浅灰
          dark: '#1F2937',
        },
        text: {
          DEFAULT: '#1F2937', // 深灰
          light: '#6B7280',
        },
        border: {
          DEFAULT: '#E5E7EB', // 灰色
          dark: '#9CA3AF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 
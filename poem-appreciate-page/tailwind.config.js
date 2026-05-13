/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#faf9f7',
          100: '#f5f3f0',
          200: '#e8e4df',
          300: '#d4cdc5',
          400: '#b8ada2',
          500: '#9a8c7d',
          600: '#7d6f62',
          700: '#5c4f44',
          800: '#3d342c',
          900: '#1f1a17',
        },
        bamboo: {
          100: '#e8f5e9',
          300: '#81c784',
          500: '#4caf50',
          700: '#2e7d32',
        },
        plum: {
          100: '#fce4ec',
          300: '#f48fb1',
          500: '#e91e63',
          700: '#c2185b',
        },
        gold: {
          100: '#fff8e1',
          300: '#ffd54f',
          500: '#ffc107',
          700: '#ffa000',
        }
      },
      fontFamily: {
        kai: ['KaiTi', 'STKaiti', '楷体', 'serif'],
        song: ['SimSun', 'STSong', '宋体', 'serif'],
      },
    },
  },
  plugins: [],
}

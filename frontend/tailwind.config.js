/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kodomo-blue': '#87CEEB',
        'kodomo-yellow': '#FFD700',
        'kodomo-green': '#98FB98',
        'kodomo-pink': '#FFB6C1',
        'kodomo-orange': '#FFA07A',
        'city-bg': '#F0F4F8'
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        kodomo: ['"M PLUS Rounded 1c"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cn: {
          blue: '#3DB7E4',
          'blue-dark': '#2A9DC8',
          'blue-light': '#AEE3F5',
          yellow: '#F2C94C',
          black: '#1C1C1C',
          gray: '#EAEAEA',
        }
      }
    },
  },
  plugins: [],
}
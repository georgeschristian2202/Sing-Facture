/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sing: {
          primary: '#00758D',
          secondary: '#DFC32F',
          dark: '#00303C',
          burgundy: '#8E0B56',
          brown: '#5C4621',
        }
      }
    },
  },
  plugins: [],
}

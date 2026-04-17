/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        stellar: {
          blue: '#0D47A1',
          light: '#1976D2',
          accent: '#00BCD4',
        },
      },
    },
  },
  plugins: [],
};

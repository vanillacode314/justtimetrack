/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: 'forest',
    logs: false,
  },
  content: [
    'src/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
}

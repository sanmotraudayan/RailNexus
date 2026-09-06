/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#06264D',
          700: '#0B3D6E',
        },
        blue: {
          600: '#145DA0',
        },
        saffron: '#FF9933',
        'flag-green': '#138808',
        grey: {
          50: '#F4F6F8',
          100: '#E9EDF1',
          300: '#C9D2DA',
          600: '#5B6B79',
        },
        ink: {
          900: '#1B2733',
        },
        success: {
          700: '#1E7B34',
          100: '#E4F3E6',
        },
        warning: {
          700: '#B5750A',
          100: '#FDEFD9',
        },
        critical: {
          700: '#B3261E',
          100: '#FBE4E2',
        },
        info: {
          700: '#145DA0',
          100: '#E3EEF9',
        },
      },
      fontFamily: {
        sans: ['Noto Sans', 'Mukta', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

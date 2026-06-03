module.exports = {
  darkMode: 'class',
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#0B0F1A',
        card: '#161F33',
        primary: '#7C3AED',
        primaryDark: '#5B21B6',
        accent: '#06B6D4',
        borderDefault: '#1E293B',
      },
    },
  },
  plugins: [],
}

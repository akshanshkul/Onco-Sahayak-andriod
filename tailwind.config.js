/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  // The app is light-only. Without this NativeWind defaults to `media` on web
  // and its runtime then throws "Cannot manually set color scheme" on every
  // load, which buries real errors in the console.
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0E7C5A",
        "primary-bright": "#19A974",
        navy: "#0F2C52",
        dark: "#12283F",
        mint: "#E9F8F1",
        rose: "#FCECEF",
        pink: "#D94F7B",
        lavender: "#F0ECFF",
        violet: "#7C5CE6",
        sky: "#E8F1FD",
        amber: "#F59E0B",
        border: "#E7EDF3",
        wash: "#F6F9FB"
      }
    }
  },
  plugins: []
};

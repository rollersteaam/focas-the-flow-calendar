const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      ...colors,
    },
  },
  variants: {
    extend: {
      backgroundColor: ["hover", "active"],
      borderColor: ["hover", "active"],
      textColor: ["active"],
      animation: ["motion-safe"],
    },
  },
  plugins: [],
};

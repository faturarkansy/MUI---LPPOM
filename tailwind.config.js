/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src//*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        myriad: ['"Myriad Pro"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

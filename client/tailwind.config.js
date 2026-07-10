/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        body: ['"Source Serif 4"', "serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        ink: {
          950: "#0a0908",
          900: "#13110f",
          800: "#1c1916",
          700: "#26221e",
          600: "#332e29",
        },
        parchment: {
          50: "#fdf8f0",
          100: "#f9eed8",
          200: "#f0d9a8",
        },
        amber: {
          glow: "#d4843a",
          soft: "#e8a85a",
          pale: "#f5c878",
        },
        sage: "#7a9e7e",
        crimson: "#c0392b",
      },
    },
  },
  plugins: [],
};

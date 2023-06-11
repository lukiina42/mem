/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          "0%, 30%, 50%, 70%, 90%, 100%": { transform: "rotate(-10deg)" },
          "20%, 40%, 60%, 80%": { transform: "rotate(10deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 1s ease-in-out",
      },
    },
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1204px",
      // => @media (min-width: 1024px) { ... }

      xl: "1620px",
      // => @media (min-width: 1280px) { ... }
    },
  },
  plugins: [require("@tailwindcss/container-queries")],
};

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // inclut tous tes fichiers source
  ],
  theme: {
    extend: {
      spacing: {
        45: "11.25rem", // correspond à px-45 ou w-45
        50: "12.5rem",
        90: "22.5rem",
      },
    },
  },
  plugins: ["@tailwindcss/postcss"],
};

export default config;

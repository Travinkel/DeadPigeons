/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        jerneif: {
          primary: "#b91c1c", // Red-700 - Jerne IF red (WCAG AA contrast)
          "primary-content": "#FFFFFF", // White text on red
          secondary: "#991b1b", // Red-800
          accent: "#F87171", // Red-400
          neutral: "#1F2937", // Gray-800
          "base-100": "#FFFFFF", // White background
          "base-200": "#F3F4F6", // Gray-100
          "base-300": "#E5E7EB", // Gray-200
          info: "#3B82F6",
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
    ],
  },
};

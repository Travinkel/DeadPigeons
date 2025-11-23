/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        h1: ["2.44rem", { lineHeight: "1.2", fontWeight: "900" }],
        h2: ["1.94rem", { lineHeight: "1.25", fontWeight: "700" }],
        h3: ["1.56rem", { lineHeight: "1.3", fontWeight: "600" }],
        h4: ["1.25rem", { lineHeight: "1.35", fontWeight: "500" }],
      },
    },
  },
};

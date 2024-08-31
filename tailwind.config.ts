import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: '#787F99',   // Màu chính
        secondary: '#333645', // Màu phụ
        accent: '#D9D9D9',    // Màu nhấn
        neutral: '#9D9D9D',   // Màu trung tính
        background: '#000000' // Màu nền
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        "racing-sans": ['"Racing Sans One"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

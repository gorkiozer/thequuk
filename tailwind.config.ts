import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#06030F",
          800: "#0B0719",
          700: "#120B26",
          600: "#1A1133",
        },
        violet: {
          glow: "#B388FF",
        },
        neon: {
          purple: "#A06BFF",
          lilac: "#C9A8FF",
          plum: "#6E3BFF",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(160, 107, 255, 0.45)",
        soft: "0 8px 24px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;

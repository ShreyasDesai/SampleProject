import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B1F1C",
          900: "#122E29",
          800: "#1A3F38",
          700: "#24554B",
          600: "#2F6B5E",
          500: "#3D8575",
        },
        moss: {
          50: "#F3F8F5",
          100: "#E4F0EA",
          200: "#C5DECF",
          300: "#9BC4AE",
          400: "#6BA88A",
          500: "#4A8F6F",
        },
        coral: {
          400: "#F07A5A",
          500: "#E85D38",
          600: "#D04522",
        },
        sand: {
          50: "#FBF8F3",
          100: "#F5EFE4",
          200: "#E8DCC8",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(ellipse 80% 60% at 70% 20%, rgba(74,143,111,0.35), transparent 55%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(232,93,56,0.18), transparent 50%), linear-gradient(165deg, #0B1F1C 0%, #1A3F38 45%, #24554B 100%)",
        "section-wash":
          "linear-gradient(180deg, #F3F8F5 0%, #FBF8F3 50%, #E4F0EA 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        float: "float 5s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;

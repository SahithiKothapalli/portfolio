import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Outfit", "Satoshi", "Inter", "sans-serif"],
        instrument: ["var(--font-instrument)", "Instrument Serif", "serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        border: "var(--border)",
        accent: {
          violet: "#7C3AED",
          purple: "#5B21B6",
          mauve: "#C084FC",
          champagne: "#F59E0B",
          lime: "#c6f135",
        },
        lime: {
          400: "#bef264",
          500: "#a3e635",
          accent: "#c6f135",
        },
      },
      backgroundImage: {
        "grid-pattern": "var(--grid-pattern)",
      },
      boxShadow: {
        "luxury-light": "0 24px 60px rgba(109, 40, 217, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
        "luxury-dark": "0 24px 60px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.08)",
        "glow-purple": "0 0 40px rgba(124, 58, 237, 0.15)",
        "glow-gold": "0 0 40px rgba(245, 158, 11, 0.15)",
      },
      animation: {
        "pulse-slow": "pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

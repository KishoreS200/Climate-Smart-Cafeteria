import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundColor: {
        background: "hsl(var(--background))",
      },
      textColor: {
        foreground: "hsl(var(--foreground))",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom eco-friendly color palette
        leaf: {
          50: "#f2f8f0",
          100: "#e4f1e0",
          200: "#c9e3c2",
          300: "#add5a3",
          400: "#92c785",
          500: "#76b966",
          600: "#5e9452",
          700: "#47703e",
          800: "#2f4c29",
          900: "#182415",
          950: "#0c1209",
        },
        earth: {
          50: "#f8f5f0",
          100: "#f1ebe0",
          200: "#e3d7c2",
          300: "#d5c3a3",
          400: "#c7af85",
          500: "#b99b66",
          600: "#947c52",
          700: "#705d3e",
          800: "#4c3e29",
          900: "#241f15",
          950: "#120f09",
        },
        sky: {
          50: "#f0f7f8",
          100: "#e0eff1",
          200: "#c2dfe3",
          300: "#a3cfd5",
          400: "#85bfc7",
          500: "#66afb9",
          600: "#528c94",
          700: "#3e6970",
          800: "#29464c",
          900: "#152324",
          950: "#091112",
        },
        carbon: {
          low: "#4ade80", // Green for low carbon
          medium: "#facc15", // Yellow for medium carbon
          high: "#f87171", // Red for high carbon
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite",
        "gradient": "gradientShift 15s ease infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [daisyui],
  // @ts-ignore
  daisyui: {
    themes: [
      {
        light: {
          primary: "#6366f1",
          "primary-focus": "#4f46e5",
          "primary-content": "#ffffff",
          secondary: "#a855f7",
          "secondary-focus": "#9333ea",
          "secondary-content": "#ffffff",
          accent: "#ec4899",
          neutral: "#1a1a2e",
          "base-100": "#ffffff",
          "base-200": "#f3f4f6",
          "base-300": "#e5e7eb",
          "base-content": "#1f2937",
        },
      },
      {
        dark: {
          primary: "#818cf8",
          "primary-focus": "#6366f1",
          "primary-content": "#0f0c29",
          secondary: "#c084fc",
          "secondary-focus": "#a855f7",
          "secondary-content": "#0f0c29",
          accent: "#f472b6",
          neutral: "#e2e8f0",
          "base-100": "#0f0c29",
          "base-200": "#1a1740",
          "base-300": "#252257",
          "base-content": "#e2e8f0",
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    logs: false,
  },
} satisfies Config & {
  daisyui?: any
};;

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        'sans': ['var(--font-poppins)', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        'unical-red': {
          '50': '#fef2f2',
          '100': '#ffe1e1',
          '200': '#ffc9c9',
          '300': '#fea4a3',
          '400': '#fb6f6e',
          '500': '#f34140',
          '600': '#e02322',
          '700': '#b71918',
          '800': '#9c1918',
          '900': '#811c1b',
          '950': '#460909',
      },      
      },
      animation: {
        'ping-once': 'ping-once 4s cubic-bezier(0, 0, 0.2, 1) infinite;',
      },
      keyframes: {
        'ping-once':{
          "0%, 45%": {
            transform: "scale(1)",
            opacity: "1"
          },
          "55%": {
            transform: "scaleX(2)",
            opacity: "0"
          },
          "65%, 100%": {
            transform: "scale(1)",
            opacity: "1"
          }
        }
      }
    },
  },
  plugins: [],
};
export default config;

/** @type {import('tailwindcss').Config} */
import tailwindCSSLineClamp from "@tailwindcss/line-clamp"
import daisyui from "daisyui"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,
    tailwindCSSLineClamp
  ],
}


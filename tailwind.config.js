/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-MainColor": "#D51F39", // กำหนดสีพื้นหลัง
        "color-textInput":"#6b7280",
        "bg-gray":"#f3f4f6 ",
      },
    },
  },
  plugins: [require('daisyui')],
}

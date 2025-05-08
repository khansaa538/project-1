/ @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages//*.{js,ts,jsx,tsx,mdx}", "./components//*.{js,ts,jsx,tsx,mdx}", "./app//*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class", // Menggunakan class untuk mode gelap
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Kamu bisa kustomisasi warna "Udud" di sini
        primary: "#f97316", // orange-500
        dark: "#0f172a",    // slate-900
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    // Plugin ini berguna untuk memotong judul anime yang kepanjangan
    // Instal dengan: npm install -D @tailwindcss/line-clamp
  ],
}
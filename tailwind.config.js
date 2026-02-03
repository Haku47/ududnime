/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- 🎨 PERANCANGAN IDENTIFIKASI SISTEM WARNA ---
        // Kita hubungkan Tailwind dengan CSS Variables di App.vue gais!
        accent: {
          DEFAULT: "var(--accent-color)", // Bisa pakai class 'text-accent' atau 'bg-accent'
          glow: "var(--accent-glow)",     // Bisa pakai class 'shadow-accent-glow'
          bg: "var(--accent-bg)",         // Bisa pakai class 'bg-accent-bg'
        },
        dark: {
          950: "#020617", // Super dark buat background utama
          900: "#0f172a", // Dark buat card/modal
          800: "#1e293b", // Light dark buat border
        },
      },
      fontFamily: {
        // Inter mbois pol buat UI modern gais
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      // --- ✨ CUSTOM ANIMASI KHAS UDUDNIME ---
      animation: {
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'glow-pulse': 'glow-pulse 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: 0.5, filter: 'blur(10px)' },
          '50%': { opacity: 1, filter: 'blur(15px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        // Shadow neon otomatis gais!
        'glow': '0 0 20px var(--accent-glow)',
        'glow-lg': '0 0 40px var(--accent-glow)',
      }
    },
  },
  plugins: [
    // Note: line-clamp sekarang sudah bawaan Tailwind v3.3+ gais, 
    // Jadi tidak perlu plugin tambahan jika versi Tailwind-mu baru!
  ],
}
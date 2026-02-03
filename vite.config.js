import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // Tambahkan ini gais

// https://vite.dev/config/
export default defineConfig({
  // --- 🚀 TAMBAHAN WAJIB BUAT ANDROID GAIS ---
  base: './', 

  plugins: [vue()],
  resolve: {
    alias: {
      // Ini bagian gahar yang bikin @ merujuk ke folder src gais
      '@': path.resolve(__dirname, './src'),
    },
  },
})
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // Tambahkan ini gais

// https://vite.dev/config/
export default defineConfig({
  // base: './' memastikan semua aset (CSS/JS) terbaca benar oleh Capacitor Android gais!
  base: './', 
  
  plugins: [vue()],
  
  resolve: {
    alias: {
      // Ini bagian gahar yang bikin @ merujuk ke folder src gais
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Optimasi Build gais agar folder dist selalu bersih
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
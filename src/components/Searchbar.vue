<template>
  <div class="max-w-2xl mx-auto relative group">
    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500 group-focus-within:text-[var(--accent-color)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <input
      v-model="query"
      @input="handleInput"
      type="text"
      :placeholder="t('search_placeholder')"
      class="w-full bg-slate-800/50 border border-slate-700 text-white text-sm rounded-2xl block pl-12 p-4 focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] outline-none transition-all shadow-lg backdrop-blur-md"
    />

    <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none hidden sm:flex">
      <kbd class="px-2 py-1 text-[10px] font-black text-slate-500 bg-slate-900 border border-slate-700 rounded-lg uppercase tracking-widest">
        Enter
      </kbd>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { translations } from '../utils/i18n'; // Import translasi gahar gais!

const props = defineProps(['user']); // Terima data user buat deteksi bahasa gais
const query = ref('');
const emit = defineEmits(['search']);
let timeout = null;

// --- 🌐 LOGIKA TRANSLASI PINTAR GAIS ---
const t = (key) => {
  // Tambahan placeholder ke file i18n kamu gais:
  const searchTranslations = {
    en: { search_placeholder: "Search anime... (e.g. Naruto, One Piece)" },
    id: { search_placeholder: "Cari anime... (contoh: Naruto, One Piece)" },
    jv: { search_placeholder: "Golek anime sak karepmu cak... (Naruto, One Piece)" },
    jp: { search_placeholder: "Anime o kensaku... (Naruto, Wan Pīsu)" }
  };
  
  const lang = props.user?.lang || 'en';
  return searchTranslations[lang][key] || translations[lang][key] || key;
};

const handleInput = () => {
  // Clear timeout sebelumnya jika user masih mengetik
  clearTimeout(timeout);

  // Set timeout 500ms (Debounce) biar API nggak kaget gais
  timeout = setTimeout(() => {
    emit('search', query.value);
  }, 500);
};
</script>

<style scoped>
/* Tambahin sedikit efek glow pas focus gais */
input:focus {
  box-shadow: 0 0 20px var(--accent-glow);
}
</style>
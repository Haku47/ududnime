<template>
  <div class="max-w-2xl mx-auto relative group">
    <BaseInput
      v-model="query"
      @input="handleInput"
      type="text"
      :placeholder="t('search_placeholder')"
      icon="fa-solid fa-magnifying-glass"
      class="shadow-lg shadow-[var(--accent-glow)]/10"
    />

    <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none hidden sm:flex">
      <kbd class="px-2 py-1 text-[10px] font-black text-slate-500 bg-slate-900/50 border border-white/5 rounded-lg uppercase tracking-widest backdrop-blur-sm group-focus-within:text-[var(--accent-color)] group-focus-within:border-[var(--accent-color)]/30 transition-all">
        Enter
      </kbd>
    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue';
import { translations } from '../utils/i18n';

// Lazy load komponen Base gais
const BaseInput = defineAsyncComponent(() => import('./BaseInput.vue'));

const props = defineProps(['user']); 
const query = ref('');
const emit = defineEmits(['search']);
let timeout = null;

// --- 🌐 LOGIKA TRANSLASI PINTAR GAIS ---
const t = (key) => {
  const searchTranslations = {
    en: { search_placeholder: "Search anime... (e.g. Naruto, One Piece)" },
    id: { search_placeholder: "Cari anime... (contoh: Naruto, One Piece)" },
    jv: { search_placeholder: "Golek anime sak karepmu cak... (Naruto, One Piece)" },
    jp: { search_placeholder: "Anime o kensaku... (Naruto, Wan Pīsu)" }
  };
  
  const lang = props.user?.lang || 'en';
  // Fallback ke i18n global jika tidak ada di lokal gais
  return searchTranslations[lang]?.[key] || translations[lang]?.[key] || key;
};

const handleInput = () => {
  // Debounce logic biar API Jikan aman gais
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit('search', query.value);
  }, 500);
};
</script>

<style scoped>
/* Transisi halus buat grup focus gais */
.group:focus-within {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}
</style>
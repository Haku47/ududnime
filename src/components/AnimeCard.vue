<script setup>
import { ref, defineAsyncComponent } from 'vue';

// --- 🛠️ FIX IMPORT PATH GAIS ---
// Gunakan path yang lebih aman agar Vite tidak bingung
const BaseBadge = defineAsyncComponent(() => import('./BaseBadge.vue'));
const BaseIcon = defineAsyncComponent(() => import('./BaseIcon.vue'));

// Jika masih error, coba ganti baris di atas jadi seperti ini gais:
// const BaseBadge = defineAsyncComponent(() => import('../components/BaseBadge.vue'));

defineProps({
  anime: { type: Object, required: true }
});

defineEmits(['showDetail']);

const isLoaded = ref(false);
const handleImageLoad = () => {
  isLoaded.value = true;
};
</script>

<template>
  <div 
    @click="$emit('showDetail', anime)"
    class="group relative bg-slate-800 rounded-[2rem] overflow-hidden border border-slate-700 hover:border-[var(--accent-color)] shadow-lg hover:shadow-[var(--accent-glow)] transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
  >
    <div class="relative aspect-[3/4.2] overflow-hidden bg-slate-900">
      <div v-if="!isLoaded" class="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
        <BaseIcon icon="fa-solid fa-image" size="xl" color="#1e293b" />
      </div>

      <img 
        :src="anime.images.jpg.large_image_url" 
        :alt="anime.title" 
        @load="handleImageLoad"
        class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 opacity-0"
        :class="{ 'opacity-100': isLoaded }"
        loading="lazy"
      />

      <div class="absolute top-3 right-3 z-10">
        <BaseBadge variant="glass" size="sm" rounded="lg" glow>
          <template #icon><span class="text-[var(--accent-color)] italic">★</span></template>
          {{ anime.score || 'N/A' }}
        </BaseBadge>
      </div>

      <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 to-transparent z-10">
        <BaseBadge variant="primary" size="xs" glow>
          {{ anime.type }}
        </BaseBadge>
      </div>

      <div class="absolute inset-0 bg-[#0f172a]/95 p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center z-20 backdrop-blur-sm">
        <p class="text-[10px] text-[var(--accent-color)] font-black uppercase tracking-widest mb-2 italic">Genre</p>
        <div class="flex flex-wrap gap-1.5">
          <BaseBadge 
            v-for="genre in anime.genres.slice(0, 3)" 
            :key="genre.mal_id"
            variant="glass"
            size="xs"
          >
            {{ genre.name }}
          </BaseBadge>
        </div>
        
        <p class="text-[10px] text-slate-400 mt-5 line-clamp-5 leading-relaxed font-medium">
          {{ anime.synopsis || 'Tidak ada deskripsi untuk anime ini gais.' }}
        </p>
        
        <div class="mt-auto text-center pt-4 border-t border-slate-800">
          <span class="text-[9px] text-[var(--accent-color)] font-black uppercase tracking-[0.3em] animate-pulse">
            Full Detail <BaseIcon icon="fa-solid fa-arrow-right" size="xs" />
          </span>
        </div>
      </div>
    </div>

    <div class="p-5">
      <h3 class="text-white font-black text-xs uppercase tracking-tight line-clamp-2 min-h-[32px] group-hover:text-[var(--accent-color)] transition-colors leading-tight">
        {{ anime.title }}
      </h3>
      
      <div class="mt-4 flex items-center justify-between border-t border-slate-700/50 pt-3">
        <div class="flex flex-col">
          <span class="text-[8px] text-slate-500 uppercase font-black tracking-widest">Status</span>
          <BaseBadge 
            :variant="anime.status === 'Currently Airing' ? 'success' : 'glass'" 
            size="xs" 
            class="mt-1"
          >
            {{ anime.status === 'Currently Airing' ? 'Airing' : 'Finished' }}
          </BaseBadge>
        </div>
        <div class="flex flex-col text-right">
          <span class="text-[8px] text-slate-500 uppercase font-black tracking-widest">Episodes</span>
          <span class="text-[10px] text-slate-300 font-bold uppercase">{{ anime.episodes || '?' }} EPS</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* State Clamp tetap dijaga gais */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
.line-clamp-5 {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>
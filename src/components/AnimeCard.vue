<template>
  <div 
    @click="$emit('showDetail', anime)"
    class="group relative bg-slate-800 rounded-[2rem] overflow-hidden border border-slate-700 hover:border-[var(--accent-color)] shadow-lg hover:shadow-[var(--accent-glow)] transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
  >
    <div class="relative aspect-[3/4.2] overflow-hidden bg-slate-900">
      <div v-if="!isLoaded" class="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
        <i class="fa-solid fa-image text-slate-700 text-3xl"></i>
      </div>

      <img 
        :src="anime.images.jpg.large_image_url" 
        :alt="anime.title" 
        @load="handleImageLoad"
        class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 opacity-0"
        :class="{ 'opacity-100': isLoaded }"
        loading="lazy"
      />

      <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/10 z-10">
        <span class="text-[var(--accent-color)] text-xs font-black italic">★</span>
        <span class="text-white text-[10px] font-black italic">{{ anime.score || 'N/A' }}</span>
      </div>

      <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 to-transparent z-10">
        <span class="text-[9px] uppercase tracking-[0.2em] font-black text-white bg-[var(--accent-color)] px-3 py-1 rounded-lg shadow-lg shadow-[var(--accent-glow)]">
          {{ anime.type }}
        </span>
      </div>

      <div class="absolute inset-0 bg-[#0f172a]/95 p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center z-20 backdrop-blur-sm">
        <p class="text-[10px] text-[var(--accent-color)] font-black uppercase tracking-widest mb-2 italic">Genre</p>
        <div class="flex flex-wrap gap-1.5">
          <span v-for="genre in anime.genres" :key="genre.mal_id" class="text-[8px] font-black bg-slate-800 text-slate-300 px-2 py-1 rounded-lg border border-slate-700 uppercase">
            {{ genre.name }}
          </span>
        </div>
        
        <p class="text-[10px] text-slate-400 mt-5 line-clamp-5 leading-relaxed font-medium">
          {{ anime.synopsis || 'Tidak ada deskripsi untuk anime ini gais.' }}
        </p>
        
        <div class="mt-auto text-center pt-4 border-t border-slate-800">
          <span class="text-[9px] text-[var(--accent-color)] font-black uppercase tracking-[0.3em] animate-pulse">View Full Detail →</span>
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
          <span class="text-[10px] text-slate-300 font-bold truncate max-w-[80px]">{{ anime.status }}</span>
        </div>
        <div class="flex flex-col text-right">
          <span class="text-[8px] text-slate-500 uppercase font-black tracking-widest">Episodes</span>
          <span class="text-[10px] text-slate-300 font-bold">{{ anime.episodes || '?' }} EPS</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  anime: {
    type: Object,
    required: true
  }
});

defineEmits(['showDetail']);

// Logika Lazy Fade-In gais
const isLoaded = ref(false);
const handleImageLoad = () => {
  isLoaded.value = true;
};
</script>

<style scoped>
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

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
</style>
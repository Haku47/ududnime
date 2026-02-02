<template>
  <div class="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 bg-[#020617]/95 backdrop-blur-sm transition-all">
    <div class="absolute inset-0" @click="handleClose"></div>

    <div class="bg-slate-900 border border-white/5 w-full max-w-3xl max-h-[85vh] rounded-[2rem] overflow-hidden relative shadow-[0_0_40px_rgba(0,0,0,0.7)] flex flex-col md:flex-row scale-in z-10">
      
      <button @click="handleClose" class="absolute top-4 right-4 z-50 bg-slate-800/80 hover:bg-[var(--accent-color)] text-white p-2 rounded-xl transition-all active:scale-90 border border-white/5 backdrop-blur-md">
        <i class="fa-solid fa-xmark text-sm"></i>
      </button>

      <div class="md:w-[240px] bg-slate-950/50 p-5 flex flex-col border-r border-white/5 overflow-y-auto no-scrollbar">
        <div class="relative group mb-4">
          <img 
            :src="anime.images?.jpg?.large_image_url" 
            :alt="anime.title" 
            class="w-full rounded-2xl shadow-xl object-cover aspect-[3/4.2] border border-white/5 group-hover:border-[var(--accent-color)] transition-all duration-500" 
          />
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
          
          <div class="absolute bottom-3 left-3 right-3 flex justify-between items-center">
            <span class="bg-[var(--accent-color)] text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase shadow-lg shadow-[var(--accent-glow)]">
              {{ anime.type || 'TV' }}
            </span>
            <span class="bg-slate-900/90 text-slate-300 text-[8px] font-black px-2 py-0.5 rounded-md uppercase border border-white/5">
              {{ anime.status || 'N/A' }}
            </span>
          </div>
        </div>

        <button 
          @click="handleWatchlist"
          :class="[
            'w-full py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-2 border mb-4 active:scale-95',
            isBookmarked 
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' 
              : 'bg-[var(--accent-color)] text-white border-white/10 hover:opacity-90 shadow-lg shadow-[var(--accent-glow)]'
          ]"
        >
          <i :class="['fa-solid', isBookmarked ? 'fa-check' : 'fa-plus']"></i>
          {{ isBookmarked ? t('in_watchlist') : t('add_watchlist') }}
        </button>

        <div class="grid grid-cols-2 gap-2">
          <div class="bg-slate-900/80 p-2.5 rounded-xl border border-white/5 text-center">
            <p class="text-[8px] font-black text-slate-500 uppercase mb-0.5">Rating</p>
            <p class="text-sm font-black text-[var(--accent-color)] italic">⭐ {{ anime.score || '0.0' }}</p>
          </div>
          <div class="bg-slate-900/80 p-2.5 rounded-xl border border-white/5 text-center">
            <p class="text-[8px] font-black text-slate-500 uppercase mb-0.5">Rank</p>
            <p class="text-sm font-black text-white italic">#{{ anime.rank || '??' }}</p>
          </div>
        </div>
      </div>

      <div class="flex-1 p-6 md:p-8 overflow-y-auto custom-scroll bg-gradient-to-br from-slate-900 to-slate-950">
        <div class="mb-5 text-left">
          <h2 class="text-xl md:text-2xl font-black text-white leading-tight mb-1 uppercase tracking-tighter italic">
            {{ anime.title }}
          </h2>
          <div class="flex items-center gap-3">
             <p class="text-[10px] text-[var(--accent-color)] font-bold uppercase">{{ anime.title_japanese }}</p>
             <div class="h-1 w-1 bg-slate-700 rounded-full"></div>
             <p class="text-[10px] text-slate-500 font-black uppercase">{{ anime.duration || 'N/A' }}</p>
          </div>
        </div>

        <div v-if="anime.trailer?.embed_url" class="relative aspect-video mb-6 rounded-2xl overflow-hidden bg-black border border-white/5 shadow-xl">
          <iframe :src="anime.trailer.embed_url" class="w-full h-full" frameborder="0" allowfullscreen></iframe>
        </div>

        <div class="space-y-5 text-left">
          <div>
            <h3 class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 italic">{{ t('synopsis') }}</h3>
            <p class="text-[11px] md:text-xs text-slate-400 leading-relaxed font-medium">
              {{ anime.synopsis || t('no_synopsis') }}
            </p>
          </div>

          <div>
            <h3 class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 italic">{{ t('categories') }}</h3>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="genre in anime.genres" :key="genre.mal_id" class="text-[8px] font-black bg-slate-800/50 text-slate-300 px-3 py-1 rounded-lg border border-white/5 hover:border-[var(--accent-color)] hover:text-white transition-colors cursor-default">
                {{ genre.name }}
              </span>
            </div>
          </div>

          <div class="py-4 border-t border-white/5 flex flex-col gap-3">
            <h3 class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic">{{ t('share_anime') }}</h3>
            <div class="flex gap-2">
              <button @click="shareAction('whatsapp')" class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all active:scale-90 flex items-center justify-center">
                <i class="fa-brands fa-whatsapp text-lg"></i>
              </button>
              <button @click="shareAction('twitter')" class="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-500 hover:bg-sky-500 hover:text-white transition-all active:scale-90 flex items-center justify-center">
                <i class="fa-brands fa-x-twitter text-lg"></i>
              </button>
              <button @click="shareAction('copy')" class="flex-1 h-10 rounded-xl bg-slate-800/50 border border-white/5 text-slate-400 hover:border-[var(--accent-color)] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-widest">
                <i class="fa-solid fa-link"></i>
                {{ t('copy_link') }}
              </button>
            </div>
          </div>
          
          <div class="pt-3 border-t border-white/5 flex justify-between items-center text-[9px] font-black uppercase">
            <span class="text-slate-500 italic">{{ t('release') }}: {{ anime.aired?.string || 'Unknown' }}</span>
            <span class="text-[var(--accent-color)]">{{ anime.episodes || '?' }} Episodes</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { translations } from '../utils/i18n';

const props = defineProps(['anime', 'user']);
const emit = defineEmits(['close', 'toggleWatchlist', 'openAuth', 'addToast']);

const t = (key) => {
  const lang = props.user?.lang || 'en';
  return translations[lang][key] || key;
};

const isBookmarked = computed(() => {
  if (!props.user?.watchlist || !props.anime?.mal_id) return false;
  return props.user.watchlist.some(item => item.id === props.anime.mal_id);
});

const handleClose = () => {
  emit('close');
};

const handleWatchlist = () => {
  if (!props.user) {
    emit('openAuth');
    return;
  }
  emit('toggleWatchlist', {
    id: props.anime.mal_id,
    title: props.anime.title,
    image: props.anime.images?.jpg?.image_url,
    type: props.anime.type,
    status: props.anime.status,
    genres: props.anime.genres,
  });
};

// --- 🌐 FUNGSI SHARE DENGAN PERMALINK BARU GAIS ---
const shareAction = (platform) => {
  // Link sekarang merujuk ke AnimeShowView gais: /anime/:id
  const shareUrl = `${window.location.origin}/anime/${props.anime.mal_id}`;
  const shareText = `Gais, cek anime "${props.anime.title}" di Ududnime! Mbois pol ker! 🍹🔥`;

  if (platform === 'whatsapp') {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
  } else if (platform === 'twitter') {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  } else if (platform === 'copy') {
    navigator.clipboard.writeText(shareUrl);
    alert(t('link_copied')); 
  }
};

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
  }
});

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
});
</script>
<template>
  <div class="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-6 bg-[#020617]/95 backdrop-blur-sm transition-all">
    <div class="absolute inset-0" @click="handleClose"></div>

    <div class="bg-slate-900 border border-white/5 w-full max-w-4xl max-h-[95vh] md:max-h-[85vh] rounded-[2rem] overflow-hidden relative shadow-[0_0_40px_rgba(0,0,0,0.7)] flex flex-col md:flex-row scale-in z-10">
      
      <button @click="handleClose" class="absolute top-4 right-4 z-50 bg-slate-800/80 hover:bg-[var(--accent-color)] text-white p-2 rounded-xl transition-all active:scale-90 border border-white/5 backdrop-blur-md">
        <BaseIcon icon="fa-solid fa-xmark" size="sm" />
      </button>

      <div class="w-full md:w-[280px] bg-slate-950/50 p-5 flex flex-col border-b md:border-b-0 md:border-r border-white/5 overflow-y-auto no-scrollbar shrink-0">
        <div class="flex md:flex-col gap-5 md:gap-0">
          <div class="relative group mb-0 md:mb-4 w-[120px] md:w-full shrink-0">
            <img 
              :src="anime.images?.jpg?.large_image_url" 
              :alt="anime.title" 
              class="w-full rounded-2xl shadow-xl object-cover aspect-[3/4.2] border border-white/5 group-hover:border-[var(--accent-color)] transition-all duration-500" 
            />
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 hidden md:block"></div>
            
            <div class="absolute bottom-3 left-3 right-3 hidden md:flex justify-between items-center">
              <BaseBadge variant="primary" size="xs" rounded="md" glow>{{ anime.type || 'TV' }}</BaseBadge>
              <BaseBadge variant="glass" size="xs" rounded="md">{{ anime.status || 'N/A' }}</BaseBadge>
            </div>
          </div>

          <div class="flex-1 flex flex-col justify-center md:block">
            <h2 class="md:hidden text-lg font-black text-white leading-tight mb-3 uppercase italic line-clamp-2">
              {{ anime.title }}
            </h2>

            <BaseButton 
              @click="handleWatchlist"
              :variant="isBookmarked ? 'glass' : 'primary'"
              size="md"
              class="w-full mb-3 md:mb-4 !py-3 md:!py-4"
              :class="{ 'text-emerald-500 border-emerald-500/30': isBookmarked }"
            >
              <template #icon-left>
                <BaseIcon :icon="isBookmarked ? 'fa-solid fa-check' : 'fa-solid fa-plus'" size="sm" />
              </template>
              <span class="text-[9px] md:text-xs">{{ isBookmarked ? t('in_watchlist') : t('add_watchlist') }}</span>
            </BaseButton>

            <div class="grid grid-cols-2 gap-2">
              <div class="bg-slate-900/80 p-2 md:p-2.5 rounded-xl border border-white/5 text-center">
                <p class="text-[7px] md:text-[8px] font-black text-slate-500 uppercase mb-0.5">Rating</p>
                <p class="text-xs md:text-sm font-black text-[var(--accent-color)] italic">⭐ {{ anime.score || '0.0' }}</p>
              </div>
              <div class="bg-slate-900/80 p-2 md:p-2.5 rounded-xl border border-white/5 text-center">
                <p class="text-[7px] md:text-[8px] font-black text-slate-500 uppercase mb-0.5">Rank</p>
                <p class="text-xs md:text-sm font-black text-white italic">#{{ anime.rank || '??' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 p-5 md:p-8 overflow-y-auto custom-scroll bg-gradient-to-br from-slate-900 to-slate-950">
        <div class="hidden md:block mb-5 text-left">
          <h2 class="text-2xl font-black text-white leading-tight mb-1 uppercase tracking-tighter italic">
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

        <div class="space-y-6 text-left">
          <div>
            <h3 class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 italic">{{ t('synopsis') }}</h3>
            <p class="text-[11px] md:text-xs text-slate-400 leading-relaxed font-medium">
              {{ anime.synopsis || t('no_synopsis') }}
            </p>
          </div>

          <div>
            <h3 class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 italic">{{ t('categories') }}</h3>
            <div class="flex flex-wrap gap-1.5">
              <BaseBadge 
                v-for="genre in anime.genres" 
                :key="genre.mal_id"
                variant="glass"
                size="xs"
                class="hover:border-[var(--accent-color)] hover:text-white transition-all"
              >
                {{ genre.name }}
              </BaseBadge>
            </div>
          </div>

          <div class="py-4 border-t border-white/5 flex flex-col gap-3">
            <h3 class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic">{{ t('share_anime') }}</h3>
            <div class="flex gap-2">
              <BaseButton variant="secondary" size="sm" @click="shareAction('whatsapp')" class="!bg-emerald-500/10 !text-emerald-500 !border-emerald-500/20 hover:!bg-emerald-500 hover:!text-white">
                <template #icon-left><BaseIcon icon="fa-brands fa-whatsapp" size="lg" /></template>
              </BaseButton>
              <BaseButton variant="secondary" size="sm" @click="shareAction('twitter')" class="!bg-sky-500/10 !text-sky-500 !border-sky-500/20 hover:!bg-sky-500 hover:!text-white">
                <template #icon-left><BaseIcon icon="fa-brands fa-x-twitter" size="lg" /></template>
              </BaseButton>
              <BaseButton variant="secondary" size="sm" @click="shareAction('copy')" class="flex-1">
                <template #icon-left><BaseIcon icon="fa-solid fa-link" size="sm" /></template>
                {{ t('copy_link') }}
              </BaseButton>
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
import { computed, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import { translations } from '../utils/i18n';

const BaseButton = defineAsyncComponent(() => import('./BaseButton.vue'));
const BaseBadge = defineAsyncComponent(() => import('./BaseBadge.vue'));
const BaseIcon = defineAsyncComponent(() => import('./BaseIcon.vue'));

const props = defineProps(['anime', 'user']);
const emit = defineEmits(['close', 'toggleWatchlist', 'openAuth', 'addToast']);

const t = (key) => {
  const lang = props.user?.lang || 'en';
  return translations[lang]?.[key] || key;
};

const isBookmarked = computed(() => {
  if (!props.user?.watchlist || !props.anime?.mal_id) return false;
  return props.user.watchlist.some(item => item.id === props.anime.mal_id);
});

const handleClose = () => emit('close');

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

const shareAction = (platform) => {
  const shareUrl = `${window.location.origin}/anime/${props.anime.mal_id}`;
  const shareText = `Gais, cek anime "${props.anime.title}" di Ududnime! Mbois pol ker! 🍹🔥`;

  if (platform === 'whatsapp') {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
  } else if (platform === 'twitter') {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  } else if (platform === 'copy') {
    navigator.clipboard.writeText(shareUrl);
    emit('addToast', `${props.anime.title} Link Copied! 🚀`, 'success');
  }
};

onMounted(() => {
  if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
  if (typeof document !== 'undefined') document.body.style.overflow = '';
});
</script>
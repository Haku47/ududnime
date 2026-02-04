<template>
  <div class="relative font-inter" ref="notifContainer">
    <button 
      @click.stop="toggleDropdown" 
      class="w-10 h-10 flex items-center justify-center relative bg-white/5 hover:bg-[var(--accent-bg)] rounded-full border border-white/10 hover:border-[var(--accent-color)] transition-all group outline-none active:scale-90"
    >
      <i class="fa-solid fa-bell text-slate-400 group-hover:text-[var(--accent-color)] transition-colors text-sm"></i>
      
      <span v-if="notifCount > 0" class="absolute top-0 right-0 flex h-3.5 w-3.5">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-color)] opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-[var(--accent-color)] text-[7px] font-black items-center justify-center text-white shadow-sm shadow-[var(--accent-glow)]">
          {{ notifCount }}
        </span>
      </span>
    </button>

    <transition name="pop-notif">
      <div 
        v-if="isOpen" 
        class="fixed md:absolute right-4 md:right-0 left-4 md:left-auto mt-4 md:w-[380px] bg-slate-900/95 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden z-[150] backdrop-blur-2xl"
      >
        <div class="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 bg-[var(--accent-color)] rounded-full shadow-[0_0_10px_var(--accent-glow)]" :class="{'animate-pulse': !loading}"></div>
            <h3 class="text-[10px] font-black uppercase text-white tracking-[0.3em] italic">{{ t('radar_title') }}</h3>
          </div>
          <button @click="closeDropdown" class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
            <i class="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>

        <div class="max-h-[60vh] md:max-h-[420px] overflow-y-auto no-scrollbar custom-scroll">
          <div v-if="loading" class="p-16 text-center">
            <div class="animate-spin h-8 w-8 border-2 border-[var(--accent-color)] border-t-transparent rounded-full mx-auto mb-6 shadow-[0_0_15px_var(--accent-glow)]"></div>
            <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">{{ t('loading_jikan') }}</p>
          </div>

          <div v-else-if="notifItems.length > 0" class="p-2 space-y-1">
            <div 
              v-for="anime in notifItems" 
              :key="anime.mal_id" 
              @click="handleOpen(anime)"
              class="p-4 rounded-[1.5rem] hover:bg-white/5 cursor-pointer flex gap-5 transition-all group relative overflow-hidden text-left"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-[var(--accent-color)]/0 to-[var(--accent-color)]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div class="relative shrink-0">
                <img :src="anime.images?.webp?.small_image_url || anime.images?.jpg?.small_image_url" class="w-12 h-16 rounded-2xl object-cover border border-white/10 group-hover:border-[var(--accent-color)] group-hover:scale-105 transition-all duration-500 shadow-xl" />
                <div class="absolute -top-1 -right-1 bg-[var(--accent-color)] w-3 h-3 rounded-full border-2 border-slate-900 shadow-lg shadow-[var(--accent-glow)]"></div>
              </div>
              
              <div class="flex-1 min-w-0 z-10">
                <div class="flex justify-between items-start mb-2">
                  <p class="text-[8px] font-black text-[var(--accent-color)] uppercase italic tracking-widest">Handshake OK</p>
                  <span class="text-[9px] font-black text-white uppercase bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    {{ anime.broadcast?.time || '??:??' }}
                  </span>
                </div>
                <h4 class="text-[11px] font-black text-slate-200 uppercase leading-snug line-clamp-2 group-hover:text-[var(--accent-color)] transition-colors">
                  {{ anime.title }}
                </h4>
              </div>
            </div>
          </div>

          <div v-else class="p-20 text-center">
              <i class="fa-solid fa-satellite-dish text-5xl text-slate-800 mb-6 block animate-bounce"></i>
              <p class="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] leading-loose italic">
                {{ t('empty') }}
              </p>
          </div>
        </div>

        <div class="p-5 bg-black/40 text-center border-t border-white/5 backdrop-blur-md">
          <button 
            @click="router.push('/schedule'); closeDropdown();" 
            class="group relative h-12 flex items-center justify-center bg-white/5 rounded-full text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-[0.3em] transition-all border border-white/5 overflow-hidden active:scale-95 w-full"
          >
            <div class="absolute inset-0 bg-[var(--accent-color)] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <span class="relative z-10 flex items-center justify-center w-full gap-4 font-black group/text">
              <span class="tracking-[0.3em] group-hover:text-white transition-all duration-500 ease-out pl-4 uppercase">
                {{ t('schedule') }} {{ t('explorer_mode') }}
              </span> 
              
              <div class="relative w-8 h-8 flex items-center justify-center shrink-0 mr-2">
                <div class="absolute inset-0 border-2 border-white/20 rounded-full scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-40 transition-all duration-500"></div>
                <i class="fa-solid fa-arrow-right absolute text-xs transition-all duration-500 group-hover:opacity-0"></i>
                <i class="fa-solid fa-bolt-lightning absolute scale-0 opacity-0 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100 text-white"></i>
              </div>
            </span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { translations } from '../utils/i18n';

const router = useRouter();
const isOpen = ref(false);
const loading = ref(false);
const notifItems = ref([]);
const notifCount = ref(0);
const notifContainer = ref(null);
const emit = defineEmits(['openDetail']);

// 🌐 LOGIKA TRANSLASI GAIS
const t = (key) => {
  const session = localStorage.getItem('ududnime_session');
  let lang = 'en';
  if (session) {
    try { lang = JSON.parse(session).lang || 'en'; } catch (e) { lang = 'en'; }
  }
  
  // Custom keys khusus notif gais kalau belum ada di i18n.js
  const extra = {
    en: { radar_title: "Release Radar Today" },
    id: { radar_title: "Radar Rilis Hari Ini" }
  };

  return extra[lang]?.[key] || translations[lang]?.[key] || translations['en']?.[key] || key;
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value && notifItems.value.length === 0) fetchTodayNotif();
};

const closeDropdown = () => { isOpen.value = false; };

const handleClickOutside = (event) => {
  if (notifContainer.value && !notifContainer.value.contains(event.target)) closeDropdown();
};

const handleOpen = (anime) => {
  closeDropdown();
  emit('openDetail', anime);
};

const fetchTodayNotif = async () => {
  loading.value = true;
  try {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const res = await fetch(`https://api.jikan.moe/v4/schedules?filter=${today}&limit=6`);
    const data = await res.json();
    
    const sortedData = (data.data || []).sort((a, b) => {
      return (a.broadcast?.time || '00:00').localeCompare(b.broadcast?.time || '00:00');
    });

    notifItems.value = sortedData;
    notifCount.value = sortedData.length;
  } catch (error) {
    console.error("Gagal ambil notif:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchTodayNotif();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.pop-notif-enter-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.pop-notif-leave-active { transition: all 0.2s ease-in; }
.pop-notif-enter-from, .pop-notif-leave-to { transform: scale(0.9) translateY(-10px); opacity: 0; }
.custom-scroll::-webkit-scrollbar { width: 4px; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
</style>
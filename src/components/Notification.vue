<template>
  <div class="relative font-inter" ref="notifContainer">
    <button 
      @click.stop="toggleDropdown" 
      class="relative p-2.5 bg-slate-800/50 hover:bg-[var(--accent-bg)] rounded-xl border border-slate-700 hover:border-[var(--accent-color)] transition-all group outline-none"
    >
      <i class="fa-solid fa-bell text-slate-400 group-hover:text-[var(--accent-color)] transition-colors"></i>
      
      <span v-if="notifCount > 0" class="absolute -top-1 -right-1 flex h-4 w-4">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-color)] opacity-75"></span>
        <span class="relative inline-flex rounded-full h-4 w-4 bg-[var(--accent-color)] text-[8px] font-black items-center justify-center text-white shadow-sm shadow-[var(--accent-glow)]">
          {{ notifCount }}
        </span>
      </span>
    </button>

    <transition name="slide-fade">
      <div 
        v-if="isOpen" 
        class="fixed md:absolute right-4 md:right-0 left-4 md:left-auto mt-4 md:w-96 bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden z-[150] backdrop-blur-xl"
      >
        <div class="p-5 md:p-6 border-b border-white/5 bg-slate-800/30 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 bg-[var(--accent-color)] rounded-full shadow-[0_0_8px_var(--accent-glow)]" :class="{'animate-pulse': !loading}"></div>
            <h3 class="text-[10px] font-black uppercase text-white tracking-[0.2em]">RILIS HARI INI</h3>
          </div>
          <button @click="closeDropdown" class="text-slate-500 hover:text-white transition-colors">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="max-h-[60vh] md:max-h-[400px] overflow-y-auto no-scrollbar">
          <div v-if="loading" class="p-12 text-center">
            <div class="animate-spin h-6 w-6 border-2 border-[var(--accent-color)] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p class="text-[8px] font-black text-slate-600 uppercase tracking-widest">Sinkronisasi Jadwal...</p>
          </div>

          <div v-else-if="notifItems.length > 0" class="divide-y divide-white/5">
            <div 
              v-for="anime in notifItems" 
              :key="anime.mal_id" 
              @click="handleOpen(anime)"
              class="p-4 md:p-5 hover:bg-[var(--accent-bg)] cursor-pointer flex gap-4 transition-colors group"
            >
              <div class="relative shrink-0">
                <img :src="anime.images?.webp?.small_image_url || anime.images?.jpg?.small_image_url" class="w-10 h-14 md:w-12 md:h-16 rounded-xl object-cover border border-slate-800 group-hover:border-[var(--accent-color)] transition-all" />
                <div class="absolute -top-1 -right-1 bg-[var(--accent-color)] w-2.5 h-2.5 rounded-full border-2 border-slate-900 shadow-sm shadow-[var(--accent-glow)]"></div>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start mb-1">
                  <p class="text-[8px] font-black text-[var(--accent-color)] uppercase italic tracking-wider">Airing Now</p>
                  <span class="text-[8px] font-black text-slate-500 uppercase bg-slate-800 px-1.5 py-0.5 rounded border border-white/5">
                    {{ anime.broadcast?.time || '??:??' }}
                  </span>
                </div>
                <h4 class="text-[10px] md:text-[11px] font-bold text-slate-100 uppercase leading-snug line-clamp-2 group-hover:text-white transition-colors">
                  {{ anime.title }}
                </h4>
              </div>
            </div>
          </div>

          <div v-else class="p-12 text-center">
             <i class="fa-solid fa-calendar-day text-3xl text-slate-800 mb-4 block"></i>
             <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-loose italic">
                Belum ada data rilis<br>untuk hari ini gais.
             </p>
          </div>
        </div>

        <div class="p-4 bg-slate-800/20 text-center border-t border-white/5">
          <button 
            @click="router.push('/schedule'); closeDropdown();" 
            class="text-[9px] font-black text-slate-500 hover:text-[var(--accent-color)] uppercase tracking-widest transition-colors w-full"
          >
            LIHAT JADWAL LENGKAP →
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isOpen = ref(false);
const loading = ref(false);
const notifItems = ref([]);
const notifCount = ref(0);
const notifContainer = ref(null);
const emit = defineEmits(['openDetail']);

const toggleDropdown = (e) => {
  isOpen.value = !isOpen.value;
  if (isOpen.value && notifItems.value.length === 0) {
    fetchTodayNotif();
  }
};

const closeDropdown = () => {
  isOpen.value = false;
};

const handleClickOutside = (event) => {
  if (notifContainer.value && !notifContainer.value.contains(event.target)) {
    closeDropdown();
  }
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
.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1); }
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
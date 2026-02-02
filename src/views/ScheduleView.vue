<template>
  <div class="min-h-screen bg-[#020617] text-slate-100 font-inter selection:bg-[var(--accent-glow)] overflow-x-hidden">
    <Toast ref="toastRef" />

    <Navbar 
      :user="currentUser" 
      @goHome="router.push('/')" 
      @openDashboard="handleOpenDashboard"
      @logout="handleLogout"
      @openAuth="showAuth = true"
    />

    <main class="container mx-auto px-4 py-12 relative z-10">
      <header class="mb-10 fade-in">
        <div class="flex items-center gap-4 mb-4">
          <div class="h-10 w-2 bg-[var(--accent-color)] rounded-full shadow-[0_0_15px_var(--accent-glow)]"></div>
          <h1 class="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
            RELEASE <span class="text-[var(--accent-color)]">SCHEDULE</span>
          </h1>
        </div>
        <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] opacity-80 italic">
          Jadwal rilis anime real-time — Berdasarkan waktu rilis Jepang
        </p>
      </header>

      <div class="relative mb-12 fade-in">
        <div class="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x scroll-smooth">
          <button 
            v-for="day in days" 
            :key="day"
            @click="activeDay = day"
            :class="[
              'px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all border snap-start whitespace-nowrap',
              activeDay === day 
                ? 'bg-[var(--accent-color)] border-white/10 text-white shadow-xl shadow-[var(--accent-glow)] scale-105' 
                : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-300 hover:border-slate-600'
            ]"
          >
            {{ day }}
          </button>
        </div>
        <div class="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[#020617] to-transparent pointer-events-none md:hidden"></div>
      </div>

      <div v-if="loading" class="flex flex-col justify-center items-center py-32 gap-6">
        <div class="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[var(--accent-color)] shadow-[0_0_20px_var(--accent-glow)]"></div>
        <p class="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-color)] animate-pulse">MENARIK DATA JIKAN...</p>
      </div>

      <div v-else>
        <div v-if="scheduleList.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10 fade-in">
          <AnimeCard 
            v-for="anime in scheduleList" 
            :key="anime.mal_id" 
            :anime="anime" 
            @showDetail="openDetail" 
          />
        </div>
        <div v-else class="text-center py-32 bg-slate-900/40 rounded-[3rem] border-2 border-dashed border-white/5">
          <i class="fa-solid fa-calendar-xmark text-4xl text-slate-800 mb-6 block"></i>
          <p class="text-slate-600 text-[11px] font-black uppercase tracking-[0.4em]">TIDAK ADA JADWAL HARI INI.</p>
        </div>
      </div>
    </main>

    <AuthModal v-if="showAuth" @close="showAuth = false" @authSuccess="handleAuthSuccess" />
    
    <DashboardModal 
      v-if="showDashboard" 
      :user="currentUser" 
      @close="handleCloseDashboard" 
      @logout="handleLogout" 
      @updateUser="handleUpdateUser" 
      @removeFromWatchlist="(id) => handleToggleWatchlist({id})"
    />

    <DetailModal 
      v-if="selectedAnime" 
      :anime="selectedAnime" 
      :user="currentUser"
      @close="selectedAnime = null" 
      @toggleWatchlist="handleToggleWatchlist"
      @openAuth="showAuth = true"
    />

    <footer class="text-center py-16 border-t border-white/5 mt-20 bg-slate-950/50">
      <p class="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em]">
        &copy; 2026 UDUDNIME — MALANG, INDONESIA
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, defineAsyncComponent, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { animeService } from '../services/api';

const Navbar = defineAsyncComponent(() => import('../components/Navbar.vue'));
const AnimeCard = defineAsyncComponent(() => import('../components/AnimeCard.vue'));
const DetailModal = defineAsyncComponent(() => import('../components/DetailModal.vue'));
const AuthModal = defineAsyncComponent(() => import('../components/AuthModal.vue'));
const DashboardModal = defineAsyncComponent(() => import('../components/DashboardModal.vue'));
const Toast = defineAsyncComponent(() => import('../components/Toast.vue'));

const router = useRouter();
const currentUser = ref(null);
const scheduleList = ref([]);
const loading = ref(false);
const selectedAnime = ref(null);
const showAuth = ref(false);
const showDashboard = ref(false);
const toastRef = ref(null);

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const getToday = () => {
  const dayIndex = new Date().getDay();
  return days[dayIndex === 0 ? 6 : dayIndex - 1];
};

const activeDay = ref(getToday());

const fetchSchedule = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const res = await animeService.getSchedule(activeDay.value);
    scheduleList.value = (res.data || []).sort((a, b) => (b.score || 0) - (a.score || 0));
  } catch (error) {
    toastRef.value?.addToast("GAGAL LOAD JADWAL!", "error");
  } finally {
    loading.value = false;
  }
};

const handleOpenDashboard = () => {
  showDashboard.value = true;
  nextTick(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  });
};

const handleCloseDashboard = () => {
  showDashboard.value = false;
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
};

const handleAuthSuccess = (user) => {
  currentUser.value = user;
  showAuth.value = false;
  toastRef.value?.addToast(`HALO ${user.username.toUpperCase()}!`, "success");
};

const handleUpdateUser = (updatedUser) => {
  currentUser.value = updatedUser;
  localStorage.setItem('ududnime_session', JSON.stringify(updatedUser));
  // Sinkronisasi warna tema jika ada perubahan gais
  if (updatedUser.themeColor) {
    document.documentElement.style.setProperty('--accent-color', updatedUser.themeColor);
    document.documentElement.style.setProperty('--accent-glow', `${updatedUser.themeColor}66`);
  }
};

const handleLogout = () => {
  localStorage.removeItem('ududnime_session');
  currentUser.value = null;
  handleCloseDashboard();
  toastRef.value?.addToast("BERHASIL LOGOUT!", "info");
};

const openDetail = (anime) => { selectedAnime.value = anime; };

const handleToggleWatchlist = (animeData) => {
  if (!currentUser.value) { showAuth.value = true; return; }
  let user = { ...currentUser.value };
  if (!user.watchlist) user.watchlist = [];
  const idx = user.watchlist.findIndex(i => i.id === animeData.id);
  
  if (idx === -1) {
    user.watchlist.push(animeData);
    toastRef.value?.addToast("MASUK WATCHLIST!", "success");
  } else {
    user.watchlist.splice(idx, 1);
    toastRef.value?.addToast("DIHAPUS DARI LIST!", "info");
  }
  
  currentUser.value = user;
  localStorage.setItem('ududnime_session', JSON.stringify(user));
};

onMounted(() => {
  const session = localStorage.getItem('ududnime_session');
  if (session) {
    const user = JSON.parse(session);
    currentUser.value = user;
    // Terapkan tema saat load gais
    if (user.themeColor) {
      document.documentElement.style.setProperty('--accent-color', user.themeColor);
      document.documentElement.style.setProperty('--accent-glow', `${user.themeColor}66`);
    }
  }
  fetchSchedule();
});

onUnmounted(() => {
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
});

watch(activeDay, () => fetchSchedule());
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.fade-in { animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
@keyframes fadeIn { 
  from { opacity: 0; transform: translateY(15px); } 
  to { opacity: 1; transform: translateY(0); } 
}
</style>
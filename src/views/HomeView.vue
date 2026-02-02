<script setup>
import { ref, onMounted, onUnmounted, watch, defineAsyncComponent, nextTick, computed } from 'vue'; 
import { useRoute, useRouter } from 'vue-router'; 
import { animeService } from '../services/api';
import { translations } from '../utils/i18n';

// --- OPTIMASI: LAZY LOADING KOMPONEN ---
const Navbar = defineAsyncComponent(() => import('../components/Navbar.vue'));
const SearchBar = defineAsyncComponent(() => import('../components/SearchBar.vue'));
const AnimeCard = defineAsyncComponent(() => import('../components/AnimeCard.vue'));
const DetailModal = defineAsyncComponent(() => import('../components/DetailModal.vue'));
const AuthModal = defineAsyncComponent(() => import('../components/AuthModal.vue'));
const LoadingScreen = defineAsyncComponent(() => import('../components/LoadingScreen.vue'));
const DashboardModal = defineAsyncComponent(() => import('../components/DashboardModal.vue'));
const Toast = defineAsyncComponent(() => import('../components/Toast.vue'));
const ApiStatus = defineAsyncComponent(() => import('../components/ApiStatus.vue'));
const ScheduleMiniView = defineAsyncComponent(() => import('../views/ScheduleMiniView.vue'));

// --- STATE MANAGEMENT ---
const route = useRoute(); 
const router = useRouter();
const animeList = ref([]);
const top10List = ref([]); 
const loading = ref(false);
const top10Loading = ref(false);
const loadingMore = ref(false);
const title = ref("Explore Universe");
const page = ref(1);
const searchQuery = ref("");
const hasNextPage = ref(true);

// --- TOP 10 FILTER STATE DENGAN ID TRANSLASI GAIS ---
const top10Filter = ref('airing'); 
const filters = [
  { id: 'airing', key: 'filter_today' },
  { id: 'bypopularity', key: 'filter_weekly' },
  { id: 'favorite', key: 'filter_monthly' }
];

// --- UI STATE ---
const isInitialLoading = ref(true);
const selectedAnime = ref(null);
const showAuth = ref(false);
const showDashboard = ref(false);
const initialDashboardTab = ref('watchlist');
const currentUser = ref(null); 
const toastRef = ref(null);

const activeTopIndex = ref(0);
const top10ScrollRef = ref(null);
const scrollProgress = ref(0); 
let progressInterval = null;

// --- 🌐 LOGIKA TRANSLASI GAIS ---
const t = (key) => {
  const lang = currentUser.value?.lang || 'en';
  const filterTranslations = {
    en: { filter_today: "Today", filter_weekly: "Weekly", filter_monthly: "Monthly", trending_title: "Trending" },
    id: { filter_today: "Hari Ini", filter_weekly: "Mingguan", filter_monthly: "Bulanan", trending_title: "Populer" },
    jv: { filter_today: "Dino Iki", filter_weekly: "Mingguan", filter_monthly: "Wulanan", trending_title: "Sakti" },
    jp: { filter_today: "Kyō", filter_weekly: "Shūkan", filter_monthly: "Gekkan", trending_title: "Toréndo" }
  };
  return filterTranslations[lang]?.[key] || translations[lang]?.[key] || key;
};

// --- ❄️ LOGIKA MUSIM (SEASONAL) ---
const getCurrentSeason = () => {
  const month = new Date().getMonth(); 
  if (month >= 0 && month <= 2) return 'winter';
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  return 'fall';
};

const handleSeasonalLoad = async () => {
  const season = getCurrentSeason();
  const year = 2026;
  searchQuery.value = "";
  title.value = `SEASONAL: ${season.toUpperCase()} ${year}`;
  loading.value = true;
  page.value = 1;
  scrollToTop();

  try {
    const res = await animeService.getExplorer('season', season);
    animeList.value = res.data || [];
    hasNextPage.value = false;
    toastRef.value?.addToast(`LOADED ${season.toUpperCase()} 2026!`, "success");
  } catch (error) {
    toastRef.value?.addToast("GAGAL LOAD SEASON!", "error");
  } finally {
    loading.value = false;
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// --- XP & LEVEL SYSTEM BRAIN ---
const processUserProgress = (userObj, showGeneralToast = false) => {
  let user = { ...userObj };
  if (user.themeColor) {
    document.documentElement.style.setProperty('--accent-color', user.themeColor);
    document.documentElement.style.setProperty('--accent-glow', `${user.themeColor}66`);
  }
  if (user.xp >= 100) {
    const levelsToGain = Math.floor(user.xp / 100);
    user.level = (user.level || 1) + levelsToGain;
    user.xp = user.xp % 100;
    toastRef.value?.addToast(`LEVEL UP! SEKARANG LVL ${user.level}! 🚀`, 'level', 'fa-solid fa-rocket');
  }
  currentUser.value = user;
  localStorage.setItem('ududnime_session', JSON.stringify(user));
  if (showGeneralToast) toastRef.value?.addToast("KONFIGURASI DISIMPAN!", 'success', 'fa-solid fa-user-pen');
};

const gainXP = (amount) => {
  if (!currentUser.value) return;
  let user = { ...currentUser.value };
  user.xp = (user.xp || 0) + amount;
  toastRef.value?.addToast(`+${amount} XP DITERIMA!`, 'level', 'fa-solid fa-bolt');
  processUserProgress(user);
};

// --- HANDLERS ---
const handleToggleWatchlist = (animeData) => {
  if (!currentUser.value) {
    toastRef.value?.addToast("LOGIN DULU GAIS!", 'error', 'fa-solid fa-user-lock');
    showAuth.value = true;
    return;
  }
  let user = { ...currentUser.value };
  if (!user.watchlist) user.watchlist = [];
  const index = user.watchlist.findIndex(item => item.id === animeData.id);
  if (index === -1) {
    user.watchlist.push(animeData);
    toastRef.value?.addToast("BERHASIL DITAMBAHKAN!", 'success', 'fa-solid fa-heart');
    gainXP(25);
  } else {
    user.watchlist.splice(index, 1);
    toastRef.value?.addToast("DIHAPUS DARI LIST!", 'info', 'fa-solid fa-heart-crack');
    processUserProgress(user);
  }
};

const handleRemoveFromWatchlist = (animeId) => {
  if (!currentUser.value) return;
  let user = { ...currentUser.value };
  user.watchlist = user.watchlist.filter(item => item.id !== animeId);
  toastRef.value?.addToast("LIST DIPERBARUI!", 'info', 'fa-solid fa-trash-can');
  processUserProgress(user);
};

const handleSearch = (query) => { 
  searchQuery.value = query; 
  title.value = !query ? "Explore Universe" : `HASIL: ${query.toUpperCase()}`; 
  fetchAnimeData();
  scrollToTop();
};

// --- DATA FETCHING ---
const fetchAnimeData = async (isLoadMore = false) => {
  if (loading.value || (isLoadMore && loadingMore.value)) return;
  if (isLoadMore) { loadingMore.value = true; page.value++; } 
  else { loading.value = true; page.value = 1; animeList.value = []; }
  try {
    const res = searchQuery.value 
      ? await animeService.searchAnime(searchQuery.value, page.value, 15)
      : await animeService.getTopAnime(page.value, 15);
    if (isLoadMore) animeList.value = [...animeList.value, ...(res.data || [])];
    else animeList.value = res.data || [];
    hasNextPage.value = res.pagination?.has_next_page || false;
  } catch (error) { toastRef.value?.addToast("KONEKSI BERMASALAH GAIS!", "error"); } 
  finally {
    loading.value = false; loadingMore.value = false;
    if (isInitialLoading.value) setTimeout(() => { isInitialLoading.value = false; }, 800);
  }
};

const fetchTop10 = async () => {
  top10Loading.value = true;
  try {
    const res = await animeService.getTopAnime(1, 10, top10Filter.value);
    top10List.value = res.data || [];
    activeTopIndex.value = 0;
    if (top10ScrollRef.value) top10ScrollRef.value.scrollTo({ left: 0 });
    startAutoPlay();
  } catch (error) { console.error("TOP10_ERROR"); } 
  finally { top10Loading.value = false; }
};

const handleTop10Scroll = (e) => {
  const scrollPosition = e.target.scrollLeft;
  const cardWidth = e.target.querySelector('.group')?.offsetWidth || 280;
  activeTopIndex.value = Math.round(scrollPosition / (cardWidth + 16));
};

const startAutoPlay = () => {
  stopAutoPlay();
  scrollProgress.value = 0;
  progressInterval = setInterval(() => {
    scrollProgress.value += 1;
    if (scrollProgress.value >= 100) {
      scrollProgress.value = 0;
      if (!top10ScrollRef.value || top10List.value.length === 0) return;
      const cardWidth = top10ScrollRef.value.querySelector('.group')?.offsetWidth || 280;
      let nextIndex = (activeTopIndex.value + 1) % top10List.value.length;
      top10ScrollRef.value.scrollTo({ left: nextIndex * (cardWidth + 16), behavior: 'smooth' });
    }
  }, 50); 
};

const stopAutoPlay = () => { 
  if (progressInterval) clearInterval(progressInterval);
  scrollProgress.value = 0;
};

const openDetail = (anime) => { selectedAnime.value = anime; document.body.style.overflow = 'hidden'; };
const handleLogout = () => { localStorage.removeItem('ududnime_session'); currentUser.value = null; showDashboard.value = false; toastRef.value?.addToast("BERHASIL KELUAR!", 'info', 'fa-solid fa-power-off'); };
const goHome = () => { searchQuery.value = ""; handleSearch(""); scrollToTop(); };

onMounted(() => {
  const session = localStorage.getItem('ududnime_session');
  if (session) {
    const user = JSON.parse(session);
    currentUser.value = user;
    if (user.themeColor) {
        document.documentElement.style.setProperty('--accent-color', user.themeColor);
        document.documentElement.style.setProperty('--accent-glow', `${user.themeColor}66`);
    }
  }
  fetchTop10();
  fetchAnimeData();
});
onUnmounted(() => stopAutoPlay());
watch(top10Filter, () => fetchTop10());
</script>

<template>
  <div class="min-h-screen bg-[#020617] text-slate-100 font-inter relative selection:bg-[var(--accent-glow)] overflow-x-hidden">
    <Toast ref="toastRef" />

    <transition name="fade-screen">
      <LoadingScreen v-if="isInitialLoading" />
    </transition>

    <div :class="{ 'opacity-0': isInitialLoading, 'opacity-100 transition-opacity duration-1000': !isInitialLoading }">
      <Navbar 
        :user="currentUser" 
        @openAuth="showAuth = true" 
        @openDashboard="() => { initialDashboardTab = 'watchlist'; showDashboard = true; }" 
        @logout="handleLogout" 
        @goHome="goHome" 
        @openDetail="openDetail" 
      />

      <AuthModal v-if="showAuth" @close="showAuth = false" @authSuccess="(u) => currentUser = u" />
      <DashboardModal 
        v-if="showDashboard" :user="currentUser" :initialTab="initialDashboardTab"
        @close="showDashboard = false" @logout="handleLogout" 
        @updateUser="(u) => processUserProgress(u, true)"
        @removeFromWatchlist="handleRemoveFromWatchlist" 
        @showToast="(msg, type, icon) => toastRef?.addToast(msg, type, icon)"
      />
      <DetailModal 
        v-if="selectedAnime" :anime="selectedAnime" :user="currentUser" 
        @close="selectedAnime = null; document.body.style.overflow = 'auto'" 
        @toggleWatchlist="handleToggleWatchlist" @openAuth="showAuth = true"
      />

      <div class="relative w-full py-20 md:py-32 px-4 mb-10 overflow-hidden">
        <div class="absolute inset-0 z-0 transition-all duration-1000">
          <img :src="currentUser?.customHomeBg || 'https://images.alphacoders.com/132/1327170.png'" 
            class="w-full h-full object-cover transition-all duration-1000 scale-105"
            :style="{ filter: `blur(${currentUser?.bgBlur ?? 2}px) brightness(${currentUser?.bgBrightness ?? 40}%)` }" />
          <div class="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-transparent to-[#020617]"></div>
        </div>

        <div class="relative z-10 max-w-4xl mx-auto bg-white/5 border border-white/10 backdrop-blur-2xl p-10 md:p-20 rounded-[4rem] shadow-2xl">
          <header class="text-center mb-12">
            <h1 class="text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic drop-shadow-2xl">
              UDUD<span class="text-[var(--accent-color)] underline decoration-[12px] decoration-[var(--accent-glow)] underline-offset-[12px]">NIME</span>
            </h1>
            <p class="text-slate-400 text-[9px] md:text-xs font-black uppercase tracking-[0.5em] max-w-md mx-auto leading-relaxed opacity-70">
              {{ t('tagline') }}
            </p>
          </header>

          <div class="max-w-2xl mx-auto space-y-6">
            <SearchBar :user="currentUser" @search="handleSearch" />
            <div class="flex justify-center">
              <button @click="handleSeasonalLoad" class="group relative flex items-center gap-3 bg-white/5 hover:bg-[var(--accent-bg)] border border-white/10 px-6 py-3 rounded-2xl transition-all active:scale-95 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <i class="fa-solid fa-snowflake text-[var(--accent-color)] animate-pulse"></i>
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-white transition-colors">{{ getCurrentSeason().toUpperCase() }} 2026 Recommendation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <main class="container mx-auto px-4 py-6">
        <section v-if="!searchQuery" class="mt-8 mb-24" @mouseenter="stopAutoPlay" @mouseleave="startAutoPlay">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 px-2 gap-4">
            <div class="flex items-center gap-4">
              <div class="h-8 w-1.5 bg-[var(--accent-color)] rounded-full shadow-[0_0_15px_var(--accent-glow)]"></div>
              <h2 class="text-2xl font-black uppercase tracking-tighter italic text-white">Top 10 <span class="text-[var(--accent-color)]">{{ t('trending_title') }}</span></h2>
            </div>
            <div class="flex items-center bg-slate-900/60 p-1.5 rounded-2xl border border-white/5">
              <button v-for="f in filters" :key="f.id" @click="top10Filter = f.id"
                :class="['px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all', 
                  top10Filter === f.id ? 'bg-[var(--accent-color)] text-white shadow-lg shadow-[var(--accent-glow)]' : 'text-slate-500 hover:text-slate-300']">
                {{ t(f.key) }}
              </button>
            </div>
          </div>

          <div ref="top10ScrollRef" @scroll="handleTop10Scroll" class="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x scroll-smooth">
            <div v-if="top10Loading" class="flex gap-4"><div v-for="i in 5" :key="i" class="min-w-[320px] h-32 bg-slate-800/20 rounded-[1.5rem] animate-pulse border border-white/5"></div></div>
            <div v-else v-for="(anime, index) in top10List" :key="anime.mal_id" @click="openDetail(anime)" class="group relative min-w-[320px] h-32 bg-slate-900/40 hover:bg-slate-800/40 border border-slate-800 hover:border-[var(--accent-glow)] rounded-[1.5rem] p-3 flex items-center gap-4 transition-all cursor-pointer snap-start overflow-hidden">
              <div class="absolute -right-2 -top-4 opacity-10 group-hover:opacity-20 transition-opacity text-white font-black italic"><span class="text-7xl leading-none">{{ index + 1 }}</span></div>
              <img :src="anime.images.jpg.image_url" class="w-20 h-full rounded-xl object-cover shadow-lg" />
              <div class="flex-1 pr-6 z-10">
                <p class="text-[9px] font-black text-[var(--accent-color)] mb-1">#{{ index + 1 }} RANK</p>
                <h3 class="text-[11px] font-black text-white uppercase line-clamp-2 leading-tight group-hover:text-[var(--accent-color)] transition-colors">{{ anime.title }}</h3>
                <p class="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-2">{{ anime.type }} • {{ anime.episodes || '?' }} EPS</p>
              </div>
            </div>
          </div>
          <div class="mt-6 max-w-[200px] mx-auto h-[1.5px] bg-white/5 rounded-full overflow-hidden">
            <div class="h-full bg-[var(--accent-color)] transition-all duration-50 ease-linear" :style="{ width: scrollProgress + '%' }"></div>
          </div>
        </section>

        <section class="mt-8 mb-20">
          <div class="flex items-center gap-4 mb-12 px-2">
            <div class="h-10 w-2 bg-[var(--accent-color)] rounded-full shadow-[0_0_15px_var(--accent-glow)]"></div>
            <h2 class="text-3xl font-black uppercase tracking-tighter text-white">{{ title }}</h2>
          </div>
          <div v-if="loading" class="flex flex-col justify-center items-center py-32"><div class="animate-spin rounded-full h-16 w-16 border-t-4 border-[var(--accent-color)] shadow-glow"></div></div>
          <div v-else>
            <div v-if="animeList.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10 fade-in">
              <AnimeCard v-for="anime in animeList" :key="anime.mal_id" :anime="anime" @showDetail="openDetail" />
            </div>
            <div v-if="hasNextPage" class="mt-20 flex justify-center">
              <button @click="fetchAnimeData(true)" :disabled="loadingMore" class="px-12 py-5 bg-slate-800 hover:bg-[var(--accent-color)] text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl transition-all shadow-2xl active:scale-95 disabled:opacity-50">
                {{ loadingMore ? 'SYNCHRONIZING...' : 'LOAD MORE DATA' }}
              </button>
            </div>
          </div>
        </section>

        <section v-if="!searchQuery" class="mt-32 mb-20 fade-in">
          <div class="max-w-5xl mx-auto">
            <ScheduleMiniView :user="currentUser" @openDetail="openDetail" />
          </div>
        </section>
      </main>

      <footer class="text-center py-20 border-t border-white/5 mt-32 bg-slate-900/50 backdrop-blur-sm">
        <div class="container mx-auto px-4 flex flex-col items-center gap-10">
          <div class="cursor-pointer transition-all hover:scale-105 active:scale-95" @click="router.push('/status')">
            <ApiStatus />
          </div>
          <div class="space-y-3">
            <p class="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">&copy; 2026 UDUDNIME — MALANG, INDONESIA</p>
            <p class="text-[9px] font-bold text-slate-700 uppercase tracking-widest italic tracking-[0.2em]">MADE WITH 🧡 BY ALVIENSYAH MOHAMMAD — UB STUDENT</p>
          </div>
        </div>
      </footer>
    </div>
    
    <button @click="scrollToTop" class="fixed bottom-8 right-8 z-[100] bg-[var(--accent-color)] text-white w-12 h-12 rounded-2xl shadow-2xl flex items-center justify-center hover:opacity-80 active:scale-90 transition-all border border-white/10">
        <i class="fa-solid fa-arrow-up"></i>
    </button>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.fade-in { animation: fadeIn 0.8s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.shadow-glow { filter: drop-shadow(0 0 10px var(--accent-glow)); }
</style>
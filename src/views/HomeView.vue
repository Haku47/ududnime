<script setup>
import { ref, onMounted, onUnmounted, watch, defineAsyncComponent, nextTick, computed } from 'vue'; 
import { useRoute, useRouter } from 'vue-router'; 
import { animeService } from '../services/api';
import { translations } from '../utils/i18n';
import { supabase } from '../utils/supabase'; // Gerbang utama data kamu gais!

// --- OPTIMASI: LAZY LOADING KOMPONEN ---
const Navbar = defineAsyncComponent(() => import('../components/Navbar.vue'));
const SearchBar = defineAsyncComponent(() => import('../components/Searchbar.vue'));
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
// Fungsi Translasi Minimalis gais
const t = (key) => {
  const lang = currentUser.value?.lang || 'en'; // Default English
  return translations[lang]?.[key] || translations['en']?.[key] || key;
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

// --- 🔓 LOGIKA LOGOUT SUPABASE SAKTI GAIS ---
const handleLogout = async () => { 
  try {
    if (supabase) await supabase.auth.signOut(); // Logout dari Cloud gais!
    localStorage.removeItem('ududnime_session'); 
    currentUser.value = null; 
    showDashboard.value = false; 
    toastRef.value?.addToast("BERHASIL KELUAR! SAMPAI JUMPA KER!", 'info', 'fa-solid fa-power-off'); 
  } catch (err) {
    toastRef.value?.addToast("GAGAL KELUAR GAIS!", "error");
  }
};

const goHome = () => { searchQuery.value = ""; handleSearch(""); scrollToTop(); };

// --- 🔄 SUPABASE SESSION SYNC GAIS ---
const syncSupabaseUser = (session) => {
  if (session) {
    const { user } = session;
    // Logika Gabungan: Full Name GitHub atau potongan Email gais!
    const finalUsername = user.user_metadata.full_name || user.email.split('@')[0];
    
    const mappedUser = {
      id: user.id,
      username: finalUsername,
      email: user.email,
      avatar: user.user_metadata.avatar_url,
      level: 1, 
      xp: 0,
      watchlist: [],
      lang: 'id'
    };
    processUserProgress(mappedUser);
  }
};

onMounted(async () => {
  // 🚀 1. PRIORITAS UTAMA: Ambil dari localStorage dulu gais!
  // Ini biar pas F5, profil langsung muncul instan tanpa jeda mili-detik.
  const localSession = localStorage.getItem('ududnime_session');
  if (localSession) {
    try {
      const parsedUser = JSON.parse(localSession);
      processUserProgress(parsedUser); // Langsung pasang ke state gais!
    } catch (e) {
      console.error("SESSION_CORRUPT");
    }
  }

  // 🚀 2. VALIDASI CLOUD: Cek session Supabase di latar belakang gais
  // Ini buat mastiin kalau tokennya masih valid atau ada update dari GitHub.
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    syncSupabaseUser(session);
  } else if (!localSession) {
    // Kalau di local gak ada, di supabase gak ada, baru fix null gais
    currentUser.value = null;
  }

  // 🚀 3. LISTENER: Jaga-jaga kalau user login/logout di tab lain gais
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      syncSupabaseUser(session);
    }
    if (event === 'SIGNED_OUT') {
      currentUser.value = null;
      localStorage.removeItem('ududnime_session');
      // Reset warna ke default pas logout gais
      document.documentElement.style.setProperty('--accent-color', '#f97316');
    }
  });
  
  // Ambil data konten gais
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

      <AuthModal v-if="showAuth" @close="showAuth = false" @authSuccess="(u) => processUserProgress(u)" />
      
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

<div class="relative w-full pt-36 md:pt-48 pb-20 md:pb-32 px-4 mb-10 overflow-hidden -mt-28">
  
  <div class="absolute inset-0 z-0 transition-all duration-1000">
    <img :src="currentUser?.customHomeBg || 'https://images.alphacoders.com/132/1327170.png'" 
      class="w-full h-full object-cover transition-all duration-1000 scale-105"
      :style="{ filter: `blur(${currentUser?.bgBlur ?? 2}px) brightness(${currentUser?.bgBrightness ?? 40}%)` }" />
    
    <div class="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-[#020617]/20 to-[#020617]"></div>
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

    <footer class="relative mt-40 border-t border-white/5 bg-[#020617] overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-color)] to-transparent opacity-40"></div>

      <div class="container mx-auto px-6 pt-20 pb-12 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 mb-20">
          
          <div class="space-y-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-[var(--accent-color)] rounded-xl flex items-center justify-center shadow-[0_0_15px_var(--accent-glow)]">
                <i class="fa-solid fa-film text-white text-sm"></i>
              </div>
              <h2 class="text-xl font-black text-white tracking-tighter uppercase italic">
                Udud<span class="text-[var(--accent-color)]">nime</span>
              </h2>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed max-w-xs font-medium">
              Independent anime database architecture built for speed and immersion. Providing seamless access to global anime metadata gais.
            </p>
            <div class="flex gap-4">
              <a v-for="social in ['github', 'instagram', 'x-twitter']" :key="social" href="#" 
                class="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:border-[var(--accent-color)]/30 hover:bg-[var(--accent-bg)] transition-all duration-300">
                <i :class="[`fa-brands fa-${social}`, 'text-sm']"></i>
              </a>
            </div>
          </div>

          <div class="flex flex-col items-start md:items-center">
            <div class="space-y-6">
              <p class="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">System Navigation</p>
              <ul class="grid grid-cols-2 gap-x-10 gap-y-4">
                <li><router-link to="/" class="text-[11px] font-bold text-slate-500 hover:text-[var(--accent-color)] transition-colors uppercase tracking-widest">Home</router-link></li>
                <li><router-link to="/explorer" class="text-[11px] font-bold text-slate-500 hover:text-[var(--accent-color)] transition-colors uppercase tracking-widest">Browse</router-link></li>
                <li><router-link to="/schedule" class="text-[11px] font-bold text-slate-500 hover:text-[var(--accent-color)] transition-colors uppercase tracking-widest">Schedule</router-link></li>
                <li><router-link to="/about-us" class="text-[11px] font-bold text-slate-500 hover:text-[var(--accent-color)] transition-colors uppercase tracking-widest">About Us</router-link></li>
                
                <li><router-link to="/status" class="text-[11px] font-bold text-slate-600 hover:text-white transition-colors uppercase tracking-widest">Status</router-link></li>
                <li><router-link to="/api-docs" class="text-[11px] font-bold text-slate-600 hover:text-white transition-colors uppercase tracking-widest">API</router-link></li>
                <li><router-link to="/changelog" class="text-[11px] font-bold text-slate-600 hover:text-white transition-colors uppercase tracking-widest">Changelog</router-link></li>
                <li><router-link to="/privacy-policy" class="text-[11px] font-bold text-slate-600 hover:text-white transition-colors uppercase tracking-widest">Terms</router-link></li>
              </ul>
            </div>
          </div>

          <div class="flex flex-col items-start md:items-end space-y-6">
            <div class="text-left md:text-right space-y-2">
              <p class="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">Engine Status</p>
              <div class="cursor-pointer group" @click="$router.push('/status')">
                <ApiStatus />
              </div>
            </div>
            <div class="p-4 bg-white/[0.02] border border-white/5 rounded-2xl md:text-right w-full md:w-auto">
              <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Core Integrity</p>
              <p class="text-[10px] font-black text-emerald-400 uppercase">Synchronized v4.2.0</p>
            </div>
          </div>
        </div>

        <div class="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p class="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
              &copy; 2026 UDUDNIME — INDONESIA
            </p>
            <div class="hidden md:block h-3 w-[1px] bg-slate-800"></div>
            <div class="flex items-center gap-2">
              <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic">Developed by</span>
              <span class="text-[10px] font-black text-white uppercase tracking-widest hover:text-[var(--accent-color)] transition-colors cursor-default">
                Alviensyah Mohammad
              </span>
            </div>
          </div>
          
          <div class="flex items-center gap-6 opacity-30">
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global CDN</span>
            </div>
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">SSL Secure</span>
          </div>
        </div>
      </div>

      <div class="absolute -bottom-20 -right-20 w-80 h-80 bg-[var(--accent-color)] opacity-[0.03] rounded-full blur-[120px]"></div>
    </footer>
    </div>
    
    <button @click="scrollToTop" class="fixed bottom-8 right-8 z-[100] bg-[var(--accent-color)] text-white w-12 h-12 rounded-2xl shadow-2xl flex items-center justify-center hover:opacity-80 active:scale-90 transition-all border border-white/10">
        <i class="fa-solid fa-arrow-up"></i>
    </button>
  </div>
</template>

<UdudBotAI :user="currentUser" :loading="loading" />

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.fade-in { animation: fadeIn 0.8s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.shadow-glow { filter: drop-shadow(0 0 10px var(--accent-glow)); }
</style>
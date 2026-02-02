<template>
  <div class="min-h-screen bg-[#020617] text-slate-100 font-inter relative selection:bg-[var(--accent-glow)]">
    <Toast ref="toastRef" />

    <Navbar 
      :user="currentUser" 
      @goHome="handleGoHome" 
      @openDetail="openDetail" 
      @openDashboard="showDashboard = true"
      @logout="handleLogout"
      @openAuth="showAuth = true"
    />

    <main class="container mx-auto px-4 py-12">
      <header class="mb-12 fade-in">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="h-12 w-2 bg-[var(--accent-color)] rounded-full shadow-[0_0_20px_var(--accent-glow)]"></div>
            <div>
              <h1 class="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
                {{ t('explorer_title') }} <span class="text-[var(--accent-color)]">{{ t('explorer_mode') }}</span>
              </h1>
              <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1 italic">
                {{ t('explorer_sub') }}
              </p>
            </div>
          </div>
          
          <button 
            @click="fetchRandomAnime"
            :disabled="loadingRandom"
            class="px-8 py-4 bg-[var(--accent-color)] hover:opacity-90 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[var(--accent-glow)] transition-all active:scale-95 flex items-center gap-3"
          >
            <i class="fa-solid fa-shuffle" :class="{ 'animate-spin': loadingRandom }"></i>
            {{ loadingRandom ? t('searching') : t('random_btn') }}
          </button>
        </div>
      </header>

      <div class="flex gap-4 mb-10 border-b border-white/5 pb-1 overflow-x-auto no-scrollbar">
        <button 
          v-for="tab in ['genre', 'season', 'year']" 
          :key="tab"
          @click="activeTab = tab"
          :class="['px-8 py-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap', 
            activeTab === tab ? 'text-[var(--accent-color)] border-b-4 border-[var(--accent-color)] bg-[var(--accent-bg)]' : 'text-slate-500 hover:text-slate-300']"
        >
          {{ t('by_label') }} {{ t(tab) }}
        </button>
      </div>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 bg-slate-900/40 p-5 rounded-[2rem] border border-white/5 backdrop-blur-sm">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-[var(--accent-bg)] rounded-lg flex items-center justify-center border border-[var(--accent-glow)]">
            <i class="fa-solid fa-arrow-down-wide-short text-[var(--accent-color)] text-xs"></i>
          </div>
          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{{ t('sort_results') }}:</span>
        </div>
        
        <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <button 
            v-for="opt in sortOptions" 
            :key="opt.id"
            @click="sortBy = opt.id"
            :class="['px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border', 
              sortBy === opt.id ? 'bg-[var(--accent-color)] border-white/10 text-white shadow-lg' : 'bg-black/40 border-white/5 text-slate-500 hover:text-slate-300']"
          >
            {{ t(`sort_${opt.id}`) }}
          </button>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-10">
        <aside class="lg:w-64 space-y-6 fade-in h-fit lg:sticky lg:top-24">
          <div v-if="activeTab === 'genre'" class="bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5">
            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">{{ t('genre_list') }}:</h3>
            <div class="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scroll">
              <button 
                v-for="g in genres" :key="g.id"
                @click="activeGenre = g.id"
                :class="['text-left px-5 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap', 
                  activeGenre === g.id ? 'bg-[var(--accent-color)] text-white shadow-lg shadow-[var(--accent-glow)]' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300']"
              >
                {{ g.name }}
              </button>
            </div>
          </div>

          <div v-if="activeTab === 'season'" class="bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5">
            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">{{ t('season_list') }}:</h3>
            <div class="flex flex-col gap-2">
              <button 
                v-for="s in ['winter', 'spring', 'summer', 'fall']" :key="s"
                @click="activeSeason = s"
                :class="['text-left px-5 py-3 rounded-xl text-[10px] font-black uppercase transition-all', 
                  activeSeason === s ? 'bg-[var(--accent-color)] text-white shadow-lg shadow-[var(--accent-glow)]' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300']"
              >
                {{ t(s) }}
              </button>
            </div>
          </div>

          <div v-if="activeTab === 'year'" class="bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5">
            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">{{ t('year_release') }}:</h3>
            <div class="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scroll">
              <button 
                v-for="y in yearList" :key="y"
                @click="activeYear = y"
                :class="['text-left px-5 py-3 rounded-xl text-[10px] font-black uppercase transition-all', 
                  activeYear === y ? 'bg-[var(--accent-color)] text-white shadow-lg shadow-[var(--accent-glow)]' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300']"
              >
                {{ t('year_label') }} {{ y }}
              </button>
            </div>
          </div>
        </aside>

        <div class="flex-1">
          <div v-if="loading" class="flex flex-col justify-center items-center py-40">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-[var(--accent-color)] mb-4 shadow-[0_0_15px_var(--accent-glow)]"></div>
            <p class="text-[10px] font-black uppercase text-slate-500 tracking-widest italic">{{ t('loading_jikan') }}</p>
          </div>
          
          <div v-else>
            <div v-if="animeList.length > 0" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 fade-in">
              <AnimeCard v-for="anime in animeList" :key="anime.mal_id" :anime="anime" @showDetail="openDetail" />
            </div>
            <div v-else class="text-center py-40 bg-slate-900/20 rounded-[3rem] border-4 border-dashed border-white/5">
              <i class="fa-solid fa-ghost text-4xl text-slate-800 mb-4 block"></i>
              <p class="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">{{ t('empty') }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AuthModal v-if="showAuth" @close="showAuth = false" @authSuccess="handleAuthSuccess" />
    
    <DashboardModal 
      v-if="showDashboard" 
      :user="currentUser" 
      @close="showDashboard = false" 
      @logout="handleLogout" 
      @updateUser="handleUpdateUser" 
      @removeFromWatchlist="handleRemoveFromWatchlist"
    />

    <DetailModal 
      v-if="selectedAnime" 
      :anime="selectedAnime" 
      :user="currentUser" 
      @close="selectedAnime = null" 
      @toggleWatchlist="handleToggleWatchlist"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineAsyncComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { animeService } from '../services/api';
import { translations } from '../utils/i18n';

// ... (Imports & defineAsyncComponent tetep sama gais)
const Navbar = defineAsyncComponent(() => import('../components/Navbar.vue'));
const AnimeCard = defineAsyncComponent(() => import('../components/AnimeCard.vue'));
const DetailModal = defineAsyncComponent(() => import('../components/DetailModal.vue'));
const AuthModal = defineAsyncComponent(() => import('../components/AuthModal.vue'));
const DashboardModal = defineAsyncComponent(() => import('../components/DashboardModal.vue'));
const Toast = defineAsyncComponent(() => import('../components/Toast.vue'));

const router = useRouter();
const currentUser = ref(null);
const animeList = ref([]);
const loading = ref(false);
const loadingRandom = ref(false);
const selectedAnime = ref(null);
const toastRef = ref(null);

const showAuth = ref(false);
const showDashboard = ref(false);

const activeTab = ref('genre');
const activeGenre = ref(1);
const activeSeason = ref('winter');
const activeYear = ref(new Date().getFullYear());

const sortBy = ref('popularity');
const sortOptions = [
  { id: 'popularity', name: 'Popularitas' },
  { id: 'score', name: 'Rating' },
  { id: 'title', name: 'Judul' },
  { id: 'members', name: 'Favorit' }
];

// --- HELPER TRANSLASI ---
const t = (key) => {
  const lang = currentUser.value?.lang || 'en';
  return translations[lang][key] || key;
};

const yearList = computed(() => {
  const years = [];
  for (let y = 2026; y >= 1990; y--) years.push(y);
  return years;
});

const genres = [
  {id:1, name:'ACTION'}, {id:2, name:'ADVENTURE'}, {id:4, name:'COMEDY'}, 
  {id:8, name:'DRAMA'}, {id:10, name:'FANTASY'}, {id:14, name:'HORROR'}, 
  {id:7, name:'MYSTERY'}, {id:22, name:'ROMANCE'}, {id:24, name:'SCI-FI'}, 
  {id:36, name:'SLICE OF LIFE'}, {id:30, name:'SPORTS'}, {id:37, name:'SUPERNATURAL'}, 
  {id:41, name:'SUSPENSE'}, {id:27, name:'SHOUNEN'}, {id:25, name:'SHOUJO'}
];

// --- LOGIKA USER & AUTH ---
const handleAuthSuccess = (user) => {
  currentUser.value = user;
  showAuth.value = false;
  toastRef.value?.addToast(`${t('welcome')}, ${user.username.toUpperCase()}!`, "success");
};

const handleUpdateUser = (updatedUser) => {
  currentUser.value = updatedUser;
  localStorage.setItem('ududnime_session', JSON.stringify(updatedUser));
  if (updatedUser.themeColor) {
    document.documentElement.style.setProperty('--accent-color', updatedUser.themeColor);
    document.documentElement.style.setProperty('--accent-glow', `${updatedUser.themeColor}66`);
  }
};

const handleLogout = () => {
  localStorage.removeItem('ududnime_session');
  currentUser.value = null;
  showDashboard.value = false;
  toastRef.value?.addToast(t('logout_success'), "info");
};

const handleToggleWatchlist = (animeData) => {
  if (!currentUser.value) { showAuth.value = true; return; }
  let user = { ...currentUser.value };
  if (!user.watchlist) user.watchlist = [];
  const idx = user.watchlist.findIndex(i => i.id === animeData.id);
  if (idx === -1) {
    user.watchlist.push(animeData);
    toastRef.value?.addToast(t('success_add'), "success");
  } else {
    user.watchlist.splice(idx, 1);
    toastRef.value?.addToast(t('success_remove'), "info");
  }
  handleUpdateUser(user);
};

// --- DATA FETCHING ---
const fetchExplorer = async () => {
  if (loading.value) return; 
  loading.value = true;
  try {
    let res;
    const sortDirection = sortBy.value === 'title' ? 'asc' : 'desc';
    if (activeTab.value === 'genre') {
      res = await animeService.getExplorer('genre', activeGenre.value, sortBy.value, sortDirection);
    } else if (activeTab.value === 'season') {
      res = await animeService.getExplorer('season', activeSeason.value, sortBy.value, sortDirection);
    } else {
      res = await animeService.getAnimeByYear(activeYear.value, sortBy.value, sortDirection);
    }
    animeList.value = res.data || [];
  } catch (error) {
    toastRef.value?.addToast(t('error_action'), "error");
  } finally {
    loading.value = false;
  }
};

const fetchRandomAnime = async () => {
  if (loadingRandom.value) return;
  loadingRandom.value = true;
  try {
    const res = await animeService.getRandomAnime();
    selectedAnime.value = res.data;
  } catch (error) {
    toastRef.value?.addToast(t('error_action'), "error");
  } finally {
    loadingRandom.value = false;
  }
};

const openDetail = (anime) => { selectedAnime.value = anime; };
const handleGoHome = () => router.push('/');

onMounted(() => {
  const session = localStorage.getItem('ududnime_session');
  if (session) {
    const user = JSON.parse(session);
    currentUser.value = user;
    if (user.themeColor) {
      document.documentElement.style.setProperty('--accent-color', user.themeColor);
      document.documentElement.style.setProperty('--accent-glow', `${user.themeColor}66`);
      document.documentElement.style.setProperty('--accent-bg', `${user.themeColor}1a`);
    }
  }
  fetchExplorer();
});

watch([activeTab, activeGenre, activeSeason, activeYear, sortBy], () => {
  fetchExplorer();
});
</script>
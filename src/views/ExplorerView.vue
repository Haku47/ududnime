<template>
  <div class="min-h-screen bg-[#020617] text-slate-100 font-inter relative selection:bg-[var(--accent-glow)] overflow-x-hidden">
    <Toast ref="toastRef" />

    <Navbar 
      :user="currentUser" 
      @goHome="handleGoHome" 
      @openDetail="openDetail" 
      @openDashboard="showDashboard = true"
      @logout="handleLogout"
      @openAuth="showAuth = true"
      @updateUser="handleUpdateUser"
    />

    <div class="relative w-full pt-36 md:pt-48 pb-12 px-4 mb-10 overflow-hidden -mt-28">
      <div class="absolute inset-0 z-0 transition-all duration-1000">
        <img :src="currentUser?.customHomeBg || 'https://images.alphacoders.com/132/1327170.png'" 
          class="w-full h-full object-cover transition-all duration-1000 scale-105"
          :style="{ filter: `blur(${currentUser?.bgBlur ?? 4}px) brightness(${currentUser?.bgBrightness ?? 30}%)` }" />
        <div class="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-[#020617]/40 to-[#020617]"></div>
      </div>

      <div class="relative z-10 max-w-6xl mx-auto">
        <header class="flex flex-col md:flex-row md:items-end justify-between gap-8 fade-in">
          <div class="flex items-center gap-5">
            <div class="h-16 w-2 bg-[var(--accent-color)] rounded-full shadow-[0_0_30px_var(--accent-glow)] animate-pulse"></div>
            <div>
              <h1 class="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
                {{ t('explorer_title') }} <span class="text-[var(--accent-color)]">{{ t('explorer_mode') }}</span>
              </h1>
              <p class="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.5em] mt-3 italic opacity-70">
                {{ t('explorer_sub') }}
              </p>
            </div>
          </div>
          
          <button 
            @click="fetchRandomAnime"
            :disabled="loadingRandom"
            class="group relative px-10 py-5 bg-[var(--accent-color)] hover:scale-105 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_10px_40px_var(--accent-glow)] transition-all active:scale-95 flex items-center gap-4 overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <i class="fa-solid fa-shuffle text-sm" :class="{ 'animate-spin': loadingRandom }"></i>
            <span>{{ loadingRandom ? t('searching') : t('random_btn') }}</span>
          </button>
        </header>
      </div>
    </div>

    <main class="container mx-auto px-4 py-6 relative z-10">
      <div class="flex gap-2 mb-12 border-b border-white/5 pb-1 overflow-x-auto no-scrollbar scroll-smooth">
        <button 
          v-for="tab in ['genre', 'season', 'year']" 
          :key="tab"
          @click="activeTab = tab"
          :class="['px-10 py-5 text-[11px] font-black uppercase tracking-[0.4em] transition-all whitespace-nowrap relative group', 
            activeTab === tab ? 'text-[var(--accent-color)]' : 'text-slate-500 hover:text-slate-300']"
        >
          {{ t('by_label') }} {{ t(tab) }}
          <div v-if="activeTab === tab" class="absolute bottom-0 left-0 right-0 h-1 bg-[var(--accent-color)] shadow-[0_-5px_15px_var(--accent-glow)] rounded-t-full"></div>
        </button>
      </div>

      <div class="flex flex-col lg:flex-row justify-between items-center gap-6 mb-16 bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-xl shadow-2xl">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-[var(--accent-bg)] rounded-xl flex items-center justify-center border border-[var(--accent-glow)]">
            <i class="fa-solid fa-sliders text-[var(--accent-color)] text-sm"></i>
          </div>
          <span class="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">{{ t('sort_results') }}</span>
        </div>
        
        <div class="flex gap-3 overflow-x-auto no-scrollbar w-full lg:w-auto p-1">
          <button 
            v-for="opt in sortOptions" 
            :key="opt.id"
            @click="sortBy = opt.id"
            :class="['px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2', 
              sortBy === opt.id ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-white shadow-[0_0_20px_var(--accent-glow)]' : 'bg-black/40 border-white/5 text-slate-500 hover:border-white/20 hover:text-slate-200']"
          >
            {{ t(`sort_${opt.id}`) }}
          </button>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-12">
        <aside class="lg:w-72 space-y-8 fade-in h-fit lg:sticky lg:top-24">
          <div class="bg-slate-900/60 p-8 rounded-[3rem] border border-white/5 backdrop-blur-md shadow-2xl">
            <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 italic flex items-center gap-3">
               <span class="w-2 h-2 bg-[var(--accent-color)] rounded-full"></span>
               {{ t(activeTab === 'genre' ? 'genre_list' : activeTab === 'season' ? 'season_list' : 'year_release') }}
            </h3>
            
            <div class="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-3 custom-scroll">
              <template v-if="activeTab === 'genre'">
                <button v-for="g in genres" :key="g.id" @click="activeGenre = g.id"
                  :class="['text-left px-6 py-4 rounded-2xl text-[11px] font-black uppercase transition-all flex justify-between items-center group/btn', 
                    activeGenre === g.id ? 'bg-[var(--accent-color)] text-white shadow-xl shadow-[var(--accent-glow)]' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200']">
                  {{ g.name }}
                  <i v-if="activeGenre === g.id" class="fa-solid fa-chevron-right text-[8px]"></i>
                </button>
              </template>

              <template v-if="activeTab === 'season'">
                <button v-for="s in ['winter', 'spring', 'summer', 'fall']" :key="s" @click="activeSeason = s"
                  :class="['text-left px-6 py-4 rounded-2xl text-[11px] font-black uppercase transition-all flex justify-between items-center', 
                    activeSeason === s ? 'bg-[var(--accent-color)] text-white shadow-xl' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200']">
                  {{ t(s) }}
                </button>
              </template>

              <template v-if="activeTab === 'year'">
                <button v-for="y in yearList" :key="y" @click="activeYear = y"
                  :class="['text-left px-6 py-4 rounded-2xl text-[11px] font-black uppercase transition-all flex justify-between items-center', 
                    activeYear === y ? 'bg-[var(--accent-color)] text-white shadow-xl' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200']">
                  {{ t('year_label') }} {{ y }}
                </button>
              </template>
            </div>
          </div>
        </aside>

        <div class="flex-1">
          <div v-if="loading" class="flex flex-col justify-center items-center py-40">
            <div class="w-16 h-16 border-4 border-white/5 border-t-[var(--accent-color)] rounded-full animate-spin shadow-[0_0_20px_var(--accent-glow)] mb-8"></div>
            <p class="text-[11px] font-black uppercase text-slate-500 tracking-[0.5em] animate-pulse">{{ t('loading_jikan') }}</p>
          </div>
          
          <div v-else>
            <div v-if="animeList.length > 0" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 fade-in">
              <AnimeCard v-for="anime in animeList" :key="anime.mal_id" :anime="anime" @showDetail="openDetail" />
            </div>
            <div v-else class="flex flex-col items-center justify-center py-48 bg-slate-900/20 rounded-[4rem] border-4 border-dashed border-white/5">
              <div class="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8">
                <i class="fa-solid fa-ghost text-5xl text-slate-800 animate-bounce"></i>
              </div>
              <p class="text-slate-600 text-[12px] font-black uppercase tracking-[0.5em] italic">{{ t('empty') }}</p>
            </div>
          </div>
        </div>
      </div>
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
                <li><a href="#" class="text-[11px] font-bold text-slate-600 hover:text-white transition-colors uppercase tracking-widest">API</a></li>
                <li><a href="#" class="text-[11px] font-bold text-slate-600 hover:text-white transition-colors uppercase tracking-widest">Changelog</a></li>
                <li><a href="#" class="text-[11px] font-bold text-slate-600 hover:text-white transition-colors uppercase tracking-widest">Terms</a></li>
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

    <AuthModal v-if="showAuth" @close="showAuth = false" @authSuccess="handleAuthSuccess" />
    <DashboardModal v-if="showDashboard" :user="currentUser" @close="showDashboard = false" @logout="handleLogout" @updateUser="handleUpdateUser" @removeFromWatchlist="handleRemoveFromWatchlist" @showToast="(m,t,i) => toastRef?.addToast(m,t,i)" />
    <DetailModal v-if="selectedAnime" :anime="selectedAnime" :user="currentUser" @close="selectedAnime = null" @toggleWatchlist="handleToggleWatchlist" @openAuth="showAuth = true" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineAsyncComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { animeService } from '../services/api';
import { translations } from '../utils/i18n';

const Navbar = defineAsyncComponent(() => import('../components/Navbar.vue'));
const AnimeCard = defineAsyncComponent(() => import('../components/AnimeCard.vue'));
const DetailModal = defineAsyncComponent(() => import('../components/DetailModal.vue'));
const AuthModal = defineAsyncComponent(() => import('../components/AuthModal.vue'));
const DashboardModal = defineAsyncComponent(() => import('../components/DashboardModal.vue'));
const Toast = defineAsyncComponent(() => import('../components/Toast.vue'));
const ApiStatus = defineAsyncComponent(() => import('../components/ApiStatus.vue'));

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
const activeYear = ref(2026);

const sortBy = ref('popularity');
const sortOptions = [
  { id: 'popularity', name: 'Popularitas' },
  { id: 'score', name: 'Rating' },
  { id: 'title', name: 'Judul' },
  { id: 'members', name: 'Favorit' }
];

const t = (key) => {
  const lang = currentUser.value?.lang || 'id';
  return translations[lang]?.[key] || translations['en']?.[key] || key;
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
    document.documentElement.style.setProperty('--accent-bg', `${updatedUser.themeColor}1a`);
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

const handleRemoveFromWatchlist = (animeId) => {
  if (!currentUser.value) return;
  let user = { ...currentUser.value };
  user.watchlist = user.watchlist.filter(i => i.id !== animeId);
  handleUpdateUser(user);
};

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

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.custom-scroll::-webkit-scrollbar { width: 5px; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
.custom-scroll::-webkit-scrollbar-thumb:hover { background: var(--accent-color); }

.fade-in { animation: fadeIn 0.8s cubic-bezier(0.23, 1, 0.32, 1); }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
<template>
  <div class="min-h-screen bg-[#020617] text-slate-100 font-inter relative selection:bg-[var(--accent-glow)] overflow-x-hidden">
    <Toast ref="toastRef" />
    
    <Navbar 
      :user="currentUser" 
      @openDashboard="showDashboard = true"
      @logout="handleLogout"
      @openAuth="showAuth = true"
    />

    <main class="container mx-auto px-4 py-12 md:py-24">
      <div v-if="loading" class="max-w-5xl mx-auto space-y-8 animate-pulse">
        <div class="h-10 w-64 bg-white/5 rounded-xl"></div>
        <div class="flex flex-col md:flex-row gap-10">
          <div class="w-full md:w-[300px] aspect-[3/4.5] bg-white/5 rounded-[2.5rem]"></div>
          <div class="flex-1 space-y-6">
            <div class="h-12 w-full bg-white/5 rounded-2xl"></div>
            <div class="h-32 w-full bg-white/5 rounded-2xl"></div>
          </div>
        </div>
      </div>

      <div v-else-if="anime && anime.mal_id" class="max-w-6xl mx-auto fade-in">
        <button @click="router.back()" class="flex items-center gap-3 text-slate-500 hover:text-[var(--accent-color)] transition-all mb-8 group uppercase text-[10px] font-black tracking-widest">
          <i class="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          {{ t('back') || 'KEMBALI' }}
        </button>

        <div class="flex flex-col lg:flex-row gap-12">
          <aside class="w-full lg:w-[320px] shrink-0">
            <div class="sticky top-28 space-y-6">
              <div class="relative group">
                <img :src="anime.images?.jpg?.large_image_url" class="w-full rounded-[3rem] border border-white/5 shadow-2xl group-hover:border-[var(--accent-color)] transition-all duration-500" />
                <div class="absolute inset-0 rounded-[3rem] bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
              </div>

              <button @click="handleToggleWatchlist" class="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
                :class="isBookmarked ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'bg-[var(--accent-color)] text-white shadow-[var(--accent-glow)]'">
                <i :class="['fa-solid', isBookmarked ? 'fa-check' : 'fa-plus']"></i>
                {{ isBookmarked ? t('in_watchlist') : t('add_watchlist') }}
              </button>
              
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-slate-900/40 p-4 rounded-2xl border border-white/5 text-center">
                  <p class="text-[8px] font-black text-slate-500 uppercase mb-1">Score</p>
                  <p class="text-lg font-black text-[var(--accent-color)] italic">⭐ {{ anime.score || '0.0' }}</p>
                </div>
                <div class="bg-slate-900/40 p-4 rounded-2xl border border-white/5 text-center">
                  <p class="text-[8px] font-black text-slate-500 uppercase mb-1">Rank</p>
                  <p class="text-lg font-black text-white italic">#{{ anime.rank || '??' }}</p>
                </div>
              </div>
            </div>
          </aside>

          <div class="flex-1 space-y-10">
            <header>
              <h1 class="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
                {{ anime.title }}
              </h1>
              <div class="flex flex-wrap items-center gap-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                <span class="text-[var(--accent-color)]">{{ anime.title_japanese || '???' }}</span>
                <div class="h-1 w-1 bg-slate-800 rounded-full"></div>
                <span>{{ anime.type || 'TV' }}</span>
                <div class="h-1 w-1 bg-slate-800 rounded-full"></div>
                <span>{{ anime.episodes || '?' }} EPS</span>
                <div class="h-1 w-1 bg-slate-800 rounded-full"></div>
                <span>{{ anime.status || 'N/A' }}</span>
              </div>
            </header>

            <div v-if="anime.trailer?.embed_url" class="aspect-video rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl bg-black">
              <iframe :src="anime.trailer.embed_url" class="w-full h-full" frameborder="0" allowfullscreen></iframe>
            </div>

            <div class="space-y-8 bg-slate-900/20 p-8 rounded-[3rem] border border-white/5 backdrop-blur-sm">
              <div>
                <h3 class="text-[10px] font-black text-[var(--accent-color)] uppercase tracking-[0.4em] mb-4 italic">{{ t('synopsis') }}</h3>
                <p class="text-sm md:text-base text-slate-400 leading-relaxed font-medium">
                  {{ anime.synopsis || t('no_synopsis') }}
                </p>
              </div>

              <div>
                <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 italic">{{ t('categories') }}</h3>
                <div class="flex flex-wrap gap-2">
                  <span v-for="genre in anime.genres" :key="genre.mal_id" class="px-5 py-2 rounded-xl bg-slate-800/40 border border-white/5 text-[10px] font-black text-slate-300 uppercase hover:border-[var(--accent-color)] hover:text-white transition-all cursor-default">
                    {{ genre.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="py-40 text-center">
        <i class="fa-solid fa-ghost text-5xl text-slate-800 mb-6 block"></i>
        <h2 class="text-2xl font-black text-white uppercase italic">{{ t('empty') }}</h2>
        <button @click="router.push('/')" class="mt-8 px-10 py-4 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[var(--accent-color)] transition-all">
          {{ t('back_home') }}
        </button>
      </div>
    </main>

    <AuthModal v-if="showAuth" @close="showAuth = false" @authSuccess="handleAuthSuccess" />
    <DashboardModal v-if="showDashboard" :user="currentUser" @close="showDashboard = false" @logout="handleLogout" @updateUser="handleUpdateUser" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineAsyncComponent, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { animeService } from '../services/api';
import { translations } from '../utils/i18n';

const Navbar = defineAsyncComponent(() => import('../components/Navbar.vue'));
const AuthModal = defineAsyncComponent(() => import('../components/AuthModal.vue'));
const DashboardModal = defineAsyncComponent(() => import('../components/DashboardModal.vue'));
const Toast = defineAsyncComponent(() => import('../components/Toast.vue'));

const route = useRoute();
const router = useRouter();
const anime = ref(null);
const loading = ref(true);
const currentUser = ref(null);
const toastRef = ref(null);
const showAuth = ref(false);
const showDashboard = ref(false);

const t = (key) => {
  const lang = currentUser.value?.lang || 'en';
  return translations[lang]?.[key] || key;
};

const isBookmarked = computed(() => {
  if (!currentUser.value || !anime.value) return false;
  return currentUser.value.watchlist?.some(i => i.id === anime.value.mal_id);
});

const fetchAnimeDetail = async () => {
  const id = route.params.id;
  if (!id) return;
  loading.value = true;
  anime.value = null; // Reset gais biar gak ada sisa data lama
  try {
    const res = await animeService.getAnimeDetail(id);
    if (res && res.data) {
      anime.value = res.data;
    }
  } catch (err) {
    console.error("SHOW_ERR", err);
  } finally {
    loading.value = false;
  }
};

const handleAuthSuccess = (user) => {
  currentUser.value = user;
  showAuth.value = false;
};

const handleUpdateUser = (updatedUser) => {
  currentUser.value = updatedUser;
  localStorage.setItem('ududnime_session', JSON.stringify(updatedUser));
};

const handleToggleWatchlist = () => {
  if (!currentUser.value) { showAuth.value = true; return; }
  
  let user = { ...currentUser.value };
  if (!user.watchlist) user.watchlist = [];
  
  const animeData = {
    id: anime.value.mal_id,
    title: anime.value.title,
    image: anime.value.images?.jpg?.image_url,
    genres: anime.value.genres
  };

  const idx = user.watchlist.findIndex(i => i.id === animeData.id);
  if (idx === -1) {
    user.watchlist.push(animeData);
    toastRef.value?.addToast(t('success_add'), "success");
    user.xp = (user.xp || 0) + 10;
  } else {
    user.watchlist.splice(idx, 1);
    toastRef.value?.addToast(t('success_remove'), "info");
  }

  handleUpdateUser(user);
};

const handleLogout = () => {
  localStorage.removeItem('ududnime_session');
  currentUser.value = null;
  showDashboard.value = false;
};

// Re-fetch gais kalau route ID ganti tiba-tiba
watch(() => route.params.id, () => {
  fetchAnimeDetail();
});

onMounted(() => {
  const session = localStorage.getItem('ududnime_session');
  if (session) currentUser.value = JSON.parse(session);
  fetchAnimeDetail();
});
</script>
<template>
  <div class="min-h-screen bg-[#020617] text-slate-100 font-inter relative selection:bg-[var(--accent-glow)] overflow-x-hidden">
    <Toast ref="toastRef" />
    
    <Navbar 
      :user="currentUser" 
      @openAuth="showAuth = true"
      @openDashboard="showDashboard = true"
      @logout="handleLogout"
      @goHome="router.push('/')"
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

      <div v-else-if="anime" class="max-w-6xl mx-auto fade-in">
        <button @click="router.back()" class="flex items-center gap-3 text-slate-500 hover:text-[var(--accent-color)] transition-all mb-8 group uppercase text-[10px] font-black tracking-widest">
          <BaseIcon icon="fa-solid fa-arrow-left" size="xs" wrapper-class="group-hover:-translate-x-1 transition-transform" />
          {{ t('back') || 'KEMBALI' }}
        </button>

        <div class="flex flex-col lg:flex-row gap-12">
          <aside class="w-full lg:w-[320px] shrink-0">
            <div class="sticky top-28 space-y-6">
              <div class="relative group">
                <img :src="anime.images?.jpg?.large_image_url" class="w-full rounded-[3rem] border border-white/5 shadow-2xl group-hover:border-[var(--accent-color)] transition-all duration-500" />
                <div class="absolute inset-0 rounded-[3rem] bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                
                <div class="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                  <BaseBadge variant="primary" size="sm" glow>{{ anime.type }}</BaseBadge>
                  <BaseBadge variant="glass" size="sm">{{ anime.status }}</BaseBadge>
                </div>
              </div>

              <BaseButton 
                @click="handleToggleWatchlist" 
                :variant="isBookmarked ? 'secondary' : 'primary'"
                size="lg"
                class="w-full"
                :class="{ '!text-emerald-500 !border-emerald-500/30': isBookmarked }"
              >
                <template #icon-left>
                  <BaseIcon :icon="isBookmarked ? 'fa-solid fa-check' : 'fa-solid fa-plus'" size="sm" />
                </template>
                {{ isBookmarked ? t('in_watchlist') : t('add_watchlist') }}
              </BaseButton>
              
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
                <span class="text-[var(--accent-color)]">{{ anime.title_japanese }}</span>
                <div class="h-1 w-1 bg-slate-800 rounded-full"></div>
                <span>{{ anime.duration || 'N/A' }}</span>
                <div class="h-1 w-1 bg-slate-800 rounded-full"></div>
                <span>{{ anime.aired?.string || 'Unknown' }}</span>
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
                  <BaseBadge v-for="genre in anime.genres" :key="genre.mal_id" variant="glass" size="md">
                    {{ genre.name }}
                  </BaseBadge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="py-40 text-center">
        <BaseIcon icon="fa-solid fa-ghost" size="2xl" wrapper-class="mb-6 opacity-20" />
        <h2 class="text-2xl font-black text-white uppercase italic">{{ t('empty') }}</h2>
        <BaseButton @click="router.push('/')" variant="secondary" class="mt-8">
          {{ t('back_home') }}
        </BaseButton>
      </div>
    </main>

    <AuthModal v-if="showAuth" @close="showAuth = false" @authSuccess="handleAuthSuccess" />
    <DashboardModal 
      v-if="showDashboard" 
      :user="currentUser" 
      @close="showDashboard = false" 
      @logout="handleLogout"
      @updateUser="handleUpdateUser"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { animeService } from '../services/api';
import { translations } from '../utils/i18n';
import { supabase } from '../utils/supabase';

// Lazy load komponen gais
const Navbar = defineAsyncComponent(() => import('../components/Navbar.vue'));
const AuthModal = defineAsyncComponent(() => import('../components/AuthModal.vue'));
const DashboardModal = defineAsyncComponent(() => import('../components/DashboardModal.vue'));
const Toast = defineAsyncComponent(() => import('../components/Toast.vue'));
const BaseButton = defineAsyncComponent(() => import('../components/BaseButton.vue'));
const BaseBadge = defineAsyncComponent(() => import('../components/BaseBadge.vue'));
const BaseIcon = defineAsyncComponent(() => import('../components/BaseIcon.vue'));

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
  return currentUser.value?.watchlist?.some(i => i.id === anime.value?.mal_id);
});

// --- 🔐 LOGIKA AUTH SYNC GAIS ---
const handleAuthSuccess = (user) => {
  currentUser.value = user;
  showAuth.value = false;
  // Apply theme jika ada gais
  if (user.themeColor) {
    document.documentElement.style.setProperty('--accent-color', user.themeColor);
  }
};

const handleUpdateUser = (updatedUser) => {
  currentUser.value = updatedUser;
  localStorage.setItem('ududnime_session', JSON.stringify(updatedUser));
};

const handleLogout = async () => {
  try {
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem('ududnime_session');
    currentUser.value = null;
    showDashboard.value = false;
    toastRef.value?.addToast("LOGOUT BERHASIL!", "info");
  } catch (err) {
    console.error("LOGOUT_ERR");
  }
};

const fetchAnimeDetail = async () => {
  const id = route.params.id;
  loading.value = true;
  try {
    const res = await animeService.getAnimeDetail(id);
    anime.value = res.data;
  } catch (err) {
    console.error("SHOW_ERR", err);
  } finally {
    loading.value = false;
  }
};

const handleToggleWatchlist = () => {
  if (!currentUser.value) { showAuth.value = true; return; }
  
  let user = { ...currentUser.value };
  if (!user.watchlist) user.watchlist = [];
  
  const animeData = {
    id: anime.value.mal_id,
    title: anime.value.title,
    image: anime.value.images?.jpg?.image_url,
    type: anime.value.type
  };

  const idx = user.watchlist.findIndex(i => i.id === animeData.id);
  if (idx === -1) {
    user.watchlist.push(animeData);
    toastRef.value?.addToast("DITAMBAHKAN KE LIST!", "success");
    // Gain XP kecil buat interaksi gais
    user.xp = (user.xp || 0) + 10;
  } else {
    user.watchlist.splice(idx, 1);
    toastRef.value?.addToast("DIHAPUS DARI LIST!", "info");
  }

  handleUpdateUser(user);
};

onMounted(() => {
  const session = localStorage.getItem('ududnime_session');
  if (session) {
    const user = JSON.parse(session);
    handleAuthSuccess(user);
  }
  fetchAnimeDetail();
});
</script>
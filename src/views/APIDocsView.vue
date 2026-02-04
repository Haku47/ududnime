<template>
  <div class="min-h-screen bg-[#020617] text-slate-100 font-inter selection:bg-[var(--accent-glow)] overflow-x-hidden relative">
    <Toast ref="toastRef" />

    <Navbar 
      :user="currentUser" 
      @goHome="() => router.push('/')" 
      @openDetail="openDetail" 
      @openDashboard="showDashboard = true"
      @logout="handleLogout"
      @openAuth="showAuth = true"
      @updateUser="handleUpdateUser"
    />

    <div class="relative w-full pt-36 md:pt-48 pb-12 px-4 mb-10 overflow-hidden -mt-28">
      <div class="absolute inset-0 z-0">
        <img src="https://images.alphacoders.com/132/1322100.png" 
          class="w-full h-full object-cover opacity-20 scale-110"
          :style="{ filter: 'blur(12px) brightness(30%)' }" />
        <div class="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-transparent to-[#020617]"></div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto text-center animate-fade-in">
        <div class="inline-flex items-center gap-3 px-5 py-2 bg-[var(--accent-bg)] border border-[var(--accent-color)]/20 rounded-full mb-8">
           <i class="fa-solid fa-microchip text-[var(--accent-color)] text-[10px]"></i>
           <p class="text-[10px] font-black text-[var(--accent-color)] uppercase tracking-[0.4em]">Developer Documentation</p>
        </div>
        <h1 class="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-4 leading-none">
          SYSTEM <span class="text-[var(--accent-color)] drop-shadow-[0_0_30px_var(--accent-glow)]">CORE</span>
        </h1>
        <p class="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] max-w-2xl mx-auto italic opacity-70 leading-relaxed">
          Panduan integrasi dan spesifikasi teknis arsitektur data Ududnime gais.
        </p>
      </div>
    </div>

    <main class="container mx-auto px-4 py-12 relative z-10">
      <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <aside class="lg:col-span-3 space-y-4 h-fit lg:sticky lg:top-24 hidden lg:block">
          <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6 px-4">Endpoints</p>
          <button v-for="section in apiDocs" :key="section.id" 
            @click="scrollTo(section.id)"
            class="w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-transparent hover:bg-white/5 active:scale-95"
            :class="activeSection === section.id ? 'bg-[var(--accent-bg)] text-[var(--accent-color)] border-[var(--accent-color)]/20 shadow-lg' : 'text-slate-500'">
            {{ section.title }}
          </button>
        </aside>

        <div class="lg:col-span-9 space-y-16">
          <section v-for="section in apiDocs" :key="section.id" :id="section.id" class="space-y-8 scroll-mt-32">
            <div class="flex items-center gap-4">
               <div class="h-8 w-1.5 bg-[var(--accent-color)] rounded-full"></div>
               <h2 class="text-3xl font-black uppercase italic text-white tracking-tight">{{ section.title }}</h2>
            </div>

            <p class="text-slate-400 text-sm leading-relaxed font-medium">
              {{ section.description }}
            </p>

            <div class="bg-slate-950 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
              <div class="px-6 py-3 bg-white/5 border-b border-white/5 flex justify-between items-center">
                <div class="flex gap-1.5">
                  <div class="w-2 h-2 rounded-full bg-red-500/50"></div>
                  <div class="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                  <div class="w-2 h-2 rounded-full bg-green-500/50"></div>
                </div>
                <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">JSON Protocol</span>
              </div>
              <pre class="p-8 overflow-x-auto custom-scroll font-mono text-[11px] md:text-xs leading-relaxed text-blue-400">
<code><span class="text-pink-500">GET</span> {{ section.endpoint }}

<span class="text-slate-500">// Response Structure</span>
{
  <span class="text-emerald-400">"status"</span>: 200,
  <span class="text-emerald-400">"data"</span>: [
    {
      <span class="text-emerald-400">"mal_id"</span>: <span class="text-yellow-500">12345</span>,
      <span class="text-emerald-400">"title"</span>: <span class="text-yellow-500">"{{ section.exampleTitle }}"</span>,
      <span class="text-emerald-400">"type"</span>: <span class="text-yellow-500">"TV"</span>
    }
  ]
}</code></pre>
            </div>
          </section>
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

    <AuthModal v-if="showAuth" @close="showAuth = false" @authSuccess="handleAuthSuccess" />
    <DashboardModal v-if="showDashboard" :user="currentUser" @close="showDashboard = false" @logout="handleLogout" @updateUser="handleUpdateUser" />
    <DetailModal v-if="selectedAnime" :anime="selectedAnime" :user="currentUser" @close="selectedAnime = null" />
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';

const Navbar = defineAsyncComponent(() => import('../components/Navbar.vue'));
const Toast = defineAsyncComponent(() => import('../components/Toast.vue'));
const AuthModal = defineAsyncComponent(() => import('../components/AuthModal.vue'));
const DashboardModal = defineAsyncComponent(() => import('../components/DashboardModal.vue'));
const DetailModal = defineAsyncComponent(() => import('../components/DetailModal.vue'));

const router = useRouter();
const currentUser = ref(null);
const showAuth = ref(false);
const showDashboard = ref(false);
const selectedAnime = ref(null);
const toastRef = ref(null);
const activeSection = ref('top-anime');

const apiDocs = [
  {
    id: 'top-anime',
    title: 'Top Anime',
    description: 'Mengambil daftar anime paling populer secara global berdasarkan metrik Jikan Core.',
    endpoint: '/top/anime?filter=bypopularity',
    exampleTitle: 'Cowboy Bebop'
  },
  {
    id: 'schedules',
    title: 'Season Schedule',
    description: 'Mendapatkan jadwal tayang anime seasonal yang disinkronisasi dengan waktu lokal gais.',
    endpoint: '/schedules?filter=monday',
    exampleTitle: 'One Piece'
  },
  {
    id: 'details',
    title: 'Anime Details',
    description: 'Mengambil metadata lengkap termasuk sinopsis, genre, dan trailer menggunakan ID unik.',
    endpoint: '/anime/{id}/full',
    exampleTitle: 'Naruto Shippuden'
  }
];

const scrollTo = (id) => {
  activeSection.value = id;
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const handleAuthSuccess = (user) => {
  currentUser.value = user;
  showAuth.value = false;
};

const handleUpdateUser = (updatedUser) => {
  currentUser.value = updatedUser;
  localStorage.setItem('ududnime_session', JSON.stringify(updatedUser));
  if (updatedUser.themeColor) {
    document.documentElement.style.setProperty('--accent-color', updatedUser.themeColor);
  }
};

const handleLogout = () => {
  localStorage.removeItem('ududnime_session');
  currentUser.value = null;
  showDashboard.value = false;
};

const openDetail = (anime) => { selectedAnime.value = anime; };

onMounted(() => {
  const session = localStorage.getItem('ududnime_session');
  if (session) {
    const user = JSON.parse(session);
    currentUser.value = user;
    if (user.themeColor) {
      document.documentElement.style.setProperty('--accent-color', user.themeColor);
    }
  }
});
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
.custom-scroll::-webkit-scrollbar-thumb:hover { background: var(--accent-color); }
</style>
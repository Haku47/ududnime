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
        <img :src="currentUser?.customHomeBg || 'https://images.alphacoders.com/132/1327170.png'" 
          class="w-full h-full object-cover opacity-20 scale-110"
          :style="{ filter: 'blur(8px) brightness(30%)' }" />
        <div class="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-[#020617]/40 to-[#020617]"></div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto text-center">
        <div class="inline-flex items-center gap-3 px-5 py-2 bg-[var(--accent-bg)] border border-[var(--accent-glow)] rounded-full mb-8 animate-fade-in">
           <i class="fa-solid fa-code-branch text-[var(--accent-color)] text-[10px]"></i>
           <p class="text-[10px] font-black text-[var(--accent-color)] uppercase tracking-[0.4em]">System Evolution Log</p>
        </div>
        <h1 class="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-4 leading-none">
          CHANGE<span class="text-[var(--accent-color)] drop-shadow-[0_0_30px_var(--accent-glow)]">LOG</span>
        </h1>
        <p class="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] max-w-2xl mx-auto italic opacity-70">
          Melacak setiap bit perubahan dan fitur baru yang lahir di Ududnime gais.
        </p>
      </div>
    </div>

    <main class="container mx-auto px-4 py-12 relative z-10">
      <div class="max-w-3xl mx-auto relative">
        <div class="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent-color)] via-slate-800 to-transparent opacity-30 md:-translate-x-1/2"></div>

        <div class="space-y-20">
          <div v-for="(update, idx) in updates" :key="update.version" 
            class="relative flex flex-col md:flex-row items-start md:items-center gap-8 group">
            
            <div class="absolute left-0 md:left-1/2 w-4 h-4 bg-slate-900 border-2 border-[var(--accent-color)] rounded-full z-20 md:-translate-x-1/2 shadow-[0_0_15px_var(--accent-glow)] group-hover:scale-125 transition-transform duration-500"></div>

            <div :class="['w-full md:w-[45%] p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl transition-all hover:border-[var(--accent-color)]/30', 
              idx % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto md:text-right']">
              
              <div :class="['flex items-center gap-4 mb-6', idx % 2 === 0 ? '' : 'md:flex-row-reverse']">
                <span class="px-4 py-1 bg-[var(--accent-bg)] text-[var(--accent-color)] rounded-lg text-[10px] font-black tracking-widest border border-[var(--accent-glow)]">
                  v{{ update.version }}
                </span>
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">{{ update.date }}</span>
              </div>

              <h3 class="text-xl font-black text-white uppercase italic mb-4">{{ update.title }}</h3>
              
              <ul :class="['space-y-3', idx % 2 === 0 ? '' : 'md:items-end']">
                <li v-for="item in update.changes" :key="item" class="flex items-start gap-3 text-xs text-slate-400 leading-relaxed group/item">
                  <i :class="['fa-solid fa-caret-right text-[var(--accent-color)] mt-1 transition-transform group-hover/item:translate-x-1', idx % 2 === 0 ? '' : 'md:order-last']"></i>
                  <span class="flex-1">{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-32 text-center">
        <button @click="router.push('/')" class="px-12 py-5 bg-slate-900/60 border border-white/5 hover:bg-[var(--accent-color)] text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-[2rem] transition-all active:scale-95 shadow-2xl">
          Return to Dashboard
        </button>
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

const updates = [
  {
    version: '4.2.0',
    date: 'February 2026',
    title: 'Neural UI Overhaul',
    changes: [
      'Redesign total UI dengan Glassmorphism 2.0 gais.',
      'Integrasi Immersive Hero Background di semua halaman utama.',
      'Sistem Caching API Jikan v4 untuk loading lebih kilat.',
      'Professional Footer architecture dengan navigasi cerdas.'
    ]
  },
  {
    version: '4.1.5',
    date: 'January 2026',
    title: 'Stability & Optimization',
    changes: [
      'Penambahan System Monitoring & Status page gais.',
      'Perbaikan bug Rate Limit pada Jikan API.',
      'Otentikasi Supabase & sinkronisasi profil GitHub.',
      'Dukungan multilingual (ID, EN, JV, JP) untuk Loading Screen.'
    ]
  },
  {
    version: '4.0.0',
    date: 'December 2025',
    title: 'The New Ududnime Engine',
    changes: [
      'Migrasi total ke Vue 3 Composition API gais.',
      'Sistem tema dinamis berbasis warna aksen user.',
      'Fitur Watchlist & User XP Progression System.',
      'Dashboard user untuk kustomisasi tampilan Home.'
    ]
  }
];

const handleAuthSuccess = (user) => {
  currentUser.value = user;
  showAuth.value = false;
  toastRef.value?.addToast(`WELCOME, ${user.username.toUpperCase()}!`, "success");
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
  toastRef.value?.addToast("LOGGED OUT", "info");
};

const openDetail = (anime) => { selectedAnime.value = anime; };

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
});
</script>

<style scoped>
.animate-fade-in { animation: fadeInDown 0.8s ease-out; }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
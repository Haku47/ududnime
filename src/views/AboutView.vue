<template>
  <div class="min-h-screen bg-[#020617] text-slate-100 font-inter selection:bg-[var(--accent-glow)] overflow-x-hidden">
    <Toast ref="toastRef" />

    <Navbar
      :user="currentUser"
      @openDashboard="handleOpenDashboard"
      @logout="handleLogout"
      @openAuth="showAuth = true"
      @updateUser="handleUpdateUser"
    />

    <div class="relative w-full pt-36 md:pt-48 pb-12 px-4 -mt-28 overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img :src="currentUser?.customHomeBg || 'https://images.alphacoders.com/132/1327170.png'" 
          class="w-full h-full object-cover transition-all duration-1000 opacity-20 scale-110"
          :style="{ filter: 'blur(8px) brightness(40%)' }" />
        <div class="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-transparent to-[#020617]"></div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto text-center">
        <div class="inline-flex items-center gap-3 px-5 py-2 bg-[var(--accent-bg)] border border-[var(--accent-glow)] rounded-full mb-8 animate-fade-in">
           <span class="relative flex h-2 w-2">
             <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-color)] opacity-75"></span>
             <span class="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-color)]"></span>
           </span>
           <p class="text-[10px] font-black text-[var(--accent-color)] uppercase tracking-[0.4em]">{{ t('dev_profile') }}</p>
        </div>
        <h1 class="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-4 leading-none">
          {{ t('about_us').split(' ')[0] }} <span class="text-[var(--accent-color)] underline decoration-[12px] decoration-[var(--accent-glow)] underline-offset-[16px]">{{ t('about_us').split(' ')[1] || 'US' }}</span>
        </h1>
      </div>
    </div>

    <main class="container mx-auto px-4 pb-24 relative z-10 -mt-10">
      <div class="max-w-4xl mx-auto">
        <div class="bg-slate-900/40 p-8 md:p-20 rounded-[4rem] border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative overflow-hidden group">
          <div class="absolute -top-32 -right-32 w-80 h-80 bg-[var(--accent-color)] opacity-5 rounded-full blur-[100px] group-hover:opacity-10 transition-opacity duration-1000"></div>

          <div class="relative z-10 flex flex-col items-center">
            <p class="text-slate-400 text-sm md:text-lg font-medium uppercase tracking-widest leading-relaxed mb-16 italic text-center px-4 md:px-10 opacity-80">
              "{{ t('about_desc') }}"
            </p>

            <div class="flex flex-col items-center gap-8 w-full">
              <div class="relative">
                <div class="absolute -inset-4 bg-gradient-to-tr from-[var(--accent-color)] to-yellow-500 rounded-[3rem] opacity-20 blur-xl animate-pulse"></div>
                <div class="relative w-32 h-32 md:w-40 md:h-40 bg-slate-950 p-2 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-700">
                   <div class="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 rounded-[2rem] flex items-center justify-center">
                      <i class="fa-solid fa-code-merge text-5xl text-[var(--accent-color)]"></i>
                   </div>
                </div>
              </div>

              <div class="text-center space-y-3">
                <h2 class="text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">ALVIENSYAH MOHAMMAD</h2>
                <div class="flex items-center justify-center gap-4">
                  <div class="h-px w-8 bg-slate-800"></div>
                  <p class="text-[11px] font-black uppercase tracking-[0.5em] text-[var(--accent-color)]">{{ t('undergraduate') }}</p>
                  <div class="h-px w-8 bg-slate-800"></div>
                </div>
              </div>

              <div class="flex flex-wrap justify-center gap-4 w-full max-w-md">
                <button @click="copyEmail" class="flex-1 min-w-[240px] px-8 py-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group/email hover:border-[var(--accent-color)]/50 hover:bg-[var(--accent-bg)] transition-all">
                  <div class="flex items-center gap-4">
                    <i class="fa-solid fa-envelope text-slate-500 group-hover/email:text-[var(--accent-color)] transition-colors"></i>
                    <span class="text-[11px] font-black text-slate-300 group-hover/email:text-white tracking-widest uppercase truncate max-w-[150px]">hakupoi97@gmail.com</span>
                  </div>
                  <i class="fa-solid fa-copy text-[10px] text-slate-700 group-hover/email:text-[var(--accent-color)]"></i>
                </button>
                
                <div class="flex gap-4">
                  <a href="https://github.com/haku47" target="_blank" class="w-14 h-14 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:border-[var(--accent-color)]/40 hover:bg-[var(--accent-bg)] transition-all duration-500 shadow-lg">
                    <i class="fa-brands fa-github text-2xl"></i>
                  </a>
                  <a href="https://instagram.com/alvien1939" target="_blank" class="w-14 h-14 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:border-[var(--accent-color)]/40 hover:bg-[var(--accent-bg)] transition-all duration-500 shadow-lg">
                    <i class="fa-brands fa-instagram text-2xl"></i>
                  </a>
                </div>
              </div>
            </div>

            <div class="w-full mt-24 pt-16 border-t border-white/5">
              <h3 class="text-[10px] font-black uppercase tracking-[0.6em] text-slate-500 mb-12 text-center">{{ t('tech_title') }}</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div v-for="tech in techStacks" :key="tech.name" class="p-8 rounded-[2.5rem] bg-black/40 border border-white/5 flex flex-col items-center gap-5 hover:border-[var(--accent-color)]/30 hover:bg-white/[0.02] transition-all group/tech active:scale-95 shadow-inner">
                  <div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover/tech:bg-[var(--accent-bg)] group-hover/tech:border-[var(--accent-color)]/20 transition-all">
                    <i :class="[tech.icon, 'text-2xl text-slate-500 group-hover/tech:text-[var(--accent-color)] transition-colors']"></i>
                  </div>
                  <span class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover/tech:text-white transition-colors">{{ tech.name }}</span>
                </div>
              </div>
            </div>

            <div class="mt-20">
              <button @click="router.push('/')" class="group px-14 py-6 bg-slate-900 border border-white/5 hover:bg-[var(--accent-color)] text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-[2rem] transition-all shadow-2xl active:scale-95 flex items-center gap-5">
                <i class="fa-solid fa-arrow-left group-hover:-translate-x-2 transition-transform"></i> 
                {{ t('back_home') }}
              </button>
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
    <DashboardModal v-if="showDashboard" :user="currentUser" @close="handleCloseDashboard" @logout="handleLogout" @updateUser="handleUpdateUser" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { translations } from '../utils/i18n'

const Navbar = defineAsyncComponent(() => import('../components/Navbar.vue'))
const AuthModal = defineAsyncComponent(() => import('../components/AuthModal.vue'))
const DashboardModal = defineAsyncComponent(() => import('../components/DashboardModal.vue'))
const Toast = defineAsyncComponent(() => import('../components/Toast.vue'))
const ApiStatus = defineAsyncComponent(() => import('../components/ApiStatus.vue'))

const router = useRouter()
const currentUser = ref(null)
const showAuth = ref(false)
const showDashboard = ref(false)
const toastRef = ref(null) 

// --- 🌐 LOGIKA TRANSLASI EFISIEN GAIS ---
const t = (key) => {
  const lang = currentUser.value?.lang || 'en'; // Default English
  // Langsung ambil dari file i18n.js gais
  return translations[lang]?.[key] || translations['en']?.[key] || key;
};

const techStacks = [
  { name: 'Vite.js', icon: 'fa-solid fa-bolt-lightning' },
  { name: 'Vue 3', icon: 'fa-brands fa-vuejs' },
  { name: 'Tailwind', icon: 'fa-solid fa-wind' },
  { name: 'Supabase', icon: 'fa-solid fa-database' }
];

const handleOpenDashboard = () => { showDashboard.value = true; document.body.style.overflow = 'hidden'; }
const handleCloseDashboard = () => { showDashboard.value = false; document.body.style.overflow = ''; }

const handleAuthSuccess = (user) => {
  currentUser.value = user;
  showAuth.value = false;
  toastRef.value?.addToast(`WELCOME, ${user.username.toUpperCase()}!`, 'success');
}

const handleUpdateUser = (updatedUser) => {
  currentUser.value = updatedUser;
  localStorage.setItem('ududnime_session', JSON.stringify(updatedUser));
  if (updatedUser.themeColor) {
    document.documentElement.style.setProperty('--accent-color', updatedUser.themeColor);
    document.documentElement.style.setProperty('--accent-glow', `${updatedUser.themeColor}66`);
    document.documentElement.style.setProperty('--accent-bg', `${updatedUser.themeColor}1a`);
  }
}

const handleLogout = () => {
  localStorage.removeItem('ududnime_session');
  currentUser.value = null;
  handleCloseDashboard();
  toastRef.value?.addToast('LOGGED OUT', 'info');
}

const copyEmail = () => {
  navigator.clipboard.writeText("hakupoi97@gmail.com");
  toastRef.value?.addToast(t('email_copied'), 'success', 'fa-solid fa-copy');
}

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
})

onUnmounted(() => { document.body.style.overflow = ''; })
</script>

<style scoped>
.animate-fade-in { animation: fadeInDown 0.8s ease-out; }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

.custom-scroll::-webkit-scrollbar { width: 5px; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
.custom-scroll::-webkit-scrollbar-thumb:hover { background: var(--accent-color); }
</style>
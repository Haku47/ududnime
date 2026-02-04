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
          :style="{ filter: 'blur(10px) brightness(30%)' }" />
        <div class="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-transparent to-[#020617]"></div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto text-center animate-fade-in">
        <div class="inline-flex items-center gap-3 px-5 py-2 bg-[var(--accent-bg)] border border-[var(--accent-color)]/20 rounded-full mb-8">
           <i class="fa-solid fa-shield-halved text-[var(--accent-color)] text-[10px]"></i>
           <p class="text-[10px] font-black text-[var(--accent-color)] uppercase tracking-[0.4em]">Legal & Compliance</p>
        </div>
        
        <h1 class="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-4 leading-none">
          {{ t('terms_header').split(' & ')[0] }} & <span class="text-[var(--accent-color)] drop-shadow-[0_0_30px_var(--accent-glow)]">{{ t('terms_header').split(' & ')[1] }}</span>
        </h1>
        
        <p class="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] max-w-2xl mx-auto italic opacity-70 leading-relaxed">
          {{ t('terms_tagline') }}
        </p>
      </div>
    </div>

    <main class="container mx-auto px-4 py-12 relative z-10">
      <div class="max-w-4xl mx-auto space-y-8 text-left">
        
        <div v-for="(section, idx) in termsDataComputed" :key="idx" 
          class="bg-slate-900/40 p-8 md:p-12 rounded-[3rem] border border-white/5 backdrop-blur-xl transition-all hover:border-[var(--accent-color)]/20 shadow-2xl group">
          
          <div class="flex items-start gap-6">
            <div class="w-12 h-12 shrink-0 bg-black/40 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-[var(--accent-color)]/50 transition-colors">
              <span class="text-lg font-black text-[var(--accent-color)] italic">{{ String(idx + 1).padStart(2, '0') }}</span>
            </div>
            
            <div class="space-y-4">
              <h2 class="text-2xl font-black text-white uppercase italic tracking-tight">{{ section.title }}</h2>
              <p class="text-slate-400 text-sm leading-relaxed font-medium">
                {{ section.content }}
              </p>
              
              <ul v-if="section.subPoints" class="space-y-3 mt-6">
                <li v-for="point in section.subPoints" :key="point" class="flex items-center gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  <i class="fa-solid fa-check text-[var(--accent-color)] text-[8px]"></i>
                  {{ point }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="p-8 bg-red-500/5 border-2 border-dashed border-red-500/20 rounded-[3rem] text-center">
        <i class="fa-solid fa-triangle-exclamation text-red-500 text-2xl mb-4"></i>
        <h3 class="text-sm font-black text-white uppercase tracking-widest mb-2">Disclaimer</h3>
        <p class="text-[11px] text-slate-500 font-medium uppercase tracking-widest leading-relaxed px-4">
            {{ t('disclaimer_content') }}
        </p>
        </div>
      </div>

      <div class="mt-24 text-center">
        <button @click="router.push('/')" class="px-14 py-6 bg-slate-900 border border-white/5 hover:bg-[var(--accent-color)] text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-[2rem] transition-all shadow-2xl active:scale-95">
          {{ t('terms_btn') }}
        </button>
      </div>
    </main>

    <footer class="relative mt-40 border-t border-white/5 bg-[#020617] overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-color)] to-transparent opacity-40"></div>
      <div class="container mx-auto px-6 pt-20 pb-12 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 mb-20">
          <div class="space-y-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-[var(--accent-color)] rounded-xl flex items-center justify-center shadow-2xl">
                <i class="fa-solid fa-film text-white text-sm"></i>
              </div>
              <h2 class="text-xl font-black text-white tracking-tighter uppercase italic">Udud<span class="text-[var(--accent-color)]">nime</span></h2>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed max-w-xs font-medium">Independent anime database architecture built for speed and immersion gais.</p>
          </div>
          <div class="flex flex-col items-start md:items-center">
            <div class="space-y-6">
              <p class="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">System Navigation</p>
              <ul class="grid grid-cols-2 gap-x-10 gap-y-4">
                <li><router-link to="/" class="text-[11px] font-bold text-slate-500 hover:text-[var(--accent-color)] uppercase">{{ t('home') }}</router-link></li>
                <li><router-link to="/explorer" class="text-[11px] font-bold text-slate-500 hover:text-[var(--accent-color)] uppercase">{{ t('browse') }}</router-link></li>
                <li><router-link to="/schedule" class="text-[11px] font-bold text-slate-500 hover:text-[var(--accent-color)] uppercase">{{ t('schedule') }}</router-link></li>
                <li><router-link to="/about-us" class="text-[11px] font-bold text-slate-500 hover:text-[var(--accent-color)] uppercase">{{ t('about_us') }}</router-link></li>
              </ul>
            </div>
          </div>
          <div class="flex flex-col items-start md:items-end space-y-6 text-right">
            <div class="space-y-2"><ApiStatus /></div>
          </div>
        </div>
        <div class="pt-8 border-t border-white/5 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <p class="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">&copy; 2026 UDUDNIME — INDONESIA</p>
          <div class="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest"><span class="text-slate-500 italic">Dev</span> Alviensyah Mohammad</div>
        </div>
      </div>
    </footer>

    <AuthModal v-if="showAuth" @close="showAuth = false" @authSuccess="handleAuthSuccess" />
    <DashboardModal v-if="showDashboard" :user="currentUser" @close="showDashboard = false" @logout="handleLogout" @updateUser="handleUpdateUser" />
    <DetailModal v-if="selectedAnime" :anime="selectedAnime" :user="currentUser" @close="selectedAnime = null" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { translations } from '../utils/i18n';

const Navbar = defineAsyncComponent(() => import('../components/Navbar.vue'));
const Toast = defineAsyncComponent(() => import('../components/Toast.vue'));
const AuthModal = defineAsyncComponent(() => import('../components/AuthModal.vue'));
const DashboardModal = defineAsyncComponent(() => import('../components/DashboardModal.vue'));
const DetailModal = defineAsyncComponent(() => import('../components/DetailModal.vue'));
const ApiStatus = defineAsyncComponent(() => import('../components/ApiStatus.vue'));

const router = useRouter();
const currentUser = ref(null);
const showAuth = ref(false);
const showDashboard = ref(false);
const selectedAnime = ref(null);
const toastRef = ref(null);

// 🌐 FUNGSI TRANSLASI GAIS
const t = (key) => {
  const lang = currentUser.value?.lang || 'en';
  return translations[lang]?.[key] || translations['en']?.[key] || key;
};

// 🧠 LOGIKA DATA TERMS DWI-BAHASA (AMBIL DARI i18n.js)
const termsDataComputed = computed(() => {
  const lang = currentUser.value?.lang || 'en';
  return translations[lang]?.terms_list || translations['en']?.terms_list || [];
});

const handleAuthSuccess = (user) => {
  currentUser.value = user;
  showAuth.value = false;
};

const handleUpdateUser = (updatedUser) => {
  currentUser.value = updatedUser;
  localStorage.setItem('ududnime_session', JSON.stringify(updatedUser));
  if (updatedUser.themeColor) document.documentElement.style.setProperty('--accent-color', updatedUser.themeColor);
};

const handleLogout = () => {
  localStorage.removeItem('ududnime_session');
  currentUser.value = null;
  showDashboard.value = false;
  toastRef.value?.addToast(t('logout_success'), 'info');
};

const openDetail = (anime) => { selectedAnime.value = anime; };

onMounted(() => {
  const session = localStorage.getItem('ududnime_session');
  if (session) {
    const user = JSON.parse(session);
    currentUser.value = user;
    if (user.themeColor) document.documentElement.style.setProperty('--accent-color', user.themeColor);
  }
});
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.8s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
<script setup>
import { ref, onMounted, onUnmounted, defineAsyncComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import { translations } from '../utils/i18n' // Import translasi sakti gais!

const Navbar = defineAsyncComponent(() => import('../components/Navbar.vue'))
const AuthModal = defineAsyncComponent(() => import('../components/AuthModal.vue'))
const DashboardModal = defineAsyncComponent(() => import('../components/DashboardModal.vue'))
const Toast = defineAsyncComponent(() => import('../components/Toast.vue'))

const router = useRouter()
const currentUser = ref(null)
const showAuth = ref(false)
const showDashboard = ref(false)
const toastRef = ref(null) 

// --- 🌐 LOGIKA TRANSLASI DINAMIS GAIS ---
const t = (key) => {
  const lang = currentUser.value?.lang || 'en';
  
  // Data tambahan khusus halaman About Us gais
  const aboutExtra = {
    en: {
      dev_profile: "Developer Profile",
      about_desc: "UDUDNIME is a modern anime catalog platform developed to facilitate real-time anime searching and tracking for anime lovers throughout Indonesia.",
      tech_title: "Technology Stack",
      back_home: "Back to Home",
      email_copied: "EMAIL COPIED TO CLIPBOARD!"
    },
    id: {
      dev_profile: "Profil Pengembang",
      about_desc: "UDUDNIME adalah platform katalog anime modern yang dikembangkan untuk memudahkan pencarian dan tracking anime secara real-time bagi para penikmat anime di seluruh Indonesia.",
      tech_title: "Teknologi Yang Digunakan",
      back_home: "Kembali ke Beranda",
      email_copied: "EMAIL DISALIN KE CLIPBOARD!"
    },
    jv: {
      dev_profile: "Sopo Sing Nggawe",
      about_desc: "UDUDNIME iki wadah nggo nggoleki lan mantau jadwal anime jaman saiki sing digawe nggo nggampangne arek-arek penikmat anime sak Indonesia cak.",
      tech_title: "Gaman Sing Digarap",
      back_home: "Balik Nang Omah",
      email_copied: "E-MAIL WIS DISALIN CAK!"
    },
    jp: {
      dev_profile: "Kaihatsu-sha purofīru",
      about_desc: "UDUDNIME wa, Indonesia-jū no anime-zuki no tame ni riarutaimu no anime kensaku to torakkingu o yōi ni suru tame ni kaihatsu sa reta modan'na anime katarogu purattofōmudesu.",
      tech_title: "Shiyō gijutsu",
      back_home: "Hōmu ni modoru",
      email_copied: "MĒRU GA KURIPPUBŌDO NI KOPĪ SAREMASHITA!"
    }
  };

  return aboutExtra[lang][key] || translations[lang][key] || key;
};

const techStacks = [
  { name: 'Vite.js', icon: 'fa-solid fa-bolt-lightning' },
  { name: 'Vue 3', icon: 'fa-brands fa-vuejs' },
  { name: 'Tailwind', icon: 'fa-solid fa-wind' },
  { name: 'JavaScript', icon: 'fa-brands fa-js' }
];

const handleOpenDashboard = () => {
  showDashboard.value = true
  document.body.style.overflow = 'hidden'
}

const handleCloseDashboard = () => {
  showDashboard.value = false
  document.body.style.overflow = ''
}

const handleAuthSuccess = (user) => {
  currentUser.value = user
  showAuth.value = false
  if (toastRef.value) {
    const msg = currentUser.value.lang === 'jv' ? `SUGENG RAWUH, ${user.username.toUpperCase()}!` : `SELAMAT DATANG, ${user.username.toUpperCase()}!`;
    toastRef.value.addToast(msg, 'success')
  }
}

const handleUpdateUser = (updatedUser) => {
  currentUser.value = updatedUser
  localStorage.setItem('ududnime_session', JSON.stringify(updatedUser))
  if (updatedUser.themeColor) {
    document.documentElement.style.setProperty('--accent-color', updatedUser.themeColor);
    document.documentElement.style.setProperty('--accent-glow', `${updatedUser.themeColor}66`);
    document.documentElement.style.setProperty('--accent-bg', `${updatedUser.themeColor}1a`);
  }
}

const handleLogout = () => {
  localStorage.removeItem('ududnime_session')
  currentUser.value = null
  handleCloseDashboard()
  toastRef.value?.addToast(t('logout_btn'), 'info')
}

const copyEmail = () => {
  const email = "hakupoi97@gmail.com";
  navigator.clipboard.writeText(email);
  toastRef.value?.addToast(t('email_copied'), 'success', 'fa-solid fa-copy');
}

onMounted(() => {
  const session = localStorage.getItem('ududnime_session')
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

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="min-h-screen bg-[#020617] text-slate-100 font-inter selection:bg-[var(--accent-glow)] overflow-x-hidden">
    <Toast ref="toastRef" />

    <Navbar
      :user="currentUser"
      @openDashboard="handleOpenDashboard"
      @logout="handleLogout"
      @openAuth="showAuth = true"
      @openDetail="(anime) => router.push({ name: 'home', query: { animeId: anime.mal_id } })"
    />

    <main class="container mx-auto px-4 py-24 relative z-10">
      <div class="max-w-4xl mx-auto text-center fade-in">
        <header class="mb-12">
          <div class="inline-block px-4 py-1 bg-[var(--accent-bg)] border border-[var(--accent-glow)] rounded-full mb-6">
            <p class="text-[9px] font-black text-[var(--accent-color)] uppercase tracking-[0.4em]">{{ t('dev_profile') }}</p>
          </div>
          <h1 class="text-6xl md:text-7xl font-black uppercase italic tracking-tighter mb-4">
            {{ t('about_us').split(' ')[0] }} <span class="text-[var(--accent-color)] underline decoration-8 decoration-[var(--accent-bg)] underline-offset-8">{{ t('about_us').split(' ')[1] || 'US' }}</span>
          </h1>
        </header>

        <div class="bg-slate-900/40 p-8 md:p-14 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <p class="text-slate-400 text-sm md:text-base font-medium uppercase tracking-wider leading-relaxed mb-12 italic px-2 md:px-10">
            "{{ t('about_desc') }}"
          </p>

          <div class="flex flex-col items-center gap-6 py-10 border-t border-white/5">
            <div class="w-24 h-24 bg-gradient-to-tr from-[var(--accent-color)] to-var(--accent-glow) rounded-3xl flex items-center justify-center rotate-6 shadow-2xl shadow-[var(--accent-glow)] hover:rotate-0 hover:scale-110 transition-all duration-500 cursor-pointer group">
              <i class="fa-solid fa-code text-4xl text-white group-hover:scale-110 transition-transform"></i>
            </div>
            
            <div class="text-center">
              <h2 class="text-3xl font-black uppercase tracking-tight text-white leading-tight">ALVIENSYAH MOHAMMAD</h2>
              <p class="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-color)] mt-2">Undergraduate student</p>
              
              <div 
                @click="copyEmail" 
                class="mt-4 px-4 py-2 bg-black/40 border border-white/5 rounded-xl inline-flex items-center gap-3 cursor-pointer hover:border-[var(--accent-color)] hover:bg-[var(--accent-bg)] transition-all group"
              >
                <i class="fa-solid fa-envelope text-slate-500 group-hover:text-[var(--accent-color)]"></i>
                <span class="text-[11px] font-black text-slate-300 group-hover:text-white tracking-widest uppercase">hakupoi97@gmail.com</span>
              </div>
            </div>
            
            <div class="flex gap-4 mt-2 relative z-20">
              <a href="https://github.com/haku47" target="_blank" class="w-12 h-12 bg-black/60 border border-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:border-[var(--accent-color)] hover:bg-[var(--accent-bg)] transition-all duration-300">
                <i class="fa-brands fa-github text-xl"></i>
              </a>
              <a href="https://instagram.com/alvien1939" target="_blank" class="w-12 h-12 bg-black/60 border border-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:border-[var(--accent-color)] hover:bg-[var(--accent-bg)] transition-all duration-300">
                <i class="fa-brands fa-instagram text-xl"></i>
              </a>
            </div>
          </div>

          <div class="pt-12 border-t border-white/5">
            <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent-color)] mb-8">{{ t('tech_title') }}</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
              <div v-for="tech in techStacks" :key="tech.name" class="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col items-center gap-3 hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] transition-all group">
                <i :class="[tech.icon, 'text-2xl text-slate-500 group-hover:text-[var(--accent-color)] transition-colors']"></i>
                <span class="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">{{ tech.name }}</span>
              </div>
            </div>
          </div>

          <div class="pt-12">
            <button @click="router.push('/')" class="group px-12 py-5 bg-black/60 hover:bg-[var(--accent-color)] text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all border border-white/5 hover:border-white/20 shadow-2xl active:scale-95 flex items-center gap-4 mx-auto">
              <i class="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> {{ t('back_home') }}
            </button>
          </div>
        </div>
      </div>
    </main>

    <AuthModal v-if="showAuth" @close="showAuth = false" @authSuccess="handleAuthSuccess" />
    <DashboardModal 
      v-if="showDashboard" 
      :user="currentUser" 
      @close="handleCloseDashboard" 
      @logout="handleLogout" 
      @updateUser="handleUpdateUser" 
    />
  </div>
</template>

<style scoped>
.fade-in { animation: fadeIn 0.8s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
</style>
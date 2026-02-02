<template>
  <nav class="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 font-inter">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      
      <div class="flex items-center gap-2 cursor-pointer group" @click="goToHome">
        <div class="bg-[var(--accent-color)] p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-[0_0_15px_var(--accent-glow)]">
          <i class="fa-solid fa-film text-white text-sm"></i>
        </div>
        <span class="text-2xl font-black text-white hidden sm:block tracking-tighter uppercase italic">
          Udud<span class="text-[var(--accent-color)]">nime</span>
        </span>
      </div>

      <div class="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
        <button @click="goToHome" :class="[isActive('/') ? 'text-[var(--accent-color)]' : 'hover:text-[var(--accent-color)] transition-colors']">
          {{ t('home') }}
        </button>
        <button @click="router.push('/explorer')" :class="[isActive('/explorer') ? 'text-[var(--accent-color)]' : 'hover:text-[var(--accent-color)] transition-colors']">
          {{ t('browse') }}
        </button>
        <button @click="router.push('/schedule')" :class="[isActive('/schedule') ? 'text-[var(--accent-color)]' : 'hover:text-[var(--accent-color)] transition-colors']">
          {{ t('schedule') }}
        </button>
        <button @click="router.push('/about-us')" :class="[isActive('/about-us') ? 'text-[var(--accent-color)]' : 'hover:text-[var(--accent-color)] transition-colors']">
          {{ t('about_us') }}
        </button>
      </div>

      <div class="flex items-center gap-3 md:gap-4">
        <Notification @openDetail="(anime) => $emit('openDetail', anime)" />

        <div v-if="user" class="relative group">
          <button class="flex items-center gap-3 bg-slate-800/50 p-1 pr-4 rounded-2xl border border-slate-700 hover:border-[var(--accent-color)] transition-all shadow-sm outline-none">
            <img :src="user.avatar" class="w-9 h-9 rounded-xl object-cover border-2 border-slate-800 shadow-lg" alt="Profile" />
            <div class="text-left hidden lg:block">
              <p class="text-[9px] text-[var(--accent-color)] leading-none uppercase font-black tracking-tighter">LVL {{ user.level || 1 }}</p>
              <p class="text-xs text-white font-black leading-tight truncate max-w-[80px]">{{ user.username }}</p>
            </div>
            <i class="fa-solid fa-chevron-down text-[10px] ml-1 text-slate-500 group-hover:text-[var(--accent-color)] transition-colors"></i>
          </button>

          <div class="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right group-hover:translate-y-0 translate-y-2 z-[60] backdrop-blur-xl">
            <div class="px-5 py-3 border-b border-slate-800/50 mb-2 bg-slate-800/30">
              <div class="flex justify-between items-center mb-2">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ t('exp_label') }}</span>
                <span class="text-[9px] font-black text-[var(--accent-color)]">{{ user.xp || 0 }}%</span>
              </div>
              <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden p-[1px]">
                <div class="h-full bg-[var(--accent-color)] rounded-full shadow-[0_0_8px_var(--accent-glow)] transition-all duration-500" :style="{ width: (user.xp || 0) + '%' }"></div>
              </div>
            </div>

            <button @click="$emit('openDashboard')" class="w-full text-left px-5 py-3 text-[10px] font-black text-slate-300 hover:bg-[var(--accent-bg)] hover:text-[var(--accent-color)] flex items-center gap-3 transition-all uppercase">
              <i class="fa-solid fa-user-gear text-sm opacity-50"></i> {{ t('dashboard') }}
            </button>
            <hr class="border-slate-800 my-2 mx-4" />
            <button @click="$emit('logout')" class="w-full text-left px-5 py-3 text-[10px] font-black text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-all uppercase">
              <i class="fa-solid fa-power-off text-sm"></i> {{ t('logout_btn') }}
            </button>
          </div>
        </div>

        <button v-else @click="$emit('openAuth')" class="flex items-center gap-2 bg-[var(--accent-color)] px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white hover:opacity-90 transition-all shadow-xl shadow-[var(--accent-glow)] active:scale-95">
          <i class="fa-solid fa-user-astronaut"></i>
          <span class="hidden xs:block">{{ t('login') }}</span>
        </button>

        <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden p-2.5 bg-slate-800/50 rounded-xl text-slate-400 hover:text-[var(--accent-color)] transition-all active:scale-90 flex items-center justify-center w-10 h-10 overflow-hidden">
          <div class="relative w-5 h-4 flex items-center justify-center">
            <span :class="['absolute h-0.5 bg-current transition-all duration-300 rounded-full', isMobileMenuOpen ? 'w-5 rotate-45 translate-y-0' : 'w-5 -translate-y-1.5']"></span>
            <span :class="['absolute h-0.5 bg-current transition-all duration-300 rounded-full', isMobileMenuOpen ? 'w-0 opacity-0' : 'w-5 opacity-100']"></span>
            <span :class="['absolute h-0.5 bg-current transition-all duration-300 rounded-full', isMobileMenuOpen ? 'w-5 -rotate-45 translate-y-0' : 'w-5 translate-y-1.5']"></span>
          </div>
        </button>
      </div>
    </div>

    <transition name="slide-down">
      <div v-if="isMobileMenuOpen" class="md:hidden bg-slate-900 border-t border-slate-800 px-6 py-8 flex flex-col gap-6 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 shadow-2xl overflow-hidden relative">
        <button @click="handleMobileNav('/')" :class="[isActive('/') ? 'text-[var(--accent-color)]' : '']" class="text-left py-2 hover:text-[var(--accent-color)] transition-colors">{{ t('home') }}</button>
        <button @click="handleMobileNav('/explorer')" :class="[isActive('/explorer') ? 'text-[var(--accent-color)]' : '']" class="text-left py-2 hover:text-[var(--accent-color)] transition-colors">{{ t('browse') }}</button>
        <button @click="handleMobileNav('/schedule')" :class="[isActive('/schedule') ? 'text-[var(--accent-color)]' : '']" class="text-left py-2 hover:text-[var(--accent-color)] transition-colors">{{ t('schedule') }}</button>
        <button @click="handleMobileNav('/about-us')" :class="[isActive('/about-us') ? 'text-[var(--accent-color)]' : '']" class="text-left py-2 hover:text-[var(--accent-color)] transition-colors">{{ t('about_us') }}</button>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { translations } from '../utils/i18n'; // Import dari file pusat gais
import Notification from './Notification.vue'; 

const props = defineProps(['user']);
const emit = defineEmits(['openAuth', 'openDashboard', 'logout', 'goHome', 'openDetail']);

const router = useRouter();
const route = useRoute();
const isMobileMenuOpen = ref(false);

// --- 🌐 LOCALIZATION HELP GAIS ---
const t = (key) => {
  const lang = props.user?.lang || 'en';
  // Ambil langsung dari file translations.js biar gak dobel data gais
  return translations[lang][key] || key;
};

const isActive = (path) => route.path === path;

const goToHome = () => {
  router.push('/');
  emit('goHome');
  isMobileMenuOpen.value = false;
};

const handleMobileNav = (path) => {
  router.push(path);
  isMobileMenuOpen.value = false;
};
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-20px); }
</style>
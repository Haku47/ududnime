<template>
  <nav 
    class="sticky top-4 z-[100] mx-auto max-w-7xl px-4 font-inter transition-all duration-500"
    :class="[isScrolled ? 'top-2 scale-[0.98]' : 'top-4 scale-100']"
  >
    <div 
      class="transition-all duration-500 flex justify-between items-center px-6 py-3 shadow-2xl"
      :class="[
        isScrolled 
          ? 'bg-slate-900/40 backdrop-blur-3xl border border-[var(--accent-color)]/20 rounded-[2rem] shadow-[var(--accent-glow)]' 
          : 'bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-[2.5rem]'
      ]"
    >
      
      <div class="flex items-center gap-3 cursor-pointer group" @click="goToHome">
        <div class="bg-[var(--accent-color)] w-10 h-10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-all shadow-[0_0_20px_var(--accent-glow)]">
          <i class="fa-solid fa-film text-white text-lg"></i>
        </div>
        <span class="text-xl font-black text-white hidden sm:block tracking-tighter uppercase italic">
          Udud<span class="text-[var(--accent-color)]">nime</span>
        </span>
      </div>

      <div class="hidden md:flex items-center gap-2 bg-black/20 p-1.5 rounded-full border border-white/5 backdrop-blur-md">
        <button v-for="nav in navLinks" :key="nav.path" @click="handleNav(nav.path)" 
          :class="[isActive(nav.path) ? 'bg-[var(--accent-color)] text-white shadow-lg shadow-[var(--accent-glow)]' : 'text-slate-400 hover:text-white']"
          class="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
          {{ t(nav.key) }}
        </button>
      </div>

      <div class="flex items-center gap-3">
        <Notification @openDetail="(anime) => $emit('openDetail', anime)" />

        <div v-if="user" class="relative group">
          <button class="w-10 h-10 rounded-full border border-white/10 hover:border-[var(--accent-color)] transition-all overflow-hidden bg-slate-800/50 shadow-sm active:scale-90 flex items-center justify-center">
            <img :src="user.avatar" class="w-full h-full object-cover" :alt="user.username" />
          </button>

          <div class="absolute right-0 mt-4 w-60 bg-slate-900/95 border border-white/10 rounded-[2rem] shadow-2xl py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 z-50 backdrop-blur-xl text-left">
            <div class="px-6 py-4 border-b border-white/5 mb-2 bg-white/5">
              <div class="flex justify-between items-center mb-1">
                 <p class="text-[9px] text-[var(--accent-color)] font-black uppercase italic leading-none">LVL {{ user.level || 1 }}</p>
                 <p class="text-[10px] font-black text-white truncate max-w-[100px]">{{ user.username }}</p>
              </div>
              <div class="h-1.5 bg-black/40 rounded-full overflow-hidden mt-2">
                <div class="h-full bg-gradient-to-r from-[var(--accent-color)] to-yellow-400 shadow-[0_0_10px_var(--accent-glow)] transition-all duration-700" :style="{ width: (user.xp || 0) + '%' }"></div>
              </div>
            </div>
            
            <button @click="$emit('openDashboard')" class="w-full px-6 py-3 text-[10px] font-black text-slate-300 hover:text-[var(--accent-color)] flex items-center gap-3 transition-all uppercase">
              <i class="fa-solid fa-user-gear opacity-50"></i> {{ t('dashboard') }}
            </button>
            <hr class="border-white/5 my-2 mx-4" />
            <button @click="$emit('logout')" class="w-full px-6 py-3 text-[10px] font-black text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-all uppercase">
              <i class="fa-solid fa-power-off"></i> {{ t('logout_btn') }}
            </button>
          </div>
        </div>

        <button v-else @click="$emit('openAuth')" class="w-10 h-10 rounded-full bg-[var(--accent-color)] text-white flex items-center justify-center hover:opacity-90 transition-all shadow-xl shadow-[var(--accent-glow)] active:scale-95">
          <i class="fa-solid fa-user-astronaut text-sm"></i>
        </button>

        <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 text-slate-400 active:scale-90 transition-all">
          <i :class="['fa-solid transition-all', isMobileMenuOpen ? 'fa-xmark' : 'fa-bars-staggered']"></i>
        </button>
      </div>
    </div>

    <transition name="pop">
      <div v-if="isMobileMenuOpen" class="md:hidden mt-4 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl flex flex-col gap-4">
        <div v-if="user" class="bg-white/5 p-5 rounded-[2rem] border border-white/5 mb-2">
          <div class="flex items-center gap-4 mb-4 text-left">
            <img :src="user.avatar" class="w-12 h-12 rounded-full border-2 border-[var(--accent-color)]" />
            <div>
              <p class="text-[var(--accent-color)] text-[8px] tracking-[0.4em] uppercase font-black">Level {{ user.level || 1 }}</p>
              <p class="text-white text-sm font-black">{{ user.username }}</p>
            </div>
          </div>
          <button @click="handleMobileAction('openDashboard')" class="w-full py-3 bg-slate-800 rounded-xl text-center text-xs font-black text-slate-300 uppercase tracking-widest border border-white/5">
            {{ t('dashboard') }}
          </button>
        </div>

        <button v-for="nav in navLinks" :key="nav.path" @click="handleMobileNav(nav.path)" 
          class="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all"
          :class="isActive(nav.path) ? 'bg-[var(--accent-color)] text-white' : 'bg-white/5 text-slate-400'">
          {{ t(nav.key) }}
        </button>

        <button v-if="user" @click="handleMobileAction('logout')" class="w-full py-4 bg-red-500/10 text-red-400 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-red-500/10">
          {{ t('logout_btn') }}
        </button>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { translations } from '../utils/i18n'; 
import Notification from './Notification.vue'; 

const props = defineProps(['user']);
const emit = defineEmits(['openAuth', 'openDashboard', 'logout', 'goHome', 'openDetail', 'updateUser']);

const router = useRouter();
const route = useRoute();
const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);

const navLinks = [
  { path: '/', key: 'home' },
  { path: '/explorer', key: 'browse' },
  { path: '/schedule', key: 'schedule' },
  { path: '/about-us', key: 'about_us' }
];

/**
 * 🚀 SMART TRANSLATION GAIS
 * Jika user login dan punya setting bahasa, pakai itu.
 * Jika tidak, default ke 'en' (English).
 */
const t = (key) => {
  const lang = props.user?.lang || 'en';
  return translations[lang]?.[key] || translations['en']?.[key] || key;
};

// 🚀 SCROLL ENGINE GAIS
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const isActive = (path) => route.path === path;
const goToHome = () => { router.push('/'); emit('goHome'); isMobileMenuOpen.value = false; };
const handleNav = (path) => { if (path === '/') goToHome(); else router.push(path); };
const handleMobileNav = (path) => { handleNav(path); isMobileMenuOpen.value = false; };
const handleMobileAction = (action) => { emit(action); isMobileMenuOpen.value = false; };
</script>

<style scoped>
.pop-enter-active, .pop-leave-active { 
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
}
.pop-enter-from, .pop-leave-to { 
  opacity: 0; 
  transform: scale(0.9) translateY(-20px); 
}
</style>
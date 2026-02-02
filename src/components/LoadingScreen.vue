<template>
  <div class="fixed inset-0 z-[300] bg-[#020617] flex flex-col items-center justify-center overflow-hidden p-6">
    
    <div class="absolute inset-0 z-0">
      <img 
        src="/background.png" 
        class="w-full h-full object-cover transition-opacity duration-1000"
        @load="isBgLoaded = true"
        :class="[isBgLoaded ? 'opacity-10' : 'opacity-0']"
        alt="Background System"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]"></div>
    </div>

    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-[var(--accent-color)] opacity-[0.07] rounded-full blur-[40px] md:blur-[60px] z-10 transition-colors duration-1000"></div>

    <div class="relative scale-90 md:scale-100 z-20">
      <div class="absolute -inset-4 border border-[var(--accent-color)] opacity-20 rounded-full animate-[spin_4s_linear_infinite]"></div>
      <div class="absolute -inset-4 border-t-2 border-[var(--accent-color)] rounded-full animate-[spin_1.5s_linear_infinite]"></div>

      <div class="relative bg-slate-900/90 border border-white/10 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-xl backdrop-blur-md">
        <div class="text-[var(--accent-color)] animate-bounce text-center">
          <i class="fa-solid fa-film text-3xl md:text-4xl shadow-accent-icon"></i>
        </div>
      </div>
    </div>

    <div class="text-center mt-8 md:mt-10 px-4 relative z-20">
      <h2 class="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase italic">
        UDUD<span class="text-[var(--accent-color)] transition-colors duration-500">NIME</span>
      </h2>
      <div class="flex items-center justify-center gap-2 mt-2">
        <div class="h-1 w-1 bg-[var(--accent-color)] rounded-full animate-ping"></div>
        <p class="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] md:tracking-[0.4em]">SYSTEM INITIALIZING</p>
      </div>
    </div>
    
    <div class="mt-10 md:mt-12 w-full max-w-[240px] md:max-w-[256px] relative z-20">
      <div class="flex justify-between items-center mb-3 px-1">
        <p class="text-[8px] md:text-[9px] font-black text-[var(--accent-color)] uppercase tracking-widest truncate max-w-[180px]">{{ loadingStatus }}</p>
        <p class="text-[9px] md:text-[10px] font-black text-white italic">{{ progress }}%</p>
      </div>
      
      <div class="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 p-[1px]">
        <div 
          class="h-full bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-color)] opacity-90 rounded-full transition-all duration-300 ease-out"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
    </div>
    
    <p class="absolute bottom-8 md:bottom-12 text-[8px] md:text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.3em] animate-pulse text-center px-6 leading-relaxed z-20">
      {{ bottomTagline }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const progress = ref(0);
const loadingStatus = ref('Fetching Data...');
const isBgLoaded = ref(false);
const userLang = ref('en');

// --- 🌐 MULTILINGUAL STATUS MESSAGES GAIS ---
const statusData = {
  en: {
    steps: ['Connecting Jikan API...', 'Compiling Metadata...', 'Syncing Watchlist...', 'Optimizing UI...', 'Ready to Udud!'],
    tagline: 'Waiting is boring, but waifu is waiting for you gais...'
  },
  id: {
    steps: ['Menghubungkan Jikan API...', 'Menyusun Metadata...', 'Sinkronisasi Watchlist...', 'Optimasi Tampilan...', 'Siap Udud Gais!'],
    tagline: 'Menunggu itu membosankan, tapi waifu menantimu gais...'
  },
  jv: {
    steps: ['Nyambungne API...', 'Nata Data Sakti...', 'Ngepaske Simpenan...', 'Ngapiki Tampilan...', 'Wis Siap Cak!'],
    tagline: 'Ngenteni pancen boseni, tapi waifumu wis ngenteni cak...'
  },
  jp: {
    steps: ['API ni setsuzoku...', 'Metadēta o konpairu...', 'Murisuto o dōki...', 'UI o saitekika...', 'Junbi kanryō!'],
    tagline: 'Matsu no wa taitsudaga, waifu ga matte iru gais...'
  }
};

const bottomTagline = computed(() => statusData[userLang.value]?.tagline || statusData.en.tagline);

onMounted(() => {
  const session = localStorage.getItem('ududnime_session');
  if (session) {
    const user = JSON.parse(session);
    if (user.themeColor) {
      document.documentElement.style.setProperty('--accent-color', user.themeColor);
    }
    if (user.lang) {
      userLang.value = user.lang;
    }
  }

  const currentSteps = statusData[userLang.value]?.steps || statusData.en.steps;

  let interval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += Math.floor(Math.random() * 15) + 5; 
      if (progress.value > 100) progress.value = 100;
      const statusIdx = Math.min(
        Math.floor((progress.value / 100) * currentSteps.length),
        currentSteps.length - 1
      );
      loadingStatus.value = currentSteps[statusIdx];
    } else {
      clearInterval(interval);
    }
  }, 150);
});
</script>

<style scoped>
.shadow-accent-icon {
  filter: drop-shadow(0 0 4px var(--accent-color));
}
.fade-in { animation: fadeIn 0.8s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
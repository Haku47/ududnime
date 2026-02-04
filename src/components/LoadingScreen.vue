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

    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-[var(--accent-color)] opacity-[0.07] rounded-full blur-[40px] md:blur-[60px] z-10 transition-colors duration-1000 animate-pulse"></div>

    <div class="relative scale-90 md:scale-100 z-20">
      <div class="absolute -inset-6 border border-[var(--accent-color)] opacity-10 rounded-full animate-[spin_6s_linear_infinite]"></div>
      <div class="absolute -inset-4 border-t-2 border-[var(--accent-color)] rounded-full animate-[spin_1.5s_linear_infinite]"></div>

      <div class="relative bg-slate-900/90 border border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
        <div class="animate-bounce flex items-center justify-center">
          <BaseIcon 
            icon="fa-solid fa-film" 
            size="xl" 
            glow 
          />
        </div>
      </div>
    </div>

    <div class="text-center mt-10 md:mt-12 px-4 relative z-20">
      <h2 class="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase italic drop-shadow-2xl">
        UDUD<span class="text-[var(--accent-color)] transition-colors duration-500">NIME</span>
      </h2>
      <div class="flex items-center justify-center gap-2 mt-3">
        <div class="h-1.5 w-1.5 bg-[var(--accent-color)] rounded-full animate-ping"></div>
        <p class="text-[9px] md:text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Neural Core Initializing</p>
      </div>
    </div>
    
    <div class="mt-12 md:mt-14 w-full max-w-[260px] md:max-w-[300px] relative z-20">
      <div class="flex justify-between items-end mb-4 px-1">
        <p class="text-[9px] font-black text-[var(--accent-color)] uppercase tracking-[0.2em] truncate max-w-[200px] italic">
          {{ loadingStatus }}
        </p>
        <p class="text-[10px] font-black text-white italic tabular-nums">{{ progress }}%</p>
      </div>
      
      <div class="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/5 p-[2px] shadow-inner">
        <div 
          class="h-full bg-gradient-to-r from-[var(--accent-color)] to-yellow-400 opacity-90 rounded-full transition-all duration-300 ease-out shadow-[0_0_15px_var(--accent-glow)]"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
    </div>
    
    <p class="absolute bottom-10 md:bottom-16 text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em] animate-pulse text-center px-10 leading-relaxed z-20 italic">
      {{ bottomTagline }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from 'vue';

const BaseIcon = defineAsyncComponent(() => import('./BaseIcon.vue'));

const progress = ref(0);
const loadingStatus = ref('Booting Core...');
const isBgLoaded = ref(false);
const userLang = ref('id'); // Default ke Indonesia gais

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
  // 🚀 FIXED: Sync theme & lang instan gais
  const session = localStorage.getItem('ududnime_session');
  if (session) {
    try {
      const user = JSON.parse(session);
      if (user.themeColor) {
        document.documentElement.style.setProperty('--accent-color', user.themeColor);
        document.documentElement.style.setProperty('--accent-glow', `${user.themeColor}66`);
      }
      if (user.lang) userLang.value = user.lang;
    } catch (e) { console.error("LOAD_SYNC_ERR"); }
  }

  const currentSteps = statusData[userLang.value]?.steps || statusData.en.steps;

  // 🚀 SMOOTH PROGRESS ENGINE GAIS
  let interval = setInterval(() => {
    if (progress.value < 100) {
      // Incremental random yang lebih halus gais
      const inc = Math.floor(Math.random() * 12) + 4;
      progress.value = Math.min(progress.value + inc, 100);
      
      const statusIdx = Math.min(
        Math.floor((progress.value / 100) * currentSteps.length),
        currentSteps.length - 1
      );
      loadingStatus.value = currentSteps[statusIdx];
    } else {
      clearInterval(interval);
    }
  }, 200);
});
</script>

<style scoped>
/* Transisi masuk/keluar gais */
.fade-in { animation: fadeIn 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
@keyframes fadeIn {
  from { opacity: 0; transform: scale(1.05); }
  to { opacity: 1; transform: scale(1); }
}

/* Fix tabular-nums gais biar angka persen nggak goyang kiri-kanan */
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>
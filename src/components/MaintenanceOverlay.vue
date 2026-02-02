<template>
  <div class="fixed inset-0 z-[999] bg-[#020617] flex flex-col items-center justify-center p-10 text-center selection:bg-[var(--accent-glow)]">
    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent-glow)] opacity-10 rounded-full blur-[120px]"></div>
    
    <div class="relative scale-90 md:scale-100">
      <div class="w-32 h-32 bg-[var(--accent-glow)] rounded-full absolute -top-4 -left-4 animate-ping"></div>
      
      <div class="relative bg-slate-900 border-2 border-[var(--accent-color)] p-10 rounded-[3rem] shadow-2xl shadow-[var(--accent-glow)] backdrop-blur-md">
        <i class="fa-solid fa-screwdriver-wrench text-6xl text-[var(--accent-color)] shadow-icon"></i>
      </div>
    </div>

    <h2 class="text-4xl font-black text-white mt-12 uppercase italic tracking-tighter">
      UNDER <span class="text-[var(--accent-color)]">MAINTENANCE</span>
    </h2>
    <p class="mt-6 text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] max-w-sm leading-loose italic">
      Sabar gais, dev lagi poles mesin biar UDUDNIME makin gahar. <br> Kita bakal balik bentar lagi!
    </p>

    <div class="mt-12 flex gap-3">
      <div 
        v-for="i in 3" :key="i" 
        class="w-2 h-2 bg-[var(--accent-color)] rounded-full animate-bounce" 
        :style="{ animationDelay: `${i * 0.2}s` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // Pastikan tema tetap sinkron meskipun sistem maintenance gais
  const session = localStorage.getItem('ududnime_session');
  if (session) {
    const user = JSON.parse(session);
    if (user.themeColor) {
      document.documentElement.style.setProperty('--accent-color', user.themeColor);
      document.documentElement.style.setProperty('--accent-glow', `${user.themeColor}66`);
    }
  }
});
</script>

<style scoped>
.shadow-icon {
  filter: drop-shadow(0 0 10px var(--accent-glow));
}

.shadow-2xl {
  box-shadow: 0 0 50px var(--accent-glow);
}
</style>
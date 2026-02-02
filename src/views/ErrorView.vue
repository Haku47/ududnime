<template>
  <div class="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center overflow-hidden relative selection:bg-[var(--accent-glow)]">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-glow)] opacity-10 rounded-full blur-[120px]"></div>

    <div class="relative fade-in">
      <div class="inline-block p-8 bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl mb-10">
        <i class="fa-solid fa-bug text-6xl text-[var(--accent-color)] animate-bounce shadow-icon"></i>
      </div>
      
      <h1 class="text-7xl md:text-9xl font-black text-white italic tracking-tighter mb-4 opacity-20">404</h1>
      <h2 class="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-6">
        DATA <span class="text-[var(--accent-color)]">HILANG</span> DARI RADAR!
      </h2>
      <p class="text-slate-500 text-xs md:text-sm font-black uppercase tracking-[0.3em] max-w-md mx-auto leading-loose mb-12">
        Mungkin animenya sudah tamat atau link yang kamu cari diculik oleh villain gais.
      </p>

      <button 
        @click="router.push('/')" 
        class="px-10 py-5 bg-[var(--accent-color)] hover:opacity-90 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-[var(--accent-glow)] active:scale-95"
      >
        ← BALIK KE BASE
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  // Pastikan tema tetap sinkron saat masuk halaman error gais
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
.fade-in { animation: fadeIn 0.8s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.shadow-icon {
  filter: drop-shadow(0 0 10px var(--accent-glow));
}
</style>
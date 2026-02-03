<template>
  <div class="min-h-screen bg-[#020617] text-slate-100 font-inter selection:bg-[var(--accent-glow)] overflow-x-hidden">
    <nav class="border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-[100]">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <div @click="router.push('/')" class="text-2xl font-black italic cursor-pointer group">
          UDUD<span class="text-[var(--accent-color)] group-hover:underline decoration-4">NIME</span>
        </div>
        <div class="flex items-center gap-3">
          <div :class="['h-2 w-2 rounded-full animate-pulse', apiStatus === 'online' ? 'bg-emerald-500' : 'bg-red-500']"></div>
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">System Monitoring Live</span>
        </div>
      </div>
    </nav>

    <main class="container mx-auto px-6 py-12">
      <header class="mb-12 fade-in">
        <h1 class="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
          SYSTEM <span class="text-[var(--accent-color)]">STATUS</span>
        </h1>
        <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] max-w-xl italic">
          Memantau kesehatan infrastruktur Ududnime dan koneksi pihak ketiga secara real-time gais.
        </p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-8 space-y-8">
          
          <div class="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-sm relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <i class="fa-solid fa-server text-8xl text-[var(--accent-color)]"></i>
            </div>
            
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h3 class="text-xl font-black uppercase italic text-white mb-2">Jikan API Infrastructure</h3>
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global CDN & Database Connectivity</p>
              </div>
              <div :class="['px-6 py-3 rounded-2xl border font-black text-xs uppercase tracking-widest transition-all', apiStatusColor]">
                {{ apiStatusLabel }}
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-black/40 p-6 rounded-3xl border border-white/5">
                <p class="text-[9px] font-black text-slate-500 uppercase mb-2">Latency</p>
                <p class="text-2xl font-black text-[var(--accent-color)]">{{ apiLatency ? apiLatency + 'ms' : '---' }}</p>
              </div>
              <div class="bg-black/40 p-6 rounded-3xl border border-white/5">
                <p class="text-[9px] font-black text-slate-500 uppercase mb-2">Uptime</p>
                <p class="text-2xl font-black text-emerald-500">99.9%</p>
              </div>
              <div class="bg-black/40 p-6 rounded-3xl border border-white/5">
                <p class="text-[9px] font-black text-slate-500 uppercase mb-2">Region</p>
                <p class="text-2xl font-black text-white">Global</p>
              </div>
            </div>
          </div>

          <div class="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8">
            <h3 class="text-sm font-black uppercase text-slate-400 mb-6 flex items-center gap-3">
              <i class="fa-solid fa-list-ul text-[var(--accent-color)]"></i> Recent Network Logs
            </h3>
            <div class="space-y-3 font-mono">
              <div v-for="(log, idx) in logs" :key="idx" class="flex items-center gap-4 text-[10px] p-3 bg-black/40 rounded-xl border border-white/5">
                <span class="text-slate-600">[{{ log.time }}]</span>
                <span :class="log.type === 'error' ? 'text-red-500' : 'text-emerald-500'">{{ log.type.toUpperCase() }}</span>
                <span class="text-slate-400 truncate">{{ log.message }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-4 space-y-8">
          <div class="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8">
            <h3 class="text-sm font-black uppercase text-white mb-8 italic">Your Browser</h3>
            <div class="space-y-6">
              <div>
                <div class="flex justify-between text-[9px] font-black text-slate-500 uppercase mb-2">
                  <span>Connection Stability</span>
                  <span class="text-emerald-500">Excellent</span>
                </div>
                <div class="h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-500 w-[95%] shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                </div>
              </div>
              <div class="pt-4 border-t border-white/5 space-y-3">
                <div class="flex justify-between text-[10px] font-bold">
                  <span class="text-slate-500">Platform</span>
                  <span class="text-white uppercase">{{ platformInfo }}</span>
                </div>
                <div class="flex justify-between text-[10px] font-bold">
                  <span class="text-slate-500">Environment</span>
                  <span class="text-[var(--accent-color)] uppercase italic">Production</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-4">
            <button @click="checkApiStatus" :disabled="apiStatus === 'checking'" class="w-full py-5 bg-[var(--accent-color)] hover:opacity-90 disabled:opacity-50 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-[var(--accent-glow)] active:scale-95">
              {{ apiStatus === 'checking' ? 'Synchronizing...' : 'Re-verify Connection' }}
            </button>
            <button @click="router.push('/')" class="w-full py-5 bg-slate-800/40 hover:bg-slate-800/80 text-slate-300 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all border border-white/5">
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </main>

    <footer class="mt-20 py-12 border-t border-white/5 text-center">
      <p class="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em]">
        Ududnime Monitoring Service v1.0.4 — Est 2026
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const apiStatus = ref('checking'); 
const apiLatency = ref(null);
const logs = ref([]);
const platformInfo = ref(navigator.platform);
let statusInterval = null;

const addLog = (message, type = 'info') => {
  const time = new Date().toLocaleTimeString('id-ID', { hour12: false });
  logs.value.unshift({ time, message, type });
  if (logs.value.length > 8) logs.value.pop();
};

const checkApiStatus = async () => {
  if (apiStatus.value === 'checking' && logs.value.length > 0) return;
  
  apiStatus.value = 'checking';
  addLog("Initiating handshake with Jikan API...");
  
  const start = Date.now();
  try {
    const res = await fetch('https://api.jikan.moe/v4/status', { method: 'GET' });
    apiLatency.value = Date.now() - start;
    
    if (res.ok) {
      apiStatus.value = 'online';
      addLog(`Handshake successful. Latency: ${apiLatency.value}ms`, 'success');
    } else {
      apiStatus.value = 'offline';
      addLog(`Server responded with error ${res.status}`, 'error');
    }
  } catch (err) {
    apiStatus.value = 'offline';
    addLog("Network Error: Link to core server terminated gais.", "error");
  }
};

const apiStatusLabel = computed(() => {
  if (apiStatus.value === 'online') return 'All Systems Green';
  if (apiStatus.value === 'offline') return 'Connection Terminated';
  return 'Syncing...';
});

const apiStatusColor = computed(() => {
  if (apiStatus.value === 'online') return 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
  if (apiStatus.value === 'offline') return 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
  return 'bg-slate-800 border-white/5 text-slate-500 animate-pulse';
});

onMounted(() => {
  const session = localStorage.getItem('ududnime_session');
  if (session) {
    const user = JSON.parse(session);
    if (user.themeColor) {
      document.documentElement.style.setProperty('--accent-color', user.themeColor);
      document.documentElement.style.setProperty('--accent-glow', `${user.themeColor}66`);
    }
  }

  checkApiStatus();
  // Simpan interval ke variabel agar bisa dibersihkan gais
  statusInterval = setInterval(checkApiStatus, 60000);
});

// Penting: Bersihkan interval saat user pindah halaman gais biar laptop gak berat!
onUnmounted(() => {
  if (statusInterval) clearInterval(statusInterval);
});
</script>

<style scoped>
.fade-in { animation: fadeIn 0.8s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.shadow-xl {
  box-shadow: 0 10px 30px var(--accent-glow);
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
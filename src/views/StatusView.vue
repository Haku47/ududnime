<template>
  <div class="min-h-screen bg-[#020617] text-slate-100 font-inter selection:bg-[var(--accent-glow)] overflow-x-hidden relative">
    
    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
    <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[var(--accent-color)]/5 via-transparent to-transparent pointer-events-none"></div>

    <nav class="sticky top-0 z-[100] border-b border-white/5 bg-slate-950/80 backdrop-blur-2xl transition-all duration-500">
      <div class="container mx-auto px-6 py-5 flex justify-between items-center">
        <div @click="router.push('/')" class="flex items-center gap-3 cursor-pointer group">
          <div class="w-10 h-10 bg-[var(--accent-color)] rounded-xl flex items-center justify-center shadow-[0_0_20px_var(--accent-glow)] group-hover:rotate-12 transition-transform">
            <i class="fa-solid fa-server text-white text-sm"></i>
          </div>
          <div class="text-2xl font-black italic tracking-tighter">
            UDUD<span class="text-[var(--accent-color)]">NIME</span>
          </div>
        </div>
        <div class="flex items-center gap-4 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
          <div :class="['h-2 w-2 rounded-full shadow-[0_0_10px_currentColor]', apiStatus === 'online' ? 'text-emerald-500 bg-emerald-500 animate-pulse' : 'text-red-500 bg-red-500']"></div>
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">System Monitoring Live</span>
        </div>
      </div>
    </nav>

    <main class="container mx-auto px-6 py-16 relative z-10">
      <header class="mb-16 text-center md:text-left fade-in">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--accent-bg)] border border-[var(--accent-color)]/20 rounded-full mb-6">
           <i class="fa-solid fa-bolt-lightning text-[var(--accent-color)] text-[10px]"></i>
           <p class="text-[9px] font-black text-[var(--accent-color)] uppercase tracking-[0.4em]">Infrastructure Health</p>
        </div>
        <h1 class="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4 leading-none">
          SYSTEM <span class="text-[var(--accent-color)] drop-shadow-[0_0_30px_var(--accent-glow)]">STATUS</span>
        </h1>
        <p class="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] max-w-2xl leading-relaxed italic opacity-70 mx-auto md:mx-0">
          Memantau kesehatan infrastruktur Ududnime dan latensi koneksi pihak ketiga secara real-time gais.
        </p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div class="lg:col-span-8 space-y-10">
          
          <div class="bg-slate-900/60 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl relative overflow-hidden group shadow-2xl transition-all hover:border-[var(--accent-color)]/30">
            <div class="absolute -top-24 -right-24 w-64 h-64 bg-[var(--accent-color)] opacity-5 rounded-full blur-[100px]"></div>
            
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
              <div class="flex items-center gap-6">
                <div class="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-cloud-bolt text-3xl text-[var(--accent-color)]"></i>
                </div>
                <div>
                  <h3 class="text-2xl font-black uppercase italic text-white mb-1">Jikan API v4</h3>
                  <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic leading-none">Global Metadata Handshake</p>
                </div>
              </div>
              <div :class="['px-8 py-4 rounded-2xl border font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl', apiStatusColor]">
                {{ apiStatusLabel }}
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-black/60 p-8 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all">
                <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Latency</p>
                <div class="flex items-baseline gap-1">
                  <p class="text-4xl font-black text-[var(--accent-color)] tabular-nums">{{ apiLatency || '---' }}</p>
                  <span v-if="apiLatency" class="text-xs font-black text-slate-600 uppercase">ms</span>
                </div>
              </div>
              <div class="bg-black/60 p-8 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all">
                <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Uptime</p>
                <p class="text-4xl font-black text-emerald-500 tabular-nums">99.9<span class="text-xs">%</span></p>
              </div>
              <div class="bg-black/60 p-8 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all">
                <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Engine</p>
                <p class="text-2xl font-black text-white uppercase tracking-tighter">Production</p>
              </div>
            </div>
          </div>

          <div class="bg-slate-900/60 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl">
            <h3 class="text-[11px] font-black uppercase text-slate-400 mb-8 tracking-[0.4em] flex items-center gap-4 italic">
              <span class="h-px w-8 bg-slate-800"></span>
              Neural Network Logs
              <span class="h-px w-8 bg-slate-800"></span>
            </h3>
            <div class="space-y-3 font-mono">
              <div v-for="(log, idx) in logs" :key="idx" class="flex items-center gap-6 text-[11px] p-4 bg-black/50 rounded-2xl border border-white/5 transition-all hover:bg-black/70">
                <span class="text-slate-600 font-bold shrink-0">[{{ log.time }}]</span>
                <span :class="['font-black uppercase tracking-widest shrink-0', log.type === 'error' ? 'text-red-500' : 'text-emerald-500']">{{ log.type }}</span>
                <span class="text-slate-400 truncate tracking-tight">{{ log.message }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-4 space-y-10">
          <div class="bg-slate-900/60 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl">
            <h3 class="text-[11px] font-black uppercase text-white mb-10 tracking-[0.4em] italic text-center">Your Terminal</h3>
            <div class="space-y-10">
              <div class="space-y-4">
                <div class="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                  <span>Connection Link</span>
                  <span class="text-emerald-500">EXCELLENT</span>
                </div>
                <div class="h-2 bg-black/60 rounded-full overflow-hidden p-[1px] border border-white/5">
                  <div class="h-full bg-gradient-to-r from-[var(--accent-color)] to-emerald-500 w-[95%] shadow-[0_0_15px_var(--accent-glow)] rounded-full transition-all duration-1000"></div>
                </div>
              </div>

              <div class="pt-8 border-t border-white/5 space-y-5">
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Platform</span>
                  <span class="text-[11px] font-black text-white uppercase tracking-tighter">{{ platformInfo }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Environment</span>
                  <div class="px-3 py-1 bg-[var(--accent-bg)] border border-[var(--accent-glow)] rounded-lg">
                    <span class="text-[9px] font-black text-[var(--accent-color)] uppercase italic">Production</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-5">
            <button @click="checkApiStatus" :disabled="apiStatus === 'checking'" class="group relative w-full py-6 bg-[var(--accent-color)] hover:scale-105 disabled:opacity-50 text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-[2rem] transition-all shadow-[0_15px_40px_var(--accent-glow)] active:scale-95 overflow-hidden">
              <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span class="relative z-10 flex items-center justify-center gap-3">
                <i class="fa-solid fa-rotate" :class="{ 'animate-spin': apiStatus === 'checking' }"></i>
                {{ apiStatus === 'checking' ? 'Synchronizing...' : 'Re-verify Link' }}
              </span>
            </button>
            <button @click="router.push('/')" class="w-full py-6 bg-slate-800/20 hover:bg-slate-800/60 text-slate-400 hover:text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-[2rem] transition-all border border-white/10 backdrop-blur-md active:scale-95">
              Return to Control
            </button>
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const apiStatus = ref('checking'); 
const apiLatency = ref(null);
const logs = ref([]);
const platformInfo = ref(navigator.platform.split(' ')[0]);
let statusInterval = null;

const addLog = (message, type = 'info') => {
  const time = new Date().toLocaleTimeString('id-ID', { hour12: false });
  logs.value.unshift({ time, message, type });
  if (logs.value.length > 8) logs.value.pop();
};

const checkApiStatus = async () => {
  if (apiStatus.value === 'checking' && logs.value.length > 0) return;
  
  apiStatus.value = 'checking';
  addLog("Initiating handshake with Jikan Core...");
  
  const start = Date.now();
  try {
    const res = await fetch('https://api.jikan.moe/v4/status', { method: 'GET' });
    apiLatency.value = Date.now() - start;
    
    if (res.ok) {
      apiStatus.value = 'online';
      addLog(`Synchronization complete. Latency: ${apiLatency.value}ms`, 'success');
    } else {
      apiStatus.value = 'offline';
      addLog(`System responded with error ${res.status}`, 'error');
    }
  } catch (err) {
    apiStatus.value = 'offline';
    addLog("Network Fault: Remote link terminated.", "error");
  }
};

const apiStatusLabel = computed(() => {
  if (apiStatus.value === 'online') return 'All Systems Nominal';
  if (apiStatus.value === 'offline') return 'Connection Fault';
  return 'Syncing Core...';
});

const apiStatusColor = computed(() => {
  if (apiStatus.value === 'online') return 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-emerald-500/5';
  if (apiStatus.value === 'offline') return 'bg-red-500/10 border-red-500 text-red-500 shadow-red-500/5';
  return 'bg-slate-800 border-white/5 text-slate-500 animate-pulse';
});

onMounted(() => {
  const session = localStorage.getItem('ududnime_session');
  if (session) {
    const user = JSON.parse(session);
    if (user.themeColor) {
      document.documentElement.style.setProperty('--accent-color', user.themeColor);
      document.documentElement.style.setProperty('--accent-glow', `${user.themeColor}66`);
      document.documentElement.style.setProperty('--accent-bg', `${user.themeColor}1a`);
    }
  }

  checkApiStatus();
  statusInterval = setInterval(checkApiStatus, 60000);
});

onUnmounted(() => {
  if (statusInterval) clearInterval(statusInterval);
});
</script>

<style scoped>
.fade-in { animation: fadeIn 0.8s cubic-bezier(0.23, 1, 0.32, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

.tabular-nums { font-variant-numeric: tabular-nums; }
</style>
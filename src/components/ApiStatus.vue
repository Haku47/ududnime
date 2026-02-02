<template>
  <div class="flex items-center gap-3 bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-2xl backdrop-blur-md">
    <div class="relative flex h-2 w-2">
      <span 
        :class="[
          'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
          statusColor === 'green' ? 'bg-emerald-400' : statusColor === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'
        ]"
      ></span>
      <span 
        :class="[
          'relative inline-flex rounded-full h-2 w-2',
          statusColor === 'green' ? 'bg-emerald-500' : statusColor === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
        ]"
      ></span>
    </div>

    <div class="flex flex-col">
      <div class="flex items-center gap-2">
        <p class="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Jikan API Status</p>
        <span v-if="responseTime" class="text-[8px] font-black text-orange-500 italic">{{ responseTime }}ms</span>
      </div>
      <p class="text-[10px] font-black uppercase tracking-tight" :class="statusTextColor">
        {{ statusText }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const status = ref('checking'); // checking, online, slow, offline
const responseTime = ref(null);
let interval = null;

const checkStatus = async () => {
  const start = Date.now();
  try {
    // Kita ping endpoint paling ringan dari Jikan gais
    const res = await fetch('https://api.jikan.moe/v4/status', { method: 'HEAD' });
    responseTime.value = Date.now() - start;

    if (res.ok) {
      status.value = responseTime.value > 1000 ? 'slow' : 'online';
    } else {
      status.value = 'offline';
    }
  } catch (err) {
    status.value = 'offline';
    responseTime.value = null;
  }
};

const statusText = computed(() => {
  if (status.value === 'checking') return 'Checking System...';
  if (status.value === 'online') return 'All Systems Operational';
  if (status.value === 'slow') return 'High Latency Detected';
  return 'Connection Refused';
});

const statusColor = computed(() => {
  if (status.value === 'online') return 'green';
  if (status.value === 'slow') return 'yellow';
  return 'red';
});

const statusTextColor = computed(() => {
  if (status.value === 'online') return 'text-emerald-500';
  if (status.value === 'slow') return 'text-yellow-500';
  return 'text-red-500';
});

onMounted(() => {
  checkStatus();
  // Cek tiap 30 detik biar gak makan kuota rate limit gais
  interval = setInterval(checkStatus, 30000);
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});
</script>
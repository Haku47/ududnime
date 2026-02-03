<template>
  <div class="flex items-center gap-4 bg-slate-900/50 border border-white/5 px-5 py-3 rounded-2xl backdrop-blur-md hover:border-white/10 transition-all group">
    <div class="relative flex items-center justify-center">
      <span 
        v-if="status !== 'checking'"
        class="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full opacity-40"
        :style="{ backgroundColor: statusHexColor }"
      ></span>
      <div 
        class="relative h-2 w-2 rounded-full transition-colors duration-500"
        :style="{ backgroundColor: statusHexColor, boxShadow: `0 0 10px ${statusHexColor}` }"
      ></div>
    </div>

    <div class="flex flex-col">
      <div class="flex items-center gap-2 mb-0.5">
        <p class="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none">Jikan API Status</p>
        <BaseBadge 
          v-if="responseTime" 
          variant="glass" 
          size="xs" 
          class="!text-orange-500 border-none !bg-transparent"
        >
          {{ responseTime }}ms
        </BaseBadge>
      </div>
      
      <p 
        class="text-[10px] font-black uppercase tracking-tight transition-colors duration-500" 
        :style="{ color: statusHexColor }"
      >
        {{ statusText }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, defineAsyncComponent } from 'vue';

// Lazy load komponen Base gais
const BaseBadge = defineAsyncComponent(() => import('./BaseBadge.vue'));

const status = ref('checking'); // checking, online, slow, offline
const responseTime = ref(null);
let interval = null;

const checkStatus = async () => {
  const start = Date.now();
  try {
    // Ping endpoint status gais
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
  const texts = {
    checking: 'Checking System...',
    online: 'All Systems Operational',
    slow: 'High Latency Detected',
    offline: 'Connection Refused'
  };
  return texts[status.value];
});

// Identifikasi warna terpusat gais
const statusHexColor = computed(() => {
  const colors = {
    checking: '#64748b', // slate-500
    online: '#10b981',   // emerald-500
    slow: '#f59e0b',     // amber-500
    offline: '#ef4444'   // red-500
  };
  return colors[status.value];
});

onMounted(() => {
  checkStatus();
  interval = setInterval(checkStatus, 30000);
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});
</script>
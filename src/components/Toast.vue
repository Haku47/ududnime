<template>
  <div class="fixed bottom-6 right-6 z-[300] flex flex-col gap-4 pointer-events-none w-full max-w-[340px] items-end">
    <transition-group name="toast-fade">
      <div 
        v-for="toast in toasts" :key="toast.id"
        class="pointer-events-auto w-full flex flex-col overflow-hidden rounded-2xl border backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300 group"
        :class="[
          toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-emerald-500/5' : 
          toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-red-500/5' : 
          toast.type === 'level' ? 'bg-[var(--accent-bg)] border-[var(--accent-color)]/40 text-[var(--accent-color)]' :
          'bg-slate-900/80 border-white/10 text-slate-300'
        ]"
      >
        <div class="flex items-center gap-4 p-4">
          <div class="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-white/5 border border-current/20 shadow-inner group-hover:scale-110 transition-transform">
            <i :class="[toast.icon || getIcon(toast.type), 'text-lg']"></i>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center mb-0.5">
              <p class="text-[9px] font-black uppercase tracking-[0.25em] opacity-50 italic">{{ t('system_label') }}</p>
              <button @click="removeToast(toast.id)" class="opacity-30 hover:opacity-100 p-1 transition-all active:scale-90">
                <i class="fa-solid fa-xmark text-[10px]"></i>
              </button>
            </div>
            <p class="text-[12px] font-black uppercase tracking-tight leading-tight line-clamp-2 drop-shadow-sm">{{ toast.message }}</p>
          </div>
        </div>

        <div class="h-[3px] w-full bg-black/20">
          <div 
            class="h-full bg-current opacity-40 transition-all ease-linear"
            :style="{ width: toast.progress + '%', transitionDuration: '100ms' }"
          ></div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { translations } from '../utils/i18n';

const toasts = ref([]);

/**
 * 🚀 SMART TRANSLATION GAIS
 * Kita ambil bahasa dari localStorage langsung supaya toast
 * tetap sinkron meskipun komponen belum sempat dapat props gais.
 */
const t = (key) => {
  const session = localStorage.getItem('ududnime_session');
  let lang = 'en'; // Default gais
  if (session) {
    try {
      const user = JSON.parse(session);
      lang = user.lang || 'en';
    } catch (e) { lang = 'en'; }
  }
  return translations[lang]?.[key] || translations['en']?.[key] || key;
};

const getIcon = (type) => {
  switch (type) {
    case 'success': return 'fa-solid fa-circle-check';
    case 'error': return 'fa-solid fa-triangle-exclamation';
    case 'level': return 'fa-solid fa-rocket';
    default: return 'fa-solid fa-bell';
  }
};

const addToast = (message, type = 'info', icon = null) => {
  const id = Date.now();
  const duration = 4000;
  const startTime = Date.now();
  
  if (toasts.value.length >= 4) {
    const oldest = toasts.value[0];
    if (oldest.timer) clearInterval(oldest.timer);
    toasts.value.shift();
  }
  
  const newToast = { id, message, type, icon, progress: 100 };
  toasts.value.push(newToast);
  
  const timer = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
    
    const index = toasts.value.findIndex(t => t.id === id);
    if (index !== -1) {
      toasts.value[index].progress = remaining;
    }

    if (remaining <= 0) {
      clearInterval(timer);
      removeToast(id);
    }
  }, 100);

  toasts.value[toasts.value.length - 1].timer = timer;
};

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id);
  if (index !== -1) {
    if (toasts.value[index].timer) clearInterval(toasts.value[index].timer);
    toasts.value.splice(index, 1);
  }
};

defineExpose({ addToast });
</script>

<style scoped>
.toast-fade-enter-active { animation: toast-in 0.6s cubic-bezier(0.23, 1, 0.32, 1) both; }
.toast-fade-leave-active { animation: toast-out 0.4s cubic-bezier(0.4, 0, 1, 1) both; }

@keyframes toast-in { 
  from { opacity: 0; transform: translateX(50px) scale(0.9) skewX(-5deg); filter: blur(10px); } 
  to { opacity: 1; transform: translateX(0) scale(1) skewX(0); filter: blur(0); } 
}

@keyframes toast-out { 
  from { opacity: 1; transform: translateX(0) scale(1); } 
  to { opacity: 0; transform: translateX(100%) scale(0.9); filter: blur(5px); } 
}

.toast-fade-move { transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); }
.bg-current { background-color: currentColor; }
</style>
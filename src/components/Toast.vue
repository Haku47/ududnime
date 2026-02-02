<template>
  <div class="fixed bottom-6 right-6 z-[300] flex flex-col gap-3 pointer-events-none w-full max-w-[320px] items-end">
    <transition-group name="toast-fade">
      <div 
        v-for="toast in toasts" :key="toast.id"
        class="pointer-events-auto w-full flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300"
        :class="[
          toast.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-500' : 
          toast.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-500' : 
          toast.type === 'level' ? 'bg-[var(--accent-bg)] border-[var(--accent-color)] text-[var(--accent-color)] shadow-[0_0_20px_var(--accent-glow)]' :
          'bg-slate-800/80 border-slate-700 text-slate-300'
        ]"
      >
        <div class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-current/20 transition-colors duration-500">
          <i :class="[toast.icon || 'fa-solid fa-bell', 'text-lg']"></i>
        </div>

        <div class="flex-1">
          <p class="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-0.5 italic">UDUDNIME SYSTEM</p>
          <p class="text-[11px] font-black uppercase tracking-wide leading-tight line-clamp-2">{{ toast.message }}</p>
        </div>

        <button @click="removeToast(toast.id)" class="opacity-40 hover:opacity-100 p-1 transition-all">
          <i class="fa-solid fa-xmark text-xs"></i>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const toasts = ref([]);

const addToast = (message, type = 'info', icon = null) => {
  const id = Date.now();
  // Limit toast biar gak menuhin layar gais
  if (toasts.value.length >= 4) toasts.value.shift(); 
  
  toasts.value.push({ id, message, type, icon });
  
  // Auto remove gais
  setTimeout(() => removeToast(id), 4000);
};

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id);
  if (index !== -1) toasts.value.splice(index, 1);
};

// Expose fungsi biar bisa dipanggil parent (HomeView/Explorer) gais
defineExpose({ addToast });
</script>

<style scoped>
/* Animasi toast masuk dari kanan dengan efek bounce gahar gais */
.toast-fade-enter-active { animation: toast-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; }
.toast-fade-leave-active { animation: toast-out 0.4s cubic-bezier(0.6, -0.28, 0.735, 0.045) both; }

@keyframes toast-in { 
  from { opacity: 0; transform: translateX(100%) scale(0.9); } 
  to { opacity: 1; transform: translateX(0) scale(1); } 
}

@keyframes toast-out { 
  from { opacity: 1; transform: translateX(0) scale(1); } 
  to { opacity: 0; transform: translateX(100%) scale(0.9); } 
}

/* Biar list toast yang lain geser smooth pas ada yang ilang gais */
.toast-fade-move { transition: transform 0.4s ease; }
</style>
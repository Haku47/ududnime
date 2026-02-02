<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 animate-pulse">
    <div v-for="i in 12" :key="i" class="bg-slate-800/20 border border-slate-800/50 p-10 rounded-[3rem] flex flex-col items-center gap-6">
      <div class="w-20 h-20 bg-slate-800 rounded-[2rem] shadow-inner"></div>
      
      <div class="space-y-3 w-full flex flex-col items-center">
        <div class="h-4 bg-slate-800 rounded-full w-24"></div>
        <div class="h-2 bg-slate-800/50 rounded-full w-16"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Efek Shimmering Biar Keren Gais */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
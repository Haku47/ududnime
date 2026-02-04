<template>
  <div class="w-full bg-[#020617]/40 rounded-[3rem] border border-white/5 backdrop-blur-2xl overflow-hidden fade-in shadow-2xl relative group">
    <div class="absolute -top-24 -right-24 w-64 h-64 bg-[var(--accent-color)] opacity-5 rounded-full blur-[100px] pointer-events-none group-hover:opacity-10 transition-opacity duration-1000"></div>

    <div class="p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group/icon">
          <i class="fa-solid fa-calendar-day text-[var(--accent-color)] text-xl group-hover/icon:rotate-12 transition-transform shadow-[0_0_15px_var(--accent-glow)]"></i>
        </div>
        <div>
          <h2 class="text-2xl font-black uppercase tracking-tighter italic text-white leading-none mb-1">{{ t('schedule') }}</h2>
          <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Time Sync Active</p>
        </div>
      </div>

      <div class="flex flex-col items-end">
        <div class="flex items-center gap-3 px-6 py-2.5 bg-black/40 rounded-2xl border border-white/10 shadow-inner">
          <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">WIB</span>
          <span class="text-lg font-black text-[var(--accent-color)] tabular-nums tracking-wider">{{ currentTime }}</span>
        </div>
      </div>
    </div>

    <div class="px-6 pb-6 overflow-x-auto no-scrollbar relative z-10">
      <div class="flex gap-3 min-w-max p-1">
        <button v-for="day in weekDays" :key="day.date" 
          @click="activeDate = day.date"
          :class="['group/day flex flex-col items-center min-w-[85px] py-4 rounded-3xl transition-all duration-500 border', 
            activeDate === day.date 
              ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-white shadow-[0_10px_30px_var(--accent-glow)] scale-105' 
              : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10 hover:bg-white/10']">
          <span class="text-[10px] font-black uppercase tracking-[0.2em] mb-1">{{ day.label }}</span>
          <span :class="['text-[11px] font-black italic', activeDate === day.date ? 'text-white' : 'text-slate-400']">{{ day.shortDate }}</span>
          <div v-if="isToday(day.date)" class="mt-2 w-1 h-1 bg-current rounded-full animate-ping"></div>
        </button>
      </div>
    </div>

    <div class="p-8 pt-4 relative z-10">
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="n in 4" :key="n" class="h-24 bg-white/[0.03] border border-white/5 rounded-3xl animate-pulse"></div>
      </div>

      <div v-else-if="scheduleList.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[480px] overflow-y-auto custom-scroll pr-2">
        <div v-for="anime in scheduleList" :key="anime.mal_id" 
          @click="$emit('openDetail', anime)"
          class="group flex items-center gap-5 p-4 rounded-[2rem] bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[var(--accent-color)]/30 transition-all cursor-pointer active:scale-[0.98]">
          
          <div class="shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-black/40 rounded-2xl border border-white/5 group-hover:border-[var(--accent-color)]/50 transition-colors">
            <span class="text-xs font-black text-white group-hover:text-[var(--accent-color)] transition-colors">
              {{ convertJSTtoWIB(anime.broadcast?.time) }}
            </span>
            <span class="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-1">START</span>
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="text-xs font-black text-white uppercase truncate group-hover:translate-x-1 transition-transform tracking-tight">
              {{ anime.title }}
            </h3>
            <div class="flex items-center gap-3 mt-2">
              <span class="text-[8px] font-black text-[var(--accent-color)] px-2 py-0.5 bg-[var(--accent-bg)] rounded-lg border border-[var(--accent-color)]/20">
                EP {{ anime.episodes || '??' }}
              </span>
              <span class="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                <i class="fa-solid fa-tower-broadcast mr-1"></i> TV Series
              </span>
            </div>
          </div>

          <div class="hidden sm:flex shrink-0">
             <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--accent-color)] group-hover:text-white transition-all">
                <i class="fa-solid fa-arrow-right-long text-[10px]"></i>
             </div>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-24 text-slate-600 opacity-50">
         <i class="fa-solid fa-moon text-4xl mb-4 animate-pulse"></i>
         <p class="text-[11px] font-black uppercase tracking-[0.5em] italic">{{ t('empty') }}</p>
      </div>
    </div>

    <div class="px-8 py-6 bg-black/40 border-t border-white/5 flex justify-center">
      <button @click="router.push('/schedule')" class="group flex items-center gap-4 text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-[0.4em] transition-all">
        <span class="h-px w-8 bg-slate-800 group-hover:w-12 group-hover:bg-[var(--accent-color)] transition-all"></span>
        Full Schedule
        <i class="fa-solid fa-arrow-right-to-bracket ml-1 group-hover:translate-x-2 transition-transform"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { animeService } from '../services/api';
import { translations } from '../utils/i18n';

const props = defineProps(['user']);
const emit = defineEmits(['openDetail']);
const router = useRouter();

const scheduleList = ref([]);
const loading = ref(false);
const activeDate = ref(new Date().toISOString().split('T')[0]);
const currentTime = ref(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));

const t = (key) => {
  const lang = props.user?.lang || 'id';
  return translations[lang]?.[key] || key;
};

const isToday = (dateStr) => dateStr === new Date().toISOString().split('T')[0];

const convertJSTtoWIB = (jstTime) => {
  if (!jstTime || jstTime === 'Unknown') return '--:--';
  const [hours, minutes] = jstTime.split(':').map(Number);
  let wibHours = hours - 2; 
  if (wibHours < 0) wibHours += 24;
  return `${String(wibHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const weekDays = computed(() => {
  const days = [];
  const baseDate = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    days.push({
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      shortDate: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      date: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    });
  }
  return days;
});

const fetchDaySchedule = async () => {
  loading.value = true;
  scheduleList.value = [];
  try {
    const currentDay = weekDays.value.find(d => d.date === activeDate.value)?.dayName;
    await new Promise(resolve => setTimeout(resolve, 400)); // Smooth loading gais
    const res = await animeService.getSchedule(currentDay);
    
    scheduleList.value = (res.data || []).sort((a, b) => {
      const timeA = a.broadcast?.time || '99:99';
      const timeB = b.broadcast?.time || '99:99';
      return timeA.localeCompare(timeB);
    });
  } catch (error) {
    console.error("SCH_ERR", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDaySchedule();
  setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, 1000);
});

watch(activeDate, () => fetchDaySchedule());
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.custom-scroll::-webkit-scrollbar { width: 4px; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
.custom-scroll::-webkit-scrollbar-thumb:hover { background: var(--accent-color); }

.fade-in { animation: fadeIn 0.8s cubic-bezier(0.23, 1, 0.32, 1); }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.tabular-nums { font-variant-numeric: tabular-nums; }
</style>
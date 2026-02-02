<template>
  <div class="w-full bg-slate-900/40 rounded-[2.5rem] border border-white/5 backdrop-blur-md overflow-hidden fade-in">
    <div class="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/5">
      <div class="flex items-center gap-3">
        <div class="h-6 w-1.5 bg-[var(--accent-color)] rounded-full shadow-[0_0_10px_var(--accent-glow)]"></div>
        <h2 class="text-xl font-black uppercase tracking-tighter italic text-white">{{ t('schedule') }}</h2>
      </div>
      <div class="flex items-center gap-2 px-4 py-1.5 bg-black/40 rounded-full border border-white/5">
        <span class="text-[8px] font-black text-slate-500 uppercase tracking-widest">(GMT+07:00)</span>
        <span class="text-[10px] font-black text-[var(--accent-color)] italic">{{ currentTime }}</span>
      </div>
    </div>

    <div class="flex items-center justify-between px-4 py-4 bg-black/20 border-b border-white/5 overflow-x-auto no-scrollbar gap-2">
      <button v-for="day in weekDays" :key="day.date" 
        @click="activeDate = day.date"
        :class="['flex flex-col items-center min-w-[70px] py-3 rounded-2xl transition-all active:scale-95', 
          activeDate === day.date ? 'bg-[var(--accent-color)] text-white shadow-lg shadow-[var(--accent-glow)]' : 'text-slate-500 hover:text-slate-300']">
        <span class="text-[10px] font-black uppercase tracking-widest">{{ day.label }}</span>
        <span class="text-[9px] font-bold opacity-60">{{ day.shortDate }}</span>
      </button>
    </div>

    <div class="p-4 md:p-6 space-y-2 max-h-[500px] overflow-y-auto custom-scroll">
      <div v-if="loading" class="flex flex-col items-center py-20 gap-4">
        <div class="animate-spin h-8 w-8 border-2 border-t-[var(--accent-color)] border-transparent rounded-full"></div>
        <p class="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Syncing Schedule...</p>
      </div>

      <div v-else-if="scheduleList.length > 0">
        <div v-for="anime in scheduleList" :key="anime.mal_id" 
          @click="$emit('openDetail', anime)"
          class="group flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer">
          
          <div class="flex items-center gap-6">
            <span class="text-[11px] font-black text-slate-500 group-hover:text-[var(--accent-color)] transition-colors min-w-[45px]">
              {{ convertJSTtoWIB(anime.broadcast?.time) }}
            </span>
            <div class="flex flex-col max-w-[150px] md:max-w-md">
              <h3 class="text-[11px] font-black text-white uppercase truncate group-hover:text-[var(--accent-color)] transition-colors">
                {{ anime.title }}
              </h3>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="hidden sm:flex items-center gap-2 px-3 py-1 bg-black/40 rounded-lg border border-white/5">
               <i class="fa-solid fa-play text-[8px] text-[var(--accent-color)]"></i>
               <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest">Episode {{ anime.episodes || '?' }}</span>
            </div>
            <i class="fa-solid fa-chevron-right text-[10px] text-slate-700 group-hover:translate-x-1 transition-transform"></i>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
         <p class="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">{{ t('empty') }}</p>
      </div>
    </div>

    <div class="p-4 bg-black/20 text-center">
      <button @click="router.push('/schedule')" class="text-[9px] font-black text-slate-500 hover:text-[var(--accent-color)] uppercase tracking-[0.3em] transition-all italic">
        View Full Schedule <i class="fa-solid fa-arrow-right-long ml-2"></i>
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
const currentTime = ref(new Date().toLocaleTimeString('en-US', { hour12: true }));

const t = (key) => {
  const lang = props.user?.lang || 'en';
  return translations[lang][key] || key;
};

// --- FUNGSI KONVERSI WAKTU JST KE WIB GAIS ---
const convertJSTtoWIB = (jstTime) => {
  if (!jstTime || jstTime === 'Unknown') return '??:??';
  
  const [hours, minutes] = jstTime.split(':').map(Number);
  let wibHours = hours - 2; // Jepang (GMT+9) ke Malang (GMT+7)
  
  if (wibHours < 0) wibHours += 24;
  
  return `${String(wibHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// Generasi 7 hari kedepan gais
const weekDays = computed(() => {
  const days = [];
  const baseDate = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    days.push({
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      shortDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      date: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    });
  }
  return days;
});

const fetchDaySchedule = async () => {
  loading.value = true;
  try {
    const currentDay = weekDays.value.find(d => d.date === activeDate.value)?.dayName;
    const res = await animeService.getSchedule(currentDay);
    // Kita sort berdasarkan waktu rilis gais biar rapi
    scheduleList.value = (res.data || []).sort((a, b) => {
      const timeA = a.broadcast?.time || '99:99';
      const timeB = b.broadcast?.time || '99:99';
      return timeA.localeCompare(timeB);
    });
  } catch (error) {
    console.error("SCH_ERR");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDaySchedule();
  setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString('en-US', { hour12: true });
  }, 1000);
});

watch(activeDate, () => fetchDaySchedule());
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.custom-scroll::-webkit-scrollbar { width: 4px; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
.custom-scroll::-webkit-scrollbar-thumb:hover { background: var(--accent-color); }
.fade-in { animation: fadeIn 0.6s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
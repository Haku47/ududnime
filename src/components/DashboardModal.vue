<template>
  <div class="fixed inset-0 z-[120] flex items-center justify-center p-2 md:p-4 bg-black/95">
    <div class="absolute inset-0" @click="handleClose"></div>

    <div class="bg-[#020617] border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden relative flex flex-col max-h-[90vh] shadow-[0_0_50px_rgba(0,0,0,0.8)] fade-in font-inter z-10">
      
      <div class="absolute inset-0 z-0">
        <img :src="user.customHomeBg || 'https://images.unsplash.com/photo-1578632738908-4521c726eeb7?q=80&w=2070'" class="w-full h-full object-cover opacity-30 transition-all duration-1000" />
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/60 to-[#020617]"></div>
      </div>

      <div class="relative z-10 flex flex-col h-full overflow-hidden">
        <div class="p-6 md:p-8 border-b border-white/10">
          <div class="flex justify-between items-start mb-8">
            <div class="flex items-center gap-6">
              <div class="relative group">
                <div class="absolute -inset-1 bg-gradient-to-tr from-[var(--accent-color)] to-yellow-500 rounded-[2rem] opacity-30 group-hover:opacity-60 transition-opacity"></div>
                <div class="relative w-20 h-20 md:w-24 md:h-24 rounded-[1.8rem] bg-slate-900 p-1">
                  <img :src="user.avatar" class="w-full h-full rounded-[1.5rem] object-cover border-2 border-slate-800 shadow-2xl" />
                </div>
                
                <button @click="$refs.fileInput.click()" class="absolute -bottom-1 -right-1 bg-[var(--accent-color)] text-white p-2 rounded-xl border-4 border-[#020617] hover:scale-110 transition-all shadow-xl">
                  <BaseIcon icon="fa-solid fa-camera" size="xs" />
                </button>
                <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="uploadAvatar" />

                <div class="absolute -top-3 -left-3 animate-bounce">
                  <BaseBadge variant="primary" size="md" rounded="full" glow>
                    LVL {{ user.level || 1 }}
                  </BaseBadge>
                </div>
              </div>

              <div>
                <div class="flex items-center gap-2 mb-1">
                  <h2 class="text-xl md:text-2xl font-black text-white tracking-tighter uppercase italic">{{ user.username }}</h2>
                  <BaseIcon icon="fa-solid fa-circle-check" color="#60a5fa" size="xs" />
                </div>
                <p class="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-4">{{ user.email }}</p>
                
                <div class="w-48 md:w-64">
                  <div class="flex justify-between items-center mb-1.5">
                    <span class="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">{{ t('exp_label') }}</span>
                    <span class="text-[9px] font-black text-[var(--accent-color)]">{{ user.xp || 0 }} / 100 XP</span>
                  </div>
                  <div class="h-2 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div class="h-full bg-gradient-to-r from-[var(--accent-color)] to-yellow-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_var(--accent-glow)]" :style="{ width: (user.xp || 0) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>

            <button @click="handleClose" class="text-slate-600 hover:text-white transition-all p-2 hover:rotate-90">
              <BaseIcon icon="fa-solid fa-xmark" size="lg" />
            </button>
          </div>

          <div class="grid grid-cols-3 gap-3 md:gap-4">
            <div class="bg-black/30 p-3 md:p-4 rounded-2xl border border-white/5 text-center">
              <p class="text-[8px] text-slate-500 font-black uppercase mb-1">{{ t('watchlist') }}</p>
              <p class="text-lg md:text-xl font-black text-white">{{ user.watchlist?.length || 0 }}</p>
            </div>
            <div class="bg-[var(--accent-bg)] p-3 md:p-4 rounded-2xl border border-[var(--accent-glow)] text-center">
              <p class="text-[8px] text-[var(--accent-color)] font-black uppercase mb-1 italic">Rank Title</p>
              <p class="text-[8px] md:text-[9px] font-black text-white mt-1 uppercase leading-tight">{{ getRankTitle }}</p>
            </div>
            <div class="bg-black/30 p-3 md:p-4 rounded-2xl border border-white/5 text-center">
              <p class="text-[8px] text-slate-500 font-black uppercase mb-1">{{ t('member') }}</p>
              <p class="text-[9px] md:text-[10px] font-black text-white mt-1 uppercase">{{ user.createdAt || '2026' }}</p>
            </div>
          </div>
        </div>

        <div class="flex bg-black/20 border-b border-white/5">
          <button v-for="tab in ['watchlist', 'stats', 'settings']" :key="tab" @click="activeTab = tab" 
            :class="['flex-1 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all', activeTab === tab ? 'text-[var(--accent-color)] bg-[var(--accent-bg)] shadow-[inset_0_-3px_0_0_var(--accent-color)]' : 'text-slate-500 hover:text-slate-300']">
            {{ t(tab) }}
          </button>
        </div>

        <div class="p-6 md:p-8 overflow-y-auto flex-1 custom-scroll">
          
          <div v-if="activeTab === 'watchlist'" class="space-y-4">
            <div v-if="user.watchlist?.length" class="grid grid-cols-1 gap-3">
              <div v-for="item in user.watchlist" :key="item.id" class="flex items-center gap-4 bg-black/40 hover:bg-black/60 p-3 rounded-2xl border border-white/5 transition-all group">
                <img :src="item.image" class="w-12 h-16 object-cover rounded-xl shadow-lg" />
                <div class="flex-1 truncate">
                  <p class="text-xs md:text-sm font-black text-white uppercase truncate">{{ item.title }}</p>
                  <p class="text-[8px] text-slate-500 uppercase font-bold mt-1 italic">{{ item.type }} • {{ item.status }}</p>
                </div>
                <button @click="$emit('removeFromWatchlist', item.id)" class="p-2 text-slate-600 hover:text-red-500 transition-all">
                  <BaseIcon icon="fa-solid fa-trash-can" size="sm" />
                </button>
              </div>
            </div>
            <div v-else class="text-center py-20 text-slate-600 text-[10px] font-black uppercase tracking-widest italic">{{ t('empty') }}</div>
          </div>

          <div v-if="activeTab === 'stats'" class="space-y-8 fade-in pb-10 text-center">
            <h3 class="text-sm font-black text-white uppercase tracking-[0.2em] italic">{{ t('analytics_title') }}</h3>
            <div v-if="genreStats.length > 0" class="space-y-6 text-left">
              <div v-for="stat in genreStats" :key="stat.name" class="group">
                <div class="flex justify-between items-end mb-2 px-1">
                  <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-[var(--accent-color)] transition-colors">{{ stat.name }}</span>
                  <span class="text-[9px] font-black text-slate-500 italic">{{ stat.count }} TITLES ({{ stat.percent }}%)</span>
                </div>
                <div class="h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5 p-[1px]">
                  <div class="h-full bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-color)] opacity-80 rounded-full transition-all duration-1000 shadow-[0_0_15px_var(--accent-glow)]" :style="{ width: stat.percent + '%' }"></div>
                </div>
              </div>
            </div>
            <div v-else class="py-20 bg-black/20 rounded-[3rem] border-2 border-dashed border-white/5">
              <BaseIcon icon="fa-solid fa-chart-pie" size="xl" wrapper-class="mb-4 opacity-20" />
              <p class="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">{{ t('empty_stats') }}</p>
            </div>
          </div>

          <div v-if="activeTab === 'settings'" class="space-y-6 pb-10">
            <div class="p-5 md:p-6 bg-black/40 rounded-[2rem] border border-white/5 space-y-4">
              <label class="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2 block italic text-center">{{ t('persistence_title') }}</label>
              <div class="grid grid-cols-2 gap-3">
                <BaseButton variant="secondary" @click="exportData">
                  <template #icon-left><BaseIcon icon="fa-solid fa-cloud-arrow-down" /></template>
                  Backup
                </BaseButton>
                <BaseButton variant="secondary" @click="$refs.restoreInput.click()">
                  <template #icon-left><BaseIcon icon="fa-solid fa-cloud-arrow-up" /></template>
                  Restore
                </BaseButton>
                <input type="file" ref="restoreInput" class="hidden" accept=".json" @change="importData" />
              </div>
            </div>

            <div class="p-5 md:p-6 bg-black/40 rounded-[2rem] border border-white/5">
              <label class="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 block italic text-center">{{ t('lang_title') }}</label>
              <div class="grid grid-cols-2 gap-3">
                <BaseButton v-for="(langName, code) in { en: 'English', id: 'Indonesia', jv: 'Jowo', jp: 'Nihongo' }" :key="code"
                  @click="updateLang(code)"
                  :variant="user.lang === code ? 'primary' : 'secondary'"
                  size="sm"
                >
                  {{ langName }}
                </BaseButton>
              </div>
            </div>

            <div class="p-5 md:p-6 bg-black/40 rounded-[2rem] border border-white/5">
              <label class="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6 block italic text-center">{{ t('accent_title') }}</label>
              <div class="flex justify-center gap-4 flex-wrap">
                <button v-for="color in ['#f97316', '#8b5cf6', '#06b6d4', '#ec4899', '#10b981', '#facc15']" :key="color"
                  @click="updateTheme(color)"
                  class="w-10 h-10 rounded-full border-4 transition-all active:scale-90 shadow-lg"
                  :class="user.themeColor === color ? 'border-white scale-110' : 'border-[#020617] hover:scale-105'"
                  :style="{ backgroundColor: color }"></button>
              </div>
            </div>

            <div class="p-5 md:p-6 bg-black/40 rounded-[2rem] border border-white/5 space-y-6">
              <label class="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 block italic text-center">{{ t('wallpaper_title') }}</label>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div v-for="preset in wallpaperPresets" :key="preset.name" @click="applyPreset(preset)"
                  class="relative aspect-video rounded-xl overflow-hidden cursor-pointer group border-2 transition-all active:scale-95 bg-slate-800"
                  :class="user.customHomeBg === preset.url ? 'border-[var(--accent-color)] shadow-lg' : 'border-white/5 hover:border-white/20'">
                  <img :src="preset.url" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
              </div>
              <div class="pt-4 border-t border-white/5 flex gap-3">
                <BaseInput v-model="homeBgUrl" placeholder="Paste Wallpaper URL..." class="flex-1" />
                <BaseButton variant="primary" @click="saveHomeConfig">{{ t('apply_btn') }}</BaseButton>
              </div>
            </div>

            <div class="p-5 md:p-6 bg-black/40 rounded-[2rem] border border-white/5 flex gap-3">
              <BaseInput v-model="newUsername" :placeholder="user.username" label="Update Name" class="flex-1" />
              <BaseButton variant="secondary" @click="updateName" class="mt-auto">{{ t('save_btn') }}</BaseButton>
            </div>

            <BaseButton variant="ghost" class="w-full py-6 !text-red-500 hover:!bg-red-500/10 !border-white/5" @click="$emit('logout')">
              <template #icon-left><BaseIcon icon="fa-solid fa-power-off" /></template>
              {{ t('logout_btn') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import { translations } from '../utils/i18n';

// Lazy load komponen Base gais
const BaseButton = defineAsyncComponent(() => import('./BaseButton.vue'));
const BaseInput = defineAsyncComponent(() => import('./BaseInput.vue'));
const BaseIcon = defineAsyncComponent(() => import('./BaseIcon.vue'));
const BaseBadge = defineAsyncComponent(() => import('./BaseBadge.vue'));

const props = defineProps(['user']);
const emit = defineEmits(['close', 'logout', 'removeFromWatchlist', 'updateUser', 'showToast']);

const activeTab = ref('watchlist');
const newUsername = ref('');
const homeBgUrl = ref(props.user.customHomeBg || '');
const bgBlur = ref(props.user.bgBlur ?? 2);
const bgBrightness = ref(props.user.bgBrightness ?? 40);

const t = (key) => {
  const lang = props.user?.lang || 'en';
  const extraI18n = {
    en: { persistence_title: "Data Persistence", backup_success: "DATA BACKED UP!", restore_success: "DATA RESTORED!", restore_fail: "INVALID JSON!" },
    id: { persistence_title: "Keamanan Data", backup_success: "DATA BERHASIL DI-BACKUP!", restore_success: "DATA BERHASIL DIPULIHKAN!", restore_fail: "FILE JSON RUSAK!" },
    jv: { persistence_title: "Simpenan Data", backup_success: "DATA WIS DISIMPEN!", restore_success: "DATA WIS BALIK!", restore_fail: "FILE RUSAK!" },
    jp: { persistence_title: "Dēta no hozon", backup_success: "BAKKUAPPU KANRYŌ!", restore_success: "FUKKYŪ SAREMASHITA!", restore_fail: "FUAIRU GA KOWARETE IMASU!" }
  };
  return extraI18n[lang]?.[key] || translations[lang]?.[key] || key;
};

const exportData = () => {
  try {
    const dataStr = JSON.stringify(props.user, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `ududnime_backup_${props.user.username}.json`);
    linkElement.click();
    emit('showToast', t('backup_success'), 'success', 'fa-solid fa-cloud-arrow-down');
  } catch (err) {
    emit('showToast', "BACKUP FAILED!", 'error');
  }
};

const importData = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const restoredUser = JSON.parse(event.target.result);
      if (restoredUser.username && restoredUser.email) {
        emit('updateUser', restoredUser);
        emit('showToast', t('restore_success'), 'success', 'fa-solid fa-cloud-arrow-up');
      }
    } catch (err) {
      emit('showToast', t('restore_fail'), 'error');
    }
  };
  reader.readAsText(file);
};

const genreStats = computed(() => {
  if (!props.user.watchlist?.length) return [];
  const counts = {};
  props.user.watchlist.forEach(anime => {
    anime.genres?.forEach(g => { counts[g.name] = (counts[g.name] || 0) + 1; });
  });
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return Object.entries(counts).map(([name, count]) => ({ name, count, percent: Math.round((count / total) * 100) })).sort((a, b) => b.count - a.count).slice(0, 5);
});

const wallpaperPresets = [
  { name: 'Cyberpunk', url: 'https://w.wallhaven.cc/full/9m/wallhaven-9mrdgd.png', blur: 2, brightness: 35 },
  { name: 'Lofi Chill', url: 'https://w.wallhaven.cc/full/ex/wallhaven-exo2gr.jpg', blur: 4, brightness: 50 },
  { name: 'Ghost City', url: 'https://w.wallhaven.cc/full/ym/wallhaven-ym2mz7.png', blur: 1, brightness: 30 }
];

const updateLang = (langCode) => emit('updateUser', { ...props.user, lang: langCode });
const updateTheme = (color) => emit('updateUser', { ...props.user, themeColor: color });
const applyPreset = (p) => { homeBgUrl.value = p.url; bgBlur.value = p.blur; bgBrightness.value = p.brightness; saveHomeConfig(); };
const saveHomeConfig = () => emit('updateUser', { ...props.user, customHomeBg: homeBgUrl.value, bgBlur: parseInt(bgBlur.value), bgBrightness: parseInt(bgBrightness.value) });
const updateName = () => { if (newUsername.value.trim().length >= 3) { emit('updateUser', { ...props.user, username: newUsername.value }); newUsername.value = ''; } };
const handleClose = () => { document.body.style.overflow = 'auto'; emit('close'); };

const uploadAvatar = (e) => { 
  const file = e.target.files[0]; 
  if (file && file.size <= 1024 * 1024) {
    const reader = new FileReader(); 
    reader.onload = (event) => emit('updateUser', { ...props.user, avatar: event.target.result }); 
    reader.readAsDataURL(file); 
  }
};

const getRankTitle = computed(() => {
  const lvl = props.user.level || 1;
  return lvl >= 50 ? "HARDCORE WATCHER" : lvl >= 25 ? "SEASONAL EXPERT" : "OTAKU ROOKIE";
});

onMounted(() => { document.body.style.overflow = 'hidden'; });
onUnmounted(() => { document.body.style.overflow = 'auto'; });
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar { width: 4px; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
.custom-scroll::-webkit-scrollbar-thumb:hover { background: var(--accent-color); }
</style>
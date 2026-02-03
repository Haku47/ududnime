<template>
  <div :style="themeStyles" class="min-h-screen">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <ChatBot 
      :user="currentUser" 
      @toggleWatchlist="handleGlobalWatchlist" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent, computed } from 'vue';
import { supabase } from './utils/supabase'; // Import gerbang database kamu gais!

// Lazy load biar aplikasi tetep ngebut gais
const ChatBot = defineAsyncComponent(() => import('./components/ududbot.vue'));

const currentUser = ref(null);
const currentThemeColor = ref('#f97316'); // Default Orange UDUDNIME gais

// --- DYNAMIC THEME ENGINE ---
const themeStyles = computed(() => ({
  '--accent-color': currentThemeColor.value,
  '--accent-glow': `${currentThemeColor.value}66`, // Alpha 40% buat efek neon
  '--accent-bg': `${currentThemeColor.value}1a`   // Alpha 10% buat soft background
}));

// Sinkronisasi data user gais
const updateUserData = () => {
  const session = localStorage.getItem('ududnime_session');
  if (session) {
    const user = JSON.parse(session);
    currentUser.value = user;
    // Set warna tema kalau user sudah pernah milih gais
    if (user.themeColor) currentThemeColor.value = user.themeColor;
  } else {
    currentUser.value = null;
  }
};

// --- 🌐 SUPABASE SESSION SYNC GAIS ---
const syncSupabaseSession = (session) => {
  if (session) {
    // Ambil data dari metadata GitHub gais!
    const { user } = session;
    const supabaseUser = {
      id: user.id,
      username: user.user_metadata.full_name || user.email.split('@')[0],
      email: user.email,
      avatar: user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.id}`,
      level: 1, 
      xp: 0,
      watchlist: [],
      provider: 'github'
    };
    
    localStorage.setItem('ududnime_session', JSON.stringify(supabaseUser));
    updateUserData();
  }
};

// Handler buat Quick Add dari Chat gais
const handleGlobalWatchlist = (animeData) => {
  if (!currentUser.value) return;
  
  let user = { ...currentUser.value };
  if (!user.watchlist) user.watchlist = [];
  
  const exists = user.watchlist.find(a => a.id === animeData.id);
  if (!exists) {
    user.watchlist.push(animeData);
    user.xp = (user.xp || 0) + 25; 
    
    if (user.xp >= 100) {
      user.level = (user.level || 1) + 1;
      user.xp = user.xp % 100;
    }

    currentUser.value = user;
    localStorage.setItem('ududnime_session', JSON.stringify(user));
    
    // Sinkronisasi ke database lokal gais
    const allUsers = JSON.parse(localStorage.getItem('ududnime_users') || '[]');
    const idx = allUsers.findIndex(u => u.email === user.email);
    if (idx !== -1) {
      allUsers[idx] = user;
      localStorage.setItem('ududnime_users', JSON.stringify(allUsers));
    }
  }
};

onMounted(async () => {
  updateUserData();

  // 1. Cek session Supabase pas baru buka gais
  const { data: { session } } = await supabase.auth.getSession();
  if (session) syncSupabaseSession(session);

  // 2. Listener Supabase: Otomatis deteksi kalau user login/logout gais!
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      syncSupabaseSession(session);
    } else {
      // Kalau logout, hapus session lokal gais
      localStorage.removeItem('ududnime_session');
      updateUserData();
    }
  });

  // 3. Listener Storage (Tab Lain) gais
  window.addEventListener('storage', (e) => {
    if (e.key === 'ududnime_session') updateUserData();
  });
});
</script>

<style>
/* 1. IMPORT HARUS DI PALING ATAS GAIS! */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

/* 2. CSS VARIABLES DEFAULTS */
:root {
  --accent-color: #f97316;
  --accent-glow: rgba(249, 115, 22, 0.4);
  --accent-bg: rgba(249, 115, 22, 0.1);
}

/* 3. ANIMASI GLOBAL */
.fade-in { animation: fadeIn 0.5s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* 4. SCROLLBAR GLOBAL DENGAN DYNAMIC COLOR GAIS */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #0f172a; }
::-webkit-scrollbar-thumb { 
  background: #1e293b; 
  border-radius: 10px; 
  border: 2px solid #0f172a;
}
::-webkit-scrollbar-thumb:hover { 
  background: var(--accent-color); /* Ikut warna tema gais! */
}

/* 5. BODY CONFIG */
body {
  font-family: 'Inter', sans-serif;
  background-color: #0f172a;
  margin: 0;
  overflow-x: hidden;
  color: #f1f5f9;
}

/* 6. UTILITY CLASSES UNTUK DYNAMIC THEME */
.text-accent { color: var(--accent-color); }
.bg-accent { background-color: var(--accent-color); }
.border-accent { border-color: var(--accent-color); }
.shadow-accent { box-shadow: 0 0 20px var(--accent-glow); }
</style>
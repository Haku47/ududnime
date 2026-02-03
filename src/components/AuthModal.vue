<template>
  <div class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto" @click.self="$emit('close')">
    
    <div class="bg-slate-900 border border-white/5 w-full max-w-md my-auto flex flex-col rounded-[2.5rem] overflow-hidden relative shadow-2xl fade-in z-10 transition-all duration-300">
      
      <button @click="$emit('close')" class="absolute top-6 right-6 z-30 text-slate-500 hover:text-white transition-all hover:rotate-90">
        <i class="fa-solid fa-xmark text-2xl"></i>
      </button>

      <div class="flex-1 overflow-y-auto custom-scroll p-6 sm:p-8 pt-10">
        
        <div class="text-center mb-8">
          <div class="bg-gradient-to-tr from-[var(--accent-color)] to-[var(--accent-glow)] w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[var(--accent-glow)] rotate-3 hover:rotate-12 transition-transform">
            <i class="fa-solid fa-user-shield text-2xl sm:text-3xl text-white"></i>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase italic">
            {{ isLogin ? t('login_title') : t('register_title') }}
          </h2>
          <p class="text-slate-500 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mt-3 leading-relaxed">
            {{ isLogin ? t('login_sub') : t('register_sub') }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-5">
          <transition name="fade">
            <div v-if="errorMessage" class="bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest p-4 rounded-2xl flex items-center gap-3 animate-shake">
              <i class="fa-solid fa-circle-exclamation text-sm"></i>
              {{ errorMessage }}
            </div>
          </transition>

          <div v-if="!isLogin" class="space-y-2">
            <label class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{{ t('username_label') }}</label>
            <div class="relative group">
              <i class="fa-solid fa-id-card absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--accent-color)] transition-colors text-sm"></i>
              <input 
                v-model="username" 
                @input="username = username.replace(/\s/g, '')"
                type="text" 
                class="w-full bg-slate-800/40 border border-white/5 rounded-2xl py-3.5 sm:py-4 pl-12 pr-4 text-sm text-white focus:ring-2 focus:ring-[var(--accent-glow)] focus:border-[var(--accent-color)] outline-none transition-all placeholder:text-slate-600 font-bold tracking-wide" 
                :placeholder="t('username_placeholder')" 
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email</label>
            <div class="relative group">
              <i class="fa-solid fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--accent-color)] transition-colors text-sm"></i>
              <input v-model="email" @input="email = email.toLowerCase().replace(/\s/g, '')" type="email" class="w-full bg-slate-800/40 border border-white/5 rounded-2xl py-3.5 sm:py-4 pl-12 pr-4 text-sm text-white focus:ring-2 focus:ring-[var(--accent-glow)] focus:border-[var(--accent-color)] outline-none transition-all placeholder:text-slate-600" placeholder="email@kamu.com" />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Password</label>
            <div class="relative group">
              <i class="fa-solid fa-key absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--accent-color)] transition-colors text-sm"></i>
              <input :type="showPassword ? 'text' : 'password'" v-model="password" class="w-full bg-slate-800/40 border border-white/5 rounded-2xl py-3.5 sm:py-4 pl-12 pr-12 text-sm text-white focus:ring-2 focus:ring-[var(--accent-glow)] focus:border-[var(--accent-color)] outline-none transition-all placeholder:text-slate-600" placeholder="••••••••" />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-[var(--accent-color)] transition-colors">
                <i :class="['fa-solid', showPassword ? 'fa-eye-slash' : 'fa-eye']"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="w-full bg-[var(--accent-color)] hover:opacity-90 text-white font-black py-4 sm:py-5 rounded-2xl mt-4 transition-all active:scale-95 shadow-xl shadow-[var(--accent-glow)] flex items-center justify-center gap-3 uppercase text-[10px] sm:text-xs tracking-[0.2em]">
            <span>{{ isLogin ? t('login') : t('register_btn') }}</span>
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </form>

        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-white/5"></div></div>
          <div class="relative flex justify-center text-[8px] font-black uppercase tracking-[0.3em]"><span class="bg-slate-900 px-4 text-slate-600">Atau Pake Akun Dev</span></div>
        </div>

        <button @click="handleGitHubLogin" class="w-full bg-black/40 hover:bg-black/60 border border-white/5 hover:border-white/20 text-white font-black py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-4 uppercase text-[10px] tracking-widest group">
          <i class="fa-brands fa-github text-lg group-hover:rotate-12 transition-transform"></i>
          <span>{{ isLogin ? 'Masuk Pake GitHub' : 'Daftar Pake GitHub' }}</span>
        </button>

        <div class="mt-8 pb-4 text-center">
          <p class="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-widest">
            {{ isLogin ? t('no_account') : t('have_account') }}
            <button @click="isLogin = !isLogin" class="text-[var(--accent-color)] hover:opacity-80 ml-1 underline decoration-2 underline-offset-4 transition-colors">
              {{ isLogin ? t('register_link') : t('login_link') }}
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { translations } from '../utils/i18n';
import { supabase } from '../utils/supabase';

const props = defineProps(['user']);
const emit = defineEmits(['close', 'authSuccess']);

const isLogin = ref(true);
const showPassword = ref(false);
const username = ref("");
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const t = (key) => {
  const lang = props.user?.lang || 'en';
  return translations[lang][key] || key;
};

const handleGitHubLogin = async () => {
  if (!supabase) {
    errorMessage.value = "Koneksi database pingsan gais, cek .env.";
    return;
  }

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        scopes: 'read:user',
        redirectTo: window.location.origin 
      }
    });
    if (error) throw error;
  } catch (err) {
    errorMessage.value = "Gagal konek GitHub ker: " + err.message;
  }
};

const handleSubmit = () => {
  errorMessage.value = "";
  const existingUsers = JSON.parse(localStorage.getItem('ududnime_users') || '[]');
  
  const cleanEmail = email.value.toLowerCase().trim();
  const cleanUsername = username.value.trim(); 

  if (isLogin.value) {
    const user = existingUsers.find(u => u.email === cleanEmail && u.password === password.value);
    if (user) {
      user.level = user.level || 1;
      user.xp = user.xp || 0;
      user.watchlist = user.watchlist || [];
      localStorage.setItem('ududnime_session', JSON.stringify(user));
      
      if (user.themeColor) {
        document.documentElement.style.setProperty('--accent-color', user.themeColor);
        document.documentElement.style.setProperty('--accent-glow', `${user.themeColor}66`);
      }

      emit('authSuccess', user);
      emit('close');
    } else {
      errorMessage.value = t('err_login');
    }
  } else {
    if (!cleanUsername || !cleanEmail || !password.value) {
      errorMessage.value = t('err_empty');
      return;
    }
    if (existingUsers.some(u => u.email === cleanEmail)) {
      errorMessage.value = t('err_exists');
      return;
    }

    const newUser = { 
      id: Date.now(),
      username: cleanUsername, 
      email: cleanEmail, 
      password: password.value,
      level: 1,
      xp: 0,
      lang: props.user?.lang || 'en',
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${cleanUsername}`,
      watchlist: [],
      createdAt: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    existingUsers.push(newUser);
    localStorage.setItem('ududnime_users', JSON.stringify(existingUsers));
    isLogin.value = true;
    errorMessage.value = "";
    alert(t('register_success'));
    username.value = "";
  }
};

onMounted(async () => {
  // --- 🔄 OTOMATIS TANGKAP NAMA GITHUB SETELAH REDIRECT GAIS ---
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    const { user } = session;
    const githubUser = {
      id: user.id,
      username: user.user_metadata.full_name || user.email.split('@')[0],
      email: user.email,
      avatar: user.user_metadata.avatar_url,
      level: 1,
      xp: 0,
      watchlist: [],
      provider: 'github'
    };
    
    localStorage.setItem('ududnime_session', JSON.stringify(githubUser));
    emit('authSuccess', githubUser);
    emit('close');
  }

  // Cek apakah ada session lokal lama gais
  const localSession = localStorage.getItem('ududnime_session');
  if (localSession) {
    const user = JSON.parse(localSession);
    if (user.themeColor) {
      document.documentElement.style.setProperty('--accent-color', user.themeColor);
      document.documentElement.style.setProperty('--accent-glow', `${user.themeColor}66`);
    }
  }

  // LOGIKA PENDETEKSI ERROR REDIRECT GAIS
  const urlParams = new URLSearchParams(window.location.hash.substring(1));
  if (urlParams.has('error_description')) {
    errorMessage.value = "GitHub Bilang: " + urlParams.get('error_description').replace(/\+/g, ' ');
  }
});
</script>
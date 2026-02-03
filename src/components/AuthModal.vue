<template>
  <div class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto" @click.self="$emit('close')">
    
    <div class="bg-slate-900 border border-white/5 w-full max-w-md my-auto flex flex-col rounded-[2.5rem] overflow-hidden relative shadow-2xl fade-in z-10 transition-all duration-300">
      
      <button @click="$emit('close')" class="absolute top-6 right-6 z-30 text-slate-500 hover:text-white transition-all hover:rotate-90">
        <BaseIcon icon="fa-solid fa-xmark" size="lg" />
      </button>

      <div class="flex-1 overflow-y-auto custom-scroll p-6 sm:p-8 pt-10">
        
        <div class="text-center mb-8">
          <div class="bg-gradient-to-tr from-[var(--accent-color)] to-[var(--accent-glow)] w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[var(--accent-glow)] rotate-3 hover:rotate-12 transition-transform">
            <BaseIcon icon="fa-solid fa-user-shield" size="xl" color="white" />
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
              <BaseIcon icon="fa-solid fa-circle-exclamation" size="sm" />
              {{ errorMessage }}
            </div>
          </transition>

          <BaseInput 
            v-if="!isLogin"
            v-model="username"
            :label="t('username_label')"
            icon="fa-solid fa-id-card"
            autocomplete="username"
            :placeholder="t('username_placeholder')"
            @input="username = username.replace(/\s/g, '')"
          />

          <BaseInput 
            v-model="email"
            label="Email"
            type="email"
            icon="fa-solid fa-envelope"
            autocomplete="email"
            placeholder="email@kamu.com"
            @input="email = email.toLowerCase().replace(/\s/g, '')"
          />

          <BaseInput 
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            icon="fa-solid fa-key"
            :autocomplete="isLogin ? 'current-password' : 'new-password'"
            placeholder="••••••••"
            show-password-toggle
            :is-password-visible="showPassword"
            @togglePassword="showPassword = !showPassword"
          />

          <BaseButton type="submit" variant="primary" size="lg" class="w-full mt-4">
            {{ isLogin ? t('login') : t('register_btn') }}
            <template #icon-right>
              <BaseIcon icon="fa-solid fa-paper-plane" size="sm" />
            </template>
          </BaseButton>
        </form>

        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-white/5"></div></div>
          <div class="relative flex justify-center text-[8px] font-black uppercase tracking-[0.3em]"><span class="bg-slate-900 px-4 text-slate-600">Atau Pake Akun Dev</span></div>
        </div>

        <BaseButton @click="handleGitHubLogin" variant="secondary" class="w-full group">
          <template #icon-left>
            <BaseIcon icon="fa-brands fa-github" size="lg" wrapper-class="group-hover:rotate-12 transition-transform" />
          </template>
          {{ isLogin ? 'Masuk Pake GitHub' : 'Daftar Pake GitHub' }}
        </BaseButton>

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
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { translations } from '../utils/i18n';
import { supabase } from '../utils/supabase';

// Lazy load komponen Base gais
const BaseButton = defineAsyncComponent(() => import('./BaseButton.vue'));
const BaseInput = defineAsyncComponent(() => import('./BaseInput.vue'));
const BaseIcon = defineAsyncComponent(() => import('./BaseIcon.vue'));

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
      level: 1, xp: 0,
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
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    const { user } = session;
    const finalUsername = user.user_metadata.full_name || user.email.split('@')[0];
    const githubUser = {
      id: user.id, username: finalUsername, email: user.email,
      avatar: user.user_metadata.avatar_url,
      level: 1, xp: 0, watchlist: [], provider: 'github'
    };
    localStorage.setItem('ududnime_session', JSON.stringify(githubUser));
    emit('authSuccess', githubUser);
    emit('close');
  }

  const localSession = localStorage.getItem('ududnime_session');
  if (localSession) {
    const user = JSON.parse(localSession);
    if (user.themeColor) {
      document.documentElement.style.setProperty('--accent-color', user.themeColor);
      document.documentElement.style.setProperty('--accent-glow', `${user.themeColor}66`);
    }
  }

  const urlParams = new URLSearchParams(window.location.hash.substring(1));
  if (urlParams.has('error_description')) {
    errorMessage.value = "GitHub Bilang: " + urlParams.get('error_description').replace(/\+/g, ' ');
  }
});
</script>
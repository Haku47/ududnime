<script setup>
import { ref, nextTick } from 'vue';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from 'marked';

// --- 🛠️ PERBAIKAN: TAMBAHKAN PROP LOADING GAIS ---
const props = defineProps(['user', 'loading']); 
const isOpen = ref(false);
const userInput = ref('');
const isTyping = ref(false);
const chatBox = ref(null);

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const initialMessage = { role: 'bot', text: 'Halo gais! UdudBot AI sudah bangun. Mau nanya rekomendasi anime apa hari ini?' };
const messages = ref([initialMessage]);

// Deretan pertanyaan sakti gais
const suggestions = [
  "Rekomendasi anime winter 2026 gais?",
  "Anime genre Isekai yang gahar gais?",
  "Top 10 anime terbaik dunia gais!",
  "Anime yang bikin nangis di pojokan gais."
];

const renderMarkdown = (text) => {
  return marked.parse(text, { breaks: true, gfm: true });
};

const clearChat = () => {
  messages.value = [initialMessage];
};

const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (e) => {
      const path = e.composedPath();
      if (!path.includes(el)) binding.value();
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) { document.removeEventListener("click", el.clickOutsideEvent); },
};

const closeBot = () => { if (isOpen.value) isOpen.value = false; };
const scrollToBottom = async () => { 
  await nextTick(); 
  if (chatBox.value) chatBox.value.scrollTo({ top: chatBox.value.scrollHeight, behavior: 'smooth' }); 
};

const handleInput = async (forcedInput = null) => {
  const input = forcedInput || userInput.value;
  if (!input.trim() || isTyping.value) return;
  
  messages.value.push({ role: 'user', text: input });
  userInput.value = '';
  isTyping.value = true;
  await scrollToBottom();

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: "Kamu adalah UdudBot, asisten katalog anime gahar dari Ududnime. Kamu mahasiswa Universitas Brawijaya Malang yang santai. Gunakan bahasa gaul dengan akhiran 'gais'. Jawab pertanyaan seputar anime dengan antusias."
    });

    const historyData = messages.value
      .slice(1, -1)
      .map(m => ({
        role: m.role === 'bot' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

    const chat = model.startChat({ history: historyData });
    const result = await chat.sendMessage(input);
    const response = await result.response;
    
    messages.value.push({ role: 'bot', text: response.text() });
  } catch (err) {
    messages.value.push({ role: 'bot', text: `Aduh gais, ada eror: <b>${err.message}</b>` });
  } finally {
    isTyping.value = false;
    await scrollToBottom();
  }
};
</script>

<template>
  <div v-if="!loading" class="fixed bottom-8 left-8 z-[150] flex flex-col items-start gap-3 font-inter text-white" v-click-outside="closeBot">
    <transition name="slide-up">
      <div v-if="isOpen" class="w-[300px] md:w-[350px] h-[520px] bg-slate-900/80 border border-white/10 backdrop-blur-2xl rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative">
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-[var(--accent-color)] opacity-10 rounded-full blur-[50px]"></div>

        <div class="p-4 border-b border-white/5 flex justify-between items-center bg-black/40 relative z-10">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 bg-[var(--accent-color)] rounded-xl flex items-center justify-center shadow-lg rotate-3 shadow-[var(--accent-glow)]">
              <i class="fa-solid fa-robot text-white text-sm"></i>
            </div>
            <div class="leading-none">
              <p class="text-[10px] font-black text-[var(--accent-color)] uppercase tracking-widest mb-1">UdudBot AI</p>
              <p class="text-[8px] font-bold text-green-400 uppercase">Gemini Pro v2.5</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button @click="clearChat" title="Clear Chat" class="text-slate-500 hover:text-[var(--accent-color)] transition-colors">
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
            <button @click="isOpen = false" class="text-slate-500 hover:text-white transition-colors">
              <i class="fa-solid fa-minus text-sm"></i>
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll relative z-10" ref="chatBox">
          <div v-for="(msg, idx) in messages" :key="idx" :class="['flex flex-col w-full', msg.role === 'user' ? 'items-end' : 'items-start']">
            <div :class="[
              'max-w-[95%] p-4 rounded-2xl text-[12px] md:text-[13px] leading-relaxed mb-1 shadow-md prose-mini',
              msg.role === 'user' ? 'bg-[var(--accent-color)] text-white rounded-tr-none font-bold shadow-[var(--accent-glow)]' : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none backdrop-blur-sm'
            ]">
              <div v-html="renderMarkdown(msg.text)"></div>
            </div>
          </div>

          <div v-if="messages.length === 1 && !isTyping" class="flex flex-col gap-2 pt-2">
            <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Coba tanya ini gais:</p>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="s in suggestions" :key="s"
                @click="handleInput(s)"
                class="text-[10px] bg-white/5 border border-white/10 px-3 py-2 rounded-xl hover:bg-[var(--accent-color)] hover:text-white transition-all text-left"
              >
                {{ s }}
              </button>
            </div>
          </div>

          <div v-if="isTyping" class="flex justify-start">
            <div class="bg-white/5 border border-white/10 p-4 rounded-xl rounded-tl-none animate-pulse text-[10px] text-[var(--accent-color)] font-black uppercase tracking-widest">UdudBot lagi ngetik gais...</div>
          </div>
        </div>

        <form @submit.prevent="handleInput()" class="p-4 bg-black/50 border-t border-white/5 relative z-10">
          <div class="flex gap-2 bg-slate-900/50 border border-white/10 rounded-2xl p-1.5 focus-within:border-[var(--accent-color)]/50 transition-all">
            <input v-model="userInput" type="text" placeholder="Tanya soal anime gais..." class="flex-1 bg-transparent px-3 py-2 text-[12px] text-white outline-none placeholder:text-slate-600" :disabled="isTyping" />
            <button type="submit" :disabled="isTyping" class="bg-[var(--accent-color)] text-white w-9 h-9 rounded-xl hover:opacity-80 active:scale-90 transition-all disabled:opacity-50 shadow-lg shadow-[var(--accent-glow)]">
              <i class="fa-solid fa-paper-plane text-[11px]"></i>
            </button>
          </div>
        </form>
      </div>
    </transition>

    <button @click="isOpen = !isOpen" class="w-13 h-13 md:w-14 md:h-14 bg-[var(--accent-color)] text-white rounded-2xl shadow-2xl flex items-center justify-center hover:opacity-90 transition-all active:scale-90 border border-white/10 group relative shadow-[var(--accent-glow)]">
      <i class="fa-solid fa-robot text-xl z-10"></i>
      <div class="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full"></div>
    </button>
  </div>
</template>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); }

.prose-mini :deep(ul), .prose-mini :deep(ol) { margin-left: 1.25rem; margin-top: 0.5rem; margin-bottom: 0.5rem; list-style-type: disc; }
.prose-mini :deep(li) { margin-bottom: 0.25rem; }
.prose-mini :deep(p) { margin-bottom: 0.5rem; }
.prose-mini :deep(p:last-child) { margin-bottom: 0; }

.custom-scroll::-webkit-scrollbar { width: 4px; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
.custom-scroll::-webkit-scrollbar-thumb:hover { background: var(--accent-color); }
</style>
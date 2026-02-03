<template>
  <div class="space-y-2 w-full group">
    <label 
      v-if="label" 
      class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-[var(--accent-color)] transition-colors"
    >
      {{ label }}
    </label>

    <div class="relative">
      <div 
        v-if="icon" 
        class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--accent-color)] transition-colors text-sm"
      >
        <i :class="icon"></i>
      </div>

      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :type="type"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :class="[
          'w-full bg-slate-800/40 border rounded-2xl py-3.5 sm:py-4 transition-all outline-none placeholder:text-slate-600 font-medium text-sm text-white',
          icon ? 'pl-12' : 'pl-6',
          showPasswordToggle ? 'pr-12' : 'pr-6',
          error 
            ? 'border-red-500/50 focus:ring-2 focus:ring-red-500/20' 
            : 'border-white/5 focus:ring-2 focus:ring-[var(--accent-glow)] focus:border-[var(--accent-color)]'
        ]"
      />

      <button 
        v-if="showPasswordToggle"
        type="button"
        @click="$emit('togglePassword')"
        class="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-[var(--accent-color)] transition-colors"
      >
        <i :class="['fa-solid', isPasswordVisible ? 'fa-eye-slash' : 'fa-eye']"></i>
      </button>
    </div>

    <transition name="slide-fade">
      <p v-if="error" class="text-[9px] font-black text-red-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
        <i class="fa-solid fa-circle-exclamation"></i>
        {{ error }}
      </p>
    </transition>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  icon: String,
  error: String,
  autocomplete: String,
  showPasswordToggle: Boolean,
  isPasswordVisible: Boolean
});

defineEmits(['update:modelValue', 'togglePassword']);
</script>

<style scoped>
.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1); }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateX(10px); opacity: 0; }
</style>
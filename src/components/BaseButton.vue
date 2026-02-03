<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
    :class="[
      'relative flex items-center justify-center gap-3 transition-all duration-300 font-black uppercase tracking-widest active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group',
      variantClasses,
      sizeClasses,
      roundedClasses
    ]"
  >
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

    <i v-if="loading" class="fa-solid fa-circle-notch animate-spin text-lg"></i>
    
    <slot name="icon-left"></slot>

    <span :class="{ 'opacity-0': loading }">
      <slot>Button</slot>
    </span>

    <slot name="icon-right"></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' }, // primary, secondary, danger, ghost
  size: { type: String, default: 'md' },        // sm, md, lg
  rounded: { type: String, default: '2xl' },    // xl, 2xl, full
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  glow: { type: Boolean, default: true }
});

defineEmits(['click']);

// --- PERANCANGAN IDENTIFIKASI VISUAL GAIS ---
const variantClasses = computed(() => {
  const base = {
    primary: 'bg-[var(--accent-color)] text-white hover:opacity-90',
    secondary: 'bg-slate-800 text-slate-300 border border-white/5 hover:bg-slate-700 hover:text-white',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'bg-transparent text-slate-400 hover:text-[var(--accent-color)] hover:bg-[var(--accent-bg)]'
  };

  const glowEffect = props.glow && props.variant === 'primary' 
    ? 'shadow-xl shadow-[var(--accent-glow)]' 
    : '';

  return `${base[props.variant]} ${glowEffect}`;
});

const sizeClasses = computed(() => {
  return {
    sm: 'px-4 py-2 text-[8px] sm:text-[9px]',
    md: 'px-6 py-3.5 text-[10px] sm:text-xs',
    lg: 'px-10 py-5 text-xs sm:text-sm'
  }[props.size];
});

const roundedClasses = computed(() => {
  return {
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full'
  }[props.rounded];
});
</script>
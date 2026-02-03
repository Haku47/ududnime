<template>
  <div 
    :class="[
      'inline-flex items-center gap-1.5 font-black uppercase tracking-[0.15em] transition-all duration-300',
      variantClasses,
      sizeClasses,
      roundedClasses,
      glow ? 'shadow-badge' : ''
    ]"
    :style="glow ? { '--badge-glow': glowColor } : {}"
  >
    <slot name="icon"></slot>
    
    <slot>Badge</slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // primary, success, warning, danger, glass gais
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },    // xs, sm, md
  rounded: { type: String, default: 'lg' }, // md, lg, full
  glow: { type: Boolean, default: false }
});

const variantClasses = computed(() => {
  return {
    primary: 'bg-[var(--accent-bg)] text-[var(--accent-color)] border border-[var(--accent-color)]/20',
    success: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    danger: 'bg-red-500/10 text-red-500 border border-red-500/20',
    glass: 'bg-white/5 backdrop-blur-md text-slate-300 border border-white/10'
  }[props.variant];
});

const sizeClasses = computed(() => {
  return {
    xs: 'px-2 py-0.5 text-[7px]',
    sm: 'px-2.5 py-1 text-[8px]',
    md: 'px-3 py-1.5 text-[9px]'
  }[props.size];
});

const roundedClasses = computed(() => {
  return {
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  }[props.rounded];
});

// Otomatis nyesuain warna glow gais
const glowColor = computed(() => {
  const colors = {
    primary: 'var(--accent-color)',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    glass: '#ffffff'
  };
  return colors[props.variant];
});
</script>

<style scoped>
.shadow-badge {
  box-shadow: 0 0 10px -2px var(--badge-glow);
}
</style>
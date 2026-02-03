<template>
  <div 
    class="inline-flex items-center justify-center transition-all duration-300"
    :class="[
      sizeClasses,
      glow ? 'shadow-icon' : '',
      wrapperClass
    ]"
    :style="glow ? { color: color || 'var(--accent-color)', '--icon-glow': color || 'var(--accent-color)' } : { color: color }"
  >
    <i :class="[icon, 'leading-none']"></i>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // Nama class FontAwesome, misal: 'fa-solid fa-user' gais
  icon: { type: String, required: true },
  
  // sm (12px), md (16px), lg (24px), xl (32px) gais
  size: { type: String, default: 'md' },
  
  // Custom hex color gais, kalau kosong ikut CSS Variable gais
  color: { type: String, default: '' },
  
  // Efek neon glow gais!
  glow: { type: Boolean, default: false },
  
  // Tambahan class buat wrapper gais
  wrapperClass: { type: String, default: '' }
});

const sizeClasses = computed(() => {
  return {
    xs: 'text-[10px]',
    sm: 'text-xs',
    md: 'text-base',
    lg: 'text-2xl',
    xl: 'text-4xl',
    '2xl': 'text-6xl'
  }[props.size];
});
</script>

<style scoped>
.shadow-icon {
  /* Efek drop-shadow lebih mbois buat icon daripada box-shadow gais */
  filter: drop-shadow(0 0 8px var(--icon-glow));
}
</style>
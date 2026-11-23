<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  align: {
    type: String,
    default: 'left',
    validator: (val) => ['left', 'center', 'right'].includes(val),
  },
})
</script>

<template>
  <div
    :class="[
      'mb-6 sm:mb-8',
      align === 'center' ? 'text-center flex flex-col items-center' : '',
      align === 'right' ? 'text-right flex flex-col items-end' : '',
    ]"
  >
    <p v-if="subtitle" class="text-xs sm:text-sm font-bold text-primary uppercase tracking-wider mb-1">
      {{ subtitle }}
    </p>

    <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
      {{ title }}
    </h2>

    <!-- Garis kuning kecil khas identitas KWT Kartini -->
    <div class="w-12 h-1.5 bg-accent rounded-full mt-2" />
  </div>
</template>

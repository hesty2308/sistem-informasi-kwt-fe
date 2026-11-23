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
})
</script>

<template>
  <div class="relative bg-primary-dark text-white overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24">
    <!-- Decorative Glow Circles -->
    <div class="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
    <div class="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 text-center">
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">
        {{ title }}
      </h1>

      <p
        v-if="subtitle"
        class="text-white/85 text-base max-w-2xl mx-auto leading-relaxed font-light"
      >
        {{ subtitle }}
      </p>
    </div>

    <!-- Bawah Melengkung (Socin Curve Shape Divider) -->
    <div class="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10 pointer-events-none">
      <svg
        class="relative block w-full h-8 sm:h-12 lg:h-14"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z"
          fill="currentColor"
          class="text-surface"
        />
      </svg>
    </div>
  </div>
</template>

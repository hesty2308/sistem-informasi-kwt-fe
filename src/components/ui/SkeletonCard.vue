<script setup>
import BaseCard from './BaseCard.vue'
</script>

<template>
  <BaseCard :hoverable="false" :padding="false" class="animate-pulse flex flex-col">
    <!-- Image placeholder -->
    <div class="relative w-full aspect-[16/10] bg-gray-200">
      <!-- Category badge skeleton -->
      <div class="absolute top-3.5 left-3.5 w-20 h-6 bg-gray-300 rounded-full" />

      <!-- Date badge skeleton (corner) -->
      <div class="absolute bottom-3 right-3 w-14 h-12 bg-gray-300 rounded-xl" />
    </div>

    <!-- Content padding -->
    <div class="p-5 flex-1 flex flex-col justify-between">
      <div>
        <!-- Title lines -->
        <div class="w-full h-5 bg-gray-200 rounded-md mb-2" />
        <div class="w-3/4 h-5 bg-gray-200 rounded-md mb-4" />

        <!-- Excerpt lines -->
        <div class="w-full h-3.5 bg-gray-100 rounded-md mb-2" />
        <div class="w-5/6 h-3.5 bg-gray-100 rounded-md" />
      </div>

      <!-- Footer / link skeleton -->
      <div class="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div class="w-24 h-4 bg-gray-200 rounded-md" />
        <div class="w-6 h-6 bg-gray-200 rounded-full" />
      </div>
    </div>
  </BaseCard>
</template>

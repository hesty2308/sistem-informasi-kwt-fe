<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ToastContainer from '@/components/ui/ToastContainer.vue'

const authStore = useAuthStore()

onMounted(() => {
  if (!authStore.isInitialized) {
    authStore.fetchMe()
  }
})
</script>

<template>
  <RouterView />
  <ToastContainer />
</template>

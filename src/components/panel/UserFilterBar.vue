<script setup>
import BaseSelect from '@/components/ui/BaseSelect.vue'
import { Search } from 'lucide-vue-next'

const searchQuery = defineModel('search', { type: String, default: '' })
const roleFilter = defineModel('role', { type: String, default: '' })

const roleFilterOptions = [
  { value: '', label: 'Semua Peran' },
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
]
</script>

<template>
  <!-- Search & role filter bar -->
  <div class="bg-white rounded-2xl p-4 shadow-card border border-secondary/20 mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
    <div class="relative w-full sm:w-72">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari nama atau email..."
        class="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <Search class="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
    </div>

    <div class="w-full sm:w-56">
      <BaseSelect
        v-model="roleFilter"
        :options="roleFilterOptions"
        class="text-xs sm:text-sm"
      />
    </div>
  </div>
</template>

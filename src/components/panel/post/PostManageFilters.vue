<script setup>
import { Search, X } from 'lucide-vue-next'

const searchInput = defineModel('search', { type: String, default: '' })
const selectedCategory = defineModel('category', { type: [String, Number], default: '' })
const selectedStatus = defineModel('status', { type: String, default: '' })

defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['search', 'clear-search'])
</script>

<template>
  <!-- Filter & search toolbar card -->
  <div class="bg-white rounded-3xl p-5 sm:p-6 shadow-card border border-secondary/20 mb-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
      <!-- Kolom Pencarian (6 Kolom) -->
      <div class="sm:col-span-2 lg:col-span-6 relative">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        <input
          v-model="searchInput"
          type="text"
          placeholder="Cari judul atau ringkasan kegiatan..."
          @keyup.enter="$emit('search')"
          class="w-full pl-10 pr-9 py-2.5 rounded-xl border border-secondary/20 bg-surface text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-secondary transition"
        />
        <button
          v-if="searchInput"
          type="button"
          @click="$emit('clear-search')"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Filter Kategori (3 Kolom) -->
      <div class="lg:col-span-3">
        <select
          v-model="selectedCategory"
          class="w-full px-3 py-2.5 rounded-xl border border-secondary/20 bg-surface text-sm text-ink font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-secondary transition"
        >
          <option value="">Semua Kategori</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- Filter Status (3 Kolom) -->
      <div class="lg:col-span-3">
        <select
          v-model="selectedStatus"
          class="w-full px-3 py-2.5 rounded-xl border border-secondary/20 bg-surface text-sm text-ink font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-secondary transition"
        >
          <option value="">Semua Status</option>
          <option value="published">Terbit (Publik)</option>
          <option value="draft">Draf (Disimpan)</option>
        </select>
      </div>
    </div>
  </div>
</template>

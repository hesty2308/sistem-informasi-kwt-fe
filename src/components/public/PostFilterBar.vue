<script setup>
import { computed } from 'vue'
import { Search, X } from 'lucide-vue-next'

const searchInput = defineModel('search', { type: String, default: '' })

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  selectedCategory: {
    type: String,
    default: '',
  },
  activeSearch: {
    type: String,
    default: '',
  },
  totalPosts: {
    type: Number,
    default: 0,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['search-input', 'clear-search', 'select-category', 'reset'])

const selectedCategoryName = computed(
  () => props.categories.find((c) => c.slug === props.selectedCategory)?.name || props.selectedCategory
)
</script>

<template>
  <!-- Filter & search bar -->
  <div class="bg-white rounded-3xl p-5 sm:p-6 shadow-card border border-secondary/20 mb-8 sm:mb-10">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <!-- Kolom Pencarian (Debounce 400ms) -->
      <div class="relative w-full lg:max-w-md">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        <input
          v-model="searchInput"
          type="text"
          placeholder="Cari kegiatan..."
          aria-label="Cari kegiatan"
          @input="$emit('search-input', $event.target.value)"
          class="w-full pl-11 pr-10 py-3 rounded-full bg-surface border border-secondary/20 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-secondary transition-all"
        />
        <button
          v-if="searchInput"
          type="button"
          aria-label="Hapus pencarian"
          @click="$emit('clear-search')"
          class="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink rounded-full hover:bg-gray-200 transition"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Tombol-Pil Kategori -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          @click="$emit('select-category', '')"
          class="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          :class="[
            selectedCategory === ''
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface text-ink/80 hover:bg-white hover:text-primary border border-secondary/20'
          ]"
        >
          Semua
        </button>

        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          @click="$emit('select-category', cat.slug)"
          class="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5"
          :class="[
            selectedCategory === cat.slug
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface text-ink/80 hover:bg-white hover:text-primary border border-secondary/20'
          ]"
        >
          <span>{{ cat.name }}</span>
          <span
            v-if="cat.posts_count !== undefined"
            class="text-[10px] px-1.5 py-0.5 rounded-full"
            :class="selectedCategory === cat.slug ? 'bg-white/20 text-white' : 'bg-secondary/15 text-primary'"
          >
            {{ cat.posts_count }}
          </span>
        </button>
      </div>
    </div>

    <!-- Keterangan Hasil Filter -->
    <div
      v-if="!isLoading && (activeSearch || selectedCategory)"
      class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-muted"
    >
      <div>
        Menampilkan hasil untuk:
        <span v-if="activeSearch" class="font-bold text-ink">"{{ activeSearch }}"</span>
        <span v-if="activeSearch && selectedCategory"> pada kategori </span>
        <span v-if="selectedCategory" class="font-bold text-primary capitalize">
          {{ selectedCategoryName }}
        </span>
        (Ditemukan {{ totalPosts }} kegiatan)
      </div>

      <button
        type="button"
        @click="$emit('reset')"
        class="text-primary hover:underline font-semibold cursor-pointer"
      >
        Reset Filter
      </button>
    </div>
  </div>
</template>

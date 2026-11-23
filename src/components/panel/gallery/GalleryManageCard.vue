<script setup>
import StatusBadge from '@/components/panel/StatusBadge.vue'
import { ArrowUp, ArrowDown, Eye, EyeOff, Edit3, Trash2 } from 'lucide-vue-next'

defineProps({
  item: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  isLast: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['move', 'toggle-visibility', 'edit', 'delete'])
</script>

<template>
  <div class="bg-surface rounded-2xl overflow-hidden border border-secondary/20 shadow-xs flex flex-col justify-between">
    <!-- Media Thumbnail -->
    <div class="relative aspect-[16/10] bg-gray-200 overflow-hidden">
      <img
        :src="item.image_url"
        :alt="item.title"
        class="w-full h-full object-cover"
      />

      <!-- Visibility Status Badge Overlay -->
      <div class="absolute top-3 left-3 z-10">
        <StatusBadge
          :status="item.is_visible ? 'active' : 'inactive'"
          :label="item.is_visible ? 'Tampil' : 'Sembunyi'"
        />
      </div>

      <!-- Sort Order Badge Overlay -->
      <div class="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono font-bold">
        #{{ index + 1 }}
      </div>
    </div>

    <!-- Metadata Info -->
    <div class="p-4 flex-grow flex flex-col justify-between">
      <div>
        <h3 class="font-bold text-sm text-ink line-clamp-1 mb-1">
          {{ item.title }}
        </h3>
        <p v-if="item.caption" class="text-xs text-muted line-clamp-2 leading-relaxed">
          {{ item.caption }}
        </p>
        <p v-else class="text-xs text-muted italic">
          Tanpa keterangan
        </p>
      </div>

      <!-- Control Bar (Urutan, Tampil/Sembunyi, Ubah, Hapus) -->
      <div class="pt-4 mt-3 border-t border-secondary/15 flex items-center justify-between gap-1">
        <!-- Reorder Buttons -->
        <div class="flex items-center gap-1">
          <button
            type="button"
            title="Geser Naik"
            :disabled="index === 0"
            @click="$emit('move', -1)"
            class="p-1.5 rounded-lg bg-white border border-secondary/20 text-ink/70 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <ArrowUp class="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Geser Turun"
            :disabled="isLast"
            @click="$emit('move', 1)"
            class="p-1.5 rounded-lg bg-white border border-secondary/20 text-ink/70 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <ArrowDown class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Action Controls -->
        <div class="flex items-center gap-1">
          <!-- Toggle Visibility -->
          <button
            type="button"
            :title="item.is_visible ? 'Sembunyikan dari Publik' : 'Tampilkan ke Publik'"
            @click="$emit('toggle-visibility')"
            class="p-1.5 rounded-lg bg-white border border-secondary/20 transition cursor-pointer"
            :class="item.is_visible ? 'text-primary hover:bg-green-50' : 'text-muted hover:bg-gray-100'"
          >
            <Eye v-if="item.is_visible" class="w-3.5 h-3.5" />
            <EyeOff v-else class="w-3.5 h-3.5 text-red-500" />
          </button>

          <!-- Edit Metadata -->
          <button
            type="button"
            title="Ubah Judul &amp; Keterangan"
            @click="$emit('edit')"
            class="p-1.5 rounded-lg bg-white border border-secondary/20 text-ink/70 hover:text-primary hover:bg-surface transition cursor-pointer"
          >
            <Edit3 class="w-3.5 h-3.5" />
          </button>

          <!-- Delete -->
          <button
            type="button"
            title="Hapus Foto"
            @click="$emit('delete')"
            class="p-1.5 rounded-lg bg-white border border-secondary/20 text-ink/70 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getInitials } from '@/utils/initials'
import { ArrowUp, ArrowDown, Pencil, Trash2, Eye, EyeOff } from 'lucide-vue-next'

const props = defineProps({
  member: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  busy: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['edit', 'toggle', 'move', 'delete'])

const photo = computed(() => props.member.thumb_url || props.member.photo_url || '')

const iconButtonClass =
  'inline-flex items-center justify-center w-11 h-11 rounded-xl border border-secondary/30 text-primary hover:bg-surface transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed'
</script>

<template>
  <li
    class="p-4 rounded-2xl border bg-white transition-colors duration-200 flex flex-col sm:flex-row sm:items-center gap-3"
    :class="member.is_active ? 'border-secondary/30' : 'border-dashed border-muted/40 bg-surface'"
    data-testid="board-member-row"
  >
    <div class="flex items-center gap-3 flex-1 min-w-0">
      <div class="w-14 h-14 rounded-full overflow-hidden bg-surface border-2 border-secondary/30 shrink-0">
        <img v-if="photo" :src="photo" :alt="`Foto ${member.name}`" class="w-full h-full object-cover" />
        <span v-else class="w-full h-full flex items-center justify-center font-black text-primary">
          {{ getInitials(member.name) }}
        </span>
      </div>
      <div class="min-w-0">
        <p class="text-base font-semibold text-ink break-words" :class="{ 'text-muted': !member.is_active }">
          {{ member.name }}
        </p>
        <p class="text-sm text-primary font-semibold">{{ member.position }}</p>
        <span
          v-if="!member.is_active"
          class="inline-block mt-1 px-2 py-0.5 rounded-full bg-white border border-muted/30 text-xs font-semibold text-muted"
        >
          Disembunyikan dari halaman publik
        </span>
      </div>
    </div>

    <div class="flex flex-wrap gap-2 sm:shrink-0">
      <button
        type="button"
        :class="iconButtonClass"
        :disabled="busy || index === 0"
        title="Naikkan urutan"
        aria-label="Naikkan urutan"
        @click="emit('move', -1)"
      >
        <ArrowUp class="w-4 h-4" />
      </button>
      <button
        type="button"
        :class="iconButtonClass"
        :disabled="busy || index === total - 1"
        title="Turunkan urutan"
        aria-label="Turunkan urutan"
        @click="emit('move', 1)"
      >
        <ArrowDown class="w-4 h-4" />
      </button>
      <button
        type="button"
        :class="iconButtonClass"
        :disabled="busy"
        :title="member.is_active ? 'Sembunyikan dari publik' : 'Tampilkan di publik'"
        :aria-label="member.is_active ? 'Sembunyikan dari publik' : 'Tampilkan di publik'"
        @click="emit('toggle')"
      >
        <EyeOff v-if="member.is_active" class="w-4 h-4" />
        <Eye v-else class="w-4 h-4" />
      </button>
      <button type="button" :class="iconButtonClass" :disabled="busy" title="Ubah pengurus" aria-label="Ubah pengurus" @click="emit('edit')">
        <Pencil class="w-4 h-4" />
      </button>
      <button
        type="button"
        :class="[iconButtonClass, 'text-red-600 border-red-200 hover:bg-red-50']"
        :disabled="busy"
        title="Hapus pengurus"
        aria-label="Hapus pengurus"
        @click="emit('delete')"
      >
        <Trash2 class="w-4 h-4" />
      </button>
    </div>
  </li>
</template>

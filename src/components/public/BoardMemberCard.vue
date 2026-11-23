<script setup>
import { computed } from 'vue'
import { getInitials } from '@/utils/initials'

const props = defineProps({
  member: {
    type: Object,
    required: true,
  },
})

const photo = computed(() => props.member.thumb_url || props.member.photo_url || '')
const initials = computed(() => getInitials(props.member.name))
</script>

<template>
  <article
    class="h-full bg-white rounded-3xl border border-secondary/20 shadow-card p-6 flex flex-col items-center text-center motion-safe:transition-all motion-safe:duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    data-testid="board-member-card"
  >
    <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-secondary/30 bg-surface mb-4 shrink-0">
      <img
        v-if="photo"
        :src="photo"
        :alt="`Foto ${member.name}`"
        loading="lazy"
        class="w-full h-full object-cover"
      />
      <span
        v-else
        class="w-full h-full flex items-center justify-center text-3xl font-black text-primary"
        role="img"
        :aria-label="`Inisial ${member.name}`"
        data-testid="board-member-initials"
      >
        {{ initials }}
      </span>
    </div>

    <h3 class="text-lg font-bold text-ink leading-snug break-words">{{ member.name }}</h3>
    <span class="mt-2 inline-block px-3.5 py-1 rounded-full bg-primary text-white text-sm font-semibold">
      {{ member.position }}
    </span>
  </article>
</template>

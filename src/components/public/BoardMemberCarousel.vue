<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import BoardMemberCard from '@/components/public/BoardMemberCard.vue'
import { useAutoSlide } from '@/composables/useAutoSlide'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  members: {
    type: Array,
    required: true,
  },
  total: {
    type: Number,
    default: 0,
  },
  hasMore: {
    type: Boolean,
    default: false,
  },
  loadingMore: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['load-more'])

const trackRef = ref(null)
const activeIndex = ref(0)
const visibleCount = ref(1)
const step = ref(0)

const totalCount = computed(() => Math.max(props.total, props.members.length))
const maxIndex = computed(() => Math.max(0, props.members.length - visibleCount.value))
const canSlide = computed(() => props.members.length > visibleCount.value || props.hasMore)

const rangeLabel = computed(() => {
  const from = Math.min(activeIndex.value + 1, props.members.length)
  const to = Math.min(activeIndex.value + visibleCount.value, props.members.length)
  return from === to ? `${from} dari ${totalCount.value}` : `${from}–${to} dari ${totalCount.value}`
})

// Card width + gap, measured from the rendered track so it follows the responsive layout.
const measure = () => {
  const el = trackRef.value
  if (!el) return
  const first = el.children[0]
  const gap = parseFloat(window.getComputedStyle(el).columnGap) || 0
  step.value = first ? first.offsetWidth + gap : el.clientWidth
  visibleCount.value = step.value > 0 ? Math.max(1, Math.round((el.clientWidth + gap) / step.value)) : 1
}

const maybeLoadMore = () => {
  if (props.hasMore && !props.loadingMore && activeIndex.value + visibleCount.value >= props.members.length - 2) {
    emit('load-more')
  }
}

const { isRunning, isReducedMotion, pauseHandlers } = useAutoSlide(() => next(), { enabled: canSlide })

const goTo = (index) => {
  activeIndex.value = Math.min(Math.max(index, 0), maxIndex.value)
  trackRef.value?.scrollTo?.({
    left: activeIndex.value * step.value,
    behavior: isReducedMotion.value ? 'auto' : 'smooth',
  })
  maybeLoadMore()
}

const next = () => {
  if (activeIndex.value < maxIndex.value) {
    goTo(activeIndex.value + 1)
  } else if (props.hasMore) {
    emit('load-more')
  } else {
    goTo(0)
  }
}

const prev = () => {
  goTo(activeIndex.value > 0 ? activeIndex.value - 1 : maxIndex.value)
}

// Keep the index in sync when the user swipes or scrolls the track manually.
const onScroll = () => {
  if (!trackRef.value || step.value <= 0) return
  activeIndex.value = Math.min(Math.round(trackRef.value.scrollLeft / step.value), maxIndex.value)
  maybeLoadMore()
}

useResizeObserver(trackRef, measure)
onMounted(measure)
watch(() => props.members.length, () => nextTick(measure))

const navButtonClass =
  'inline-flex items-center justify-center w-11 h-11 rounded-full bg-white border border-secondary/40 text-primary shadow-xs hover:bg-surface motion-safe:transition-colors motion-safe:duration-200 disabled:opacity-40 disabled:cursor-not-allowed'
</script>

<template>
  <section aria-roledescription="carousel" aria-label="Daftar pengurus" v-on="pauseHandlers">
    <div
      ref="trackRef"
      class="flex gap-6 overflow-x-auto snap-x snap-mandatory py-2 -my-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      :aria-live="isRunning ? 'off' : 'polite'"
      data-testid="board-member-track"
      @scroll.passive="onScroll"
    >
      <div
        v-for="(member, idx) in members"
        :key="member.id"
        class="snap-start shrink-0 w-full sm:w-[calc((100%-1.5rem)/2)] md:w-[calc((100%-3rem)/3)] lg:w-[calc((100%-4.5rem)/4)]"
        role="group"
        aria-roledescription="slide"
        :aria-label="`${idx + 1} dari ${totalCount}`"
      >
        <BoardMemberCard :member="member" />
      </div>
    </div>

    <div v-if="canSlide" class="mt-6 flex items-center justify-center gap-4">
      <button
        type="button"
        :class="navButtonClass"
        aria-label="Pengurus sebelumnya"
        title="Sebelumnya"
        data-testid="carousel-prev"
        @click="prev"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>

      <p class="min-w-28 text-center text-base font-semibold text-muted" data-testid="carousel-range">
        {{ rangeLabel }}
      </p>

      <button
        type="button"
        :class="navButtonClass"
        aria-label="Pengurus berikutnya"
        title="Berikutnya"
        :disabled="loadingMore"
        data-testid="carousel-next"
        @click="next"
      >
        <ChevronRight class="w-5 h-5" />
      </button>
    </div>
  </section>
</template>

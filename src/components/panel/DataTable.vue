<script setup>
import { ref, computed } from 'vue'
import { ArrowUpDown, ArrowUp, ArrowDown, RefreshCw } from 'lucide-vue-next'
import EmptyState from '@/components/ui/EmptyState.vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  emptyText: {
    type: String,
    default: 'Belum ada data.',
  },
  rowKey: {
    type: String,
    default: 'id',
  },
})

const emit = defineEmits(['sort'])

const sortKey = ref('')
const sortOrder = ref('asc') // 'asc' | 'desc'

const handleSort = (column) => {
  if (!column.sortable) return

  if (sortKey.value === column.key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = column.key
    sortOrder.value = 'asc'
  }

  emit('sort', { key: sortKey.value, order: sortOrder.value })
}

// Internal sorting if parent does not handle server-side sorting
const sortedItems = computed(() => {
  if (!sortKey.value) return props.items

  return [...props.items].sort((a, b) => {
    let aVal = a[sortKey.value]
    let bVal = b[sortKey.value]

    if (aVal === undefined || aVal === null) aVal = ''
    if (bVal === undefined || bVal === null) bVal = ''

    if (typeof aVal === 'string') {
      return sortOrder.value === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }

    return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal
  })
})
</script>

<template>
  <div class="w-full">
    <!-- 1. Loading Overlay -->
    <div
      v-if="loading"
      class="py-12 flex flex-col items-center justify-center gap-3 text-muted"
    >
      <RefreshCw class="w-6 h-6 animate-spin text-primary" />
      <span class="text-sm font-medium">Memuat data...</span>
    </div>

    <!-- 2. Empty State -->
    <div
      v-else-if="items.length === 0"
      class="py-8 bg-white rounded-2xl border border-secondary/20 shadow-xs"
    >
      <EmptyState
        :title="emptyText"
        description="Data yang Anda cari belum tersedia di dalam tabel ini."
      />
    </div>

    <div v-else>
      <!-- 3. Desktop Table View (>= 768px) -->
      <div class="hidden md:block overflow-x-auto rounded-2xl border border-secondary/20 bg-white shadow-xs">
        <table class="w-full text-left text-sm text-ink border-collapse">
          <thead class="bg-surface text-muted text-xs uppercase font-extrabold tracking-wider border-b border-secondary/20 select-none">
            <tr>
              <th
                v-for="col in columns"
                :key="col.key"
                scope="col"
                class="px-5 py-4"
                :class="[
                  col.class || '',
                  col.sortable ? 'cursor-pointer hover:text-primary transition-colors' : ''
                ]"
                @click="handleSort(col)"
              >
                <div class="inline-flex items-center gap-1.5">
                  <span>{{ col.label }}</span>
                  <template v-if="col.sortable">
                    <ArrowUp v-if="sortKey === col.key && sortOrder === 'asc'" class="w-3.5 h-3.5 text-primary" />
                    <ArrowDown v-else-if="sortKey === col.key && sortOrder === 'desc'" class="w-3.5 h-3.5 text-primary" />
                    <ArrowUpDown v-else class="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                  </template>
                </div>
              </th>

              <th v-if="$slots.actions" scope="col" class="px-5 py-4 text-right">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 font-medium">
            <tr
              v-for="item in sortedItems"
              :key="item[rowKey] || item.id"
              class="hover:bg-surface/50 transition-colors"
            >
              <td
                v-for="col in columns"
                :key="col.key"
                class="px-5 py-4 align-middle"
                :class="col.class || ''"
              >
                <!-- Custom Cell Slot -->
                <slot :name="`cell-${col.key}`" :item="item" :value="item[col.key]">
                  {{ item[col.key] !== undefined && item[col.key] !== null ? item[col.key] : '-' }}
                </slot>
              </td>

              <!-- Actions Slot -->
              <td v-if="$slots.actions" class="px-5 py-4 text-right align-middle">
                <slot name="actions" :item="item" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 4. Mobile Stacked Cards View (< 768px) -->
      <div class="md:hidden flex flex-col gap-3.5">
        <div
          v-for="item in sortedItems"
          :key="item[rowKey] || item.id"
          class="bg-white rounded-2xl p-4 sm:p-5 border border-secondary/20 shadow-xs flex flex-col gap-3"
        >
          <div
            v-for="col in columns"
            :key="col.key"
            class="flex items-center justify-between gap-3 text-xs sm:text-sm border-b border-gray-50 pb-2 last:border-b-0 last:pb-0"
          >
            <span class="font-bold text-muted uppercase tracking-wider text-[11px]">
              {{ col.mobileLabel || col.label }}
            </span>
            <div class="text-right font-medium text-ink">
              <slot :name="`cell-${col.key}`" :item="item" :value="item[col.key]">
                {{ item[col.key] !== undefined && item[col.key] !== null ? item[col.key] : '-' }}
              </slot>
            </div>
          </div>

          <!-- Mobile Actions Slot -->
          <div v-if="$slots.actions" class="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <slot name="actions" :item="item" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

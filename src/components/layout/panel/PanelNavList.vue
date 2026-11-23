<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { settingNavEntries, settingSectionPath, SETTINGS_BASE_PATH } from '@/config/settingSections'
import {
  LayoutDashboard,
  FileText,
  Tag,
  Image as ImageIcon,
  User,
  Users,
  Sliders,
  History,
  ChevronDown,
  UserRound,
} from 'lucide-vue-next'

const props = defineProps({
  // Mobile drawer uses slightly tighter spacing than the desktop sidebar.
  mobile: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['navigate'])

const route = useRoute()
const authStore = useAuthStore()

// Menu Navigasi Admin
const adminNavItems = [
  { name: 'Dashboard', path: '/pengelola', icon: LayoutDashboard },
  { name: 'Kegiatan', path: '/pengelola/kegiatan', icon: FileText },
  { name: 'Kategori', path: '/pengelola/kategori', icon: Tag },
  { name: 'Galeri', path: '/pengelola/galeri', icon: ImageIcon },
  { name: 'Pengurus', path: '/pengelola/pengurus', icon: UserRound },
  { name: 'Profil Saya', path: '/pengelola/profil', icon: User },
]

// Menu Navigasi Khusus Super Admin ("Pengaturan Website" sits between them as a sub-menu group)
const usersNavItem = { name: 'Kelola Pengelola', path: '/pengelola/super/pengguna', icon: Users }
const activityNavItem = { name: 'Riwayat Aktivitas', path: '/pengelola/super/aktivitas', icon: History }

// Unique per instance: the desktop sidebar and the mobile drawer can both be in the DOM.
const submenuId = computed(() => (props.mobile ? 'panel-settings-submenu-mobile' : 'panel-settings-submenu'))

// Active link helper
const isItemActive = (path) => {
  if (path === '/pengelola') {
    return route.path === '/pengelola'
  }
  return route.path.startsWith(path)
}

const isInSettings = computed(() => route.path.startsWith(SETTINGS_BASE_PATH))

// Settings group opens automatically while a settings sub-page is shown.
const isSettingsOpen = ref(isInSettings.value)
watch(isInSettings, (inside) => {
  if (inside) isSettingsOpen.value = true
})

// Nested groups inside "Pengaturan Website" (e.g. "Tentang"): open while one of their pages is shown.
const isGroupActive = (group) => group.sections.some((section) => route.path === settingSectionPath(section.slug))
const openGroups = ref(
  Object.fromEntries(
    settingNavEntries.filter((entry) => entry.type === 'group').map((group) => [group.key, isGroupActive(group)])
  )
)
watch(
  () => route.path,
  () => {
    for (const entry of settingNavEntries) {
      if (entry.type === 'group' && isGroupActive(entry)) openGroups.value[entry.key] = true
    }
  }
)

const subLinkClass = (section) => [
  'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition',
  route.path === settingSectionPath(section.slug)
    ? 'bg-white/15 text-white font-bold'
    : 'text-white/85 hover:bg-white/10 hover:text-white font-medium',
]

const linkClass = (active) => [
  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold',
  props.mobile ? 'transition' : 'transition-all',
  active
    ? 'bg-white/15 text-white border-l-4 border-accent shadow-xs'
    : 'text-white/80 hover:bg-white/10 hover:text-white',
]
</script>

<template>
  <div class="flex-grow overflow-y-auto px-4 space-y-1" :class="mobile ? 'py-4' : 'py-5'">
    <!-- Main Admin Items -->
    <router-link
      v-for="item in adminNavItems"
      :key="item.path"
      :to="item.path"
      :class="linkClass(isItemActive(item.path))"
      @click="$emit('navigate')"
    >
      <component :is="item.icon" class="w-5 h-5 shrink-0" />
      <span>{{ item.name }}</span>
    </router-link>

    <!-- Super admin section (only visible to super_admin) -->
    <template v-if="authStore.isSuperAdmin">
      <div class="pb-2 px-3" :class="mobile ? 'pt-5' : 'pt-6'">
        <span
          class="font-extrabold tracking-wider text-accent uppercase block"
          :class="mobile ? 'text-[10px]' : 'text-[11px]'"
        >
          Pengaturan Super Admin
        </span>
      </div>

      <router-link
        :to="usersNavItem.path"
        :class="linkClass(isItemActive(usersNavItem.path))"
        @click="$emit('navigate')"
      >
        <component :is="usersNavItem.icon" class="w-5 h-5 shrink-0" />
        <span>{{ usersNavItem.name }}</span>
      </router-link>

      <!-- Pengaturan Website: expandable group with one link per settings section -->
      <div>
        <button
          type="button"
          :class="[linkClass(isInSettings && !isSettingsOpen), 'w-full text-left cursor-pointer']"
          :aria-expanded="isSettingsOpen"
          :aria-controls="submenuId"
          data-testid="settings-group-toggle"
          @click="isSettingsOpen = !isSettingsOpen"
        >
          <Sliders class="w-5 h-5 shrink-0" />
          <span class="flex-grow">Pengaturan Website</span>
          <ChevronDown class="w-4 h-4 shrink-0 transition-transform" :class="{ 'rotate-180': isSettingsOpen }" />
        </button>

        <div
          v-show="isSettingsOpen"
          :id="submenuId"
          class="mt-1 ml-5 pl-3 border-l border-white/15 space-y-0.5"
        >
          <template v-for="entry in settingNavEntries" :key="entry.key">
            <router-link
              v-if="entry.type === 'link'"
              :to="settingSectionPath(entry.section.slug)"
              data-testid="settings-subitem"
              :class="subLinkClass(entry.section)"
              @click="$emit('navigate')"
            >
              <component :is="entry.section.icon" class="w-4 h-4 shrink-0" />
              <span>{{ entry.section.label }}</span>
            </router-link>

            <!-- Nested group (e.g. "Tentang" → Identitas, Visi & Misi, Sejarah, Pengurus) -->
            <div v-else>
              <button
                type="button"
                class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition cursor-pointer"
                :class="
                  isGroupActive(entry) && !openGroups[entry.key]
                    ? 'bg-white/15 text-white font-bold'
                    : 'text-white/85 hover:bg-white/10 hover:text-white font-medium'
                "
                :aria-expanded="!!openGroups[entry.key]"
                :aria-controls="`${submenuId}-${entry.key}`"
                data-testid="settings-subgroup-toggle"
                @click="openGroups[entry.key] = !openGroups[entry.key]"
              >
                <FileText class="w-4 h-4 shrink-0" />
                <span class="flex-grow">{{ entry.label }}</span>
                <ChevronDown
                  class="w-4 h-4 shrink-0 transition-transform"
                  :class="{ 'rotate-180': openGroups[entry.key] }"
                />
              </button>
              <div
                v-show="openGroups[entry.key]"
                :id="`${submenuId}-${entry.key}`"
                class="mt-0.5 ml-4 pl-3 border-l border-white/15 space-y-0.5"
              >
                <router-link
                  v-for="section in entry.sections"
                  :key="section.slug"
                  :to="settingSectionPath(section.slug)"
                  data-testid="settings-subitem"
                  :class="subLinkClass(section)"
                  @click="$emit('navigate')"
                >
                  <component :is="section.icon" class="w-4 h-4 shrink-0" />
                  <span>{{ section.label }}</span>
                </router-link>
              </div>
            </div>
          </template>
        </div>
      </div>

      <router-link
        :to="activityNavItem.path"
        :class="linkClass(isItemActive(activityNavItem.path))"
        @click="$emit('navigate')"
      >
        <component :is="activityNavItem.icon" class="w-5 h-5 shrink-0" />
        <span>{{ activityNavItem.name }}</span>
      </router-link>
    </template>
  </div>
</template>

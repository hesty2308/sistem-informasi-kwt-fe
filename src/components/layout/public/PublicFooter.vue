<script setup>
import { useSettingsStore } from '@/stores/settings'
import { usePublicNav } from '@/composables/usePublicNav'
import { Phone, Facebook, MapPin, Mail, ChevronRight } from 'lucide-vue-next'

const settingsStore = useSettingsStore()
const { navLinks, aboutSubLinks } = usePublicNav()

const currentYear = new Date().getFullYear()
</script>

<template>
  <!-- Blue footer (brand-blue) -->
  <footer class="bg-brand-blue text-white mt-auto pt-16 pb-8 border-t-4 border-accent">
    <div class="max-w-7xl mx-auto px-4 sm:px-8">
      <!-- 3 Kolom Utama -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/15">
        <!-- Kolom 1: Logo & Deskripsi (5 cols) -->
        <div class="md:col-span-5 flex flex-col items-start">
          <div class="flex items-center gap-3 mb-4">
            <img
              v-if="settingsStore.logoUrl"
              :src="settingsStore.logoUrl"
              alt="Logo Paguyuban KWT Kartini"
              class="h-14 w-14 object-contain rounded-full shadow-md bg-white p-1"
            />
            <div>
              <span class="block text-xl font-black text-white leading-tight">
                {{ settingsStore.siteName }}
              </span>
              <span class="block text-xs font-medium text-accent tracking-wider uppercase">
                {{ settingsStore.siteTagline }}
              </span>
            </div>
          </div>
          <p class="text-white/80 text-base leading-relaxed">
            {{ settingsStore.footerText }}
          </p>
        </div>

        <!-- Kolom 2: Tautan Cepat (3 cols) -->
        <div class="md:col-span-3">
          <h4 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-accent" />
            {{ settingsStore.pageTexts.footer_links_title }}
          </h4>
          <ul class="space-y-2 text-sm">
            <template v-for="link in navLinks" :key="link.path">
              <!-- Jika link Tentang, sertakan sub-tautannya -->
              <li v-if="link.path === '/tentang'" class="space-y-1.5">
                <div class="text-accent font-semibold flex items-center gap-1.5 pt-1">
                  <ChevronRight class="w-3.5 h-3.5 text-accent" />
                  <span>{{ link.name }}</span>
                </div>
                <ul class="pl-4 space-y-1.5">
                  <li v-for="sub in aboutSubLinks" :key="sub.path">
                    <router-link
                      :to="sub.path"
                      class="text-white/80 hover:text-accent transition-colors flex items-center gap-1.5 text-xs sm:text-sm"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-accent/60" />
                      <span>{{ sub.label || sub.name }}</span>
                    </router-link>
                  </li>
                </ul>
              </li>
              <!-- Link reguler lainnya -->
              <li v-else>
                <router-link
                  :to="link.path"
                  class="text-white/80 hover:text-accent transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight class="w-3.5 h-3.5 text-accent/70" />
                  <span>{{ link.name }}</span>
                </router-link>
              </li>
            </template>
          </ul>
        </div>

        <!-- Kolom 3: Hubungi Kami & Tombol Facebook (4 cols) -->
        <div class="md:col-span-4">
          <h4 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-accent" />
            {{ settingsStore.pageTexts.footer_contact_title }}
          </h4>
          <ul class="space-y-3 text-sm text-white/80 mb-6">
            <li v-if="settingsStore.address" class="flex items-start gap-2.5">
              <MapPin class="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>{{ settingsStore.address }}</span>
            </li>
            <li v-if="settingsStore.whatsappLink" class="flex items-center gap-2.5">
              <Phone class="w-4 h-4 text-accent shrink-0" />
              <a
                :href="settingsStore.whatsappLink"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-accent transition-colors"
              >
                {{ settingsStore.phoneWhatsApp }} (WhatsApp)
              </a>
            </li>
            <li v-if="settingsStore.email" class="flex items-center gap-2.5">
              <Mail class="w-4 h-4 text-accent shrink-0" />
              <a
                :href="`mailto:${settingsStore.email}`"
                class="hover:text-accent transition-colors"
              >
                {{ settingsStore.email }}
              </a>
            </li>
          </ul>

          <!-- Tombol Kuning: Kunjungi Facebook Kami -->
          <a
            :href="settingsStore.facebookUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-full bg-accent text-primary-dark font-extrabold hover:bg-yellow-400 active:scale-[0.99] transition shadow-md"
          >
            <Facebook class="w-5 h-5 fill-current text-primary-dark" />
            <span>{{ settingsStore.footerFacebookBtnText }}</span>
          </a>
        </div>
      </div>

      <!-- Baris Bawah: Hak Cipta -->
      <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
        <p class="text-center sm:text-left">
          &copy; {{ currentYear }} {{ settingsStore.siteName }}. {{ settingsStore.footerCopyright }}
        </p>
      </div>
    </div>
  </footer>
</template>

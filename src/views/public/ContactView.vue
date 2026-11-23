<script setup>
import { onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useSettingsStore } from '@/stores/settings'
import PublicLayout from '@/layouts/PublicLayout.vue'
import PageBanner from '@/components/public/PageBanner.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  ExternalLink,
  MessageCircle,
} from 'lucide-vue-next'

useHead({
  title: 'Hubungi Kami - Paguyuban KWT Kartini OKU Timur',
  meta: [
    {
      name: 'description',
      content:
        'Informasi kontak sekretariat, nomor WhatsApp, email, dan lokasi Paguyuban KWT Kartini Kabupaten OKU Timur.',
    },
    { property: 'og:title', content: 'Hubungi Kami - Paguyuban KWT Kartini OKU Timur' },
    {
      property: 'og:description',
      content: 'Informasi kontak sekretariat, nomor WhatsApp, email, dan lokasi Paguyuban KWT Kartini OKU Timur.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: typeof window !== 'undefined' ? window.location.origin + '/kontak' : '/kontak' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    { rel: 'canonical', href: typeof window !== 'undefined' ? window.location.origin + '/kontak' : '/kontak' },
  ],
})

const settingsStore = useSettingsStore()

onMounted(() => {
  settingsStore.fetchSettings()
})
</script>

<template>
  <PublicLayout>
    <!-- 1. Banner Melengkung -->
    <PageBanner
      :title="settingsStore.contactBannerTitle"
      :subtitle="settingsStore.contactBannerSubtitle"
    />

    <!-- 2. Konten Kontak & Peta -->
    <section class="py-14 sm:py-20 bg-surface min-h-[60vh]">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <!-- Kolom Informasi Kontak (5 Kolom) -->
          <div class="lg:col-span-5 flex flex-col gap-6">
            <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-secondary/20">
              <SectionTitle
                :title="settingsStore.contactSectionTitle"
                :subtitle="settingsStore.contactSectionSubtitle"
                class="mb-6"
              />

              <!-- Daftar Kontak -->
              <div class="space-y-6">
                <!-- Alamat -->
                <div v-if="settingsStore.address" class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-2xl bg-surface border border-secondary/30 flex items-center justify-center text-primary shrink-0 mt-1">
                    <MapPin class="w-5 h-5" />
                  </div>
                  <div>
                    <span class="block text-xs font-bold text-muted uppercase tracking-wider mb-0.5">
                      {{ settingsStore.pageTexts.contact_address_label }}
                    </span>
                    <p class="text-ink text-base leading-relaxed font-medium">
                      {{ settingsStore.address }}
                    </p>
                  </div>
                </div>

                <!-- WhatsApp -->
                <div v-if="settingsStore.whatsappLink" class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center text-green-700 shrink-0 mt-1">
                    <Phone class="w-5 h-5" />
                  </div>
                  <div>
                    <span class="block text-xs font-bold text-muted uppercase tracking-wider mb-0.5">
                      {{ settingsStore.pageTexts.contact_whatsapp_label }}
                    </span>
                    <p class="text-ink text-base font-semibold mb-2">
                      {{ settingsStore.phoneWhatsApp }}
                    </p>
                    <a
                      :href="settingsStore.whatsappLink"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-2 min-h-11 px-5 py-2 rounded-full bg-whatsapp text-ink font-bold text-sm hover:brightness-105 active:scale-95 transition shadow-xs"
                    >
                      <MessageCircle class="w-3.5 h-3.5 fill-current" />
                      <span>{{ settingsStore.pageTexts.contact_whatsapp_btn_text }}</span>
                      <ExternalLink class="w-3 h-3 text-white/80" />
                    </a>
                  </div>
                </div>

                <!-- Email -->
                <div v-if="settingsStore.email" class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-2xl bg-surface border border-secondary/30 flex items-center justify-center text-primary shrink-0 mt-1">
                    <Mail class="w-5 h-5" />
                  </div>
                  <div>
                    <span class="block text-xs font-bold text-muted uppercase tracking-wider mb-0.5">
                      {{ settingsStore.pageTexts.contact_email_label }}
                    </span>
                    <a
                      :href="`mailto:${settingsStore.email}`"
                      class="text-primary hover:text-primary-dark text-sm sm:text-base font-semibold break-all"
                    >
                      {{ settingsStore.email }}
                    </a>
                  </div>
                </div>

                <!-- Facebook -->
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-facebook shrink-0 mt-1">
                    <Facebook class="w-5 h-5" />
                  </div>
                  <div>
                    <span class="block text-xs font-bold text-muted uppercase tracking-wider mb-0.5">
                      {{ settingsStore.pageTexts.contact_social_label }}
                    </span>
                    <p class="text-ink text-base font-semibold mb-2">
                      {{ settingsStore.pageTexts.contact_facebook_name }}
                    </p>
                    <a
                      :href="settingsStore.facebookUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-2 min-h-11 px-5 py-2 rounded-full bg-facebook text-white font-bold text-sm hover:brightness-105 active:scale-95 transition shadow-xs"
                    >
                      <Facebook class="w-3.5 h-3.5 fill-current" />
                      <span>{{ settingsStore.pageTexts.contact_facebook_btn_text }}</span>
                      <ExternalLink class="w-3 h-3 text-white/80" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Kolom Peta Interaktif (7 Kolom) -->
          <div class="lg:col-span-7 flex flex-col">
            <div
              v-if="settingsStore.settings.maps_embed_url"
              class="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-secondary/20 flex-grow flex flex-col"
            >
              <div class="flex items-center justify-between mb-4">
                <SectionTitle
                  :title="settingsStore.contactMapTitle"
                  :subtitle="settingsStore.contactMapSubtitle"
                />
              </div>

              <!-- Iframe Peta Google Maps -->
              <div class="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden border border-gray-100 flex-grow shadow-xs">
                <iframe
                  :src="settingsStore.settings.maps_embed_url"
                  width="100%"
                  height="100%"
                  style="border: 0;"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  title="Peta Lokasi Paguyuban KWT Kartini OKU Timur"
                  class="w-full h-full"
                />
              </div>
            </div>

            <!-- Jika maps_embed_url tidak ada, tampilkan kotak informasi alternatif -->
            <div
              v-else
              class="bg-white rounded-3xl p-8 sm:p-12 shadow-card border border-secondary/20 text-center flex flex-col justify-center items-center flex-grow"
            >
              <div class="w-16 h-16 rounded-full bg-surface text-primary flex items-center justify-center mb-4">
                <MapPin class="w-8 h-8" />
              </div>
              <h3 class="text-xl font-bold text-ink mb-2">
                {{ settingsStore.pageTexts.contact_map_empty_title }}
              </h3>
              <p class="text-muted text-base max-w-md mx-auto">
                {{ settingsStore.pageTexts.contact_map_empty_text }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>

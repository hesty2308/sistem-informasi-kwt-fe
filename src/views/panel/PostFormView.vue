<script setup>
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { usePostForm } from '@/composables/usePostForm'
import PanelLayout from '@/layouts/PanelLayout.vue'
import PageHeader from '@/components/panel/PageHeader.vue'
import ImageUploader from '@/components/ui/ImageUploader.vue'
import PostContentFields from '@/components/panel/post/PostContentFields.vue'
import PostPublishBox from '@/components/panel/post/PostPublishBox.vue'
import { ArrowLeft } from 'lucide-vue-next'

const { isEditMode, categories, isSubmitting, form, errors, onSlugInput, handleSubmit } = usePostForm()

const pageTitle = computed(() =>
  isEditMode.value ? 'Ubah Kegiatan - Panel Pengelola KWT Kartini' : 'Tambah Kegiatan Baru - Panel Pengelola KWT Kartini'
)

useHead({
  title: pageTitle,
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})
</script>

<template>
  <PanelLayout>
    <PageHeader
      :title="isEditMode ? 'Ubah Kegiatan' : 'Tambah Kegiatan Baru'"
      :subtitle="isEditMode ? 'Perbarui informasi naskah, foto sampul, atau status publikasi kegiatan' : 'Tulis warta, pengumuman, atau dokumentasi panen raya dan pelatihan baru'"
      :breadcrumbs="[
        { label: 'Panel Pengelola', to: '/pengelola' },
        { label: 'Kegiatan', to: '/pengelola/kegiatan' },
        { label: isEditMode ? 'Ubah' : 'Tambah Baru' }
      ]"
    >
      <template #actions>
        <router-link
          to="/pengelola/kegiatan"
          class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white text-ink border border-secondary/25 text-xs sm:text-sm font-semibold hover:bg-surface transition shadow-xs"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Kembali ke Daftar</span>
        </router-link>
      </template>
    </PageHeader>

    <!-- Form Content Container -->
    <form @submit.prevent class="space-y-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Kolom Kiri: Naskah Utama (8 Kolom) -->
        <div class="lg:col-span-8 space-y-6">
          <PostContentFields v-model:form="form" :errors="errors" @slug-input="onSlugInput" />
        </div>

        <!-- Kolom Kanan: Pengaturan Publikasi & Media (4 Kolom) -->
        <div class="lg:col-span-4 space-y-6">
          <PostPublishBox
            v-model:form="form"
            :categories="categories"
            :errors="errors"
            :is-edit-mode="isEditMode"
            :is-submitting="isSubmitting"
            @submit="handleSubmit"
          />

          <!-- Kotak Foto Sampul -->
          <div class="bg-white rounded-3xl p-6 shadow-card border border-secondary/20">
            <h3 class="text-base font-bold text-ink pb-3 border-b border-gray-100 mb-4">
              Foto Sampul Kegiatan
            </h3>

            <ImageUploader
              v-model="form.cover_image"
              label="Pilih Foto Sampul"
              help-text="Foto landscape dengan rasio 16:9 disarankan. Maksimal 2 MB."
            />
            <p v-if="errors.cover_image" class="text-xs text-red-500 mt-1">
              {{ errors.cover_image }}
            </p>
          </div>
        </div>
      </div>
    </form>
  </PanelLayout>
</template>

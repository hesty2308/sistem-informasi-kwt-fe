<script setup>
import { ref } from 'vue'
import { useHead } from '@unhead/vue'
import { useToastStore } from '@/stores/toast'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import ImageUploader from '@/components/ui/ImageUploader.vue'
import SafeHtml from '@/components/ui/SafeHtml.vue'
import logoUrl from '@/assets/logo.png'

useHead({
  title: 'UI Kit - Desain Sistem KWT Kartini',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const toastStore = useToastStore()

// State interaktif
const sampleInput = ref('Nilai masukan teks')
const sampleTextarea = ref('KWT Kartini aktif menggerakkan ketahanan pangan keluarga.')
const sampleSelect = ref('pelatihan')
const sampleImage = ref(null)
const currentPage = ref(1)
const isModalOpen = ref(false)
const isConfirmOpen = ref(false)

const selectOptions = [
  { value: 'kegiatan', label: 'Kegiatan' },
  { value: 'pelatihan', label: 'Pelatihan' },
  { value: 'panen', label: 'Panen' },
  { value: 'pengumuman', label: 'Pengumuman' },
]

const sampleRawHtml = `
  <p><strong>SafeHtml Demo:</strong> Paragraf dengan <em>formatting aman</em> dan tautan.</p>
  <script>alert("XSS dicegah!")<\/script>
`
</script>

<template>
  <div class="min-h-screen bg-surface py-8 px-4 sm:px-8">
    <div class="max-w-4xl mx-auto space-y-12">
      <!-- Header -->
      <div class="bg-background rounded-3xl p-6 shadow-card border border-secondary/20 flex items-center gap-4">
        <img :src="logoUrl" alt="Logo KWT Kartini" class="w-16 h-16 rounded-full object-contain p-1 border border-secondary/20" />
        <div>
          <h1 class="text-2xl font-bold text-primary">UI Kit &amp; Desain Sistem</h1>
          <p class="text-sm text-muted">Palet Resmi &amp; Komponen Paguyuban KWT Kartini OKU Timur</p>
        </div>
      </div>

      <!-- 1. Tombol (BaseButton) -->
      <section class="bg-background rounded-3xl p-6 shadow-card border border-secondary/20">
        <SectionTitle title="1. Tombol (BaseButton)" subtitle="Varian &amp; Ukuran" />
        <div class="flex flex-wrap items-center gap-3 mb-4">
          <BaseButton variant="primary">Utama (Kuning)</BaseButton>
          <BaseButton variant="secondary">Sekunder (Hijau)</BaseButton>
          <BaseButton variant="outline">Garis Tepi</BaseButton>
          <BaseButton variant="ghost">Transparan</BaseButton>
          <BaseButton variant="danger">Bahaya / Hapus</BaseButton>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <BaseButton size="sm">Kecil</BaseButton>
          <BaseButton size="md">Standar (44px)</BaseButton>
          <BaseButton size="lg">Besar</BaseButton>
          <BaseButton :loading="true">Memproses</BaseButton>
          <BaseButton :disabled="true">Dinonaktifkan</BaseButton>
        </div>
      </section>

      <!-- 2. Label Kategori (BaseBadge) -->
      <section class="bg-background rounded-3xl p-6 shadow-card border border-secondary/20">
        <SectionTitle title="2. Label Kategori (BaseBadge)" subtitle="Identitas Warna" />
        <div class="flex flex-wrap items-center gap-3">
          <BaseBadge variant="primary">Kegiatan (Hijau Tua)</BaseBadge>
          <BaseBadge variant="secondary">Panen (Hijau Muda)</BaseBadge>
          <BaseBadge variant="accent">Pengumuman (Kuning)</BaseBadge>
          <BaseBadge variant="blue">Pelatihan (Biru)</BaseBadge>
          <BaseBadge variant="outline">Garis Tepi</BaseBadge>
        </div>
      </section>

      <!-- 3. Formulir (BaseInput, BaseTextarea, BaseSelect) -->
      <section class="bg-background rounded-3xl p-6 shadow-card border border-secondary/20">
        <SectionTitle title="3. Formulir Masukan" subtitle="Aksesibilitas &amp; Validasi" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <BaseInput v-model="sampleInput" label="Nama Lengkap" help-text="Sesuai kartu identitas anggota." required />
          <BaseInput label="Email dengan Error" model-value="email-salah" error-message="Alamat email tidak valid." />
          <BaseSelect v-model="sampleSelect" label="Kategori Kegiatan" :options="selectOptions" required />
          <BaseTextarea v-model="sampleTextarea" label="Deskripsi Singkat" help-text="Maksimal 200 karakter." />
        </div>
      </section>

      <!-- 4. Kartu & Animasi (BaseCard, v-reveal) -->
      <section class="bg-background rounded-3xl p-6 shadow-card border border-secondary/20">
        <SectionTitle title="4. Kartu (BaseCard &amp; Gaya Socin)" subtitle="Gaya Rounded-3xl &amp; Hover" />
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <BaseCard v-reveal class="flex flex-col">
            <div class="relative aspect-[16/10] bg-surface rounded-2xl overflow-hidden mb-4">
              <img :src="logoUrl" alt="Contoh" class="w-full h-full object-contain p-4" />
              <BaseBadge class="absolute top-3 left-3">Pelatihan</BaseBadge>
              <div class="absolute bottom-3 right-3 bg-white/95 rounded-xl px-2.5 py-1 text-center shadow-xs">
                <span class="block text-xs font-bold text-primary">22</span>
                <span class="block text-[10px] text-muted">Okt</span>
              </div>
            </div>
            <h3 class="text-lg font-bold text-primary mb-2">Pelatihan Pertanian Organik KWT Kartini</h3>
            <p class="text-sm text-muted">Contoh kartu dengan foto di atas, label kategori di pojok foto, dan kotak tanggal.</p>
          </BaseCard>

          <SkeletonCard />
        </div>
      </section>

      <!-- 5. Unggah Foto (ImageUploader) -->
      <section class="bg-background rounded-3xl p-6 shadow-card border border-secondary/20">
        <SectionTitle title="5. Unggah Gambar (ImageUploader)" subtitle="Validasi 2 MB &amp; Pratinjau" />
        <ImageUploader v-model="sampleImage" label="Foto Kegiatan" />
      </section>

      <!-- 6. Notifikasi Toast & Dialog Interaktif -->
      <section class="bg-background rounded-3xl p-6 shadow-card border border-secondary/20">
        <SectionTitle title="6. Notifikasi Toast &amp; Dialog" subtitle="Umpan Balik Pengguna" />
        <div class="flex flex-wrap gap-3 mb-6">
          <BaseButton variant="secondary" size="sm" @click="toastStore.success('Data kegiatan berhasil disimpan!')">
            Toast Sukses (Hijau)
          </BaseButton>
          <BaseButton variant="danger" size="sm" @click="toastStore.error('Terjadi kesalahan pada koneksi server!')">
            Toast Gagal (Merah)
          </BaseButton>
          <BaseButton variant="primary" size="sm" @click="toastStore.info('Sesi diperbarui secara otomatis.')">
            Toast Info (Biru)
          </BaseButton>
          <BaseButton variant="outline" size="sm" @click="isModalOpen = true">
            Buka Modal Standar
          </BaseButton>
          <BaseButton variant="danger" size="sm" @click="isConfirmOpen = true">
            Buka Dialog Konfirmasi Hapus
          </BaseButton>
        </div>

        <!-- Paginasi -->
        <div class="border-t border-gray-100 pt-4">
          <p class="text-xs font-bold text-muted uppercase tracking-wider mb-2">Komponen Paginasi:</p>
          <BasePagination :current-page="currentPage" :total-pages="5" @page-change="currentPage = $event" />
        </div>
      </section>

      <!-- 7. Status Kosong (EmptyState) & SafeHtml -->
      <section class="bg-background rounded-3xl p-6 shadow-card border border-secondary/20 space-y-6">
        <div>
          <SectionTitle title="7. Status Kosong (EmptyState)" subtitle="Tampilan Saat Data Nihil" />
          <EmptyState title="Belum ada kegiatan" description="Silakan periksa kembali nanti atau tambahkan kegiatan baru melalui panel pengelola." />
        </div>

        <div>
          <SectionTitle title="8. Sanitasi HTML Aman (SafeHtml)" subtitle="Pembersihan XSS dengan DOMPurify" />
          <div class="bg-surface p-4 rounded-2xl border border-secondary/20 text-sm">
            <SafeHtml :content="sampleRawHtml" />
          </div>
        </div>
      </section>

      <!-- Modal Dialog -->
      <BaseModal v-model="isModalOpen" title="Contoh Dialog Modal">
        <p class="text-sm text-ink">Ini adalah contoh komponen BaseModal dengan tombol penutup, backdrop blur, dan animasi halus.</p>
        <template #footer>
          <BaseButton size="sm" @click="isModalOpen = false">Tutup</BaseButton>
        </template>
      </BaseModal>

      <!-- Confirm Dialog -->
      <ConfirmDialog
        v-model="isConfirmOpen"
        title="Yakin ingin menghapus kegiatan ini?"
        message="Data kegiatan akan dipindahkan ke tempat sampah dan dapat dipulihkan kembali oleh Super Admin."
        @confirm="isConfirmOpen = false; toastStore.success('Kegiatan berhasil dihapus!')"
      />
    </div>
  </div>
</template>

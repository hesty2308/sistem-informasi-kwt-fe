<script setup>
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import { extractMapEmbedUrl } from '@/utils/mapEmbed'
import SettingTextGroup from '@/components/panel/settings/SettingTextGroup.vue'

const form = defineModel('form', { type: Object, required: true })

// Users paste the whole <iframe ...> code copied from Google Maps; keep only the map address.
const onMapInput = (value) => {
  form.value.maps_embed_url = extractMapEmbedUrl(value)
}

const contactLabelFields = [
  { key: 'contact_address_label', label: 'Label di Atas Alamat', placeholder: 'Contoh: Alamat Sekretariat' },
  { key: 'contact_whatsapp_label', label: 'Label di Atas Nomor WhatsApp', placeholder: 'Contoh: Telepon / WhatsApp' },
  { key: 'contact_whatsapp_btn_text', label: 'Tulisan Tombol WhatsApp', placeholder: 'Contoh: Hubungi via WhatsApp' },
  { key: 'contact_email_label', label: 'Label di Atas Email', placeholder: 'Contoh: Surat Elektronik (Email)' },
  { key: 'contact_social_label', label: 'Label di Atas Facebook', placeholder: 'Contoh: Media Sosial Resmi' },
  { key: 'contact_facebook_name', label: 'Nama Halaman Facebook', placeholder: 'Contoh: Facebook Paguyuban KWT Kartini' },
  { key: 'contact_facebook_btn_text', label: 'Tulisan Tombol Facebook', placeholder: 'Contoh: Kunjungi Facebook Kami' },
]
const mapEmptyFields = [
  { key: 'contact_map_empty_title', label: 'Judul', placeholder: 'Contoh: Peta Lokasi Sedang Disiapkan' },
  { key: 'contact_map_empty_text', label: 'Kalimat', multiline: true },
]

defineProps({
  errors: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-base font-bold text-ink mb-1">Halaman Kontak</h3>
      <p class="text-sm text-muted">
        Alamat, WhatsApp, dan email juga tampil di bagian bawah (footer) semua halaman.
      </p>
    </div>

    <!-- Banner Kontak -->
    <div class="p-4 rounded-2xl bg-surface border border-secondary/20 space-y-4">
      <span class="block text-sm font-bold text-primary">Judul Atas Halaman</span>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput
          v-model="form.contact_banner_title"
          label="Judul Besar"
          placeholder="Contoh: Hubungi Kami"
          :error-message="errors.contact_banner_title?.[0]"
        />
        <BaseInput
          v-model="form.contact_banner_subtitle"
          label="Kalimat di Bawah Judul"
          placeholder="Terbuka untuk silaturahmi, kemitraan..."
          :error-message="errors.contact_banner_subtitle?.[0]"
        />
      </div>
    </div>

    <!-- Bagian Sekretariat -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseInput
        v-model="form.contact_section_title"
        label="Judul di Atas Daftar Kontak"
        placeholder="Contoh: Sekretariat Paguyuban"
        :error-message="errors.contact_section_title?.[0]"
      />
      <BaseInput
        v-model="form.contact_section_subtitle"
        label="Kalimat Penjelas"
        placeholder="Contoh: Silakan hubungi kami melalui saluran resmi berikut"
        :error-message="errors.contact_section_subtitle?.[0]"
      />
    </div>

    <BaseTextarea
      v-model="form.address"
      label="Alamat Sekretariat"
      placeholder="Contoh: Jl. Lintas Belitang, Kecamatan Belitang, Kabupaten Ogan Komering Ulu Timur, Sumatera Selatan 32182"
      :rows="3"
      :error-message="errors.address?.[0]"
      help-text="Tampil di halaman Kontak dan bagian bawah website."
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseInput
        v-model="form.phone_whatsapp"
        label="Nomor WhatsApp"
        placeholder="Contoh: 0812xxxxxxxx"
        :error-message="errors.phone_whatsapp?.[0]"
        help-text="Boleh ditulis 08…, sistem otomatis menyesuaikan untuk tombol WhatsApp."
      />

      <BaseInput
        v-model="form.email"
        type="email"
        label="Alamat Email"
        placeholder="Contoh: nama@gmail.com"
        :error-message="errors.email?.[0]"
        help-text="Kosongkan bila paguyuban belum punya email."
      />
    </div>

    <SettingTextGroup
      v-model:form="form"
      heading="Label & Tulisan Tombol di Daftar Kontak"
      :fields="contactLabelFields"
      :errors="errors"
    />

    <!-- Peta Lokasi -->
    <div class="pt-4 border-t border-gray-100 space-y-4">
      <span class="block text-sm font-bold text-primary">Peta Lokasi</span>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          v-model="form.contact_map_title"
          label="Judul di Atas Peta"
          placeholder="Contoh: Lokasi Kami di Peta"
          :error-message="errors.contact_map_title?.[0]"
        />
        <BaseInput
          v-model="form.contact_map_subtitle"
          label="Kalimat di Bawah Judul Peta"
          placeholder="Contoh: Kabupaten Ogan Komering Ulu Timur, Sumatera Selatan"
          :error-message="errors.contact_map_subtitle?.[0]"
        />
      </div>

      <div class="p-4 rounded-2xl bg-surface border border-secondary/20 text-sm text-ink space-y-1">
        <p class="font-bold">Cara memasang peta:</p>
        <ol class="list-decimal pl-5 space-y-0.5 text-muted">
          <li>Buka <strong class="text-ink">maps.google.com</strong> dan cari lokasi sekretariat.</li>
          <li>Klik tombol <strong class="text-ink">Bagikan</strong>, lalu pilih <strong class="text-ink">Sematkan peta</strong>.</li>
          <li>Klik <strong class="text-ink">Salin HTML</strong>, lalu tempel di kotak di bawah ini.</li>
        </ol>
      </div>

      <BaseTextarea
        :model-value="form.maps_embed_url"
        label="Kode Peta dari Google Maps"
        placeholder="Tempel di sini kode yang diawali <iframe src=&quot;https://www.google.com/maps/embed..."
        :rows="3"
        :error-message="errors.maps_embed_url?.[0]"
        help-text="Kosongkan bila peta belum tersedia. Sistem hanya menyimpan alamat petanya."
        @update:model-value="onMapInput"
      />

      <SettingTextGroup
        v-model:form="form"
        heading="Tulisan Saat Peta Belum Dipasang"
        description="Tampil di tempat peta bila kode peta di atas dikosongkan."
        :fields="mapEmptyFields"
        :errors="errors"
      />
    </div>
  </div>
</template>

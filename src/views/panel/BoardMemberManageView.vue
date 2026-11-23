<script setup>
import { useHead } from '@unhead/vue'
import PanelLayout from '@/layouts/PanelLayout.vue'
import PageHeader from '@/components/panel/PageHeader.vue'
import BoardMemberManager from '@/components/panel/board-member/BoardMemberManager.vue'

useHead({
  title: 'Kelola Pengurus - Panel Pengelola KWT Kartini',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})
</script>

<template>
  <PanelLayout>
    <PageHeader
      title="Kelola Pengurus"
      subtitle="Nama, jabatan, dan foto pengurus yang tampil di halaman Tentang → Struktur Organisasi"
      :breadcrumbs="[{ label: 'Panel Pengelola', to: '/pengelola' }, { label: 'Pengurus' }]"
    />

    <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-secondary/20">
      <BoardMemberManager />
    </div>
  </PanelLayout>
</template>

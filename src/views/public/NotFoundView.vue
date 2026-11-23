<script setup>
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'
import { AlertCircle, Home, ArrowLeft } from 'lucide-vue-next'
import logoUrl from '@/assets/logo.png'

useHead({
  title: 'Halaman Tidak Ditemukan (404) - Paguyuban KWT Kartini',
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
    {
      name: 'description',
      content: 'Halaman yang Anda tuju tidak ditemukan pada sistem informasi Paguyuban KWT Kartini.',
    },
  ],
})
</script>

<template>
  <main class="min-h-screen bg-surface flex flex-col justify-center items-center p-4 sm:p-8">
    <div class="max-w-md w-full bg-white rounded-3xl shadow-card border border-secondary/20 p-8 sm:p-10 text-center">
      <!-- Logo Bundar -->
      <img
        :src="logoUrl"
        alt="Logo Paguyuban KWT Kartini"
        class="w-20 h-20 mx-auto mb-6 rounded-full object-contain p-1 border border-secondary/20 bg-white shadow-xs"
      />

      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider mb-3 border border-red-200">
        <AlertCircle class="w-3.5 h-3.5" />
        <span>Galat 404</span>
      </div>

      <h1 class="text-2xl sm:text-3xl font-black text-ink mb-2">
        Halaman Tidak Ditemukan
      </h1>

      <p class="text-muted text-base leading-relaxed mb-8">
        Maaf, tautan atau halaman yang Anda tuju tidak tersedia, telah dipindahkan, atau alamat URL salah ketik.
      </p>

      <div class="flex flex-col gap-3">
        <RouterLink
          to="/"
          class="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full font-bold bg-accent text-primary-dark hover:bg-yellow-400 active:scale-95 transition shadow-sm"
        >
          <Home class="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </RouterLink>

        <button
          type="button"
          @click="$router.back()"
          class="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-full font-semibold text-ink/75 hover:bg-surface border border-secondary/20 transition text-sm cursor-pointer"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Kembali ke Halaman Sebelumnya</span>
        </button>
      </div>
    </div>
  </main>
</template>
